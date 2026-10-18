import { useState, useRef, useEffect, useMemo } from 'react'

import dynamic from 'next/dynamic'
import Image from 'next/image'

import Container from 'components/Container'
import { Gallery } from 'components/Gallery/Gallery'
import golfData from 'data/golf.json'
import golfCoursesData from 'data/golfCourses.json'
import { cloudinaryLoader } from 'lib/cloudinary'

const CourseMap = dynamic(
  () => import('components/Gallery/CourseMap').then(mod => mod.CourseMap),
  {
    ssr: false,
    loading: () => (
      <div className='w-full h-[280px] bg-gray-100 dark:bg-gray-800 animate-pulse rounded-2xl flex items-center justify-center text-xs text-secondary font-medium'>
        Loading course map...
      </div>
    ),
  }
)

interface CourseLocation {
  name: string
  cityState: string
  lat: number
  lng: number
  zoom?: number
}

export interface RoundStats {
  birdies?: number
  pars?: number
  bogeys?: number
  doubleBogeyOrWorse?: number
  eagles?: number
  aces?: number
  gir?: number
  girHoles?: number
  girPercent?: number
  fairwayHit?: number
  fairwayHoles?: number
  fairwayPercent?: number
  putts?: number
  handicap?: string
}

export interface RoundEntry {
  id?: string
  score: number
  toPar?: number
  holes?: number
  course: string
  date: string
  holeStrokes?: number[]
  stats?: RoundStats
  photos?: string[]
}

export interface GolfMonth {
  month: string
  roundsDetail: RoundEntry[]
  birdies: number
  girPercent: number
  fairwayPercent?: number
  highlight: string
  photos: string[]
  videos?: string[]
}

export interface GolfSeason {
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

const ScorecardModal = ({
  round,
  allRounds,
  onClose,
}: {
  round: RoundEntry
  allRounds: RoundEntry[]
  onClose: () => void
}) => {
  const [activeTab, setActiveTab] = useState<'scorecard' | 'map'>('scorecard')
  const [galleryIndex, setGalleryIndex] = useState<number | null>(null)

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (galleryIndex !== null) {
          setGalleryIndex(null)
        } else {
          onClose()
        }
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = 'unset'
    }
  }, [galleryIndex, onClose])

  const holesCount = round.holes || (round.score >= 70 ? 18 : 9)
  const holeStrokes = round.holeStrokes || []
  const hasStrokes = holeStrokes.length > 0
  const front9 = holeStrokes.slice(0, 9)
  const back9 = holeStrokes.length > 9 ? holeStrokes.slice(9, 18) : []

  const front9Sum = front9.reduce((acc, s) => acc + s, 0)
  const back9Sum = back9.reduce((acc, s) => acc + s, 0)

  const toParFormatted =
    round.toPar !== undefined
      ? round.toPar > 0
        ? `+${round.toPar}`
        : round.toPar === 0
          ? 'E'
          : `${round.toPar}`
      : null

  const hasPhotos = round.photos && round.photos.length > 0
  const courseLocation = (golfCoursesData as Record<string, CourseLocation>)[
    round.course
  ]

  // Stats for this specific course across career
  const courseStats = useMemo(() => {
    const matches = allRounds.filter(r => r.course === round.course)
    const scores = matches.map(r => r.score)
    const bestScore = Math.min(...scores)
    const avgScore = (
      scores.reduce((a, b) => a + b, 0) / scores.length
    ).toFixed(1)
    return {
      count: matches.length,
      bestScore,
      avgScore,
    }
  }, [allRounds, round.course])

  const googleMapsUrl = courseLocation
    ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${courseLocation.name} ${courseLocation.cityState}`)}`
    : null

  return (
    <>
      <div
        className='fixed inset-0 z-[10001] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto'
        onClick={onClose}
      >
        <div
          className='relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl p-6 md:p-8 shadow-2xl text-left my-auto'
          onClick={e => e.stopPropagation()}
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className='absolute top-5 right-5 z-10 p-2 rounded-full text-secondary hover:text-primary hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors'
            aria-label='Close modal'
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
              <line x1='18' y1='6' x2='6' y2='18'></line>
              <line x1='6' y1='6' x2='18' y2='18'></line>
            </svg>
          </button>

          {/* Header */}
          <div className='mb-4 pr-8'>
            <div className='flex items-center gap-2 mb-1.5 flex-wrap'>
              <span className='px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'>
                {holesCount} Holes
              </span>
              {toParFormatted && (
                <span className='px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-gray-100 dark:bg-gray-800 text-secondary border border-gray-200 dark:border-gray-700'>
                  {toParFormatted} to par
                </span>
              )}
              {courseLocation && (
                <span className='text-xs text-secondary font-medium ml-0.5'>
                  • {courseLocation.cityState}
                </span>
              )}
            </div>
            <h3 className='text-xl md:text-2xl font-black text-primary tracking-tight'>
              {round.course}
            </h3>
            <p className='text-xs font-semibold text-secondary mt-0.5'>
              {round.date}
            </p>
          </div>

          {/* Modal Navigation Tabs */}
          <div className='inline-flex p-1 rounded-xl bg-gray-100 dark:bg-gray-800 mb-5 border border-gray-200 dark:border-gray-700/60'>
            <button
              onClick={() => setActiveTab('scorecard')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'scorecard'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-secondary hover:text-primary'
              }`}
            >
              Scorecard & Stats
            </button>
            <button
              onClick={() => setActiveTab('map')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeTab === 'map'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-secondary hover:text-primary'
              }`}
            >
              <span>📍</span> Course Map
            </button>
          </div>

          {/* Tab 1: Scorecard & Stats */}
          {activeTab === 'scorecard' && (
            <div className='animate-in fade-in duration-200'>
              {/* Big Score Callout */}
              <div className='flex items-center justify-between p-4 md:p-5 mb-4 rounded-2xl bg-gradient-to-br from-emerald-50 to-emerald-100/50 dark:from-emerald-950/20 dark:to-emerald-900/10 border border-emerald-200/50 dark:border-emerald-500/20'>
                <div>
                  <p className='text-[10px] font-black uppercase tracking-widest text-emerald-700 dark:text-emerald-400'>
                    Total Score
                  </p>
                  <p className='text-4xl md:text-5xl font-black text-emerald-800 dark:text-emerald-300'>
                    {round.score}
                  </p>
                </div>
                {toParFormatted && (
                  <div className='text-right'>
                    <p className='text-[10px] font-black uppercase tracking-widest text-secondary'>
                      Par Differential
                    </p>
                    <p className='text-3xl md:text-4xl font-black text-primary'>
                      {toParFormatted}
                    </p>
                  </div>
                )}
              </div>

              {/* Key Stats Grid */}
              {round.stats && (
                <div className='grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5'>
                  <div className='p-3.5 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-800 text-left'>
                    <p className='text-[10px] font-bold text-secondary uppercase tracking-widest mb-1'>
                      Fairways
                    </p>
                    <p className='text-lg md:text-xl font-black text-primary'>
                      {round.stats.fairwayHoles && round.stats.fairwayHoles > 0
                        ? `${round.stats.fairwayHit}/${round.stats.fairwayHoles}`
                        : '--'}
                    </p>
                    {round.stats.fairwayPercent !== undefined &&
                      round.stats.fairwayHoles! > 0 && (
                        <p className='text-[10px] font-bold text-emerald-600 dark:text-emerald-400'>
                          {round.stats.fairwayPercent}%
                        </p>
                      )}
                  </div>

                  <div className='p-3.5 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-800 text-left'>
                    <p className='text-[10px] font-bold text-secondary uppercase tracking-widest mb-1'>
                      GIR
                    </p>
                    <p className='text-lg md:text-xl font-black text-primary'>
                      {round.stats.girHoles && round.stats.girHoles > 0
                        ? `${round.stats.gir}/${round.stats.girHoles}`
                        : '--'}
                    </p>
                    {round.stats.girPercent !== undefined &&
                      round.stats.girHoles! > 0 && (
                        <p className='text-[10px] font-bold text-emerald-600 dark:text-emerald-400'>
                          {round.stats.girPercent}%
                        </p>
                      )}
                  </div>

                  <div className='p-3.5 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-800 text-left'>
                    <p className='text-[10px] font-bold text-secondary uppercase tracking-widest mb-1'>
                      Putts
                    </p>
                    <p className='text-lg md:text-xl font-black text-primary'>
                      {round.stats.putts && round.stats.putts > 0
                        ? round.stats.putts
                        : '--'}
                    </p>
                    {round.stats.putts && round.stats.putts > 0 ? (
                      <p className='text-[10px] font-bold text-secondary'>
                        {(round.stats.putts / holesCount).toFixed(1)}/hole
                      </p>
                    ) : null}
                  </div>

                  <div className='p-3.5 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-800 text-left'>
                    <p className='text-[10px] font-bold text-secondary uppercase tracking-widest mb-1'>
                      Birdies
                    </p>
                    <p className='text-lg md:text-xl font-black text-emerald-600 dark:text-emerald-400'>
                      {round.stats.birdies ?? 0}
                    </p>
                    <p className='text-[10px] font-bold text-secondary'>
                      {round.stats.pars ?? 0} pars
                    </p>
                  </div>
                </div>
              )}

              {/* Hole-by-Hole Scorecard */}
              {hasStrokes && (
                <div className='mb-5'>
                  <h4 className='text-xs font-black uppercase tracking-widest text-secondary mb-2.5'>
                    Hole-by-Hole Scorecard
                  </h4>
                  <div className='p-3.5 rounded-2xl border border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/30 overflow-x-auto'>
                    {/* Front 9 */}
                    <div>
                      <div className='text-[10px] font-black uppercase text-secondary mb-2'>
                        {holesCount === 18 ? 'Front 9 (OUT)' : 'Scorecard'}
                      </div>
                      <div className='grid grid-cols-10 gap-1.5 text-center font-mono'>
                        {front9.map((_, idx) => (
                          <div
                            key={idx}
                            className='text-secondary text-[10px] font-bold'
                          >
                            #{idx + 1}
                          </div>
                        ))}
                        <div className='text-secondary text-[10px] font-black'>
                          {holesCount === 18 ? 'OUT' : 'TOT'}
                        </div>

                        {front9.map((stroke, idx) => (
                          <div
                            key={idx}
                            className='p-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-sm font-black text-primary'
                          >
                            {stroke}
                          </div>
                        ))}
                        <div className='p-2 rounded-lg bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20 text-sm font-black'>
                          {front9Sum}
                        </div>
                      </div>
                    </div>

                    {/* Back 9 if 18 holes */}
                    {back9.length > 0 && (
                      <div className='mt-3 pt-3 border-t border-gray-200 dark:border-gray-800'>
                        <div className='text-[10px] font-black uppercase text-secondary mb-2'>
                          Back 9 (IN)
                        </div>
                        <div className='grid grid-cols-10 gap-1.5 text-center font-mono'>
                          {back9.map((_, idx) => (
                            <div
                              key={idx}
                              className='text-secondary text-[10px] font-bold'
                            >
                              #{idx + 10}
                            </div>
                          ))}
                          <div className='text-secondary text-[10px] font-black'>
                            IN
                          </div>

                          {back9.map((stroke, idx) => (
                            <div
                              key={idx}
                              className='p-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-sm font-black text-primary'
                            >
                              {stroke}
                            </div>
                          ))}
                          <div className='p-2 rounded-lg bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20 text-sm font-black'>
                            {back9Sum}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Scoring Breakdown & Map Shortcut */}
              <div className='flex flex-wrap items-center justify-between gap-2 mb-4'>
                {round.stats && (
                  <div className='flex flex-wrap items-center gap-1.5'>
                    <span className='px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20'>
                      Birdies: {round.stats.birdies ?? 0}
                    </span>
                    <span className='px-3 py-1 rounded-full text-xs font-bold bg-blue-500/10 text-blue-700 dark:text-blue-300 border border-blue-500/20'>
                      Pars: {round.stats.pars ?? 0}
                    </span>
                    <span className='px-3 py-1 rounded-full text-xs font-bold bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-500/20'>
                      Bogeys: {round.stats.bogeys ?? 0}
                    </span>
                    <span className='px-3 py-1 rounded-full text-xs font-bold bg-red-500/10 text-red-700 dark:text-red-300 border border-red-500/20'>
                      Double+: {round.stats.doubleBogeyOrWorse ?? 0}
                    </span>
                  </div>
                )}

                {courseLocation && (
                  <button
                    onClick={() => setActiveTab('map')}
                    className='text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1 ml-auto'
                  >
                    <span>📍 View on Course Map</span> ➔
                  </button>
                )}
              </div>

              {/* Photos if attached */}
              {hasPhotos && (
                <div className='pt-2'>
                  <h4 className='text-[10px] font-black uppercase tracking-widest text-secondary mb-2'>
                    Round Photos ({round.photos!.length})
                  </h4>
                  <div className='grid grid-cols-2 sm:grid-cols-4 gap-2'>
                    {round.photos!.map((photo, i) => (
                      <div
                        key={i}
                        onClick={() => setGalleryIndex(i)}
                        className='relative aspect-square rounded-xl overflow-hidden cursor-pointer group border border-gray-200 dark:border-gray-700'
                      >
                        <Image
                          loader={cloudinaryLoader}
                          src={photo}
                          alt={`${round.course} photo ${i + 1}`}
                          fill
                          className='object-cover group-hover:scale-110 transition-transform duration-300'
                        />
                        <div className='absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center'>
                          <svg
                            xmlns='http://www.w3.org/2000/svg'
                            width='20'
                            height='20'
                            viewBox='0 0 24 24'
                            fill='none'
                            stroke='white'
                            strokeWidth='2'
                            strokeLinecap='round'
                            strokeLinejoin='round'
                            className='opacity-0 group-hover:opacity-100 transition-opacity'
                          >
                            <circle cx='11' cy='11' r='8'></circle>
                            <line x1='21' y1='21' x2='16.65' y2='16.65'></line>
                            <line x1='11' y1='8' x2='11' y2='14'></line>
                            <line x1='8' y1='11' x2='14' y2='11'></line>
                          </svg>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Tab 2: Course Map & Venue */}
          {activeTab === 'map' && (
            <div className='space-y-4 animate-in fade-in duration-200'>
              <div className='flex items-center justify-between'>
                <div className='flex items-center gap-2 text-xs text-secondary font-medium'>
                  <span className='inline-block w-2 h-2 rounded-full bg-emerald-500' />
                  <span>
                    {courseLocation
                      ? courseLocation.cityState
                      : 'Course Location'}
                  </span>
                </div>
                {googleMapsUrl && (
                  <a
                    href={googleMapsUrl}
                    target='_blank'
                    rel='noopener noreferrer'
                    className='px-3 py-1 rounded-lg bg-gray-100 dark:bg-gray-800 text-xs font-bold text-primary hover:text-emerald-500 transition-colors inline-flex items-center gap-1.5 border border-gray-200/60 dark:border-gray-700/60'
                  >
                    <span>Open in Google Maps</span>
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
                      <path d='M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6'></path>
                      <polyline points='15 3 21 3 21 9'></polyline>
                      <line x1='10' y1='14' x2='21' y2='3'></line>
                    </svg>
                  </a>
                )}
              </div>

              {/* Map View */}
              {courseLocation ? (
                <CourseMap
                  courseName={courseLocation.name}
                  cityState={courseLocation.cityState}
                  lat={courseLocation.lat}
                  lng={courseLocation.lng}
                  zoom={courseLocation.zoom || 14}
                />
              ) : (
                <div className='w-full h-[280px] rounded-2xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-xs text-secondary font-medium'>
                  Map coordinates not available for this course.
                </div>
              )}

              {/* Course Career Stats Bar */}
              <div className='grid grid-cols-3 gap-2.5 pt-1'>
                <div className='p-3 rounded-xl bg-gray-50/70 dark:bg-gray-800/40 border border-gray-100 dark:border-gray-800 text-center'>
                  <p className='text-[9px] font-black uppercase text-secondary tracking-widest mb-0.5'>
                    Rounds at Course
                  </p>
                  <p className='text-lg md:text-xl font-black text-primary'>
                    {courseStats.count}
                  </p>
                </div>
                <div className='p-3 rounded-xl bg-gray-50/70 dark:bg-gray-800/40 border border-gray-100 dark:border-gray-800 text-center'>
                  <p className='text-[9px] font-black uppercase text-secondary tracking-widest mb-0.5'>
                    Personal Best
                  </p>
                  <p className='text-lg md:text-xl font-black text-emerald-600 dark:text-emerald-400'>
                    {courseStats.bestScore}
                  </p>
                </div>
                <div className='p-3 rounded-xl bg-gray-50/70 dark:bg-gray-800/40 border border-gray-100 dark:border-gray-800 text-center'>
                  <p className='text-[9px] font-black uppercase text-secondary tracking-widest mb-0.5'>
                    Course Average
                  </p>
                  <p className='text-lg md:text-xl font-black text-primary'>
                    {courseStats.avgScore}
                  </p>
                </div>
              </div>

              <div className='pt-1 flex justify-start'>
                <button
                  onClick={() => setActiveTab('scorecard')}
                  className='text-xs font-bold text-secondary hover:text-primary transition-colors flex items-center gap-1'
                >
                  &larr; Back to Scorecard
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {galleryIndex !== null && hasPhotos && (
        <Gallery
          images={round.photos!}
          initialIndex={galleryIndex}
          showThumbnails={false}
          onClose={() => setGalleryIndex(null)}
        />
      )}
    </>
  )
}

const RoundTile = ({
  round,
  allRounds,
}: {
  round: RoundEntry
  allRounds: RoundEntry[]
}) => {
  const [showModal, setShowModal] = useState(false)
  const hasPhotos = round.photos && round.photos.length > 0
  const photoCount = round.photos?.length || 0

  const holesCount = round.holes || (round.score >= 70 ? 18 : 9)
  const toParFormatted =
    round.toPar !== undefined
      ? round.toPar > 0
        ? `+${round.toPar}`
        : round.toPar === 0
          ? 'E'
          : `${round.toPar}`
      : null

  const hasBirdie = round.stats?.birdies && round.stats.birdies > 0

  return (
    <>
      <div
        data-testid='round-tile'
        onClick={() => setShowModal(true)}
        className='group relative flex items-center justify-between p-4 rounded-xl border border-gray-100 dark:border-gray-800/50 bg-gray-50/30 dark:bg-gray-900/30 overflow-hidden transition-all cursor-pointer hover:border-emerald-500/40 hover:bg-emerald-50/10 dark:hover:bg-emerald-500/5 hover:shadow-sm'
      >
        {/* Background Photo for specific rounds */}
        {hasPhotos && (
          <div className='absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-300'>
            <Image
              loader={cloudinaryLoader}
              src={round.photos![0]}
              alt={round.course}
              fill
              className='object-cover object-center'
            />
          </div>
        )}

        <div className='min-w-0 relative z-10 flex-1 pr-3'>
          <div className='flex items-center gap-1.5 flex-wrap mb-1'>
            <span className='px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider bg-gray-200/60 dark:bg-gray-800 text-secondary'>
              {holesCount}H
            </span>
            {toParFormatted && (
              <span className='px-1.5 py-0.5 rounded text-[9px] font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-500/10'>
                {toParFormatted}
              </span>
            )}
            {hasBirdie && (
              <span className='px-1.5 py-0.5 rounded text-[9px] font-black uppercase text-emerald-600 dark:text-emerald-400 bg-emerald-500/15'>
                {round.stats!.birdies === 1
                  ? 'Birdie'
                  : `${round.stats!.birdies} Birdies`}
              </span>
            )}
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

          <p className='text-sm font-bold text-primary truncate group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors'>
            {round.course}
          </p>

          <div className='flex items-center gap-2 text-[10px] text-secondary font-medium mt-0.5'>
            <span>{round.date}</span>
            {round.stats?.putts ? (
              <>
                <span>•</span>
                <span>{round.stats.putts} putts</span>
              </>
            ) : null}
            {round.stats?.gir && round.stats?.girHoles ? (
              <>
                <span>•</span>
                <span>
                  GIR {round.stats.gir}/{round.stats.girHoles}
                </span>
              </>
            ) : null}
          </div>
        </div>

        {/* Score Stamp */}
        <div className='relative z-10 flex flex-col items-center justify-center min-w-[44px] h-11 px-2.5 rounded-xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-sm transition-transform group-hover:scale-105'>
          <span className='text-lg font-black text-primary leading-none'>
            {round.score}
          </span>
          {toParFormatted && (
            <span className='text-[8px] font-bold text-secondary leading-tight mt-0.5'>
              {toParFormatted}
            </span>
          )}
        </div>
      </div>

      {showModal && (
        <ScorecardModal
          round={round}
          allRounds={allRounds}
          onClose={() => setShowModal(false)}
        />
      )}
    </>
  )
}

const MonthlyCard = ({
  data,
  allRounds,
  holeFilter,
  courseFilter,
}: {
  data: GolfMonth
  allRounds: RoundEntry[]
  holeFilter: 'all' | '9' | '18'
  courseFilter: string
}) => {
  const [showMedia, setShowMedia] = useState(false)
  const hasMonthPhotos = data.photos && data.photos.length > 0
  const hasVideos = data.videos && data.videos.length > 0

  // Filter rounds for this month (reverse chronological: most recent first)
  const filteredRounds = useMemo(() => {
    return data.roundsDetail
      .filter(r => {
        const is18 = (r.holes && r.holes === 18) || r.score >= 70
        if (holeFilter === '18' && !is18) return false
        if (holeFilter === '9' && is18) return false
        if (courseFilter !== 'all' && r.course !== courseFilter) return false
        return true
      })
      .slice()
      .reverse()
  }, [data.roundsDetail, holeFilter, courseFilter])

  // Derive stats from roundsDetail
  const roundsCount = data.roundsDetail.length
  const rounds9 = data.roundsDetail.filter(
    r => (r.holes && r.holes === 9) || r.score < 70
  )
  const rounds18 = data.roundsDetail.filter(
    r => (r.holes && r.holes === 18) || r.score >= 70
  )

  const low9 =
    rounds9.length > 0 ? Math.min(...rounds9.map(r => r.score)) : '--'
  const low18 =
    rounds18.length > 0 ? Math.min(...rounds18.map(r => r.score)) : '--'

  const uniqueCourses = Array.from(
    new Set(data.roundsDetail.map(r => r.course))
  )

  if (
    filteredRounds.length === 0 &&
    (holeFilter !== 'all' || courseFilter !== 'all')
  ) {
    return null
  }

  return (
    <div className='bg-white dark:bg-gray-900 rounded-3xl border border-gray-200 dark:border-gray-800 overflow-hidden shadow-sm'>
      <div className='p-6 md:p-8'>
        {/* Header Section */}
        <div className='flex flex-col md:flex-row md:items-center justify-between gap-4 md:gap-6 mb-8'>
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
                className='px-2.5 py-1 bg-gray-50 dark:bg-gray-800 text-secondary text-[9px] md:text-[10px] font-bold uppercase tracking-wider rounded-full border border-gray-100 dark:border-gray-700/50'
              >
                {course}
              </span>
            ))}
          </div>
        </div>

        {/* Stats Grid - "Bento Box" Style */}
        <div className='grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4 mb-8'>
          <div className='p-4 md:p-5 rounded-2xl bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-800/50 flex flex-col justify-center'>
            <p className='text-[10px] uppercase font-black text-secondary tracking-widest mb-1'>
              Rounds
            </p>
            <p className='text-2xl md:text-3xl font-black text-primary'>
              {roundsCount}
            </p>
          </div>
          <div className='p-4 md:p-5 rounded-2xl bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-800/50 flex flex-col justify-center'>
            <p className='text-[10px] uppercase font-black text-secondary tracking-widest mb-1'>
              Low 9
            </p>
            <p className='text-2xl md:text-3xl font-black text-primary'>
              {low9}
            </p>
          </div>
          <div className='p-4 md:p-5 rounded-2xl bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-800/50 flex flex-col justify-center'>
            <p className='text-[10px] uppercase font-black text-secondary tracking-widest mb-1'>
              Low 18
            </p>
            <p className='text-2xl md:text-3xl font-black text-primary'>
              {low18}
            </p>
          </div>
          <div className='p-4 md:p-5 rounded-2xl bg-emerald-50/50 dark:bg-emerald-500/10 border border-emerald-100 dark:border-emerald-500/20 flex flex-col justify-center'>
            <p className='text-[10px] uppercase font-black text-emerald-600 dark:text-emerald-400 tracking-widest mb-1'>
              Birdies
            </p>
            <p className='text-2xl md:text-3xl font-black text-emerald-700 dark:text-emerald-300'>
              {data.birdies}
            </p>
          </div>
          <div className='p-4 md:p-5 rounded-2xl bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-800/50 flex flex-col justify-center'>
            <p className='text-[10px] uppercase font-black text-secondary tracking-widest mb-1'>
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
                style={{ width: `${Math.min(data.girPercent, 100)}%` }}
              />
            </div>
          </div>
          <div className='p-4 md:p-5 rounded-2xl bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-800/50 flex flex-col justify-center'>
            <p className='text-[10px] uppercase font-black text-secondary tracking-widest mb-1'>
              FIR %
            </p>
            <div className='flex items-end justify-between gap-2 mb-1'>
              <p className='text-2xl md:text-3xl font-black text-primary leading-none'>
                {data.fairwayPercent ?? '--'}%
              </p>
            </div>
            <div className='w-full h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden'>
              <div
                className='h-full bg-blue-500 transition-all duration-1000'
                style={{
                  width: `${Math.min(data.fairwayPercent ?? 0, 100)}%`,
                }}
              />
            </div>
          </div>
        </div>

        {/* Individual Rounds Log */}
        <div className='mb-6'>
          <div className='flex items-center justify-between mb-4'>
            <h4 className='text-xs font-black text-secondary uppercase tracking-[0.2em]'>
              Round History ({filteredRounds.length})
            </h4>
            <span className='text-[10px] text-secondary font-medium'>
              Click round for scorecard & map
            </span>
          </div>
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3'>
            {filteredRounds.map((round, i) => (
              <RoundTile
                key={round.id || i}
                round={round}
                allRounds={allRounds}
              />
            ))}
          </div>
        </div>

        {/* Action / Toggle for Highlights */}
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

const SeasonProgression = ({ seasons }: { seasons: GolfSeason[] }) => {
  // Sort seasons chronologically
  const sorted = useMemo(() => {
    return [...seasons].sort((a, b) => parseInt(a.year) - parseInt(b.year))
  }, [seasons])

  const seasonSummaries = useMemo(() => {
    return sorted.map(season => {
      const allRounds = season.months.flatMap(m => m.roundsDetail)
      const r18 = allRounds.filter(
        r => (r.holes && r.holes === 18) || r.score >= 70
      )
      const r9 = allRounds.filter(
        r => (r.holes && r.holes === 9) || r.score < 70
      )

      const low18 = r18.length > 0 ? Math.min(...r18.map(r => r.score)) : null
      const low9 = r9.length > 0 ? Math.min(...r9.map(r => r.score)) : null

      const avg18 =
        r18.length > 0
          ? (r18.reduce((acc, r) => acc + r.score, 0) / r18.length).toFixed(1)
          : null

      const avg9 =
        r9.length > 0
          ? (r9.reduce((acc, r) => acc + r.score, 0) / r9.length).toFixed(1)
          : null

      const totalBirdies = allRounds.reduce(
        (acc, r) => acc + (r.stats?.birdies || 0),
        0
      )
      const totalPars = allRounds.reduce(
        (acc, r) => acc + (r.stats?.pars || 0),
        0
      )

      const girCount = allRounds.reduce(
        (acc, r) => acc + (r.stats?.gir || 0),
        0
      )
      const girHoles = allRounds.reduce(
        (acc, r) => acc + (r.stats?.girHoles || 0),
        0
      )
      const girPercent =
        girHoles > 0 ? ((girCount / girHoles) * 100).toFixed(1) : null

      const firCount = allRounds.reduce(
        (acc, r) => acc + (r.stats?.fairwayHit || 0),
        0
      )
      const firHoles = allRounds.reduce(
        (acc, r) => acc + (r.stats?.fairwayHoles || 0),
        0
      )
      const firPercent =
        firHoles > 0 ? ((firCount / firHoles) * 100).toFixed(1) : null

      const coursesCount = new Set(allRounds.map(r => r.course)).size

      return {
        year: season.year,
        totalRounds: allRounds.length,
        rounds18Count: r18.length,
        rounds9Count: r9.length,
        low18,
        low9,
        avg18,
        avg9,
        totalBirdies,
        totalPars,
        girPercent,
        firPercent,
        coursesCount,
      }
    })
  }, [sorted])

  if (seasonSummaries.length < 2) return null

  const s25 = seasonSummaries[0]
  const s26 = seasonSummaries[1]

  const metrics = [
    {
      title: 'Low 18-Hole Round',
      from: s25.low18 ?? '--',
      to: s26.low18 ?? '--',
      badge: `${s26.low18! - s25.low18!} strokes`,
      detail: 'Career-low 83 at Indian Boundary',
    },
    {
      title: 'Low 9-Hole Round',
      from: s25.low9 ?? '--',
      to: s26.low9 ?? '--',
      badge: `${s26.low9! - s25.low9!} strokes`,
      detail: '+4 to par at Marovitz & Rec Park',
    },
    {
      title: '18H Scoring Average',
      from: s25.avg18 ?? '--',
      to: s26.avg18 ?? '--',
      badge: `${(parseFloat(s26.avg18!) - parseFloat(s25.avg18!)).toFixed(1)} avg`,
      detail: 'Consistent mid-90s across 14 rounds',
    },
    {
      title: '9H Scoring Average',
      from: s25.avg9 ?? '--',
      to: s26.avg9 ?? '--',
      badge: `${(parseFloat(s26.avg9!) - parseFloat(s25.avg9!)).toFixed(1)} avg`,
      detail: 'Average drop across 16 twilight rounds',
    },
    {
      title: 'Total Birdies',
      from: `${s25.totalBirdies}`,
      to: `${s26.totalBirdies}`,
      badge: `+${s26.totalBirdies - s25.totalBirdies} (+200%)`,
      detail: '3x increase including 2 on July 4th',
    },
    {
      title: 'Total Pars',
      from: `${s25.totalPars}`,
      to: `${s26.totalPars}`,
      badge: `+${s26.totalPars - s25.totalPars} pars`,
      detail: 'Up 83% in par saves & consistency',
    },
    {
      title: 'Greens in Regulation',
      from: `${s25.girPercent}%`,
      to: `${s26.girPercent}%`,
      badge: `+${(parseFloat(s26.girPercent!) - parseFloat(s25.girPercent!)).toFixed(1)}%`,
      detail: '91 greens hit in regulation',
    },
    {
      title: 'Courses Explored',
      from: `${s25.coursesCount}`,
      to: `${s26.coursesCount}`,
      badge: `+${s26.coursesCount - s25.coursesCount} new venues`,
      detail: 'Played tracks across 5 different states',
    },
  ]

  return (
    <div className='w-full pt-4 md:pt-6'>
      <div className='p-6 md:p-8 rounded-3xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-sm'>
        {/* Header */}
        <div className='flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-8 pb-6 border-b border-gray-100 dark:border-gray-800'>
          <div>
            <div className='flex items-center gap-2 mb-1'>
              <h3 className='text-xl md:text-2xl font-black text-primary tracking-tight'>
                Season-over-Season Growth
              </h3>
              <span className='px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'>
                Annual Retrospective
              </span>
            </div>
            <p className='text-xs md:text-sm text-secondary font-medium'>
              Comparing key developments from your 2025 rookie season to 2026.
            </p>
          </div>

          <div className='flex items-center gap-2 text-xs font-bold text-secondary bg-gray-50 dark:bg-gray-800/60 px-3 py-1.5 rounded-xl border border-gray-100 dark:border-gray-700/50 self-start sm:self-auto'>
            <span>2025: {s25.totalRounds} rounds</span>
            <span className='text-secondary/40'>➔</span>
            <span className='text-primary'>2026: {s26.totalRounds} rounds</span>
          </div>
        </div>

        {/* Bento Comparison Grid */}
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5'>
          {metrics.map((m, idx) => (
            <div
              key={idx}
              className='p-5 md:p-6 rounded-2xl bg-gray-50/70 dark:bg-gray-800/40 border border-gray-100 dark:border-gray-800/80 flex flex-col justify-between hover:border-emerald-500/30 transition-colors'
            >
              <div>
                <div className='flex items-start justify-between gap-2 min-h-[38px] mb-3'>
                  <span className='text-xs font-bold uppercase tracking-wider text-secondary leading-snug'>
                    {m.title}
                  </span>
                  <span className='shrink-0 px-2 py-0.5 rounded-md text-[10px] font-black bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 whitespace-nowrap'>
                    {m.badge}
                  </span>
                </div>

                <div className='flex items-baseline justify-between mb-3'>
                  <div>
                    <span className='text-[10px] uppercase font-bold text-secondary/60 block'>
                      2025
                    </span>
                    <span className='text-lg font-bold text-secondary line-through opacity-70'>
                      {m.from}
                    </span>
                  </div>

                  <span className='text-secondary/40 text-sm font-black'>
                    ➔
                  </span>

                  <div className='text-right'>
                    <span className='text-[10px] uppercase font-bold text-emerald-600 dark:text-emerald-400 block'>
                      2026
                    </span>
                    <span className='text-2xl md:text-3xl font-black text-primary leading-tight'>
                      {m.to}
                    </span>
                  </div>
                </div>

                <div className='pt-2.5 border-t border-gray-200/50 dark:border-gray-700/50'>
                  <p className='text-xs font-medium text-secondary leading-relaxed'>
                    {m.detail}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default function Golfing() {
  const [seasons] = useState<GolfSeason[]>(golfData as GolfSeason[])
  const [selectedSeason, setSelectedSeason] = useState<string>('all')
  const [holeFilter, setHoleFilter] = useState<'all' | '9' | '18'>('all')
  const [selectedCourse, setSelectedCourse] = useState<string>('all')

  // Flatten all rounds for career aggregates and modal lookups
  const allRounds = useMemo(() => {
    return seasons.flatMap(s => s.months.flatMap(m => m.roundsDetail))
  }, [seasons])

  // Compute Career / All-Time aggregates
  const careerStats = useMemo(() => {
    const r9 = allRounds.filter(r => (r.holes && r.holes === 9) || r.score < 70)
    const r18 = allRounds.filter(
      r => (r.holes && r.holes === 18) || r.score >= 70
    )

    const low9 = r9.length > 0 ? Math.min(...r9.map(r => r.score)) : 40
    const low18 = r18.length > 0 ? Math.min(...r18.map(r => r.score)) : 83

    const totalBirdies = allRounds.reduce(
      (acc, r) => acc + (r.stats?.birdies || 0),
      0
    )
    const totalPars = allRounds.reduce(
      (acc, r) => acc + (r.stats?.pars || 0),
      0
    )

    const uniqueCourses = Array.from(new Set(allRounds.map(r => r.course)))

    // Course round counts
    const courseRoundCounts: { [course: string]: number } = {}
    allRounds.forEach(r => {
      courseRoundCounts[r.course] = (courseRoundCounts[r.course] || 0) + 1
    })

    const sortedCourses = Object.entries(courseRoundCounts).sort(
      (a, b) => b[1] - a[1]
    )

    return {
      totalRounds: allRounds.length,
      count9: r9.length,
      count18: r18.length,
      low9,
      low18,
      totalBirdies,
      totalPars,
      uniqueCoursesCount: uniqueCourses.length,
      sortedCourses,
    }
  }, [allRounds])

  // Filter seasons based on tab
  const visibleSeasons = useMemo(() => {
    if (selectedSeason === 'all') return seasons
    return seasons.filter(s => s.year === selectedSeason)
  }, [seasons, selectedSeason])

  return (
    <Container fullWidth={true}>
      <div className='flex flex-col items-center justify-center space-y-12 py-4 md:py-8'>
        {/* Hero Section */}
        <div className='flex flex-col items-center text-center space-y-4 md:space-y-6 px-4 max-w-4xl mx-auto'>
          <h1 className='text-4xl md:text-7xl font-black tracking-tight text-primary'>
            Golfing
          </h1>
          <p className='text-base md:text-xl text-secondary leading-relaxed max-w-2xl'>
            Tracking my journey through my golf seasons, analyzing rounds,
            scorecards, and hopefully eventually finding the fairway...
          </p>
        </div>

        {/* All-Time Career Bento Box */}
        <div className='w-full px-4 max-w-[1400px] mx-auto'>
          <div className='mb-4'>
            <h2 className='text-xs font-black text-secondary uppercase tracking-[0.2em]'>
              Career Overview
            </h2>
          </div>
          <div className='grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4'>
            <div className='p-4 md:p-6 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-sm'>
              <p className='text-[10px] font-black uppercase tracking-widest text-secondary mb-1'>
                Total Rounds
              </p>
              <p className='text-3xl md:text-4xl font-black text-primary'>
                {careerStats.totalRounds}
              </p>
              <p className='text-[10px] font-bold text-secondary mt-1'>
                {careerStats.count18} 18H • {careerStats.count9} 9H
              </p>
            </div>

            <div className='p-4 md:p-6 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-sm'>
              <p className='text-[10px] font-black uppercase tracking-widest text-secondary mb-1'>
                Career Low 18
              </p>
              <p className='text-3xl md:text-4xl font-black text-emerald-600 dark:text-emerald-400'>
                {careerStats.low18}
              </p>
              <p className='text-[10px] font-bold text-secondary mt-1 truncate'>
                +11 at Indian Boundary
              </p>
            </div>

            <div className='p-4 md:p-6 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-sm'>
              <p className='text-[10px] font-black uppercase tracking-widest text-secondary mb-1'>
                Career Low 9
              </p>
              <p className='text-3xl md:text-4xl font-black text-emerald-600 dark:text-emerald-400'>
                {careerStats.low9}
              </p>
              <p className='text-[10px] font-bold text-secondary mt-1 truncate'>
                +4 at Marovitz
              </p>
            </div>

            <div className='p-4 md:p-6 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-sm'>
              <p className='text-[10px] font-black uppercase tracking-widest text-secondary mb-1'>
                Career Birdies
              </p>
              <p className='text-3xl md:text-4xl font-black text-emerald-600 dark:text-emerald-400'>
                {careerStats.totalBirdies}
              </p>
              <p className='text-[10px] font-bold text-secondary mt-1'>
                {careerStats.totalPars} Pars
              </p>
            </div>

            <div className='p-4 md:p-6 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-sm'>
              <p className='text-[10px] font-black uppercase tracking-widest text-secondary mb-1'>
                Courses Played
              </p>
              <p className='text-3xl md:text-4xl font-black text-primary'>
                {careerStats.uniqueCoursesCount}
              </p>
              <p className='text-[10px] font-bold text-secondary mt-1'>
                Across 5 States
              </p>
            </div>

            <div className='p-4 md:p-6 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-sm'>
              <p className='text-[10px] font-black uppercase tracking-widest text-secondary mb-1'>
                Home Course
              </p>
              <p className='text-xl md:text-2xl font-black text-primary truncate'>
                Marovitz
              </p>
              <p className='text-[10px] font-bold text-secondary mt-1'>
                35 rounds played
              </p>
            </div>
          </div>
        </div>

        {/* Filter Controls */}
        <div className='w-full px-4 max-w-[1400px] mx-auto'>
          <div className='flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 p-4 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-sm'>
            {/* Season tabs */}
            <div className='flex items-center gap-1.5 p-1 rounded-xl bg-gray-100 dark:bg-gray-800'>
              <button
                onClick={() => setSelectedSeason('all')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  selectedSeason === 'all'
                    ? 'bg-white dark:bg-gray-900 text-primary shadow-sm'
                    : 'text-secondary hover:text-primary'
                }`}
              >
                All Seasons
              </button>
              {seasons.map(s => (
                <button
                  key={s.year}
                  onClick={() => setSelectedSeason(s.year)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    selectedSeason === s.year
                      ? 'bg-white dark:bg-gray-900 text-primary shadow-sm'
                      : 'text-secondary hover:text-primary'
                  }`}
                >
                  {s.year} Season
                </button>
              ))}
            </div>

            {/* Hole Format Filter */}
            <div className='flex items-center gap-1 p-1 rounded-xl bg-gray-100 dark:bg-gray-800'>
              <button
                onClick={() => setHoleFilter('all')}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                  holeFilter === 'all'
                    ? 'bg-white dark:bg-gray-900 text-primary shadow-sm'
                    : 'text-secondary hover:text-primary'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setHoleFilter('18')}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                  holeFilter === '18'
                    ? 'bg-white dark:bg-gray-900 text-primary shadow-sm'
                    : 'text-secondary hover:text-primary'
                }`}
              >
                18 Holes
              </button>
              <button
                onClick={() => setHoleFilter('9')}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                  holeFilter === '9'
                    ? 'bg-white dark:bg-gray-900 text-primary shadow-sm'
                    : 'text-secondary hover:text-primary'
                }`}
              >
                9 Holes
              </button>
            </div>
          </div>
        </div>

        {/* Courses Played Quick Bar */}
        <div className='w-full px-4 max-w-[1400px] mx-auto'>
          <div className='p-4 md:p-6 rounded-2xl bg-gray-50/50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800'>
            <div className='flex items-center justify-between mb-3'>
              <h3 className='text-xs font-black text-secondary uppercase tracking-[0.2em]'>
                Courses Played ({careerStats.uniqueCoursesCount})
              </h3>
              {selectedCourse !== 'all' && (
                <button
                  onClick={() => setSelectedCourse('all')}
                  className='text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline'
                >
                  Reset Course Filter
                </button>
              )}
            </div>
            <div className='flex flex-wrap gap-1.5'>
              {careerStats.sortedCourses.map(([cname, count]) => (
                <button
                  key={cname}
                  onClick={() =>
                    setSelectedCourse(selectedCourse === cname ? 'all' : cname)
                  }
                  className={`px-2.5 py-1 rounded-full text-xs font-medium transition-all ${
                    selectedCourse === cname
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'bg-white dark:bg-gray-800 text-secondary hover:text-primary border border-gray-200 dark:border-gray-700/60'
                  }`}
                >
                  <span>{cname}</span>
                  <span className='ml-1.5 text-[10px] font-black opacity-70'>
                    {count}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Seasons */}
        <div className='w-full px-4 max-w-[1400px] mx-auto space-y-12 md:space-y-20'>
          {visibleSeasons.map(season => {
            const seasonRounds = season.months.flatMap(m => m.roundsDetail)
            const rounds9 = seasonRounds.filter(
              r => (r.holes && r.holes === 9) || r.score < 70
            )
            const rounds18 = seasonRounds.filter(
              r => (r.holes && r.holes === 18) || r.score >= 70
            )

            const low9 =
              rounds9.length > 0 ? Math.min(...rounds9.map(r => r.score)) : '--'
            const low18 =
              rounds18.length > 0
                ? Math.min(...rounds18.map(r => r.score))
                : '--'
            const totalRounds = seasonRounds.length
            const totalBirdies = season.months.reduce(
              (acc, m) => acc + m.birdies,
              0
            )

            return (
              <div key={season.year} className='space-y-8 md:space-y-12'>
                <div className='flex flex-col md:flex-row md:items-end justify-between gap-4 md:gap-6'>
                  <div className='flex items-center gap-4 md:gap-6'>
                    <h2 className='text-3xl md:text-5xl font-black text-primary tracking-tighter'>
                      {season.year} Season
                    </h2>
                    <div className='hidden md:block h-px w-24 bg-gray-100 dark:bg-gray-800' />
                  </div>

                  <div className='flex flex-wrap gap-2 md:gap-3'>
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
                        Low 9
                      </p>
                      <p className='text-lg md:text-xl font-black text-primary'>
                        {low9}
                      </p>
                    </div>
                    <div className='px-3 py-1.5 md:px-4 md:py-2 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-800/50'>
                      <p className='text-[8px] md:text-[10px] font-bold text-secondary uppercase tracking-widest mb-0.5'>
                        Low 18
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

                <div className='grid grid-cols-1 gap-10 md:gap-12'>
                  {[...season.months].reverse().map((month, idx) => (
                    <MonthlyCard
                      key={idx}
                      data={month}
                      allRounds={allRounds}
                      holeFilter={holeFilter}
                      courseFilter={selectedCourse}
                    />
                  ))}
                </div>
              </div>
            )
          })}

          {/* Season-over-Season Growth Bento Grid (Annual Retrospective) */}
          <SeasonProgression seasons={seasons} />
        </div>
      </div>
    </Container>
  )
}
