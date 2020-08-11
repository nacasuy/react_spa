import React, { Fragment } from 'react'
import Column from 'gumdrops/Column'
import Row from 'gumdrops/Row'

const AdPlacememts = ({}) => {
  // CONSTANTS
  const {
    types: { InScreenAd, InImageAd },
    IN_IMAGE_ENDPOINT,
    IN_SCREEN_ENDPOINT
  } = require('../constants')

  // Create a fetch ad request
  const fetchAd = endpoint => fetch(endpoint).then(res => res.json())

  // Read data container and call window.GUMGUM methods for
  // InScreenAd or InImageAd insertion
  const insertAd = async ({ isHTML = true }) => {
    try {
      const adType = InImageAd
      const node = document.getElementById('place')
      console.log(node)
      const endpoint = buildServerParams(40143, node, IN_IMAGE_ENDPOINT)
      console.log(endpoint)
      // Request in Image Ad
      const adContent = await fetchAd(endpoint)
      // Get config for gumgum.js
      const adConfig = createAdConfig(adContent, adType, isHTML)
      console.log(adContent)
      console.log(adConfig)
      // Create ad with GUMGUM method
      console.log(window)
      console.log('GUMGUM', window.GUMGUM)
      const config = isHTML ? adConfig : window.GUMGUM[adType].fromAS(adConfig)
      console.log(config)
      config.scriptset = []
      const ad = new window.GUMGUM[adType](config, node)
      console.log(ad);
      // Insert ad to DOM
      ad.attach()
    } catch (err) {
      console.error(` Error: ${err}`)
    }
  }

  // Create Query String for InImageAd
  const buildServerParams = (adBuyId, nodeData, endpoint) => {
    const { src, width, height } = nodeData
    console.log(src, width, height)
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
    // content = isHTML ? content.replace(/<!--(.*?)-->/g, '') : content
    const isInScreen = adType === InScreenAd
    const isInImage = adType === InImageAd
    let config
    // Default housing position for housing buttons.
    // Used on HTML ads.
    // TODO GSS-11 Issue could be here?
    /* const baseConfig = {
      adbuyid: 0,
      hscloseposition: { bottom: '65px', right: '20px' },
      hsattriposition: { bottom: '65px', right: '48px' },
      hsflags: { assetwide: true },
      content
    } */
    // Create or select JSON configuration for gumgum.js
    // if (isInScreen) config = isHTML ? baseConfig : content
    // if (isInImage) config = isHTML ? baseConfig : content.ads[0]
    if (isInScreen) config = content
    if (isInImage) config = content.ads[0]
    return config
  }
  return (
    <Fragment>
      <Row>
        <Column md="12" >
          <h3 className="gds-text--header-md -ellipsis -m-v-3">AdPlacements</h3>
          <img id="place" onLoad={insertAd} style={{ margin: '1px', display: 'block' }} src="https://via.placeholder.com/300x100.png" width="300" height="100">
          </img>
        </Column>
      </Row>
      <hr className="-m-b-3" />
    </Fragment>
  )
}
export default AdPlacememts
