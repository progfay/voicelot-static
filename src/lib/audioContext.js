/* global window */

const AudioContext = window.AudioContext || window.webkitAudioContext
const audioContext = new AudioContext({ sampleRate: 44100 })
export default audioContext
