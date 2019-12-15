import React from 'react'
import styled from 'styled-components'

const ModalOuter = styled.div`
  position: fixed;
  top: 50vh;
  left: 50vw;
  transform: translate(-50%, -50%);
  width: 80vw;
  max-width: 720px;
  max-height: 75vh;
  border: solid 1px #084A83;
  border-radius: 1vmin;
  background-color: rgba(255, 255, 255, 0.9);
  color: #084A83;
  user-select: none;
  overflow: scroll;
  z-index: 100;
`

const ModalInner = styled.div`
  padding: 5vmin;
  font-size: 3vw;
  line-height: 2.4em;
  text-align: center;
  display: flex;
  justify-content: center;
  flex-direction: column;
`

export default ({ children }) => (
  <ModalOuter>
    <ModalInner>
      {children}
    </ModalInner>
  </ModalOuter>
)
