import React, { Fragment } from 'react'
import Column from 'gumdrops/Column'
import Row from 'gumdrops/Row'

const AdPlacememtsH = () => {
  // CONSTANTS
  const {
    types: { InScreenAd, InImageAd },
    IN_IMAGE_ENDPOINT
  } = require('../constants')

  // Create a fetch ad request
  const fetchAd = endpoint => fetch(endpoint).then(res => res.json())

  // Read data container and call window.GUMGUM methods for
  // InImageAd insertion
  const insertAd = async () => {
    try {
      const adType = InImageAd
      const node = document.getElementById('placeH')
      const endpoint = buildServerParams(2117129, node, IN_IMAGE_ENDPOINT)
      // Request in Image Ad
      const adContent = await fetchAd(endpoint)
      // Get config for gumgum.js
      const adConfig = createAdConfig(adContent, adType, true)
      const config = window.GUMGUM[adType].fromAS(adConfig)
      config.scriptset = []
      const ad = new window.GUMGUM[adType](config, node)
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
    return content.ads[0]
  }

  return (
    <Fragment>
      <Row>
        <Column md="12" >
          <img id="placeH" onLoad={insertAd} style={{ margin: '1px', display: 'block' }} src="https://via.placeholder.com/1400x100.png" width="100%" height="100">
          </img>
        </Column>
      </Row>
    </Fragment>
  )
}
export default AdPlacememtsH
