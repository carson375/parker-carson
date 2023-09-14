import Container from 'components/Container'
import { Gallery } from '../components/Gallery/Gallery'

export default function Photos() {
  return (
    <Container>
      <div className='flex flex-col items-center justify-center inset-0'>
        <p>This page is dedicated to photos that I've taken.</p>
        <Gallery />
      </div>
    </Container>
  )
}
