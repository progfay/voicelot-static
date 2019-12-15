/* global navigator */

import AudioRecorder from './AudioRecorder'
import audioContext from './audioContext'
import createAudioBufferSourceNode from './createAudioBufferSourceNode'
import sleep from './sleep'
import { STANDBY, RECORDING, STOP } from '../constants/mode'
import sounds from './sounds'

if (!navigator.mediaDevices) throw new Error('Your browser does not support audio recording')

export default class VoicelotRecorder {
  constructor () {
    this.results = []
    this.mode = STANDBY
    this.audioRecorder = null
    this.gainNode = this.createGainNode()
    this.gainNode.connect(audioContext.destination)
    this.onEnd = () => {}
  }

  init () {
    return new Promise(
      (resolve, reject) => {
        navigator.mediaDevices.getUserMedia({ audio: true, video: false })
          .then((stream) => {
            this.audioRecorder = new AudioRecorder(stream)
            this.audioRecorder.addEventListener('dataavailable', this.onDataavailable.bind(this))
            resolve()
          })
          .catch(reject)
      }
    )
  }

  async start (onStart) {
    const silent = createAudioBufferSourceNode(audioContext.createBuffer(1, 1, 22050))
    silent.connect(this.gainNode)
    silent.start(0)
    await sleep(300)
    silent.stop()

    let clapAudio = createAudioBufferSourceNode(sounds['clap'])
    clapAudio.connect(this.gainNode)
    clapAudio.start(0)

    await sleep(1000)

    const sanHaiAudio = createAudioBufferSourceNode(sounds['san-hai'])
    sanHaiAudio.connect(this.gainNode)
    sanHaiAudio.start(0)

    await sleep(1000)

    this.audioRecorder.start(2000)
    this.mode = RECORDING

    clapAudio = createAudioBufferSourceNode(sounds['clap'])
    clapAudio.connect(this.gainNode)
    clapAudio.start(0)
    await sleep(1000)
    await onStart()
    await sleep(1000)

    while (this.mode === RECORDING) {
      clapAudio = createAudioBufferSourceNode(sounds['clap'])
      clapAudio.connect(this.gainNode)
      clapAudio.start(0)
      await sleep(2000)
    }

    this.audioRecorder.stop()
  }

  stop (onEnd) {
    if (this.mode !== RECORDING) return
    this.onEnd = onEnd
    this.mode = STOP
  }

  onDataavailable ({ data, audio }) {
    this.results.push(data)

    if (this.mode !== STOP) return
    this.mode = STANDBY
    this.onEnd(this.results)
  }

  createGainNode () {
    const gainNode = audioContext.createGain()
    gainNode.gain.setValueAtTime(8.5, 0)
    return gainNode
  }
}
