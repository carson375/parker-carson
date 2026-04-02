import { useState, useRef, useEffect } from 'react'

import Container from 'components/Container'
import { Gallery } from 'components/Gallery/Gallery'
import skiingData from 'data/skiing.json'

interface ResortVisit {
  name: string
  location: string
  days: number
}

interface SkiSeason {
  year: string
  days: number
  resorts: ResortVisit[]
  photos: string[]
  videos?: string[]
}

const VideoPlayer = ({
  src,
  onToggleLightbox,
}: {
  src: string
  onToggleLightbox: (open: boolean) => void
}) => {
  const videoRef = useRef<HTMLVideoElement>(null)
  const fullScreenVideoRef = useRef<HTMLVideoElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isFullScreen, setIsFullScreen] = useState(false)

  const togglePlay = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation()
    const currentRef = isFullScreen ? fullScreenVideoRef : videoRef
    if (currentRef.current) {
      if (isPlaying) {
        currentRef.current.pause()
      } else {
        currentRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  const toggleFullScreen = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation()
    const nextState = !isFullScreen
    setIsFullScreen(nextState)
    onToggleLightbox(nextState)

    // If we were playing, pause the small player and we'll handle the big one via effect or manual sync
    if (isPlaying && videoRef.current) {
      videoRef.current.pause()
    }
  }

  // Handle Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isFullScreen && e.key === 'Escape') {
        toggleFullScreen()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isFullScreen])

  return (
    <>
      <div
        className='relative cursor-pointer rounded-2xl overflow-hidden group bg-gray-100 dark:bg-gray-800 aspect-video flex items-center justify-center'
        onClick={togglePlay}
        onDoubleClick={toggleFullScreen}
      >
        <video
          ref={videoRef}
          src={src}
          className='w-full h-full object-cover'
          preload='metadata'
          playsInline
          onEnded={() => setIsPlaying(false)}
        />

        {/* Hover Controls */}
        <div className='absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 group-hover:opacity-100 transition-all'>
          {!isPlaying && (
            <div className='w-16 h-16 flex items-center justify-center rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-white transform transition-transform hover:scale-110'>
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
          )}
        </div>

        {/* Full Screen Button (Top Right) */}
        <button
          onClick={toggleFullScreen}
          className='absolute top-4 right-4 p-2 rounded-full bg-black/40 backdrop-blur-md text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/60'
        >
          <svg
            xmlns='http://www.w3.org/2000/svg'
            width='20'
            height='20'
            viewBox='0 0 24 24'
            fill='none'
            stroke='currentColor'
            strokeWidth='2'
            strokeLinecap='round'
            strokeLinejoin='round'
          >
            <path d='M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7' />
          </svg>
        </button>

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

      {/* Full Screen Lightbox */}
      {isFullScreen && (
        <div
          className='fixed inset-0 z-[10001] bg-white/95 dark:bg-black/95 backdrop-blur-3xl animate-in fade-in duration-500 flex items-center justify-center p-4 md:p-12'
          onClick={toggleFullScreen}
        >
          {/* Close Button (Top Right) */}
          <button
            className='absolute top-6 right-6 p-3 rounded-full bg-gray-100/50 dark:bg-gray-800/50 text-primary z-[10002] hover:bg-white dark:hover:bg-gray-700 transition-all active:scale-95 border border-white/10 shadow-lg'
            onClick={toggleFullScreen}
          >
            <svg
              xmlns='http://www.w3.org/2000/svg'
              width='28'
              height='28'
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
          </button>

          <div
            className='relative w-full h-full max-w-6xl max-h-[85vh] flex items-center justify-center'
            onClick={e => e.stopPropagation()}
          >
            <video
              ref={fullScreenVideoRef}
              src={src}
              className='w-full h-full object-contain'
              controls
              autoPlay={isPlaying}
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
            />
          </div>
        </div>
      )}
    </>
  )
}

const SeasonCard = ({
  season,
  onToggleLightbox,
}: {
  season: SkiSeason
  onToggleLightbox: (open: boolean) => void
}) => {
  const [showMedia, setShowMedia] = useState(false)
  const hasPhotos = season.photos.length > 0
  const hasVideos = season.videos && season.videos.length > 0
  const topResort = [...season.resorts].sort((a, b) => b.days - a.days)[0]

  return (
    <div className='bg-white dark:bg-gray-900 rounded-3xl border border-gray-200 dark:border-gray-800 overflow-hidden shadow-sm'>
      <div className='p-6 md:p-12'>
        <div className='grid grid-cols-1 md:grid-cols-[2fr_3fr] items-center md:items-end gap-6 md:gap-10 mb-8 md:mb-10'>
          <div className='text-center md:text-left'>
            <p className='text-xs font-bold text-blue-500 uppercase tracking-widest mb-2'>
              Winter Recap
            </p>
            <h3 className='text-3xl md:text-5xl lg:text-6xl font-black text-primary leading-tight md:leading-[1.1]'>
              {season.year}
            </h3>
          </div>
          <div className='grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4 w-full'>
            <div className='bg-gray-50 dark:bg-gray-800 px-4 py-3 md:px-6 md:py-5 rounded-2xl flex flex-col justify-center border border-gray-100 dark:border-gray-800/50 text-center md:text-left'>
              <p className='text-[10px] md:text-xs text-secondary font-bold uppercase mb-1'>
                Total Days
              </p>
              <p className='text-lg md:text-xl font-bold text-primary'>
                {season.days}
              </p>
            </div>
            <div className='bg-gray-50 dark:bg-gray-800 px-4 py-3 md:px-6 md:py-5 rounded-2xl flex flex-col justify-center border border-gray-100 dark:border-gray-800/50 text-center md:text-left'>
              <p className='text-[10px] md:text-xs text-secondary font-bold uppercase mb-1'>
                Resorts
              </p>
              <p className='text-lg md:text-xl font-bold text-primary'>
                {season.resorts.length}
              </p>
            </div>
            <div className='bg-gray-50 dark:bg-gray-800 px-4 py-3 md:px-4 md:py-5 rounded-2xl flex flex-col justify-center border border-gray-100 dark:border-gray-800/50 text-center md:text-left overflow-hidden'>
              <p className='text-[10px] md:text-xs text-secondary font-bold uppercase mb-1'>
                Top Mountain
              </p>
              <p className='text-lg md:text-xl font-bold text-primary truncate'>
                {topResort?.name || 'N/A'}
              </p>
            </div>
          </div>
        </div>

        <div className='flex flex-wrap items-center justify-center md:justify-start gap-4 mb-8'>
          <button
            onClick={() => setShowMedia(!showMedia)}
            className='inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary text-background text-sm md:text-base font-bold hover:opacity-90 transition-all active:scale-95'
          >
            {showMedia ? 'Hide Details' : 'Show Details'}
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
              className={`transition-transform duration-300 ${
                showMedia ? 'rotate-180' : ''
              }`}
            >
              <polyline points='6 9 12 15 18 9'></polyline>
            </svg>
          </button>
        </div>

        {showMedia && (
          <div className='space-y-12 pt-8 border-t border-gray-100 dark:border-gray-800'>
            {/* Resort Breakdown */}
            <div className='space-y-6'>
              <h4 className='text-xl font-bold text-primary'>
                Resort Breakdown
              </h4>
              <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
                {season.resorts.map((resort, idx) => (
                  <div
                    key={idx}
                    className='p-4 rounded-2xl bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-800/50'
                  >
                    <p className='text-lg font-bold text-primary'>
                      {resort.name}
                    </p>
                    <p className='text-sm text-secondary'>{resort.location}</p>
                    <div className='mt-2 inline-flex items-center px-2 py-1 rounded-md bg-blue-500/10 text-blue-500 text-xs font-bold uppercase'>
                      {resort.days} Days
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Videos */}
            {hasVideos && (
              <div className='space-y-6'>
                <h4 className='text-xl font-bold text-primary'>
                  Season Videos
                </h4>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                  {season.videos!.map((video, idx) => (
                    <VideoPlayer
                      key={idx}
                      src={video}
                      onToggleLightbox={onToggleLightbox}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Photos */}
            {hasPhotos && (
              <div className='space-y-6'>
                <h4 className='text-xl font-bold text-primary'>
                  Season Gallery
                </h4>
                <div className='w-full'>
                  <Gallery
                    images={season.photos}
                    perRow={3}
                    onOpen={() => onToggleLightbox(true)}
                    onClose={() => onToggleLightbox(false)}
                  />
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default function Skiing() {
  const [seasons] = useState<SkiSeason[]>(skiingData as SkiSeason[])
  const [isLightboxOpen, setIsLightboxOpen] = useState(false)

  return (
    <Container fullWidth={true} hideNav={isLightboxOpen}>
      <div className='flex flex-col items-center justify-center space-y-12 py-4 md:py-8'>
        {/* Hero Section */}
        <div className='flex flex-col items-center text-center space-y-6 md:space-y-8 px-4 max-w-4xl mx-auto'>
          <h1 className='text-4xl md:text-7xl font-black tracking-tight text-primary'>
            Skiing
          </h1>

          <div className='space-y-4 md:space-y-6'>
            <p className='text-base md:text-xl text-secondary leading-relaxed'>
              Recapping my winters on the mountain, from fresh powder days to
              season highlights.
            </p>
          </div>
        </div>

        {/* Seasons Section */}
        <div className='w-full px-4 max-w-[1400px] mx-auto space-y-8 md:space-y-12'>
          <div className='flex items-center gap-4 md:gap-6'>
            <h2 className='text-3xl md:text-5xl font-black text-primary tracking-tighter'>
              Season Recaps
            </h2>
            <div className='hidden md:block h-px w-24 bg-gray-100 dark:bg-gray-800' />
          </div>

          <div className='grid grid-cols-1 gap-12'>
            {seasons.map((season, index) => (
              <SeasonCard
                key={index}
                season={season}
                onToggleLightbox={setIsLightboxOpen}
              />
            ))}
          </div>
        </div>
      </div>
    </Container>
  )
}
