// THIS IS THE ONLY FILE WITH ACCESS TO THE WINDOW OBJECT

// CONSTANTS
const {
  HANDLE_AD_RESPONSE,
  AD_RESPONSE,
  GGS_INJECTOR,
  LOADED_GUMGUM_JS,
  LOADED_WINDOW,
  INSERT_GUMGUM,
  INSERT_SCRIPT,
  HIGHLIGHT_CLASS,
  SELECTED_CLASS,
  DATA_RECEIVED,
  REQUEST_AD,
  STORE_REQUEST_DATA,
  SOURCE,
  REMOVE_ELEMENT,
  CONTENT_REMOVED,
  types: { InScreenAd, InImageAd }
} = require('./constants')

// Flag used to check if a page has finished loading or not
let pageLoaded = false

// Used for storing future ad server requests
let requestData = null

// Read data container and call window.GUMGUM methods for
// InScreenAd or InImageAd insertion
const insertAd = async ({ content, nodeData, adType, isHTML }) => {
  try {
    // Check if the inImageAd should be requested
    const shouldRequestAd = !content && !isHTML && requestData
    // Get endpoint if necessary
    const endpoint = shouldRequestAd
      ? buildServerParams(requestData.content, nodeData, requestData.endpoint)
      : null
    // Request in Image Ad
    const adContent = shouldRequestAd ? await fetchAd(endpoint) : content
    // Reset stored data
    if (requestData) requestData = null
    // Get config for gumgum.js
    const adConfig = createAdConfig(adContent, adType, isHTML)
    const isInImage = adType === InImageAd

    // Get selected node if any
    const node = isInImage ? document.getElementsByClassName(SELECTED_CLASS)[0] : undefined
    // Create ad with GUMGUM method
    const config = isHTML ? adConfig : window.GUMGUM[adType].fromAS(adConfig)
    config.scriptset = []
    const ad = new window.GUMGUM[adType](config, node)
    // Insert ad to DOM
    ad.attach()
    // Let know inContent.js that the ad was inserter
    sendWindowMessage({ msg: HANDLE_AD_RESPONSE })
  } catch (err) {
    console.error(`GumGumScreenshots Error: ${err}`)
  }
}

// Create Query String for InImageAd
const buildServerParams = (adBuyId, nodeData, endpoint) => {
  const { src, width, height } = nodeData
  const params = {
    v: '1.1',
    pv: '0-0',
    r: '2.14.4', // GUMGUM.version
    t: 'ggumtest', // zone id
    a: [
      {
        i: 2,
        u: src, // img.src
        w: width,
        h: height,
        x: 0, // offsetTop
        y: 0, // offsetHeight
        lt: 'none',
        af: false,
        prefetch: false
      }
    ],
    rf: '',
    p: 'http://test.gumgum.com/', // page url
    fs: false,
    ce: true,
    ac: {},
    vp: {
      ii: false,
      w: document.documentElement.clientWidth, // viewport width
      h: document.documentElement.clientHeight // viewport height
    },
    sc: {
      w: window.screen.width,
      h: window.screen.height,
      d: window.devicePixelRatio || 1
    },
    tr: 1
  }
  return `${endpoint}?adBuyId=${adBuyId}&assets=${encodeURIComponent(JSON.stringify(params))}`
}

// Returns an object to be used in gumgum.js
const createAdConfig = (content, adType, isHTML) => {
  // Remove comments from markup (GumGum-CE doesn't handle it well)
  content = isHTML ? content.replace(/<!--(.*?)-->/g, '') : content
  const isInScreen = adType === InScreenAd
  const isInImage = adType === InImageAd
  let config
  // Default housing position for housing buttons.
  // Used on HTML ads.
  // TODO GSS-11 Issue could be here?
  const baseConfig = {
    adbuyid: 0,
    hscloseposition: { bottom: '65px', right: '20px' },
    hsattriposition: { bottom: '65px', right: '48px' },
    hsflags: { assetwide: true },
    content
  }
  // Create or select JSON configuration for gumgum.js
  if (isInScreen) config = isHTML ? baseConfig : content
  if (isInImage) config = isHTML ? baseConfig : content.ads[0]
  return config
}

// Store endpoint information to include image nodeData in ad server request
const storeRequestData = (endpoint, content, adType, isHTML) => {
  requestData = { endpoint, content, adType, isHTML }
  sendWindowMessage({
    msg: AD_RESPONSE,
    adData: null,
    adType,
    isHTML
  })
}

// Create a fetch ad request
const fetchAd = endpoint => fetch(endpoint).then(res => res.json())

// Create a request that should respond to the inContent Script
const requestAd = (endpoint, content, adType, isHTML) => {
  const common = { adType, isHTML }
  if (endpoint) {
    fetchAd(endpoint)
      .then(
        adData => {
          sendWindowMessage({
            msg: AD_RESPONSE,
            adData,
            ...common
          })
        },
        err => {
          sendWindowMessage({
            msg: AD_RESPONSE,
            err
          })
        }
      )
      .then(() => {
        requestData = null
      })
  } else {
    sendWindowMessage({
      msg: AD_RESPONSE,
      adData: content,
      ...common
    })
    requestData = null
  }
}

// Intercept and prevent click events
const removeElement = () => {
  const removeElt = elt => elt.parentNode && elt.parentNode.removeChild(elt)
  let clickListener, blurListener
  // Send response to inContent.js
  const afterRemoval = () => {
    window.removeEventListener('blur', blurListener)
    document.body.removeEventListener('click', clickListener)
    sendWindowMessage({
      msg: CONTENT_REMOVED
    })
  }
  // Detect regular node clicks
  clickListener = event => {
    event.stopPropagation()
    event.preventDefault()
    event.stopImmediatePropagation()
    const element = event.target
    removeElt(element)
    afterRemoval()
  }
  // Regular click events don't work within an iframe, this is a workaround
  blurListener = event => {
    if (document.activeElement.tagName === 'IFRAME') {
      event.preventDefault()
      removeElt(document.activeElement)
      afterRemoval()
    }
  }
  // Set listeners
  window.addEventListener('blur', blurListener)
  document.body.addEventListener('click', clickListener)
}

// Post messages to the windows
const sendWindowMessage = messages => window.postMessage({ GGS_INJECTOR, ...messages }, '*')

const respondGumGumJSLoaded = () => sendWindowMessage({ msg: LOADED_GUMGUM_JS })

// Check if current GUMGUM global is new version
const checkGumGumJSLoaded = () => !!(window.GUMGUM && window.GUMGUM.Tag)

// Inform other scripts that the page is ready
const sendPageReadyMessage = () => sendWindowMessage({ msg: LOADED_WINDOW })

// Load gumgum.js if needed
const insertGumgGumJS = () => {
  const gumgumIsLoaded = checkGumGumJSLoaded()
  // The page loaded listener runs only once, we need to check again on new actions
  if (pageLoaded) {
    sendPageReadyMessage()
  }
  // Global exists, no need to replace its scripts
  if (gumgumIsLoaded) {
    return respondGumGumJSLoaded()
  }
  // Load GumGum Services from CDN
  const gumgumJS = document.createElement('script')
  gumgumJS.setAttribute('src', SOURCE)
  gumgumJS.onload = () => respondGumGumJSLoaded()
  document.body.appendChild(gumgumJS)
}

// Handle incoming inContent.js messages
const inContentMessageHandler = ({ data, source }) => {
  // We only accept messages from ourselves
  const ignoreEvent = source !== window || !data || !data.GGS_IN_CONTENT
  if (ignoreEvent) return

  switch (data.msg) {
    case INSERT_GUMGUM: {
      return insertGumgGumJS()
    }
    case REMOVE_ELEMENT: {
      return removeElement()
    }
    case INSERT_SCRIPT: {
      return insertAd(data.config)
    }
    case REQUEST_AD: {
      const { endpoint, content, adType, isHTML } = data
      return requestAd(endpoint, content, adType, isHTML)
    }
    case STORE_REQUEST_DATA: {
      const { endpoint, content, adType, isHTML } = data
      return storeRequestData(endpoint, content, adType, isHTML)
    }
  }
}

// Set flag after page has loaded and inform other scripts
const onPageLoad = () => {
  pageLoaded = true
  sendPageReadyMessage()
}

// Listen for window.postMessage events
window.addEventListener('message', inContentMessageHandler)
window.addEventListener('load', onPageLoad)
