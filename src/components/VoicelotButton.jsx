/* global window */

import React from 'react'
import Information from './Information'
import ReloadButton from './ReloadButton'
import Button from './styled/button'
import Container from './styled/container'
import Placeholder from './styled/Placeholder'
import VoicelotRecorder from '../lib/VoicelotRecorder'
import VoicelotPlayer from '../lib/VoicelotPlayer'
import { STANDBY, READY, RECORDING, STOP, RESULT } from '../constants/mode'
import { prefetch } from '../lib/sounds'

class VoicelotButton extends React.Component {
  constructor () {
    super()
    this.state = {
      mounted: false,
      loaded: false,
      accessible: false,
      mode: STANDBY
    }
    this.recorder = new VoicelotRecorder()
    this.player = null
    this.onClick = this.onClick.bind(this)
  }

  componentDidMount () {
    this.setState({ mounted: true })
  }

  onClick () {
    const { mode } = this.state
    switch (mode) {
      case READY:
      case STOP:
        return

      case RESULT:
        this.player.playSelected()
        return

      default:
        this.setState({ mode: mode + 1 })
    }
  }

  render () {
    const { mounted, loaded, accessible, mode } = this.state

    if (!mounted) return null

    if (!loaded) {
      throw new Promise(
        (resolve, reject) => {
          prefetch()
            .then(() => this.recorder.init())
            .then(() => {
              this.setState({ loaded: true, accessible: true })
              resolve()
            })
            .catch(error => {
              this.setState({ loaded: true, accessible: false })
              reject(error)
            })
        }
      )
    }

    if (!accessible) return <Placeholder> not allowed permission for access microphone </Placeholder>

    switch (mode) {
      case READY:
        this.recorder.start(() => { this.setState({ mode: RECORDING }) })
        break

      case STOP:
        this.recorder.stop(results => {
          this.setState({ mode: RESULT })
          this.player = new VoicelotPlayer(results)
          this.player.playVoiceRoll()
        })
        break

      case RESULT:
        break
    }

    return (
      <Container>
        <Information text={'声を使ってエントリー'} />
        <Button onClick={this.onClick}>
          {
            mode === STANDBY ? 'Start!'
              : mode === READY ? 'Ready?'
                : mode === RECORDING ? 'Stop!'
                  : mode === STOP ? 'Calculating...'
                    : mode === RESULT ? 'Replay' : ''
          }
        </Button>
        {mode === RESULT ? <ReloadButton /> : null}
      </Container>
    )
  }
}

export default () => (
  <React.Suspense fallback={<Placeholder> Loading... </Placeholder>}>
    <VoicelotButton />
  </React.Suspense>
)
