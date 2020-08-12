import React, { Fragment } from 'react'
import FormGroup from 'gumdrops/FormGroup'
import Button from 'gumdrops/Button'
import TextInput from 'gumdrops/TextInput'

const TranslationBot = () => {
  return (
    <Fragment>
      <h3 className="gds-text--header-md -ellipsis -m-v-3">Translation</h3>

      <FormGroup className="-m-b-3">
        <div className="gds-flex">
          <div className="gds-flex__item" style={{ flexBasis: '50%' }}>
            <TextInput size="xs" name="newName" placeholder="Text to Translate" />
          </div>
          <div
            className="gds-flex__item gds-flex__item--grow-0"
            style={{ flexBasis: 60 }}
          >&nbsp;
            <Button name="submit-btn" context="primary" size="xs">
              Submit
            </Button>
          </div>
        </div>
      </FormGroup>
    </Fragment>
  )
}
export default TranslationBot
