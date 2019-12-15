import React from 'react'
import styled from 'styled-components'

const Container = styled.div`
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
`

const Title = styled.h1`
  width: 100vw;
  height: 10vh;
  line-height: 10vh;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  vertical-align: middle;
  font-weight: bold;
  color: #084A83;
  background: #C6E5F3;
  margin-bottom: 5vh;
`

const Name = styled.h3`
  width: 100vw;
  height: 5vh;
  line-height: 5vh;
  display: flex;
  align-items: center;
  justify-content: center;
`

const Thumbnail = styled.div`
  width: 100vw;
  height: 20vh;
  ${({ src = 'https://i.gyazo.com/f935e272e5b4cea73c3ef25ba0c6bc69.jpg' }) => `background-image: url(${src});`}
  background-size: contain;
  background-position: center;
  background-repeat: no-repeat;
  display: flex;
  justify-content: center;
  align-items: center;
`

const Description = styled.p`
  width: 90vw;
  height: 10vh;
  line-height: 1.2em;
  padding: 0 5vw;
  margin: 2.5vh 0;
  overflow: hidden;
`

const Result = ({ restaurant }) => {
  const { name, url, image_url: { shop_image1: image }, latitude, longitude, pr: { pr_short: description } } = restaurant
  const isOnline = window.navigator.onLine
  const altImage = `/static/cache/image/${image.split('/').pop()}`
  return (
    <Container>
      <Title> 決定！ </Title>
      <Thumbnail src={!image ? '/static/placeholder.jpg' : isOnline ? image : altImage} />
      <Name>
        <a href={url} style={{ color: '#084A83' }} target='_blank' rel='noopener'> {name} </a>
      </Name>
      <Description> {description} </Description>
      <iframe
        src={`https://maps.google.co.jp/maps?output=embed&ll=${latitude},${longitude}&z=14&q=${encodeURIComponent(name)}`}
        width={window.innerWidth} height={window.innerHeight * 0.45} frameBorder='0' allowFullScreen
      />
    </Container>
  )
}
export default Result
