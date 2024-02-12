import Container from 'components/Container'

import { Gallery } from '../components/Gallery/Gallery'

import { Paris2022 } from '../components/imageOptions'

const images = [Paris2022, ['/photography/Paris2022/Bridge.JPG']]

//const images2 = ['/photography/Bridge.JPG']

export default function Photos() {
  return (
    <Container>
      <div className='flex flex-col items-center justify-center inset-0'>
        <p>This page is dedicated to photos that I&apos;ve taken.</p>
        <Gallery images={images[0]} />
      </div>
    </Container>
  )
}
