// https://github.com/delbaoliveira/website/blob/main/ui/challenge/TextSlider.tsx
import React from 'react'
import Link from 'next/link'

import { useInterval } from 'react-use'

import classNames from 'lib/classNames'

const slides = ['I enjoy running']

const gradients = [
  'from-yellow-400 via-red-500 to-pink-500',
  'from-purple-400 via-pink-500 to-red-500',
  'from-green-400 to-blue-500',
]

const links = ['/hobbies/running']

export default function AboutMe() {
  return (
    <div className='flex flex-col items-center text-2xl font-semibold tracking-tight space-y-2 pt-8'>
      <h2 className='text-3xl font-bold mb-4'>About Me</h2>
      {slides.map((text, index) => (
        <Link href={links[index]} key={text} passHref>
          <span
            className={`cursor-pointer bg-clip-text text-transparent bg-gradient-to-r ${gradients[index]} text-center hover:underline`}
          >
            {text}
          </span>
        </Link>
      ))}
    </div>
  )
}
