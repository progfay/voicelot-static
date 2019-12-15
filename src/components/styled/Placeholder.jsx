import React from 'react'
import styled from 'styled-components'

const Outer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`

const Inner = styled.div`
  width: 80%;
  height: 80%;
  display: flex;
  justify-content: center;
  align-items: center;
  word-wrap: break-word;
`

const Placeholder = ({ children }) => {
  return (
    <Outer>
      <Inner>
        {children}
      </Inner>
    </Outer>
  )
}

export default Placeholder
