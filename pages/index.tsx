import BigText from 'components/BigText'
import AboutMe from 'components/About Me'
import Container from 'components/Container'

export default function Home() {
  return (
    <Container>
      <div className='flex flex-col items-center justify-center inset-0'>
        <BigText slides={['Parker', 'Carson']} />
        <div className='flex flex-col items-center'>
          <AboutMe />
        </div>
      </div>
    </Container>
  )
}
