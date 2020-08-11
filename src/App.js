import React, { Fragment } from 'react'
import Row from 'gumdrops/Row'
import Column from 'gumdrops/Column'
import AdPlacements from '../src/components/AdPlacements'
import EmbeddZoom from '../src/components/EmbeddZoom'
import Polls from '../src/components/Polls'
import ZoomStatistics from '../src/components/ZoomStatistics'
import Test from '../src/components/Test'
function App () {
  return (
    <div className="app">
      <header className="gds-page-header">
        <div className="gds-page-header__product-bar">
          <h6 className="gds-page-header__product-name">Virtual in video</h6>
          <img
            className="gds-page-header__logo gds-page-header__logo--expanded"
            src="https://c.gumgum.com/ads/com/gumgum/logo/logo-white.svg"
          />
        </div>
      </header>
      <Fragment>
        <Row>
          <Column md="10">
            <EmbeddZoom></EmbeddZoom>
          </Column>
          <Column md="2"><Test></Test></Column>
        </Row>
        <Row><AdPlacements></AdPlacements></Row>
        <Row>
          <Column md="6">
            <Polls></Polls>
          </Column>
          <Column md="6">
            <ZoomStatistics></ZoomStatistics>
          </Column>
        </Row>
      </Fragment>
    </div>
  )
}

export default App
