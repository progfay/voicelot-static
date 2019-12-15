/* global import */

import React from 'react'
import ReactDOM from 'react-dom'
import GlobalStyle from '../components/styled/GlobalStyle'
import Placeholder from '../components/styled/Placeholder'

const VoicelotButton = React.lazy(() => import('../components/VoicelotButton'))

ReactDOM.render(
  <React.Suspense fallback={<Placeholder> Loading... </Placeholder>}>
    <GlobalStyle />
    <VoicelotButton type={location.hash} />
  </React.Suspense>,
  document.getElementById('root'))
