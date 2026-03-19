import Link from 'next/link'

import Container from 'components/Container'

export default function Home() {
  return (
    <Container>
      <div className='max-w-4xl mx-auto flex flex-col items-center justify-center space-y-12 py-4 md:py-8'>
        {/* New Refined Hero Section */}
        <div className='flex flex-col items-center text-center space-y-8 px-4'>
          <h1 className='text-4xl md:text-6xl font-black tracking-tight text-primary'>
            Parker Carson
          </h1>

          <div className='max-w-4xl space-y-6'>
            {/* Quick Snapshot Template */}
            <div className='flex flex-wrap justify-center gap-3 md:gap-4 text-xs md:text-base font-medium'>
              <span className='px-3 py-1 rounded-full bg-gray-100 dark:bg-gray-800 text-secondary'>
                Chicago, Illinois
              </span>
              <span className='px-3 py-1 rounded-full bg-gray-100 dark:bg-gray-800 text-secondary'>
                Software Engineer @ Capital One
              </span>
            </div>

            {/* Narrative Template */}
            <div className='space-y-4 text-base md:text-xl text-secondary leading-relaxed'>
              <p>
                Originally from Cleveland, Ohio, I studied Computer Engineering
                at Ohio State. I’m now based in Chicago, working as a Software
                Engineer at{' '}
                <span className='font-semibold text-primary'>Capital One</span>.
                When I&apos;m not working, I stay active through running, skiing,
                golfing and I used to rock climb. I also enjoy photography and
                love exploring the city of Chicago on my bike. This summer my
                goal is to learn how to skateboard / long board.
              </p>
              <p className='text-sm md:text-base text-tertiary'>
                For work, my team focuses on the post-approval customer journey
                ensuring a seamless experience from the moment a card is
                approved to its activation, including features like our
                real-time delivery tracker.
              </p>
            </div>
          </div>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 w-full px-4'>
          {/* Featured Card: Photography */}
          <Link href='/photos' className='md:col-span-2'>
            <div className='group relative overflow-hidden rounded-3xl border border-gray-200 dark:border-gray-800 p-6 md:p-10 hover:shadow-2xl transition-all cursor-pointer bg-white dark:bg-gray-900'>
              <div className='absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-25 transition-opacity hidden md:block'>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  width='96'
                  height='96'
                  viewBox='0 0 24 24'
                  fill='none'
                  stroke='currentColor'
                  strokeWidth='1'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                >
                  <path d='M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z' />
                  <circle cx='12' cy='13' r='3' />
                </svg>
              </div>
              <h3 className='text-2xl md:text-3xl font-black mb-2 md:mb-3'>
                Photography
              </h3>
              <p className='text-secondary text-sm md:text-base max-w-lg leading-relaxed'>
                A collection of moments captured across Florence, Kyoto, London,
                and beyond. Exploring the world through a lens.
              </p>
              <div className='mt-4 md:mt-6 text-sm font-bold text-blue-500 group-hover:underline'>
                View Gallery →
              </div>
            </div>
          </Link>

          {/* Row 2: Running & Skiing */}
          <Link href='/hobbies/running'>
            <div className='group relative overflow-hidden rounded-3xl border border-gray-200 dark:border-gray-800 p-6 md:p-8 hover:shadow-xl transition-all cursor-pointer bg-white dark:bg-gray-900 h-full'>
              <h3 className='text-xl md:text-2xl font-black mb-1 md:mb-2'>
                Running
              </h3>
              <p className='text-secondary text-xs md:text-sm leading-relaxed'>
                Documenting my journey through daily runs, race preparations,
                and personal bests.
              </p>
              <div className='mt-3 md:mt-4 text-xs md:text-sm font-bold text-pink-500 group-hover:underline'>
                See Stats →
              </div>
            </div>
          </Link>

          <Link href='/hobbies/skiing'>
            <div className='group relative overflow-hidden rounded-3xl border border-gray-200 dark:border-gray-800 p-6 md:p-8 hover:shadow-xl transition-all cursor-pointer bg-white dark:bg-gray-900 h-full'>
              <h3 className='text-xl md:text-2xl font-black mb-1 md:mb-2'>
                Skiing
              </h3>
              <p className='text-secondary text-xs md:text-sm leading-relaxed'>
                Winter recaps featuring resort breakdowns, mountain views, and
                powder day highlights.
              </p>
              <div className='mt-3 md:mt-4 text-xs md:text-sm font-bold text-cyan-500 group-hover:underline'>
                View Trips →
              </div>
            </div>
          </Link>

          {/* Featured Card: Golfing */}
          <Link href='/hobbies/golfing' className='md:col-span-2'>
            <div className='group relative overflow-hidden rounded-3xl border border-gray-200 dark:border-gray-800 p-6 md:p-10 hover:shadow-2xl transition-all cursor-pointer bg-white dark:bg-gray-900'>
              <h3 className='text-2xl md:text-3xl font-black mb-2 md:mb-3'>
                Golfing
              </h3>
              <p className='text-secondary text-sm md:text-base max-w-lg leading-relaxed'>
                A monthly journal tracking fairways, greens, and season-long
                improvement. Documenting rounds, scores, and highlights across
                2025 and 2026.
              </p>
              <div className='mt-4 md:mt-6 text-sm font-bold text-emerald-500 group-hover:underline'>
                See Progress →
              </div>
            </div>
          </Link>
        </div>
      </div>
    </Container>
  )
}
