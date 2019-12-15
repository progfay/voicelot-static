import { createGlobalStyle } from 'styled-components'

const GlobalStyle = createGlobalStyle`
  html,
  body,
  #root {
      width: 100vw;
      height: 100vh;
      overflow: hidden;
      overscroll-behavior: none;
      background: white;
  }

  * {
      padding: 0;
      margin: 0;
      font-family: sans-serif;
  }
`

export default GlobalStyle
