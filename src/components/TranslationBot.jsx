import React, { Fragment } from 'react'
import FormGroup from 'gumdrops/FormGroup'
import Button from 'gumdrops/Button'
import TextInput from 'gumdrops/TextInput'
import TextArea from 'gumdrops/TextArea'

const TranslationBot = () => {
  return (
    <Fragment>
      <h3 className="gds-text--header-xs -ellipsis">Translation</h3>

      <FormGroup className="-m-b-3">
        <div className="gds-flex gds-flex--wrap-no">
          <div className="gds-flex__item gds-flex__item--grow-0" style={{ flexBasis: 350 }}>
            <TextArea
              size="sm"
              name="names"
              resize="resize-v"
              placeholder="Text to translate"
              style={{ height: '100px', width: '350px' }}
            />
          </div>
          <div className="gds-flex__item -m-l-2">
            <Button name="submit-btn" context="primary" size="xs">
              &nbsp;Translate
            </Button>
          </div>
        </div>
      </FormGroup>
    </Fragment>
  )
}
export default TranslationBot
