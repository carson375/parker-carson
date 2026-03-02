// https://github.com/delbaoliveira/website/blob/main/ui/challenge/TextSlider.tsx
import React from 'react'

import Link from 'next/link'
import { useInterval } from 'react-use'

import classNames from 'lib/classNames'

const slides = [
  'I enjoy running',
  'I love photography',
  'I enjoy golf',
  'I love skiing',
  'I build projects',
]

const gradients = [
  'from-orange-400 to-red-500',
  'from-blue-400 to-indigo-500',
  'from-emerald-400 to-green-600',
  'from-cyan-400 to-blue-500',
  'from-purple-400 via-pink-500 to-red-500',
]

const links = [
  '/hobbies/running',
  '/photos',
  '/hobbies/golfing',
  '/hobbies/skiing',
  '/projects',
]

export default function AboutMe() {
  const [currentSlide, setSlide] = React.useState(0)

  useInterval(() => {
    setSlide((currentSlide + 1) % slides.length)
  }, 3000)

  return (
    <div className='flex flex-col items-center text-2xl font-semibold tracking-tight space-y-2 pt-8'>
      <h2 className='text-3xl font-bold mb-4'>About Me</h2>
      <Link href={links[currentSlide]} passHref>
        <span
          className={`cursor-pointer bg-clip-text text-transparent bg-gradient-to-r ${gradients[currentSlide]} text-center hover:underline transition-all duration-500`}
        >
          {slides[currentSlide]}
        </span>
      </Link>
    </div>
  )
}
