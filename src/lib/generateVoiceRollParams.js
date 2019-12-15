const K = 0.92
const ROLL_NUM = 25
const ORIGINAL_LENGTH = 1200
const MINIMUM_LENGTH = 300

const generateVoiceRollParams = () => {
  const voiceRollParams = new Array(ROLL_NUM).fill(0)
  let playbackRate = 1
  let playLength = ORIGINAL_LENGTH
  for (let i = 0; i < ROLL_NUM; i++) {
    playbackRate /= K
    playLength *= K
    voiceRollParams[i] = {
      playbackRate: Math.min(playbackRate, ORIGINAL_LENGTH / MINIMUM_LENGTH),
      playLength: Math.max(Math.ceil(playLength), MINIMUM_LENGTH)
    }
  }
  return voiceRollParams
}

export default generateVoiceRollParams
