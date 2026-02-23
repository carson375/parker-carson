import { useState, useEffect, useRef } from 'react'

import Image from 'next/image'

import Container from 'components/Container'
import { Gallery } from 'components/Gallery/Gallery'
import photosData from 'components/imageOptions.json'

// Helper component to handle scrolling to the trip section
const ScrollToTrip = ({ index }: { index: number }) => {
  const hasScrolled = useRef(false)

  useEffect(() => {
    if (!hasScrolled.current) {
      const element = document.getElementById(`trip-${index}`)
      if (element) {
        element.scrollIntoView({ behavior: 'auto' })
        hasScrolled.current = true
      }
    }
  }, [index])

  return null
}

export default function Photos() {
  const [selectedTrip, setSelectedTrip] = useState<number | null>(null)

  // Close on Escape key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSelectedTrip(null)
    }
    window.addEventListener('keydown', handleEsc)
    return () => window.removeEventListener('keydown', handleEsc)
  }, [])

  const stats = {
    cities: 17,
    countries: 6,
    states: 5,
  }

  // GALLERY VIEW (Continuous Scroll)
  if (selectedTrip !== null) {
    return (
      <Container hideNav={true} clean={true}>
        <div className='min-h-screen w-full bg-white dark:bg-black animate-in fade-in duration-300 flex flex-col'>
          {/* Header - Fixed at the very top */}
          <div className='sticky top-0 z-[110] flex items-center justify-between px-6 py-4 bg-white/90 dark:bg-black/90 backdrop-blur-md border-b border-gray-100 dark:border-gray-900'>
            <h1 className='text-xl md:text-2xl font-bold text-primary'>
              Photography
            </h1>
            <button
              onClick={() => setSelectedTrip(null)}
              className='flex items-center gap-2 px-5 py-2 rounded-full bg-gray-100 dark:bg-gray-800 text-sm font-bold hover:bg-gray-200 dark:hover:bg-gray-700 transition-all active:scale-95'
            >
              <svg
                xmlns='http://www.w3.org/2000/svg'
                width='20'
                height='20'
                viewBox='0 0 24 24'
                fill='none'
                stroke='currentColor'
                strokeWidth='2.5'
                strokeLinecap='round'
                strokeLinejoin='round'
              >
                <line x1='18' y1='6' x2='6' y2='18'></line>
                <line x1='6' y1='6' x2='18' y2='18'></line>
              </svg>
              Back to Trips
            </button>
          </div>

          {/* Content */}
          <div className='flex-1 w-full max-w-5xl mx-auto py-12 px-4 space-y-32'>
            {photosData.map((trip, index) => (
              <div
                key={trip.name}
                id={`trip-${index}`}
                className='space-y-12 scroll-mt-24'
              >
                <div className='space-y-4'>
                  <h2 className='text-4xl md:text-6xl font-black text-primary tracking-tight'>
                    {trip.name}
                  </h2>
                  <p className='text-lg text-secondary font-medium'>
                    {trip.photos.length} photos
                  </p>
                </div>
                <Gallery images={trip.photos} perRow={3} />
              </div>
            ))}
          </div>
        </div>

        {/* Scroll to selected trip on mount */}
        <ScrollToTrip index={selectedTrip} />
      </Container>
    )
  }

  // GRID VIEW (Default)
  return (
    <Container fullWidth={true}>
      <div className='flex flex-col items-center justify-center space-y-12 py-16'>
        {/* Hero Section */}
        <div className='flex flex-col items-center text-center space-y-8 px-4 max-w-2xl mx-auto'>
          <h1 className='text-5xl md:text-7xl font-black tracking-tight text-primary'>
            Photography
          </h1>

          <div className='space-y-6'>
            <div className='flex flex-wrap justify-center gap-4 text-sm md:text-base font-medium'>
              <span className='px-4 py-1.5 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-800'>
                {stats.cities} Cities visited
              </span>
              <span className='px-4 py-1.5 rounded-full bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 border border-purple-100 dark:border-purple-800'>
                {stats.countries} Countries explored
              </span>
              <span className='px-4 py-1.5 rounded-full bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400 border border-green-100 dark:border-green-800'>
                {stats.states} US States
              </span>
            </div>

            <p className='text-lg md:text-xl text-secondary leading-relaxed'>
              Captured moments from my travels around the world. These photos
              are a record of the places I&apos;ve been and the things I&apos;ve
              seen, all shot through the lens of my phone.
            </p>
          </div>
        </div>

        {/* Trip Selection Grid - Now using full width */}
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 w-full px-4 pb-12'>
          {photosData.map((trip, index) => (
            <button
              key={trip.name}
              onClick={() => setSelectedTrip(index)}
              className='group relative aspect-[4/3] overflow-hidden rounded-2xl border border-gray-200 dark:border-gray-800 transition-all duration-300 hover:shadow-2xl hover:scale-[1.02] bg-gray-100 dark:bg-gray-800'
            >
              <Image
                src={trip.photos[0]}
                alt={trip.name}
                fill
                sizes='(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw'
                className='absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-110'
                priority={index < 4}
              />
              <div className='absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-80 group-hover:opacity-100 transition-opacity' />
              <div className='absolute bottom-0 left-0 p-6 text-left'>
                <h3 className='text-xl font-bold text-white'>{trip.name}</h3>
                <p className='text-sm text-gray-300 mt-1 font-medium'>
                  {trip.photos.length} Photos
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </Container>
  )
}
