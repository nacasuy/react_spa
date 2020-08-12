import React, { Fragment } from 'react'
import Row from 'gumdrops/Row'
import Column from 'gumdrops/Column'
import AdPlacementsH from './components/AdPlacementsH'
import AdPlacementsV from './components/AdPlacementsV'

import EmbeddZoom from '../src/components/EmbeddZoom'
import Polls from '../src/components/Polls'
import ZoomStatistics from '../src/components/ZoomStatistics'
import TranslationBot from '../src/components/TranslationBot'
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
          <Column md="2">
            <Polls></Polls>
          </Column>
        </Row>
        <hr className="-m-b-0" />
        <Row>
          <Column md="6">
            <ZoomStatistics></ZoomStatistics>
          </Column>
          <Column md="6">
            <TranslationBot></TranslationBot>
          </Column>
        </Row>
        <hr className="-m-b-0" />
        <Row>
          <AdPlacementsH></AdPlacementsH>
        </Row>
      </Fragment>
    </div>
  )
}

export default App
