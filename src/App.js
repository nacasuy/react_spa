import React, { Fragment } from 'react'
import Row from 'gumdrops/Row'
import Column from 'gumdrops/Column'
import AdPlacementsH from './components/AdPlacementsH'
import AdPlacementsV from './components/AdPlacementsV'

import EmbeddZoom from '../src/components/EmbeddZoom'
import Polls from '../src/components/Polls'
import ZoomStatistics from '../src/components/ZoomStatistics'
import TranslationBot from '../src/components/TranslationBot'
import MessageWall from '../src/components/MessageWall'

function App () {
  return (
    <div className="app">
      <header className="gds-page-header">
        <div className="gds-page-header__product-bar">
          <h6 className="gds-page-header__product-name">Virtual in video</h6>
          <img
            className="gds-page-header__logo gds-page-header__logo--expanded"
            src="GG_PrimaryLogo_Reversed_Icon-01.eps.png"
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
        <Row>
          <Column md="4">
            <ZoomStatistics></ZoomStatistics>
          </Column>
          <Column md="4">
            <TranslationBot></TranslationBot>
          </Column>
          <Column md="4">
            <MessageWall></MessageWall>
          </Column>
        </Row>
        <Row>
          <AdPlacementsH></AdPlacementsH>
        </Row>
      </Fragment>
    </div>
  )
}

export default App
