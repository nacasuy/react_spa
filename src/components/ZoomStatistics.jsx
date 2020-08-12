import React, { Fragment } from 'react'
import Column from 'gumdrops/Column'
import Row from 'gumdrops/Row'
import Card from 'gumdrops/Card'
import FormGroupLabel from 'gumdrops/FormGroupLabel'
import FormGroup from 'gumdrops/FormGroup'

const ZoomStatistics = () => {
  return (
    <Fragment>
      <h3 className="gds-text--header-md -ellipsis -m-v-3">Statistics</h3>
      <Row>
        <Column md="6">
          <FormGroup>
            <FormGroupLabel text="Connected Users"/> 1000
          </FormGroup>
        </Column>
        <Column md="6">
          <FormGroup>
            <FormGroupLabel text="Video Recorded (last week)" />  20
          </FormGroup>
        </Column>
      </Row>
      <Row>
        <Column md="6">
          <FormGroup>
            <FormGroupLabel text="Chat sessions" /> 100
          </FormGroup>
        </Column>
        <Column md="6">
          <FormGroup>
            <FormGroupLabel text="Ad Lines" /> 100
          </FormGroup>
        </Column>
      </Row>
      <Row>
        <Column md="6">
          <FormGroup>
            <FormGroupLabel text="Unit Types"/>  1
          </FormGroup>
        </Column>
        <Column md="6">
          <FormGroup>
            <FormGroupLabel text="Polls"/>  1
          </FormGroup>
        </Column>
      </Row>
    </Fragment>
  )
}
export default ZoomStatistics
