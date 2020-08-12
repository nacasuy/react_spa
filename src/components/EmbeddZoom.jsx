import React from 'react'

const EmbeddZoom = () => {
  return (
    <div>
      <iframe title="ViV" src="https://zoom.us/wc/94724592154/join?prefer=0&pwd=833753"
        style={{ height: '470px', width: '100%' }}
        allow="microphone; camera; fullscreen"
        sandbox="allow-forms allow-scripts allow-same-origin"/>
    </div>
  )
}
export default EmbeddZoom
