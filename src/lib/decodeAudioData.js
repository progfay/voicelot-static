/* global window */

const decodeAudioData = (arrayBuffer) => (
  new Promise((resolve, reject) => {
    new (window.AudioContext || window.webkitAudioContext)().decodeAudioData(arrayBuffer, resolve)
  })
)

export default decodeAudioData
