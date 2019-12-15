import getAudioBuffer from './getAudioBuffer'

const NAME_LIST = [
  'san-hai',
  'clap',
  'brass-1',
  'brass-2'
]

const sounds = {}

export const prefetch = () => {
  return Promise.all(
    NAME_LIST.map(name => (
      new Promise((resolve, reject) => {
        getAudioBuffer(`/static/sounds/${name}.wav`)
          .then(buffer => { sounds[name] = buffer })
          .then(resolve)
          .catch(reject)
      })
    ))
  )
}

export default sounds
