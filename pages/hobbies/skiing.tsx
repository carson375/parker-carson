import { useState } from 'react'

import Container from 'components/Container'

interface SkiTrip {
  location: string
  resort: string
  date: string
  photos: string[]
  videos?: string[]
}

export default function Skiing() {
  const [trips] = useState<SkiTrip[]>([])

  return (
    <Container fullWidth={true}>
      <div className='flex flex-col items-center justify-center space-y-12 py-16'>
        <div className='flex flex-col items-center text-center space-y-8 px-4 max-w-2xl mx-auto'>
          <h1 className='text-5xl md:text-7xl font-black tracking-tight text-primary'>
            Skiing
          </h1>
          <p className='text-lg md:text-xl text-secondary leading-relaxed'>
            Views from the mountains.
          </p>
        </div>

        <div className='w-full px-4 max-w-7xl mx-auto'>
          {trips.length > 0 ? (
            <div className='grid grid-cols-1 gap-12'>
              {/* Trip cards will go here */}
            </div>
          ) : (
            <div className='aspect-video w-full rounded-3xl border-2 border-dashed border-gray-200 dark:border-gray-800 flex flex-col items-center justify-center text-secondary bg-gray-50/50 dark:bg-gray-900/50'>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                width='48'
                height='48'
                viewBox='0 0 24 24'
                fill='none'
                stroke='currentColor'
                strokeWidth='1.5'
                strokeLinecap='round'
                strokeLinejoin='round'
                className='mb-4 opacity-20'
              >
                <path d='m2 20 7-7 7 7'></path>
                <path d='m9 20 10-10 3 3'></path>
                <path d='M12 5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z'></path>
              </svg>
              <p className='font-bold text-xl text-primary mb-2'>
                No trips documented yet
              </p>
            </div>
          )}
        </div>
      </div>
    </Container>
  )
}
