import React from 'react'

const EmbeddZoom = () => {
  return (
    <div>
      <iframe title="ViV" src="https://zoom.us/wc/94274654920/join?prefer=0&pwd=401598"
        style={{ height: '450px', width: '100%' }}
        allow="microphone; camera; fullscreen"
        sandbox="allow-forms allow-scripts allow-same-origin"/>
    </div>
  )
}
export default EmbeddZoom
