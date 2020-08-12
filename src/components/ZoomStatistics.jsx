import React, { Fragment } from 'react'

import { ChatItem } from 'react-chat-elements'
import 'react-chat-elements/dist/main.css'

const ZoomStatistics = () => {
  return (
    <Fragment>
      <h3 className="gds-text--header-xs -ellipsis">Chat Room</h3>

      <ChatItem
        avatar={'chat1.png'}
        alt={'User'}
        subtitle={'What are you doing?'}
        date={new Date()}
        unread={0} />
      <ChatItem
        avatar={'chat2.jpg'}
        alt={'User'}
        subtitle={'Hackaton'}
        date={new Date()}
        unread={0} />
    </Fragment>
  )
}
export default ZoomStatistics
