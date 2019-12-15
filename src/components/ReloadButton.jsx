/* global location */

import React from 'react'
import TextButton from './styled/TextButton'

const ReloadButton = () => {
  const onClick = () => { location.reload() }
  return (
    <TextButton onClick={onClick}> Reload </TextButton>
  )
}

export default ReloadButton
