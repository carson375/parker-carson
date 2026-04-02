import { useState, useEffect } from 'react'

import dynamic from 'next/dynamic'
import Image from 'next/image'
import { useRouter } from 'next/router'

import Container from 'components/Container'
import { Gallery } from 'components/Gallery/Gallery'
import photosDataRaw from 'data/photos.json'
import { cloudinaryLoader } from 'lib/cloudinary'

const TripMap = dynamic(
  () => import('components/Gallery/TripMap').then(mod => mod.TripMap),
  {
    ssr: false,
    loading: () => (
      <div className='w-full h-[450px] bg-gray-100 dark:bg-gray-800 animate-pulse rounded-3xl' />
    ),
  }
)

interface Location {
  name: string
  lat: number
  lng: number
  description?: string
}

interface Trip {
  name: string
  photos: string[]
  locations?: Location[]
  route?: [number, number][]
}

const photosData = photosDataRaw as Trip[]

// Helper to slugify trip names for URLs
const slugify = (text: string) =>
  text
    .toLowerCase()
    .replace(/[^\w ]+/g, '')
    .replace(/ +/g, '-')

export default function Photos() {
  const router = useRouter()
  const [selectedTrip, setSelectedTrip] = useState<number | null>(null)
  const [showMap, setShowMap] = useState(false)

  // Handle initial load and browser back/forward
  useEffect(() => {
    if (router.isReady) {
      const tripSlug = router.query.trip
      if (tripSlug) {
        const index = photosData.findIndex(t => slugify(t.name) === tripSlug)
        if (index !== -1) {
          setSelectedTrip(index)
        }
      } else {
        setSelectedTrip(null)
      }
    }
  }, [router.isReady, router.query.trip])

  const handleSelectTrip = (index: number) => {
    const trip = photosData[index]
    router.push({ query: { trip: slugify(trip.name) } }, undefined, {
      shallow: true,
    })
    setSelectedTrip(index)
  }

  const handleCloseTrip = () => {
    router.push({ query: {} }, undefined, { shallow: true })
    setSelectedTrip(null)
    setShowMap(false)
  }

  // Scroll to top when trip selection changes
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [selectedTrip])

  // Close on Escape key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleCloseTrip()
    }
    window.addEventListener('keydown', handleEsc)
    return () => window.removeEventListener('keydown', handleEsc)
  }, [])

  // GALLERY VIEW (Continuous Scroll)
  if (selectedTrip !== null) {
    const currentTrip = photosData[selectedTrip]
    const hasLocations =
      (!!currentTrip.locations && currentTrip.locations.length > 0) ||
      (!!currentTrip.route && currentTrip.route.length > 0)

    return (
      <Container hideNav={true} clean={true}>
        <div className='w-full bg-white dark:bg-black'>
          {/* Header - Changed to relative to prevent Leaflet snapping issues */}
          <div className='relative z-[9999] flex flex-col md:flex-row md:items-center justify-between px-4 md:px-6 py-4 bg-white dark:bg-black border-b border-gray-100 dark:border-gray-900 gap-4'>
            <div className='flex items-center justify-between md:justify-start gap-4'>
              <h1 className='text-lg md:text-2xl font-bold text-primary'>
                Photography
              </h1>
              {hasLocations && (
                <button
                  onClick={() => setShowMap(!showMap)}
                  className={`flex items-center gap-2 px-3 md:px-4 py-1.5 rounded-full text-[10px] md:text-xs font-bold transition-all active:scale-95 border ${
                    showMap
                      ? 'bg-primary text-background border-primary'
                      : 'bg-transparent text-primary border-gray-200 dark:border-gray-800 hover:border-primary'
                  }`}
                >
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    width='12'
                    height='12'
                    viewBox='0 0 24 24'
                    fill='none'
                    stroke='currentColor'
                    strokeWidth='2.5'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                  >
                    <path d='M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z'></path>
                    <circle cx='12' cy='10' r='3'></circle>
                  </svg>
                  {showMap ? 'Hide Map' : 'View Map'}
                </button>
              )}
            </div>
            <button
              onClick={handleCloseTrip}
              className='flex items-center justify-center gap-2 px-5 py-2 rounded-full bg-gray-100 dark:bg-gray-800 text-xs md:text-sm font-bold hover:bg-gray-200 dark:hover:bg-gray-700 transition-all active:scale-95'
            >
              <svg
                xmlns='http://www.w3.org/2000/svg'
                width='18'
                height='18'
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
          <div className='w-full max-w-[1400px] mx-auto py-8 md:py-12 px-4'>
            <div key={currentTrip.name} className='space-y-8 md:space-y-12'>
              <div className='space-y-4'>
                <h2 className='text-3xl md:text-6xl font-black text-primary tracking-tight'>
                  {currentTrip.name}
                </h2>
                <p className='text-base md:text-lg text-secondary font-medium'>
                  {currentTrip.photos.length} photos{' '}
                  {currentTrip.locations &&
                    `• ${currentTrip.locations.length} pinned locations`}
                </p>
              </div>

              {showMap && hasLocations && (
                <div className='w-full'>
                  <TripMap
                    locations={currentTrip.locations || []}
                    route={currentTrip.route}
                  />
                </div>
              )}

              <Gallery images={currentTrip.photos} perRow={3} />
            </div>
          </div>
        </div>
      </Container>
    )
  }

  // GRID VIEW (Default)
  return (
    <Container fullWidth={true}>
      <div className='flex flex-col items-center justify-center space-y-12 py-4 md:py-8'>
        {/* Hero Section */}
        <div className='flex flex-col items-center text-center space-y-6 md:space-y-8 px-4 max-w-4xl mx-auto'>
          <h1 className='text-4xl md:text-7xl font-black tracking-tight text-primary'>
            Photography
          </h1>

          <div className='space-y-4 md:space-y-6'>
            <p className='text-base md:text-xl text-secondary leading-relaxed'>
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
              onClick={() => handleSelectTrip(index)}
              className='group relative aspect-[4/3] overflow-hidden rounded-2xl border border-gray-200 dark:border-gray-800 transition-all duration-300 hover:shadow-2xl hover:scale-[1.02] bg-gray-100 dark:bg-gray-800'
            >
              <Image
                loader={cloudinaryLoader}
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
                  {trip.photos.length} Photos{' '}
                  {trip.locations &&
                    trip.locations.length > 0 &&
                    `• ${trip.locations.length} Locations`}
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </Container>
  )
}
