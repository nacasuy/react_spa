// THIS FILE DOESN'T HAVE ACCESS TO THE GLOBAL OBJECT (WINDOW).
// DON'T EXPECT ITS METHODS TO WORK HERE.
// DOCUMENT EVENTS ARE USEFUL FOR MESSAGING WITH THE MAIN WINDOW

// CONSTANTS
const {
    HANDLE_AD_RESPONSE,
    AD_RESPONSE,
    GGS_IN_CONTENT,
    LOADED_GUMGUM_JS,
    LOADED_WINDOW,
    HINT_CONTAINER_ID,
    HINT_BODY_CLASS,
    INSERT_GUMGUM,
    INSERT_SCRIPT,
    DATA_RECEIVED,
    REQUEST_AD,
    STORE_REQUEST_DATA,
    HIGHLIGHT_CLASS,
    SELECTED_CLASS,
    IN_IMAGE_ENDPOINT,
    IN_SCREEN_ENDPOINT,
    PROCESS_USER_CONTENT,
    CONTENT_REMOVED,
    REMOVE_ELEMENT,
    SET_HOVER,
    types: { InScreenAd, InImageAd }
} = require('./constants');

const curry = require('./curry');

// Array to store listenerConfig objects { type, target, handler, capture }
// Helps with cleanup
let listeners = [];

// Extension port to communicate with the popup, also helps detecting when it closes
let port = null;

// Flag to detect if cleanup should run if user has hovered or not
let userHovered = false;

// Element used for highlighting, if defined, will prevent clearing the handlers
let previousHoverElement = null;

// Send messages to the open port (Popup)
const sendPortMessage = data => port.postMessage(data);

// Post messages to the windows
const sendWindowMessage = messages => window.postMessage({ GGS_IN_CONTENT, ...messages }, '*');

// Triggers insertion of GumGum services script
const insertGumgGumJS = () => sendWindowMessage({ msg: INSERT_GUMGUM });

const resetHoverElement = () => {
    previousHoverElement = null;
};

// Modify element's classNames dynamically
const modifyClassName = curry((modifier, className, element) => {
    // SVG can receive objects as classNames
    if (typeof element.className === 'object') {
        element.className.baseVal = modifier(element.className.baseVal, className);
    } else {
        element.className = modifier(element.className, className);
    }
});

// Removes classnames from an element
const removeClassName = modifyClassName((string = '', className) =>
    string.replace(new RegExp(className), '').trim()
);

// Removes the highlight class from an element
const removeHighlightClass = removeClassName(HIGHLIGHT_CLASS);

// Removes the selected class from an element
const removeSelectedClass = removeClassName(SELECTED_CLASS);

// Adds classNames to an element
const addClassName = modifyClassName((string = '', className) => `${string} ${className}`.trim());

// Adds the highlight class to an element
const addHighlightClass = addClassName(HIGHLIGHT_CLASS);

// Adds the selected class to an element
const addSelectedClass = addClassName(SELECTED_CLASS);

// Removes the hint class from the body
const removeBodyHintClass = removeClassName(HINT_BODY_CLASS);

// Adds the hint class to the body
const addBodyHintClass = addClassName(HINT_BODY_CLASS);

// Remove iframe for hint messages
const removeHint = () => {
    const hint = document.getElementById(HINT_CONTAINER_ID);
    if (hint) hint.remove();
    removeBodyHintClass(document.body);
};
// Create iframe element with hint message and prepend it to the body
const setHint = msg => {
    const hint = document.getElementById(HINT_CONTAINER_ID);
    if (hint) return;
    const iframe = document.createElement('iframe');
    const fileURL = chrome.extension.getURL('hintBar.html');
    iframe.setAttribute('id', HINT_CONTAINER_ID);
    iframe.setAttribute('src', `${fileURL}?msg=${encodeURIComponent(msg)}`);
    // Add iframe to top of page
    document.body.prepend(iframe);
    // add classes to push
    addBodyHintClass(document.body);
};

// Helper that enables highlighting the currently hovered node
const attachHoverHandlers = adType => {
    const insertingAd = !!adType;
    // Show hint for in image ads
    const hint = insertingAd
        ? 'Select an image to put your ad on'
        : 'Click the element to remove from the page';
    setHint(hint);
    const hoverListener = event => {
        const element = event.target || event.srcElement;
        const isSameElement = previousHoverElement === element;
        if (!element || isSameElement) return;

        if (previousHoverElement) {
            removeHighlightClass(previousHoverElement);
            resetHoverElement();
        }

        const tagName = element.tagName.toLowerCase();
        const validInsertionHighlight = insertingAd && ['img', 'svg'].includes(tagName);
        const validRemovalHighlight = !insertingAd && tagName !== 'use'; //TODO Add other tags here

        if (validInsertionHighlight || validRemovalHighlight) {
            addHighlightClass(element);
            previousHoverElement = element;
            userHovered = true;
        }
    };
    const listenerConfig = {
        target: document,
        type: 'mousemove',
        handler: hoverListener,
        capture: false
    };
    listeners.push(listenerConfig);
    attachListener(
        listenerConfig.target,
        listenerConfig.type,
        listenerConfig.handler,
        listenerConfig.capture
    );
};

// Remove all stored listeners
const removeListeners = () => {
    listeners.forEach(({ target, type, handler, capture }) => {
        target.removeEventListener(type, handler, capture);
    });
    listeners = [];
};

// Messages main window script (injector.js, see addInjector)
// to remove the active node.
// We need access to the window to remove iframes.
const handleRemove = () => {
    attachHoverHandlers();
    sendWindowMessage({ msg: REMOVE_ELEMENT });
};

// Handle incoming port (popup) messages
const portMessageHandler = data => {
    switch (data.msg) {
        case INSERT_GUMGUM: {
            return insertGumgGumJS();
        }
        case SET_HOVER: {
            return attachHoverHandlers(data.adType);
        }
        case REMOVE_ELEMENT: {
            return handleRemove();
        }
        case PROCESS_USER_CONTENT: {
            const { content, adType, isHTML } = data;
            return processAdContent(content, adType, isHTML);
        }
    }
};

// Clean up all inserted listeners
const cleanup = () => {
    if (previousHoverElement || !userHovered) return;
    // Remove remaining listeners
    removeListeners();
    // Stop listening to window postMessage events
    window.removeEventListener('message', injectorMessageHandler);
    // Remove classes from body and hint element
    removeHint();
    // Reset hover detection flag
    userHovered = false;
};

// Handle incoming injector.js messages
const injectorMessageHandler = ({ data, source }) => {
    // We only accept messages from ourselves
    const ignoreEvent = source !== window || !data || !data.GGS_INJECTOR;
    if (ignoreEvent) return;

    switch (data.msg) {
        case LOADED_GUMGUM_JS: {
            return sendPortMessage({ msg: LOADED_GUMGUM_JS });
        }
        case LOADED_WINDOW: {
            return sendPortMessage({ msg: LOADED_WINDOW });
        }
        case HANDLE_AD_RESPONSE: {
            resetHoverElement();
            return handleInsertion();
        }
        case CONTENT_REMOVED: {
            // reset previousHoverElement
            resetHoverElement();
            // reset everything else
            return cleanup();
        }
        case AD_RESPONSE: {
            const { err, adData, adType, isHTML } = data;
            return processAdResponse(err, adData, adType, isHTML);
        }
    }
};

// Start scripts after setting up connection to port (popup)
chrome.extension.onConnect.addListener(externalPort => {
    // Listen for port (popup) messages
    externalPort.onMessage.addListener(portMessageHandler);
    // Listen for window.postMessage events
    window.addEventListener('message', injectorMessageHandler);
    // Set listener for disconnection (aka. popup closed)
    externalPort.onDisconnect.addListener(() => {
        // Clean up after all operations have completed
        setTimeout(cleanup, 1000);
    });
    port = externalPort;
});

// Listen for custom events from main window containing server responses
const handleInsertion = () => {
    const nodes = [
        ...Array.from(document.getElementsByClassName(HIGHLIGHT_CLASS)),
        ...Array.from(document.getElementsByClassName(SELECTED_CLASS))
    ];
    // General cleanup
    nodes.forEach(node => {
        removeHighlightClass(node);
        removeSelectedClass(node);
    });
    cleanup();
};

// Inject stylesheet for active elements
const injectStyles = () => {
    const eltId = 'GG-CSM-style';
    const domElt = document.getElementById(eltId);
    if (domElt) return;
    const style = document.createElement('link');
    style.rel = 'stylesheet';
    style.type = 'text/css';
    style.href = chrome.extension.getURL('inContent.css');
    document.documentElement.appendChild(style);
};

// Inject script that inserts ads to main DOM
// This is the only file with access to the global window
const addInjector = () => {
    injectStyles();
    const eltId = 'GG-CSM-script';
    const domElt = document.getElementById(eltId);
    if (domElt) return;
    const script = document.createElement('script');
    script.id = eltId;
    script.src = chrome.extension.getURL('injector.js');
    document.documentElement.appendChild(script);
};

// Helper to add an event listener to any given node
const attachListener = (elt, event, fn, capture) => elt.addEventListener(event, fn, capture);

// adds a click listener to the body
const attachClickListener = handler => {
    const listenerConfig = {
        target: document.body,
        type: 'click',
        capture: true,
        handler
    };

    listeners.push(listenerConfig);

    attachListener(
        listenerConfig.target,
        listenerConfig.type,
        listenerConfig.handler,
        listenerConfig.capture
    );
};

// Returns the endpoint to use for the current ad id request
const getEndpoint = (id, adType) => {
    switch (adType) {
        case InScreenAd:
            return IN_SCREEN_ENDPOINT + id;
        case InImageAd:
            return IN_IMAGE_ENDPOINT;
    }
};

// Main wrapper to process user input. Either request ad by id, store the request data or process the HTML
const processAdContent = (content, adType, isHTML) => {
    const needsData = !isHTML;
    const endpoint = needsData && getEndpoint(content, adType);
    const msg = adType === InScreenAd || isHTML ? REQUEST_AD : STORE_REQUEST_DATA;
    // This message will either request from the endpoint,
    // store the data to request after image selection or
    // pass the content to processAdResponse immediately (for HTML)
    sendWindowMessage({
        msg,
        endpoint,
        content,
        adType,
        isHTML
    });
};

// Gets ad configuration, makes it accessible to main window
// and sets click listeners if In Image / In Content (tbd)
// to add the active class to the selected node
const insertAd = (content, adType, isHTML = false) => {
    const isInScreen = adType === InScreenAd;
    const isInImage = adType === InImageAd;
    const isInContent = adType === 'inContent';
    const config = { content, adType, isHTML };
    // Handle clicks
    const clickHandler = event => {
        event.preventDefault();
        event.stopPropagation();
        event.stopImmediatePropagation();
        const elt = event.target;
        const { tagName, width, height, src } = elt;
        if (isInImage && tagName === 'IMG') {
            // Pass node data to config
            const nodeData = { width, height, src };
            config.nodeData = nodeData;
            addSelectedClass(elt);
        }
        insertScript(config);
    };
    // adds the selected class to the given element
    const highlightElement = () => attachClickListener(clickHandler);
    return isInScreen ? insertScript(config) : highlightElement();
};

// Handle responses from ad request
const processAdResponse = (err, data, adType, isHTML) => {
    if (err) {
        sendPortMessage({
            msg: HANDLE_AD_RESPONSE,
            err
        });
    } else {
        insertAd(data, adType, isHTML);
        sendPortMessage({
            msg: HANDLE_AD_RESPONSE,
            adType
        });
    }
};

// Tags disallowed for in content insertion
const disallowedTags = ['img', 'video'];
const needsParent = tagName => disallowedTags.includes(tagName);

// Finds a valid parent container to (TODO) insert an In Content ad
const findContainer = elt => {
    const findContainerCore = elt => {
        const tagName = elt.tagName.toLowerCase();
        while (elt.parentNode) {
            elt = elt.parentNode;
            const parentTagName = elt.tagName.toLowerCase();
            const hasSize = elt.offsetWidth > 0;
            if (!needsParent(parentTagName) && hasSize) {
                return elt;
            }
        }
        return null;
    };
    const tagName = elt.tagName.toLowerCase();
    if (needsParent(tagName)) {
        return findContainerCore(elt);
    }
    return elt;
};

// Messages the main window to insert the ad
const insertScript = config =>
    sendWindowMessage({
        msg: INSERT_SCRIPT,
        config
    });

// Init window scripts
addInjector();
