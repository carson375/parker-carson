import { useState, useRef } from 'react'

import Image from 'next/image'

import Container from 'components/Container'
import { Gallery } from 'components/Gallery/Gallery'

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

const RaceCard = ({ race }: { race: Race }) => {
  const [showMedia, setShowMedia] = useState(false)
  const hasPhotos = race.photos.length > 0
  const hasVideos = race.videos && race.videos.length > 0
  const totalItems = race.photos.length + (race.videos?.length || 0)

  return (
    <div className='bg-white dark:bg-gray-900 rounded-3xl border border-gray-200 dark:border-gray-800 overflow-hidden shadow-sm'>
      <div className='p-8 md:p-12'>
        <div className='flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8'>
          <div>
            <p className='text-sm font-bold text-orange-500 uppercase tracking-widest mb-2'>
              {race.date}
            </p>
            <h3 className='text-4xl md:text-5xl font-black text-primary'>
              {race.name}
            </h3>
          </div>
          <div className='flex flex-wrap gap-4'>
            <div className='bg-gray-50 dark:bg-gray-800 px-6 py-3 rounded-2xl'>
              <p className='text-xs text-secondary font-bold uppercase'>Time</p>
              <p className='text-xl font-bold text-primary'>{race.time}</p>
            </div>
            <div className='bg-gray-50 dark:bg-gray-800 px-6 py-3 rounded-2xl'>
              <p className='text-xs text-secondary font-bold uppercase'>
                Place
              </p>
              <p className='text-xl font-bold text-primary'>{race.place}</p>
            </div>
          </div>
        </div>

        <div className='flex flex-wrap items-center gap-4 mb-8'>
          <a
            href={race.results}
            target='_blank'
            rel='noreferrer'
            className='inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary text-background font-bold hover:opacity-90 transition-all active:scale-95'
          >
            View Results
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
              <path d='M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6'></path>
              <polyline points='15 3 21 3 21 9'></polyline>
              <line x1='10' y1='14' x2='21' y2='3'></line>
            </svg>
          </a>

          {(hasPhotos || hasVideos) && (
            <button
              onClick={() => setShowMedia(!showMedia)}
              className='inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gray-100 dark:bg-gray-800 text-primary font-bold hover:opacity-90 transition-all active:scale-95'
            >
              {showMedia ? 'Hide Media' : 'Show Media'}
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
  const [races] = useState<Race[]>([
    {
      name: 'Shamrock Shuffle',
      date: 'March 23, 2025',
      distance: '8k',
      time: '34:54',
      place: '1624',
      results: 'https://track.rtrt.me/e/BASS2025#/tracker/RS5EA4V2',
      photos: ['/running/RacePhotos/2025_ShamrockShuffle/IMG_6371.jpg'],
    },
    {
      name: 'JPMC Corporate Challenge',
      date: 'April 23, 2025',
      distance: '3.5 Miles',
      time: '22:58',
      place: '256',
      results:
        'https://leaderboard.jpmorgancc.com/leaderboard/2025/individual?entrantId=690398&eventIds=242',
      photos: [],
      videos: ['/running/RacePhotos/2025_JPMC/IMG_3829 (1).MOV'],
    },
    {
      name: 'Run For The Zoo',
      date: 'June 8, 2025',
      distance: '10k',
      time: '43:12',
      place: '19',
      results: 'https://my.raceresult.com/336635/',
      photos: [
        '/running/RacePhotos/2025_RunForTheZoo/Photos-3-001/IMG_4371.JPG',
        '/running/RacePhotos/2025_RunForTheZoo/Photos-3-001/IMG_4370.JPG',
        '/running/RacePhotos/2025_RunForTheZoo/Photos-3-001/IMG_4369.JPG',
        '/running/RacePhotos/2025_RunForTheZoo/Photos-3-001/IMG_4367.JPG',
        '/running/RacePhotos/2025_RunForTheZoo/Photos-3-001/IMG_4368.JPG',
        '/running/RacePhotos/2025_RunForTheZoo/Photos-3-001/IMG_4365.JPG',
        '/running/RacePhotos/2025_RunForTheZoo/Photos-3-001/IMG_4364.JPG',
        '/running/RacePhotos/2025_RunForTheZoo/Photos-3-001/IMG_4363.JPG',
      ],
    },
    {
      name: 'Big Ten 10k',
      date: 'July 12, 2025',
      distance: '10k',
      time: '41:39',
      place: '142',
      results: 'https://events.hakuapp.com/?registration_number=B1719187BC',
      photos: [
        '/running/RacePhotos/2025_BigTen10K/Photos-3-001 (1)/IMG_4582.JPG',
        '/running/RacePhotos/2025_BigTen10K/Photos-3-001 (1)/IMG_4581.JPG',
        '/running/RacePhotos/2025_BigTen10K/Photos-3-001 (1)/IMG_4580.JPG',
        '/running/RacePhotos/2025_BigTen10K/Photos-3-001 (1)/IMG_4579.JPG',
        '/running/RacePhotos/2025_BigTen10K/Photos-3-001 (1)/IMG_4578.JPG',
        '/running/RacePhotos/2025_BigTen10K/Photos-3-001 (1)/IMG_4577.JPG',
        '/running/RacePhotos/2025_BigTen10K/Photos-3-001 (1)/IMG_4576.JPG',
        '/running/RacePhotos/2025_BigTen10K/Photos-3-001 (1)/IMG_4575.JPG',
        '/running/RacePhotos/2025_BigTen10K/Photos-3-001 (1)/IMG_4574.JPG',
        '/running/RacePhotos/2025_BigTen10K/Photos-3-001 (1)/IMG_4573.JPG',
        '/running/RacePhotos/2025_BigTen10K/Photos-3-001 (1)/IMG_4572.JPG',
        '/running/RacePhotos/2025_BigTen10K/Photos-3-001 (1)/IMG_4571.JPG',
        '/running/RacePhotos/2025_BigTen10K/Photos-3-001 (1)/IMG_4570.JPG',
        '/running/RacePhotos/2025_BigTen10K/Photos-3-001 (1)/IMG_2701.JPG',
        '/running/RacePhotos/2025_BigTen10K/Photos-3-001 (1)/IMG_4553.JPG',
        '/running/RacePhotos/2025_BigTen10K/Photos-3-001 (1)/IMG_4556.JPG',
      ],
    },
    {
      name: 'Lifetime Chicago Half Marathon',
      date: 'September 28, 2025',
      distance: '13.1 Miles',
      time: '1:30:51',
      place: '141',
      results:
        'https://www.athlinks.com/event/20834/results/Event/1072616/Course/2440334/Bib/5500',
      photos: [
        '/running/RacePhotos/2025_LifetimeHalf/Photos-3-001 (2)/IMG_4954.jpg',
        '/running/RacePhotos/2025_LifetimeHalf/Photos-3-001 (2)/IMG_4953.jpg',
        '/running/RacePhotos/2025_LifetimeHalf/Photos-3-001 (2)/IMG_4951.jpg',
        '/running/RacePhotos/2025_LifetimeHalf/Photos-3-001 (2)/IMG_4950.jpg',
        '/running/RacePhotos/2025_LifetimeHalf/Photos-3-001 (2)/IMG_4947.jpg',
      ],
    },
    {
      name: 'Columbus Marathon',
      date: 'October 18, 2025',
      distance: '26.2 Miles',
      time: '3:07:29',
      place: '228',
      results:
        'https://www.mtecresults.com/runner/show?race=19623&rid=96038688',
      photos: [
        '/running/RacePhotos/2025_ColumbusMarathon/Photos-3-001 (3)/IMG_5175.jpg',
        '/running/RacePhotos/2025_ColumbusMarathon/Photos-3-001 (3)/IMG_5177.jpg',
        '/running/RacePhotos/2025_ColumbusMarathon/Photos-3-001 (3)/IMG_5178.jpg',
        '/running/RacePhotos/2025_ColumbusMarathon/Photos-3-001 (3)/IMG_5180.jpg',
        '/running/RacePhotos/2025_ColumbusMarathon/Photos-3-001 (3)/IMG_5181.jpg',
        '/running/RacePhotos/2025_ColumbusMarathon/Photos-3-001 (3)/IMG_FCB67B4BE97F-1.jpeg',
      ],
    },
  ])

  return (
    <Container fullWidth={true}>
      <div className='flex flex-col items-center justify-center space-y-12 py-16'>
        {/* Hero Section */}
        <div className='flex flex-col items-center text-center space-y-8 px-4 max-w-2xl mx-auto'>
          <h1 className='text-5xl md:text-7xl font-black tracking-tight text-primary'>
            Running
          </h1>

          <div className='space-y-6'>
            <p className='text-lg md:text-xl text-secondary leading-relaxed'>
              Tracking my journey through various races and daily runs.
            </p>
          </div>
        </div>

        {/* 2025 Races Section */}
        <div className='w-full px-4 max-w-7xl mx-auto'>
          <div className='flex items-center justify-between mb-8'>
            <h2 className='text-3xl font-bold text-primary'>2025 Races</h2>
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
