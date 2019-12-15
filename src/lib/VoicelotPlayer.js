import Freeverb from 'freeverb'
import audioContext from './audioContext'
import createAudioBufferSourceNode from './createAudioBufferSourceNode'
import sounds from './sounds'
import sleep from './sleep'
import generateVoiceRollParams from './generateVoiceRollParams'

const randomOrder = length => {
  const origin = new Array(length).fill(0).map((v, i) => i)
  return new Array(origin.length)
    .fill(0)
    .map(_ => origin.splice(~~(Math.random() * origin.length), 1)[0])
}

export default class VoicelotPlayer {
  constructor (bufferArray) {
    this.bufferArray = bufferArray.map(_ => _)
    this.voice = null
    this.selected = this.bufferArray[~~(Math.random() * this.bufferArray)]
    this.voiceRollEnded = false
    this.isPlaying = false
    this.lowpassFilterNode = this.createBiquadFilter('lowpass', 22050)
    this.highpassFilterNode = this.createBiquadFilter('highpass', 100)
    this.compressorNode = this.createDynamicsCompressorNode()
    this.reverbNode = this.createFreeVerb()
    this.gainNode = this.createGainNode()
    this.lowpassFilterNode.connect(this.highpassFilterNode)
    this.highpassFilterNode.connect(this.compressorNode)
    this.compressorNode.connect(this.reverbNode)
    this.reverbNode.connect(this.gainNode)
    this.gainNode.connect(audioContext.destination)
  }

  async playVoiceRoll () {
    if (this.voiceRollEnded) return

    const order = await randomOrder(this.bufferArray.length)
    const voiceRollParams = generateVoiceRollParams()

    for (let i = 0; i < voiceRollParams.length; i++) {
      const buffer = this.bufferArray[order[i % order.length]]
      const { playLength, playbackRate } = voiceRollParams[i]
      this.voice = await createAudioBufferSourceNode(buffer)
      this.voice.playbackRate.setValueAtTime(playbackRate, 0)
      this.voice.connect(this.gainNode)
      await this.voice.start(0, 1)
      await sleep(Math.max(playLength - 300, 70))
      if (this.voiceRollEnded) return
    }
    this.gainNode.gain.setValueAtTime(8, 0)
    await sleep(500)
    if (this.voiceRollEnded) return
    this.voice = createAudioBufferSourceNode(await this.selected)
    this.voice.connect(this.lowpassFilterNode)
    this.voice.start(0, 1)
    await sleep(1000)
    if (this.voiceRollEnded) return
    this.voice = createAudioBufferSourceNode(sounds['brass-1'])
    this.voice.connect(audioContext.destination)
    this.voice.start()
    await sleep(1000)
    if (this.voiceRollEnded) return
    this.voice = createAudioBufferSourceNode(await this.selected)
    this.voice.connect(this.lowpassFilterNode)
    this.voice.start(0, 1)
    await sleep(1000)
    if (this.voiceRollEnded) return
    this.voice = createAudioBufferSourceNode(sounds['brass-2'])
    this.voice.connect(audioContext.destination)
    this.voice.start()
    this.voiceRollEnded = true
  }

  async playSelected () {
    if (!this.voiceRollEnded) this.gainNode.gain.setValueAtTime(8, 0)
    this.voiceRollEnded = true
    this.voice.stop()

    this.voice = createAudioBufferSourceNode(await this.selected)
    this.voice.connect(this.lowpassFilterNode)
    this.voice.start(0, 1)
  }

  createBiquadFilter (type, value) {
    const biquadFilter = audioContext.createBiquadFilter()
    biquadFilter.type = type
    biquadFilter.frequency.setValueAtTime(value, 0)
    return biquadFilter
  }

  createDynamicsCompressorNode () {
    const compressorNode = audioContext.createDynamicsCompressor()
    compressorNode.threshold.setValueAtTime(-80, 0)
    compressorNode.ratio.setValueAtTime(15, 0)
    compressorNode.attack.setValueAtTime(0, 0)
    return compressorNode
  }

  createFreeVerb () {
    const reverbNode = Freeverb(audioContext)
    reverbNode.roomSize = 0.7
    reverbNode.dampening = 2500
    reverbNode.wet.setValueAtTime(0.7, 0)
    reverbNode.dry.setValueAtTime(1.0, 0)
    return reverbNode
  }

  createGainNode () {
    const gainNode = audioContext.createGain()
    gainNode.gain.setValueAtTime(3.5, 0)
    return gainNode
  }
}
