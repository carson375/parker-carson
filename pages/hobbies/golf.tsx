import { useState } from 'react'

import Container from 'components/Container'

interface Round {
  course: string
  score: number
  date: string
  photos: string[]
}

export default function Golf() {
  const [rounds] = useState<Round[]>([])

  return (
    <Container fullWidth={true}>
      <div className='flex flex-col items-center justify-center space-y-12 py-16'>
        <div className='flex flex-col items-center text-center space-y-8 px-4 max-w-2xl mx-auto'>
          <h1 className='text-5xl md:text-7xl font-black tracking-tight text-primary'>
            Golf
          </h1>
          <p className='text-lg md:text-xl text-secondary leading-relaxed'>
            Finding the fairway (eventually).
          </p>
        </div>

        <div className='w-full px-4 max-w-7xl mx-auto'>
          {rounds.length > 0 ? (
            <div className='grid grid-cols-1 gap-12'>
              {/* Round cards will go here */}
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
                <circle cx='12' cy='12' r='10'></circle>
                <path d='M6 12c0-1.7.7-3.2 1.8-4.2'></path>
                <circle cx='12' cy='12' r='2'></circle>
                <path d='m18 8-2 2'></path>
              </svg>
              <p className='font-bold text-xl text-primary mb-2'>
                No rounds recorded yet
              </p>
            </div>
          )}
        </div>
      </div>
    </Container>
  )
}
