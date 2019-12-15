/* global fetch */

import decodeAudioData from './decodeAudioData'

const getAudioBuffer = (url) => (
  new Promise((resolve, reject) => {
    fetch(url)
      .then(response => response.arrayBuffer())
      .then(decodeAudioData)
      .then(resolve)
      .catch(reject)
  })
)

export default getAudioBuffer
