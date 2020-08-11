import React from 'react'

const EmbeddZoom = () => {
  return (
    <div>
      <iframe title="VIV" src="https://zoom.us/wc/95749826450/join?prefer=0&pwd=877877"
        style={{ height: '500px', width: '100%' }}
        allow="microphone; camera; fullscreen"
        sandbox="allow-forms allow-scripts allow-same-origin"/>
      <hr className="-m-b-3" />
    </div>
  )
}
export default EmbeddZoom
