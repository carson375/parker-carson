import { useState, useRef } from 'react'
import Image from 'next/image'
import Container from 'components/Container'
import { Gallery } from 'components/Gallery/Gallery'
import golfData from 'data/golf.json'

interface RoundEntry {
  score: number
  course: string
  date: string
  photos?: string[]
}

interface GolfMonth {
  month: string
  roundsDetail: RoundEntry[]
  birdies: number
  girPercent: number
  highlight: string
  photos: string[]
  videos?: string[]
}

interface GolfSeason {
  year: string
  months: GolfMonth[]
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
    </div>
  )
}

const RoundTile = ({ round }: { round: RoundEntry }) => {
  const [isOpen, setIsOpen] = useState(false)
  const hasPhotos = round.photos && round.photos.length > 0
  const photoCount = round.photos?.length || 0

  return (
    <>
      <div
        onClick={() => hasPhotos && setIsOpen(true)}
        className={`group relative flex items-center justify-between p-4 rounded-xl border border-gray-100 dark:border-gray-800/50 bg-gray-50/30 dark:bg-gray-900/30 overflow-hidden transition-all ${hasPhotos ? 'cursor-pointer hover:border-emerald-500/30 hover:bg-emerald-50/10 dark:hover:bg-emerald-500/5' : ''}`}
      >
        {/* Background Photo for specific rounds */}
        {hasPhotos && (
          <div className='absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-300'>
            <Image
              src={round.photos![0]}
              alt={round.course}
              fill
              className='object-cover object-center'
            />
          </div>
        )}

        <div className='min-w-0 relative z-10'>
          <div className='flex items-center gap-2'>
            <p className='text-sm font-bold text-primary truncate'>
              {round.course}
            </p>
            {hasPhotos && (
              <div className='flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  width='10'
                  height='10'
                  viewBox='0 0 24 24'
                  fill='none'
                  stroke='currentColor'
                  strokeWidth='3'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                >
                  <path d='M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z' />
                  <circle cx='12' cy='13' r='3' />
                </svg>
                {photoCount > 1 && (
                  <span className='text-[8px] font-black'>{photoCount}</span>
                )}
              </div>
            )}
          </div>
          <p className='text-[10px] text-secondary font-medium'>{round.date}</p>
        </div>
        <div className='relative z-10 flex items-center justify-center w-10 h-10 rounded-lg bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-sm transition-transform group-hover:scale-105'>
          <span className='text-lg font-black text-primary'>{round.score}</span>
        </div>
      </div>

      {/* Trigger the Lightbox via the Gallery component */}
      {isOpen && hasPhotos && (
        <div className='fixed inset-0 z-[10001]'>
          <div
            className='absolute inset-0 bg-black/60 backdrop-blur-3xl'
            onClick={() => setIsOpen(false)}
          />
          <Gallery images={round.photos!} initialIndex={0} />
          <button
            onClick={() => setIsOpen(false)}
            className='fixed top-6 right-6 z-[10002] p-2 text-primary hover:scale-110 transition-transform bg-gray-100/50 dark:bg-gray-800/50 rounded-full'
            title='Close Gallery'
          >
            <svg
              xmlns='http://www.w3.org/2000/svg'
              width='24'
              height='24'
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
        </div>
      )}
    </>
  )
}

const MonthlyCard = ({ data }: { data: GolfMonth }) => {
  const [showMedia, setShowMedia] = useState(false)
  const hasMonthPhotos = data.photos.length > 0
  const hasVideos = data.videos && data.videos.length > 0

  // Derive stats from roundsDetail
  const roundsCount = data.roundsDetail.length
  const rounds9 = data.roundsDetail.filter(r => r.score < 70)
  const rounds18 = data.roundsDetail.filter(r => r.score >= 70)
  
  const low9 = rounds9.length > 0 ? Math.min(...rounds9.map(r => r.score)) : '--'
  const low18 = rounds18.length > 0 ? Math.min(...rounds18.map(r => r.score)) : '--'
  
  const uniqueCourses = Array.from(
    new Set(data.roundsDetail.map(r => r.course))
  )

  return (
    <div className='bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden shadow-sm'>
      <div className='p-6 md:p-8'>
        {/* Header Section */}
        <div className='flex flex-col md:flex-row md:items-center justify-between gap-4 md:gap-6 mb-8 md:mb-10'>
          <div>
            <h3 className='text-2xl md:text-4xl font-black text-primary mb-1 md:mb-2 tracking-tight'>
              {data.month}
            </h3>
            <p className='text-emerald-600 dark:text-emerald-500 font-bold uppercase tracking-widest text-[10px] md:text-xs'>
              {data.highlight}
            </p>
          </div>
          <div className='flex flex-wrap gap-2'>
            {uniqueCourses.map((course, i) => (
              <span
                key={i}
                className='px-2 py-0.5 md:px-3 md:py-1 bg-gray-50 dark:bg-gray-800 text-secondary text-[8px] md:text-[10px] font-bold uppercase tracking-wider rounded-full border border-gray-100 dark:border-gray-700/50'
              >
                {course}
              </span>
            ))}
          </div>
        </div>

        {/* Stats Grid - "Bento Box" Style */}
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 md:gap-4 mb-8 md:mb-10'>
          <div className='p-4 md:p-6 rounded-2xl bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-800/50 flex flex-col justify-center'>
            <p className='text-[10px] uppercase font-black text-secondary tracking-widest mb-1 md:mb-2'>
              Rounds
            </p>
            <p className='text-2xl md:text-3xl font-black text-primary'>{roundsCount}</p>
          </div>
          <div className='p-4 md:p-6 rounded-2xl bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-800/50 flex flex-col justify-center'>
            <p className='text-[10px] uppercase font-black text-secondary tracking-widest mb-1 md:mb-2'>
              Low 9
            </p>
            <p className='text-2xl md:text-3xl font-black text-primary'>{low9}</p>
          </div>
          <div className='p-4 md:p-6 rounded-2xl bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-800/50 flex flex-col justify-center'>
            <p className='text-[10px] uppercase font-black text-secondary tracking-widest mb-1 md:mb-2'>
              Low 18
            </p>
            <p className='text-2xl md:text-3xl font-black text-primary'>{low18}</p>
          </div>
          <div className='p-4 md:p-6 rounded-2xl bg-emerald-50/50 dark:bg-emerald-500/10 border border-emerald-100 dark:border-emerald-500/20 flex flex-col justify-center'>
            <p className='text-[10px] uppercase font-black text-emerald-600 dark:text-emerald-400 tracking-widest mb-1 md:mb-2'>
              Birdies
            </p>
            <p className='text-2xl md:text-3xl font-black text-emerald-700 dark:text-emerald-300'>
              {data.birdies}
            </p>
          </div>
          <div className='p-4 md:p-6 rounded-2xl bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-800/50 flex flex-col justify-center sm:col-span-2 lg:col-span-1'>
            <p className='text-[10px] uppercase font-black text-secondary tracking-widest mb-1 md:mb-2'>
              GIR %
            </p>
            <div className='flex items-end justify-between gap-2 mb-1'>
              <p className='text-2xl md:text-3xl font-black text-primary leading-none'>
                {data.girPercent}%
              </p>
            </div>
            <div className='w-full h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden'>
              <div
                className='h-full bg-emerald-500 transition-all duration-1000'
                style={{ width: `${data.girPercent}%` }}
              />
            </div>
          </div>
        </div>

        {/* Individual Rounds Log */}
        <div className='mb-10'>
          <h4 className='text-xs font-black text-secondary uppercase tracking-[0.2em] mb-4'>
            Round History
          </h4>
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3'>
            {data.roundsDetail.map((round, i) => (
              <RoundTile key={i} round={round} />
            ))}
          </div>
        </div>

        {/* Action / Toggle */}
        {(hasMonthPhotos || hasVideos) && (
          <button
            onClick={() => setShowMedia(!showMedia)}
            className='inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary text-background text-sm font-bold hover:opacity-90 transition-all active:scale-95'
          >
            {showMedia ? 'Hide Highlights' : 'Show Highlights'}
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
              className={`transition-transform duration-300 ${showMedia ? 'rotate-180' : ''}`}
            >
              <polyline points='6 9 12 15 18 9'></polyline>
            </svg>
          </button>
        )}

        {showMedia && (
          <div className='space-y-10 pt-10 mt-10 border-t border-gray-100 dark:border-gray-800'>
            {hasVideos && (
              <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                {data.videos!.map((video, idx) => (
                  <VideoPlayer key={idx} src={video} />
                ))}
              </div>
            )}
            {hasMonthPhotos && (
              <div className='w-full'>
                <Gallery images={data.photos} perRow={3} />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default function Golfing() {
  const [seasons] = useState<GolfSeason[]>(golfData as GolfSeason[])

  return (
    <Container fullWidth={true}>
      <div className='flex flex-col items-center justify-center space-y-12 py-4 md:py-8'>
        {/* Hero Section */}
        <div className='flex flex-col items-center text-center space-y-6 md:space-y-8 px-4 max-w-4xl mx-auto'>
          <h1 className='text-4xl md:text-7xl font-black tracking-tight text-primary'>
            Golfing
          </h1>
          <div className='space-y-4 md:space-y-6'>
            <p className='text-base md:text-xl text-secondary leading-relaxed'>
              Tracking my journey through my golf seasons, and hopefully
              eventually finding the fairway...
            </p>
          </div>
        </div>

        {/* Seasons */}
        <div className='w-full px-4 max-w-[1400px] mx-auto space-y-12 md:space-y-20'>
          {seasons.map(season => {
            const allRounds = season.months.flatMap(m => m.roundsDetail)
            const rounds9 = allRounds.filter(r => r.score < 70)
            const rounds18 = allRounds.filter(r => r.score >= 70)
  
            const low9 = rounds9.length > 0 ? Math.min(...rounds9.map(r => r.score)) : '--'
            const low18 = rounds18.length > 0 ? Math.min(...rounds18.map(r => r.score)) : '--'
            const totalRounds = allRounds.length
            const totalBirdies = season.months.reduce(
              (acc, m) => acc + m.birdies,
              0
            )

            return (
              <div key={season.year} className='space-y-8 md:space-y-12'>
                <div className='flex flex-col md:flex-row md:items-end justify-between gap-4 md:gap-6'>
                  <div className='flex items-center gap-4 md:gap-6'>
                    <h2 className='text-3xl md:text-5xl font-black text-primary tracking-tighter'>
                      {season.year}
                    </h2>
                    <div className='hidden md:block h-px w-24 bg-gray-100 dark:bg-gray-800' />
                  </div>

                  <div className='flex flex-wrap gap-2 md:gap-4'>
                    <div className='px-3 py-1.5 md:px-4 md:py-2 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-800/50'>
                      <p className='text-[8px] md:text-[10px] font-bold text-secondary uppercase tracking-widest mb-0.5'>
                        Rounds
                      </p>
                      <p className='text-lg md:text-xl font-black text-primary'>
                        {totalRounds}
                      </p>
                    </div>
                    <div className='px-3 py-1.5 md:px-4 md:py-2 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-800/50'>
                      <p className='text-[8px] md:text-[10px] font-bold text-secondary uppercase tracking-widest mb-0.5'>
                        Low 9 Hole Round
                      </p>
                      <p className='text-lg md:text-xl font-black text-primary'>
                        {low9}
                      </p>
                    </div>
                                        <div className='px-3 py-1.5 md:px-4 md:py-2 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-800/50'>
                      <p className='text-[8px] md:text-[10px] font-bold text-secondary uppercase tracking-widest mb-0.5'>
                        Low 18 Hole Round
                      </p>
                      <p className='text-lg md:text-xl font-black text-primary'>
                        {low18}
                      </p>
                    </div>
                    <div className='px-3 py-1.5 md:px-4 md:py-2 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-100 dark:border-emerald-500/20'>
                      <p className='text-[8px] md:text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest mb-0.5'>
                        Birdies
                      </p>
                      <p className='text-lg md:text-xl font-black text-emerald-700 dark:text-emerald-300'>
                        {totalBirdies}
                      </p>
                    </div>
                  </div>
                </div>

                <div className='grid grid-cols-1 gap-12'>
                  {season.months.map((month, idx) => (
                    <MonthlyCard key={idx} data={month} />
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </Container>
  )
}
