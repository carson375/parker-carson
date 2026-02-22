import { useState } from 'react'

import Container from 'components/Container'

interface Climb {
  location: string
  grade: string
  type: 'Indoor' | 'Outdoor'
  date: string
  photos: string[]
}

export default function Climbing() {
  const [climbs] = useState<Climb[]>([])

  return (
    <Container fullWidth={true}>
      <div className='flex flex-col items-center justify-center space-y-12 py-16'>
        <div className='flex flex-col items-center text-center space-y-8 px-4 max-w-2xl mx-auto'>
          <h1 className='text-5xl md:text-7xl font-black tracking-tight text-primary'>
            Climbing
          </h1>
          <p className='text-lg md:text-xl text-secondary leading-relaxed'>
            Scaling walls and finding lines. From gym sessions to outdoor crags,
            documenting the journey upwards.
          </p>
        </div>

        <div className='w-full px-4 max-w-7xl mx-auto'>
          {climbs.length > 0 ? (
            <div className='grid grid-cols-1 gap-12'>
              {/* Climb cards will go here */}
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
                <path d='m7 21 4-4 4 4'></path>
                <path d='m7 3 4 4 4-4'></path>
                <path d='M11 7v10'></path>
                <path d='m14 9-5.74 2.29a1 1 0 0 0 0 1.86L14 15'></path>
              </svg>
              <p className='font-bold text-xl text-primary mb-2'>
                No climbs logged yet
              </p>
              <p className='text-secondary'>Time to hit the gym or the crag!</p>
            </div>
          )}
        </div>
      </div>
    </Container>
  )
}
