const HIGHLIGHT_CLASS = 'GumGumScreenshots';
module.exports = {
    HANDLE_AD_RESPONSE: 'HANDLE_AD_RESPONSE',
    AD_RESPONSE: 'AD_RESPONSE',
    GGS_IN_CONTENT: 'GGS_IN_CONTENT',
    GGS_INJECTOR: 'GGS_INJECTOR',
    HINT_CONTAINER_ID: 'GGS-hint-container',
    HINT_BODY_CLASS: 'GGS-body-hint',
    HIGHLIGHT_CLASS,
    SELECTED_CLASS: `${HIGHLIGHT_CLASS}--Selected`,
    LOADED_GUMGUM_JS: 'LOADED_GUMGUM_JS',
    LOADED_WINDOW: 'LOADED_WINDOW',
    INSERT_GUMGUM: 'GGS_INSERT_GUMGUM',
    INSERT_SCRIPT: 'INSERT_SCRIPT',
    DATA_RECEIVED: 'GGS_DATA_RECEIVED',
    REQUEST_AD: 'GGS_REQUEST_AD',
    STORE_REQUEST_DATA: 'GGS_STORE_REQUEST_DATA',
    PORT: 'GGS_PORT',
    SET_HOVER: 'SET_HOVER',
    REMOVE_ELEMENT: 'REMOVE_ELEMENT',
    PROCESS_USER_CONTENT: 'PROCESS_USER_CONTENT',
    CONTENT_REMOVED: 'CONTENT_REMOVED',
    SOURCE: 'https://js.gumgum.com/gumgum.js',
    // In Image Ads are requested and inserted by a scanner in GumGum's script
    // that's no good for us, there's also no public function to retrieve URLs.
    // In order to force an ad, we can use these dummy endpoints, just append the ad ids.
    IN_IMAGE_ENDPOINT: 'https://g2.gumgum.com/assets/new',
    IN_SCREEN_ENDPOINT:
        'https://g2.gumgum.com/inscreen?r=2.3.3&rf=https%3A%2F%2Ftest.gumgum.com%2Fstatic%2Fsimple%2Fcdn%2Fhead.html&pu=https%3A%2F%2Ftest.gumgum.com%2Fstatic%2Fsimple%2Fcdn%2Fhead.html%23ggad%3DjHfIL9Gqd9A&ce=true&fs=false&scw=1920&sch=1080&dpr=1&vpii=false&vpw=976&vph=937&pv=085da60c-8cfb-45af-9c59-7c24b0528256&t=ggumtest&adBuyId=',
    types: {
        InScreenAd: 'InScreenAd',
        InImageAd: 'InImageAd'
    },
    MAIN_VIEW: 'MAIN_VIEW',
    USER_HINT_VIEW: 'USER_HINT_VIEW',
    LOADING_VIEW: 'LOADING_VIEW',
    STARTING_VIEW: 'STARTING_VIEW'
};
