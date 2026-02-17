import Link from 'next/link'
import BigText from 'components/BigText'
import AboutMe from 'components/About Me'
import Container from 'components/Container'

export default function Home() {
  return (
    <Container>
      <div className='flex flex-col items-center justify-center space-y-12 py-16'>
        {/* New Refined Hero Section */}
        <div className='flex flex-col items-center text-center space-y-8 px-4'>
          <h1 className='text-5xl md:text-6xl font-black tracking-tight text-primary'>
            Parker Carson
          </h1>
          
          <div className='max-w-2xl space-y-6'>
            {/* Quick Snapshot Template */}
            <div className='flex flex-wrap justify-center gap-4 text-sm md:text-base font-medium'>
              <span className='px-3 py-1 rounded-full bg-gray-100 dark:bg-gray-800 text-secondary'>Chicago, Illinois</span>
              <span className='px-3 py-1 rounded-full bg-gray-100 dark:bg-gray-800 text-secondary'>Software Engineer @ Capital One</span>
            </div>

            {/* Narrative Template */}
            <div className='space-y-4 text-lg md:text-xl text-secondary leading-relaxed'>
              <p>
                Originally from Cleveland, Ohio, I’m now based in Chicago and working as a 
                Software Engineer at <span className='font-semibold text-primary'>Capital One</span>. 
                My team focuses on the post-approval customer journey ensuring a seamless experience 
                from the moment a card is approved to its activation, including features like 
                our real-time delivery tracker.
              </p>
              <p className='text-base text-tertiary'>
                Outside of work, I stay active through running, skiing, and bowling. 
                I’m also enjoy photography and love exploring the city of Chicago on my bike.
              </p>
            </div>
          </div>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 gap-6 w-full px-4'>
          <Link href='/photos'>
            <div className='group relative overflow-hidden rounded-2xl border border-gray-200 dark:border-gray-800 p-8 hover:shadow-xl transition-all cursor-pointer bg-white dark:bg-gray-900'>
              <div className='absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity'>
                <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/><circle cx="12" cy="13" r="3"/></svg>
              </div>
              <h3 className='text-2xl font-bold mb-2'>Photography</h3>
              <p className='text-tertiary'>A collection of moments captured across Florence, Kyoto, London, and more.</p>
              <div className='mt-4 text-sm font-semibold text-blue-500 group-hover:underline'>View Gallery →</div>
            </div>
          </Link>

          <Link href='/hobbies/running'>
            <div className='group relative overflow-hidden rounded-2xl border border-gray-200 dark:border-gray-800 p-8 hover:shadow-xl transition-all cursor-pointer bg-white dark:bg-gray-900'>
              <div className='absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity'>
                <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><path d="m4 16 4-4 4 4-4 4-4-4z"/><path d="m12 8 4-4 4 4-4 4-4-4z"/><path d="m18 14 4-4-4-4-4 4 4 4z"/></svg>
              </div>
              <h3 className='text-2xl font-bold mb-2'>Running</h3>
              <p className='text-tertiary'>Documenting my journey through daily runs and race preparations.</p>
              <div className='mt-4 text-sm font-semibold text-pink-500 group-hover:underline'>See Stats →</div>
            </div>
          </Link>

          <Link href='/projects'>
            <div className='group relative overflow-hidden rounded-2xl border border-gray-200 dark:border-gray-800 p-8 hover:shadow-xl transition-all cursor-pointer bg-white dark:bg-gray-900 md:col-span-2'>
              <div className='absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity'>
                <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>
              </div>
              <h3 className='text-2xl font-bold mb-2'>Projects</h3>
              <p className='text-tertiary'>Autonomous drones, machine learning models, and web applications built with TypeScript and Python.</p>
              <div className='mt-4 text-sm font-semibold text-green-500 group-hover:underline'>Explore Work →</div>
            </div>
          </Link>
        </div>
      </div>
    </Container>
  )
}
