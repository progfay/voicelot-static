/* global document, Event */

import audioContext from './audioContext'

class AudioRecorder {
  constructor (stream) {
    this.stream = stream
    this.mediaStreamSource = null
    this.processor = null
    this.floatData = null
    this.audioData = null
    this.state = 'inactive'
    this.em = document.createDocumentFragment()
    this.num = 0
    this.duration = 0
    this.length = 0
    this.sampleRate = 0
    this.onAudioProcess = this.onAudioProcess.bind(this)
  }

  start (timeslice) {
    this.state = 'recording'

    this.mediaStreamSource = audioContext.createMediaStreamSource(this.stream)
    this.processor = audioContext.createScriptProcessor(1024, 1, 1)
    this.mediaStreamSource.connect(this.processor)

    this.processor.onaudioprocess = this.onAudioProcess
    if (timeslice) {
      this.slicing = setInterval(function () {
        if (this.state === 'recording') this.requestData()
      }.bind(this), timeslice)
    }

    this.processor.connect(audioContext.destination)
  }

  stop () {
    if (!this.processor) return
    this.state = 'inactive'
    this.mediaStreamSource.disconnect()
    this.processor.disconnect()
    this.processor.onaudioprocess = null
    this.processor = null
    this.stream = null
    clearInterval(this.slicing)
  }

  requestData () {
    const audioBuffer = audioContext.createBuffer(this.num, this.length, this.sampleRate)
    for (let i = 0; i < this.num; i++) {
      audioBuffer.getChannelData(i).set(this.floatData[i])
    }

    this.num = 0
    this.length = 0
    this.sampleRate = 0
    this.floatData = null

    const event = new Event('dataavailable')
    event.data = audioBuffer
    event.audio = this.audioData
    this.em.dispatchEvent(event)
  }

  onAudioProcess ({ inputBuffer }) {
    if (!this.num) {
      this.num = inputBuffer.numberOfChannels
      this.floatData = new Array(this.num).fill([])
      this.audioData = []
      this.sampleRate = inputBuffer.sampleRate
    }

    const input = inputBuffer.getChannelData(0)
    const bufferData = new Float32Array(1024).map((_, i) => input[i])
    this.audioData.push(bufferData)

    if (input.some(Boolean)) {
      this.duration += inputBuffer.duration
      this.length += inputBuffer.length
      for (let i = 0; i < this.num; i++) {
        this.floatData[i].push(...inputBuffer.getChannelData(i))
      }
    }
  }

  addEventListener () {
    this.em.addEventListener(...arguments)
  }

  removeEventListener () {
    this.em.removeEventListener(...arguments)
  }
}

export default AudioRecorder
