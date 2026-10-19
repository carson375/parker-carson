import { useState, useRef, useMemo } from 'react'

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
  const normalized = distance.toLowerCase().trim()
  if (normalized.includes('half')) {
    return {
      primary: '13.1 Mi',
      secondary: '21.08 K',
    }
  }
  if (normalized.includes('marathon') && !normalized.includes('half')) {
    return {
      primary: '26.2 Mi',
      secondary: '42.16 K',
    }
  }

  const isKm = normalized.includes('k')
  const val = parseFloat(distance)

  if (isNaN(val)) {
    return {
      primary: distance,
      secondary: '',
    }
  }

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
          {race.results &&
            race.results.trim() !== '' &&
            race.results !== '#' && (
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
            )}

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

interface PersonalRecord {
  category: string
  subtitle: string
  time: string
  raceName: string
  date: string
  pace: string
  results?: string
}

const computePersonalRecords = (racesList: Race[]): PersonalRecord[] => {
  const canonicalDistances = [
    {
      key: 'marathon',
      label: 'Marathon',
      sub: '26.2 Mi',
      match: (d: string) =>
        d.includes('26.2') || d.toLowerCase().includes('marathon'),
    },
    {
      key: 'half',
      label: 'Half Marathon',
      sub: '13.1 Mi',
      match: (d: string) =>
        d.includes('13.1') || d.toLowerCase().includes('half'),
    },
    {
      key: '10k',
      label: '10K',
      sub: '6.2 Mi',
      match: (d: string) => d.toLowerCase().includes('10k'),
    },
    {
      key: '8k',
      label: '8K',
      sub: '5.0 Mi',
      match: (d: string) => d.toLowerCase().includes('8k'),
    },
    {
      key: '5k',
      label: '5K',
      sub: '3.1 Mi',
      match: (d: string) => d.toLowerCase().includes('5k'),
    },
    {
      key: '3.5m',
      label: '3.5 Miles',
      sub: '3.5 Mi',
      match: (d: string) => d.includes('3.5'),
    },
    {
      key: '1m',
      label: '1 Mile',
      sub: '1 Mi',
      match: (d: string) => /^\s*1\s*(mi|mile)/i.test(d),
    },
  ]

  const parseTimeToSeconds = (timeStr: string) => {
    if (!timeStr || timeStr === '--:--' || timeStr === '00:00') return 0
    const parts = timeStr.trim().split(':').map(Number)
    if (parts.length === 3) {
      return parts[0] * 3600 + parts[1] * 60 + parts[2]
    } else if (parts.length === 2) {
      return parts[0] * 60 + parts[1]
    }
    return 0
  }

  const parseDistanceMiles = (distStr: string) => {
    const norm = distStr.toLowerCase().trim()
    const val = parseFloat(norm)
    if (norm.includes('k')) {
      return val * 0.621371
    }
    return val
  }

  const formatPace = (totalSeconds: number, miles: number) => {
    if (!miles || !totalSeconds) return ''
    const paceSec = totalSeconds / miles
    const mins = Math.floor(paceSec / 60)
    const secs = Math.round(paceSec % 60)
    return `${mins}:${secs < 10 ? '0' : ''}${secs} / mi`
  }

  const prs: PersonalRecord[] = []
  for (const cat of canonicalDistances) {
    const matchingRaces = racesList.filter(
      r => cat.match(r.distance) && parseTimeToSeconds(r.time) > 0
    )
    if (matchingRaces.length === 0) continue

    let bestRace = matchingRaces[0]
    let bestSec = parseTimeToSeconds(bestRace.time)

    for (let i = 1; i < matchingRaces.length; i++) {
      const sec = parseTimeToSeconds(matchingRaces[i].time)
      if (sec > 0 && (bestSec === 0 || sec < bestSec)) {
        bestSec = sec
        bestRace = matchingRaces[i]
      }
    }

    if (bestSec > 0) {
      const miles = parseDistanceMiles(bestRace.distance)
      prs.push({
        category: cat.label,
        subtitle: cat.sub,
        time: bestRace.time,
        raceName: bestRace.name,
        date: bestRace.date,
        pace: formatPace(bestSec, miles),
        results: bestRace.results,
      })
    }
  }

  return prs
}

const PersonalBests = ({ races }: { races: Race[] }) => {
  const prs = useMemo(() => computePersonalRecords(races), [races])
  if (prs.length === 0) return null

  return (
    <div className='w-full max-w-[1400px] mx-auto px-4'>
      <div className='relative overflow-hidden rounded-3xl border border-amber-500/30 dark:border-amber-500/20 bg-gradient-to-b from-amber-50/40 via-white to-white dark:from-amber-950/10 dark:via-gray-900 dark:to-gray-900 p-6 md:p-10 shadow-sm'>
        {/* Glow backdrop accent */}
        <div className='absolute -top-24 -right-24 w-72 h-72 bg-amber-500/10 dark:bg-amber-400/5 rounded-full blur-3xl pointer-events-none' />

        {/* Section Header */}
        <div className='flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-gray-100 dark:border-gray-800/80'>
          <div className='flex items-center gap-3'>
            <div className='flex items-center justify-center w-10 h-10 rounded-xl bg-amber-500/10 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-500/20'>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                width='20'
                height='20'
                viewBox='0 0 24 24'
                fill='none'
                stroke='currentColor'
                strokeWidth='2.2'
                strokeLinecap='round'
                strokeLinejoin='round'
              >
                <circle cx='12' cy='12' r='10'></circle>
                <polyline points='12 6 12 12 16 14'></polyline>
              </svg>
            </div>
            <div>
              <div className='flex items-center gap-2'>
                <h2 className='text-xl md:text-2xl font-black text-primary tracking-tight'>
                  Personal Bests
                </h2>
                <span className='px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-500/30'>
                  PBs
                </span>
              </div>
              <p className='text-xs text-secondary font-medium mt-0.5'>
                Fastest times across official race distances.
              </p>
            </div>
          </div>
        </div>

        {/* PR Cards Grid - 1 line on desktop, 2 balanced rows on tablet, 3 on mobile */}
        <div className='grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4'>
          {prs.map(pr => {
            const Content = (
              <div className='h-full flex flex-col justify-between bg-white dark:bg-gray-800/80 rounded-2xl p-3.5 sm:p-4 md:p-5 border border-gray-200/80 dark:border-gray-700/60 hover:border-amber-500/50 dark:hover:border-amber-400/50 transition-all duration-300 hover:shadow-md group'>
                <div>
                  <div className='flex items-center justify-between gap-1 mb-2'>
                    <span className='text-[9px] sm:text-[10px] font-black uppercase tracking-tight sm:tracking-wider text-amber-600 dark:text-amber-400'>
                      {pr.category}
                    </span>
                    <span className='text-[8.5px] sm:text-[9px] font-bold text-secondary bg-gray-100 dark:bg-gray-700/60 px-1.5 py-0.5 rounded-full shrink-0'>
                      {pr.subtitle}
                    </span>
                  </div>

                  <div className='text-2xl sm:text-3xl font-black text-primary tracking-tight my-1 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors'>
                    {pr.time}
                  </div>

                  {pr.pace && (
                    <div className='inline-flex items-center gap-1 text-[11px] font-semibold text-secondary mb-2'>
                      <span className='text-amber-500'>⚡</span>
                      <span>{pr.pace}</span>
                    </div>
                  )}
                </div>

                <div className='pt-2.5 border-t border-gray-100 dark:border-gray-700/50 mt-1'>
                  <p
                    className='text-xs font-bold text-primary truncate'
                    title={pr.raceName}
                  >
                    {pr.raceName}
                  </p>
                  <p className='text-[10px] text-secondary font-medium mt-0.5 truncate'>
                    {pr.date}
                  </p>
                </div>
              </div>
            )

            if (pr.results && pr.results.trim() !== '' && pr.results !== '#') {
              return (
                <a
                  key={pr.category}
                  href={pr.results}
                  target='_blank'
                  rel='noreferrer'
                  className='block transform transition-transform active:scale-95'
                  title={`View ${pr.raceName} results`}
                >
                  {Content}
                </a>
              )
            }

            return <div key={pr.category}>{Content}</div>
          })}
        </div>
      </div>
    </div>
  )
}

export default function Running() {
  const [races] = useState<Race[]>(runningData as Race[])
  const [collapsedYears, setCollapsedYears] = useState<{
    [key: string]: boolean
  }>({})

  // Group races by year from the date string (e.g., "March 23, 2025")
  const groupedRaces = races.reduce((acc: { [key: string]: Race[] }, race) => {
    const year = race.date.split(', ')[1]?.trim() || 'Upcoming'
    if (!acc[year]) acc[year] = []
    acc[year].push(race)
    return acc
  }, {})

  // Sort races within each year reverse chronologically (newest first)
  Object.keys(groupedRaces).forEach(year => {
    groupedRaces[year].sort((a, b) => {
      const timeA = new Date(a.date).getTime()
      const timeB = new Date(b.date).getTime()
      return isNaN(timeB) || isNaN(timeA) ? 0 : timeB - timeA
    })
  })

  const years = Object.keys(groupedRaces).sort((a, b) => b.localeCompare(a))

  const toggleYear = (year: string) => {
    setCollapsedYears(prev => ({
      ...prev,
      [year]: !prev[year],
    }))
  }

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

        {/* Personal Bests */}
        <PersonalBests races={races} />

        {/* Race Sections by Year */}
        <div className='w-full px-4 max-w-[1400px] mx-auto space-y-8 md:space-y-12'>
          {years.map(year => {
            const isCollapsed = collapsedYears[year]
            return (
              <div key={year} className='space-y-8 md:space-y-12'>
                <button
                  onClick={() => toggleYear(year)}
                  className='flex items-center gap-4 md:gap-6 w-full text-left group'
                >
                  <h2 className='text-3xl md:text-5xl font-black text-primary tracking-tighter'>
                    {year} Races
                  </h2>
                  <div className='flex-grow hidden md:block h-px bg-gray-100 dark:bg-gray-800' />
                  <div
                    className={`p-2 rounded-full bg-gray-50 dark:bg-gray-800 text-primary transition-transform duration-300 ${isCollapsed ? '' : 'rotate-180'}`}
                  >
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      width='24'
                      height='24'
                      viewBox='0 0 24 24'
                      fill='none'
                      stroke='currentColor'
                      strokeWidth='3'
                      strokeLinecap='round'
                      strokeLinejoin='round'
                    >
                      <polyline points='6 9 12 15 18 9'></polyline>
                    </svg>
                  </div>
                </button>

                {!isCollapsed && (
                  <div className='grid grid-cols-1 gap-12 animate-in fade-in slide-in-from-top-4 duration-500'>
                    {groupedRaces[year].map((race, index) => (
                      <RaceCard key={index} race={race} />
                    ))}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </Container>
  )
}
