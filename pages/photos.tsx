import Container from 'components/Container'

import { Gallery } from '../components/Gallery/Gallery'

const images = [
  '/photography/Bridge.JPG',
  '/photography/ASundayAfternoonInParis.JPG',
  '/photography/Eiffel.JPG',
  '/photography/Eiffel2.JPG',
  '/photography/LuxemborgGardens.JPG',
  '/photography/LuxemborgGardens.JPG',
  '/photography/LuxGardens2.JPG',
  '/photography/LuxGardensBuilding.JPG',
  '/photography/LuxGardensBuilding2.JPG',
  '/photography/LuxGardensEiffel.JPG',
  '/photography/LuxGardensStatue.JPG',
  '/photography/NotreDame.JPG',
  '/photography/NotreDame2.JPG',
  '/photography/NotreDameSide.JPG',
  '/photography/Pantheon.JPG',
  '/photography/PantheonClose.JPG',
  '/photography/ParisBuilding.JPG',
  '/photography/Street.JPG',
]

//const images2 = ['/photography/Bridge.JPG']

export default function Photos() {
  return (
    <Container>
      <div className='flex flex-col items-center justify-center inset-0'>
        <p>This page is dedicated to photos that I&apos;ve taken.</p>
        <Gallery images={images} />
      </div>
    </Container>
  )
}
