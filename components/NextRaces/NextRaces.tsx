import { useEffect, useMemo, useState } from 'react'

import Link from 'next/link'

import races from 'data/races.json'

type Race = {
  name: string
  date: string
  location: string
  distance?: string
  note?: string
}

// Races start in the morning; count down to 7:00 AM local on race day.
function raceStart(iso: string) {
  return new Date(`${iso}T07:00:00`)
}

function raceEnd(iso: string) {
  const [y, m, d] = iso.split('-').map(Number)
  return new Date(y, m - 1, d, 23, 59, 59)
}

function formatDate(iso: string) {
  const [y, m, d] = iso.split('-').map(Number)
  return new Date(y, m - 1, d).toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

function metaLine(race: Race) {
  return [formatDate(race.date), race.location, race.distance, race.note]
    .filter(Boolean)
    .join(' · ')
}

export default function NextRaces() {
  const [now, setNow] = useState<Date | null>(null)

  useEffect(() => {
    setNow(new Date())
    const t = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(t)
  }, [])

  const upcoming = useMemo(() => {
    const ref = now ?? new Date()
    return (races as Race[])
      .filter(r => raceEnd(r.date) >= ref)
      .sort((a, b) => a.date.localeCompare(b.date))
  }, [now])

  if (upcoming.length === 0) return null

  const [next, ...rest] = upcoming
  const diffMs = now ? raceStart(next.date).getTime() - now.getTime() : null
  const isRaceDay = diffMs !== null && diffMs <= 0

  const parts =
    diffMs !== null && diffMs > 0
      ? [
          { value: Math.floor(diffMs / 86_400_000), label: 'Days' },
          { value: Math.floor(diffMs / 3_600_000) % 24, label: 'Hours' },
          { value: Math.floor(diffMs / 60_000) % 60, label: 'Minutes' },
          { value: Math.floor(diffMs / 1_000) % 60, label: 'Seconds' },
        ]
      : null

  const countdownBoxes = parts ?? [
    { value: null as number | null, label: 'Days' },
    { value: null as number | null, label: 'Hours' },
    { value: null as number | null, label: 'Minutes' },
    { value: null as number | null, label: 'Seconds' },
  ]

  return (
    <section className='w-full px-4'>
      <div className='rounded-3xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 md:p-8 w-full'>
        <div className='flex items-baseline justify-between gap-4 mb-4 md:mb-6'>
          <h2 className='text-xl md:text-2xl font-black'>Next Races</h2>
          <Link
            href='/hobbies/running'
            className='text-xs md:text-sm font-bold text-pink-500 hover:underline shrink-0'
          >
            Running →
          </Link>
        </div>

        <div className='flex flex-col md:flex-row md:items-end md:justify-between gap-5'>
          <div className='text-left'>
            <div className='text-2xl md:text-3xl font-black leading-tight'>
              {next.name}
            </div>
            <div className='text-secondary text-sm md:text-base mt-1'>
              {metaLine(next)}
            </div>
          </div>

          {isRaceDay ? (
            <div className='text-left md:text-right'>
              <span className='inline-block px-4 py-2 rounded-full bg-pink-500 text-white text-sm md:text-base font-bold'>
                Race day — let&rsquo;s go!
              </span>
            </div>
          ) : (
            <div className='flex gap-2 md:gap-3'>
              {countdownBoxes.map(p => (
                <div
                  key={p.label}
                  className='bg-gray-100 dark:bg-gray-800 rounded-2xl px-2 py-2 md:px-3 min-w-[3.6rem] md:min-w-[4.2rem] text-center'
                >
                  <div className='text-xl md:text-2xl font-black tabular-nums leading-none'>
                    {p.value === null ? '––' : String(p.value).padStart(2, '0')}
                  </div>
                  <div className='text-[10px] uppercase tracking-wider text-tertiary mt-1'>
                    {p.label}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {rest.length > 0 && (
          <ul className='mt-6 divide-y divide-gray-100 dark:divide-gray-800 border-t border-gray-100 dark:border-gray-800'>
            {rest.map(race => (
              <li
                key={`${race.date}-${race.name}`}
                className='flex items-baseline justify-between gap-4 py-3 text-left'
              >
                <div className='min-w-0 flex flex-col md:flex-row md:items-baseline'>
                  <span className='font-bold text-sm md:text-base'>
                    {race.name}
                  </span>
                  <span className='text-tertiary text-xs md:text-sm mt-0.5 md:mt-0 md:ml-2'>
                    {race.location}
                    {race.distance ? ` · ${race.distance}` : ''}
                    {race.note ? ` · ${race.note}` : ''}
                  </span>
                </div>
                <span className='text-secondary text-xs md:text-sm font-medium whitespace-nowrap'>
                  {formatDate(race.date)}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  )
}
