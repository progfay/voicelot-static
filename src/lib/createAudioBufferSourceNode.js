import audioContext from './audioContext'

const createAudioBufferSourceNode = audioBuffer => {
  const source = audioContext.createBufferSource()
  source.buffer = audioBuffer
  return source
}

export default createAudioBufferSourceNode
