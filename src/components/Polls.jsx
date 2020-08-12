import React, { Fragment } from 'react'
import Column from 'gumdrops/Column'
import Row from 'gumdrops/Row'
import Checkbox from 'gumdrops/Checkbox'

const Polls = ({}) => {
  return (
    <Fragment>
      <Row>
        <Column md="12" className="-m-l-2 -m-b-2 -m-t-4">
          <h3 className="gds-text--header-md -ellipsis -m-v-3">
            Manage Poll(s)
          </h3>
          <div className="checkbox-list">
            <h6>What are your intentions for the day?</h6>
            <ul className="checkbox-list__items">
              <li key={'1'} className="checkbox-list__item">
                <Checkbox
                  label={'Catch up work/emails'}
                  size="xs"
                  className=""
                  value={true}
                />
              </li>
              <li key={'2'} className="checkbox-list__item">
                <Checkbox
                  label={'Project progress'}
                  size="xs"
                  className=""
                  value={true}
                />
              </li>
              <li key={'3'} className="checkbox-list__item">
                <Checkbox
                  label={'General wellbeing'}
                  size="xs"
                  className=""
                  value={true}
                />
              </li>
            </ul>
          </div>

        </Column>
      </Row>
    </Fragment>
  )
}
export default Polls
