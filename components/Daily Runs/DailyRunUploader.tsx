// https://github.com/delbaoliveira/website/blob/main/ui/challenge/TextSlider.tsx
import React from 'react'
import Link from 'next/link'

import { useInterval } from 'react-use'

import classNames from 'lib/classNames'
import { Gallery } from '../Gallery/Gallery'

type DailyRunUploaderProps = {
  date: string
  distance: number // in miles
  time: string // "hh:mm:ss"
  comments?: string // optional comments
  photo?: string // image URL or base64, now optional
}

export default function DailyRunUploader({
  date,
  distance,
  time,
  comments,
  photo,
  className = '',
}: DailyRunUploaderProps & { className?: string }) {
  return (
    <div
      className={`flex flex-col items-center border rounded-lg p-4 pt-8 pb-8 shadow-md bg-white dark:bg-gray-900 max-w-md mx-auto ${className}`}
    >
      {/* Gallery displaying the photo */}
      {photo && (
        <div className='w-full mb-4'>
          <Gallery images={[photo]} />
        </div>
      )}
      <div className='text-lg font-semibold mb-2'>{date}</div>
      <div className='text-md mb-1'>
        <span className='font-bold'>Distance:</span> {distance.toFixed(2)} miles
      </div>
      <div className='text-md mb-1'>
        <span className='font-bold'>Time:</span> {time}
      </div>
      {comments && (
        <div className='text-md mt-2 italic text-center'>{comments}</div>
      )}
    </div>
  )
}
