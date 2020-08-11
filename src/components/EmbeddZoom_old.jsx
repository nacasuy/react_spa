import React, { Fragment, useEffect } from 'react'
import Column from 'gumdrops/Column'
import Row from 'gumdrops/Row'
import Button from 'gumdrops/Button'

import { ZoomMtg } from '@zoomus/websdk'

let apiKeys = {
  apiKey: 'x7h92T4TSDSaa_e5RYHkYw',
  apiSecret: '47rzzSK0Nu8grhRXfFrh0f4Ow0AzHLsvQk5D'
}
let meetConfig = {
  apiKey: apiKeys.apiKey,
  meetingNumber: '92891126919',
  userName: 'Test',
  userEmail: 'natalia.castiglioni@gmail.com', // must be the attendee email address
  passWord: '497590'
}

const EmbeddZoom = ({}) => {
  const joinMeeting = (signature, meetConfig) => {
    ZoomMtg.init({
      leaveUrl: 'https://zoom.us/',
      isSupportAV: true,
      success: function (success) {
        console.log('Init Success ', success)
        ZoomMtg.join({
          meetingNumber: meetConfig.meetingNumber,
          userName: meetConfig.userName,
          signature: signature,
          apiKey: meetConfig.apiKey,
          passWord: meetConfig.passWord,

          success: (success) => {
            console.log(success)
          },

          error: (error) => {
            console.log(error)
          }
        })
      }
    })
  }

  const handleShowCreateModal = () => {
    console.log('checkSystemRequirements')
    console.log(JSON.stringify(ZoomMtg.checkSystemRequirements()))

    ZoomMtg.setZoomJSLib('node_modules/@zoomus/websdk/dist', '/av')
    ZoomMtg.preLoadWasm()
    ZoomMtg.prepareJssdk()

    /**
     * You should not visible api secret key on frontend
     * Signature must be generated on server
     * https://marketplace.zoom.us/docs/sdk/native-sdks/web/essential/signature
     */
    ZoomMtg.generateSignature({
      meetingNumber: meetConfig.meetingNumber,
      apiKey: meetConfig.apiKey,
      apiSecret: apiKeys.apiSecret,
      role: meetConfig.role,
      success: function (res) {
        console.log('res', res)

        setTimeout(() => {
          joinMeeting(res.result, meetConfig)
        }, 1000)
      }
    })
  }

  return (
    <Fragment>
      <Row>
        <Column md="12">
          <h3 className="gds-text--header-md -ellipsis -m-v-3">Zoom</h3>
        </Column>
        <Column md="12" className="gds-flex -m-t-3">
          <Button
            context="primary"
            size="sm"
            style={{ float: 'right' }}
            onClick={handleShowCreateModal}
          >
            Join a meeting
          </Button>
        </Column>
      </Row>
      <hr className="-m-b-3" />
    </Fragment>
  )
}

export default EmbeddZoom
