import React from 'react'
import Container from 'components/Container'
import DailyRunUploader from 'components/Daily Runs'

export default function Running() {
  return (
    <Container>
      <div className='flex flex-col items-center justify-center inset-0'>
        <div className='flex flex-col items-center'>
          <h1 className='text-6xl font-extrabold tracking-tight md:text-9xl'>
            Running
          </h1>
          <h2 className='text-3xl font-bold mt-8 mb-2'>Racing</h2>
          {/* Add racing content here */}
          <h2 className='text-3xl font-bold mt-8 mb-2'>Daily Runs</h2>
          {/* Add daily runs content here */}
          <DailyRunUploader
            date='2025-05-19'
            distance={6.01}
            time='00:44:19'
            comments='Tempo Run'
            className='my-6'
          />
          <DailyRunUploader
            date='2025-05-17'
            distance={10.68}
            time='01:21:36'
            className='my-6'
            comments='Long Run'
            photo='/running/Chicago52025.jpg'
          />
        </div>
      </div>
    </Container>
  )
}
