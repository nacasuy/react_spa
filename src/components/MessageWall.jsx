import React, { Fragment } from 'react'
import FormGroup from 'gumdrops/FormGroup'
import Button from 'gumdrops/Button'
import TextInput from 'gumdrops/TextInput'

const MessageWall = () => {
  return (
    <Fragment>
      <h3 className="gds-text--header-xs -ellipsis">Social Wall</h3>

      <FormGroup className="-m-b-3">
        <div className="gds-flex">
          <div className="gds-flex__item" style={{ flexBasis: '50%' }}>
            <TextInput size="xs" name="newName" placeholder="Post a message" />
          </div>
          <div
            className="gds-flex__item gds-flex__item--grow-0"
            style={{ flexBasis: 60 }}
          >
            &nbsp;
            <Button name="submit-btn" context="primary" size="xs">
              Post
            </Button>
          </div>
        </div>
        <div>
          <ul>
            <li><p><strong><em>It does not matter how slowly you go as long as you do not stop.</em></strong></p>
              <img src="emoji1.png" width="15px" height="15px"/>
              <img src="emoji2.png" width="15px" height="15px"/>
            </li>
          </ul>
        </div>
      </FormGroup>
    </Fragment>
  )
}
export default MessageWall
