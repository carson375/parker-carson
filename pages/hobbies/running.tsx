import { useState, useRef } from 'react'

import Container from 'components/Container'
import { Gallery } from 'components/Gallery/Gallery'
import runningData from 'data/running.json'

interface Race {
  name: string
  date: string
  distance: string
  time: string
  place: string
  results: string
  photos: string[]
  videos?: string[]
}

const VideoPlayer = ({ src }: { src: string }) => {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause()
      } else {
        videoRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  return (
    <div
      className='relative cursor-pointer rounded-2xl overflow-hidden group bg-gray-100 dark:bg-gray-800 aspect-video flex items-center justify-center'
      onClick={togglePlay}
    >
      <video
        ref={videoRef}
        src={src}
        className='w-full h-full object-cover'
        preload='metadata'
        playsInline
        onEnded={() => setIsPlaying(false)}
      />
      {!isPlaying && (
        <div className='absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/40 transition-all'>
          <div className='w-16 h-16 flex items-center justify-center rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-white transform transition-transform group-hover:scale-110'>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              width='32'
              height='32'
              viewBox='0 0 24 24'
              fill='currentColor'
            >
              <path d='M8 5v14l11-7z'></path>
            </svg>
          </div>
        </div>
      )}
      {isPlaying && (
        <div className='absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity'>
          <div className='p-2 rounded-full bg-black/40 backdrop-blur-md text-white'>
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
              <rect x='6' y='4' width='4' height='16'></rect>
              <rect x='14' y='4' width='4' height='16'></rect>
            </svg>
          </div>
        </div>
      )}
    </div>
  )
}

const formatRaceDistance = (distance: string) => {
  const normalized = distance.toLowerCase()
  const isKm = normalized.includes('k')
  const val = parseFloat(distance)

  if (isKm) {
    const miles = val * 0.621371
    return {
      primary: `${val}K`,
      secondary: `${miles.toFixed(2)} Mi`,
    }
  } else {
    const km = val * 1.60934
    return {
      primary: `${val} Mi`,
      secondary: `${km.toFixed(2)} K`,
    }
  }
}

const RaceCard = ({ race }: { race: Race }) => {
  const [showMedia, setShowMedia] = useState(false)
  const hasPhotos = race.photos.length > 0
  const hasVideos = race.videos && race.videos.length > 0
  const distanceInfo = formatRaceDistance(race.distance)

  return (
    <div className='bg-white dark:bg-gray-900 rounded-3xl border border-gray-200 dark:border-gray-800 overflow-hidden shadow-sm'>
      <div className='p-6 md:p-12'>
        <div className='grid grid-cols-1 md:grid-cols-[2fr_3fr] items-center md:items-end gap-6 md:gap-10 mb-8 md:mb-10'>
          <div className='text-center md:text-left'>
            <p className='text-xs font-bold text-orange-500 uppercase tracking-widest mb-2'>
              {race.date}
            </p>
            <h3 className='text-2xl md:text-5xl font-black text-primary leading-tight md:leading-[1.1]'>
              {race.name}
            </h3>
          </div>
          <div className='grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4 w-full'>
            <div className='bg-gray-50 dark:bg-gray-800 px-4 py-3 md:px-6 md:py-5 rounded-2xl flex flex-col justify-center border border-gray-100 dark:border-gray-800/50 text-center md:text-left'>
              <p className='text-[10px] md:text-xs text-secondary font-bold uppercase mb-1'>
                Distance
              </p>
              <p className='text-sm md:text-xl font-bold text-primary whitespace-nowrap'>
                {distanceInfo.primary}{' '}
                <span className='text-[10px] md:text-sm text-secondary font-medium uppercase'>
                  / {distanceInfo.secondary}
                </span>
              </p>
            </div>
            <div className='bg-gray-50 dark:bg-gray-800 px-4 py-3 md:px-6 md:py-5 rounded-2xl flex flex-col justify-center border border-gray-100 dark:border-gray-800/50 text-center md:text-left'>
              <p className='text-[10px] md:text-xs text-secondary font-bold uppercase mb-1'>
                Time
              </p>
              <p className='text-sm md:text-xl font-bold text-primary'>
                {race.time}
              </p>
            </div>
            <div className='bg-gray-50 dark:bg-gray-800 px-4 py-3 md:px-6 md:py-5 rounded-2xl flex flex-col justify-center border border-gray-100 dark:border-gray-800/50 text-center md:text-left'>
              <p className='text-[10px] md:text-xs text-secondary font-bold uppercase mb-1'>
                Place
              </p>
              <p className='text-sm md:text-xl font-bold text-primary'>
                {race.place}
              </p>
            </div>
          </div>
        </div>

        <div className='flex flex-wrap items-center justify-center md:justify-start gap-3 md:gap-4 mb-8'>
          <a
            href={race.results}
            target='_blank'
            rel='noreferrer'
            className='inline-flex items-center gap-2 px-5 py-2.5 md:px-6 md:py-3 rounded-full bg-primary text-background text-sm md:text-base font-bold hover:opacity-90 transition-all active:scale-95'
          >
            View Results
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
              <path d='M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6'></path>
              <polyline points='15 3 21 3 21 9'></polyline>
              <line x1='10' y1='14' x2='21' y2='3'></line>
            </svg>
          </a>

          {(hasPhotos || hasVideos) && (
            <button
              onClick={() => setShowMedia(!showMedia)}
              className='inline-flex items-center gap-2 px-5 py-2.5 md:px-6 md:py-3 rounded-full bg-gray-100 dark:bg-gray-800 text-primary text-sm md:text-base font-bold hover:opacity-90 transition-all active:scale-95'
            >
              {showMedia ? 'Hide Media' : 'Show Media'}
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
                className={`transition-transform duration-300 ${
                  showMedia ? 'rotate-180' : ''
                }`}
              >
                <polyline points='6 9 12 15 18 9'></polyline>
              </svg>
            </button>
          )}
        </div>

        {showMedia && (
          <div className='space-y-8 pt-8 border-t border-gray-100 dark:border-gray-800'>
            {hasVideos && (
              <div className='space-y-6'>
                <h4 className='text-xl font-bold text-primary'>Race Videos</h4>
                <div
                  className={`grid gap-6 ${
                    race.videos!.length === 1
                      ? 'max-w-2xl'
                      : 'grid-cols-1 md:grid-cols-2'
                  }`}
                >
                  {race.videos!.map((video, idx) => (
                    <VideoPlayer key={idx} src={video} />
                  ))}
                </div>
              </div>
            )}

            {hasPhotos && (
              <div className='space-y-6'>
                <h4 className='text-xl font-bold text-primary'>Race Photos</h4>
                <div
                  className={`${
                    race.photos.length === 1 ? 'flex justify-center' : ''
                  }`}
                >
                  <div
                    className={
                      race.photos.length === 1 ? 'w-full md:w-1/3' : 'w-full'
                    }
                  >
                    <Gallery
                      images={race.photos}
                      perRow={race.photos.length === 1 ? 1 : 3}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default function Running() {
  const [races] = useState<Race[]>(runningData as Race[])

  return (
    <Container fullWidth={true}>
      <div className='flex flex-col items-center justify-center space-y-12 py-4 md:py-8'>

        {/* Hero Section */}
        <div className='flex flex-col items-center text-center space-y-6 md:space-y-8 px-4 max-w-4xl mx-auto'>
          <h1 className='text-4xl md:text-7xl font-black tracking-tight text-primary'>
            Running
          </h1>

          <div className='space-y-4 md:space-y-6'>
            <p className='text-base md:text-xl text-secondary leading-relaxed'>
              Tracking my journey through various races and daily runs.
            </p>
          </div>
        </div>

        {/* 2025 Races Section */}
        <div className='w-full px-4 max-w-[1400px] mx-auto'>
          <div className='flex items-center justify-between mb-6 md:mb-8'>
            <h2 className='text-2xl md:text-3xl font-bold text-primary'>2025 Races</h2>
          </div>

          <div className='grid grid-cols-1 gap-12'>
            {races.map((race, index) => (
              <RaceCard key={index} race={race} />
            ))}
          </div>
        </div>
      </div>
    </Container>
  )
}
