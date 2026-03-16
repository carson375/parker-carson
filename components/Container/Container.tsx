import React, { useEffect, useState } from 'react'

import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useTheme } from 'next-themes'

import Footer from 'components/Footer/Footer'
import cn from 'lib/classNames'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function Container(props: any) {
  const [mounted, setMounted] = useState<boolean>(false)
  const { resolvedTheme, setTheme } = useTheme()

  const { children, fullWidth, hideNav, clean, ...customMeta } = props
  const router = useRouter()

  const meta = {
    title: 'Parker Carson',
    description:
      'Personal portfolio of Parker Carson, an engineer based in Chicago.',
    image: 'https://parker-carson.com/static/images/banner.png',
    type: 'website',
    ...customMeta,
  }

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <>
      <div
        className={cn(
          'text-primary',
          'relative h-full min-h-screen w-full',
          'flex flex-col',
          'motion-reduce:transition-none motion-reduce:transform-none'
        )}
      >
        <Head>
          <title>{meta.title}</title>
          <meta name='robots' content='follow, index' />
          <meta
            property='og:url'
            content={`https://parker-carson.com${router.asPath}`}
          />
          <link
            rel='canonical'
            href={`https://parker-carson.com${router.asPath}`}
          />
          <meta property='og:type' content={meta.type} />
          <meta property='og:site_name' content='Parker Carson' />
          <meta property='og:description' content={meta.description} />
          <meta property='og:title' content={meta.title} />
          <meta property='og:image' content={meta.image} />
          {meta.date && (
            <meta property='article:published_time' content={meta.date} />
          )}
        </Head>

        {!hideNav && (
          <nav className='sticky top-4 z-[9999] w-[calc(100%-2rem)] max-w-5xl mx-auto flex justify-between items-center px-6 py-3 rounded-2xl bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl border border-gray-200/50 dark:border-gray-800/50 shadow-sm'>
            <div className='flex flex-row items-center gap-6'>
              <Link
                href='/'
                className='text-sm font-bold transition-all cursor-pointer text-tertiary hover:text-primary'
              >
                Home
              </Link>
              <Link
                href='/photos'
                className='text-sm font-bold transition-all cursor-pointer text-tertiary hover:text-primary'
              >
                Photography
              </Link>

              <div className='relative group'>
                <button
                  className='text-sm font-bold transition-all cursor-pointer text-tertiary hover:text-primary flex items-center gap-1.5'
                  aria-haspopup='true'
                  aria-expanded='false'
                >
                  Hobbies
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    width='12'
                    height='12'
                    viewBox='0 0 24 24'
                    fill='none'
                    stroke='currentColor'
                    strokeWidth='3'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    className='opacity-50 group-hover:rotate-180 transition-transform duration-300'
                  >
                    <polyline points='6 9 12 15 18 9'></polyline>
                  </svg>
                </button>
                <div className='absolute left-1/2 -translate-x-1/2 pt-3 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-[10000]'>
                  <div className='bg-white/95 dark:bg-gray-900/95 backdrop-blur-2xl border border-gray-200 dark:border-gray-800 rounded-2xl overflow-hidden shadow-2xl min-w-[160px] p-1.5'>
                    {[
                      { label: 'Running', href: '/hobbies/running' },
                      { label: 'Skiing', href: '/hobbies/skiing' },

                      { label: 'Golfing', href: '/hobbies/golfing' },
                    ].map(item => (
                      <Link
                        key={item.href}
                        href={item.href}
                        className='block px-4 py-2.5 text-sm font-medium rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 text-secondary hover:text-primary transition-all'
                      >
                        {item.label}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className='flex flex-row items-center gap-4'>
              <a
                href='https://github.com/carson375'
                target='_blank'
                rel='noreferrer'
                aria-label='View GitHub Profile'
                className='p-2 rounded-xl text-tertiary hover:text-primary hover:bg-gray-100 dark:hover:bg-gray-800 transition-all'
              >
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  width='20'
                  height='20'
                  viewBox='0 0 24 24'
                  fill='currentColor'
                >
                  <path d='M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z' />
                </svg>
              </a>
              <button
                aria-label='Toggle Dark Mode'
                type='button'
                className='flex items-center justify-center p-2 rounded-xl text-tertiary hover:text-primary hover:bg-gray-100 dark:hover:bg-gray-800 transition-all'
                onClick={() =>
                  setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')
                }
              >
                {mounted && (
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
                    {resolvedTheme === 'dark' ? (
                      <>
                        <circle cx='12' cy='12' r='5'></circle>
                        <line x1='12' y1='1' x2='12' y2='3'></line>
                        <line x1='12' y1='21' x2='12' y2='23'></line>
                        <line x1='4.22' y1='4.22' x2='5.64' y2='5.64'></line>
                        <line
                          x1='18.36'
                          y1='18.36'
                          x2='19.78'
                          y2='19.78'
                        ></line>
                        <line x1='1' y1='12' x2='3' y2='12'></line>
                        <line x1='21' y1='12' x2='23' y2='12'></line>
                        <line x1='4.22' y1='17.78' x2='5.64' y2='16.36'></line>
                        <line x1='18.36' y1='5.64' x2='19.78' y2='4.22'></line>
                      </>
                    ) : (
                      <path d='M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z'></path>
                    )}
                  </svg>
                )}
              </button>
            </div>
          </nav>
        )}

        <main
          className={cn(
            !clean && 'px-4 mt-12',
            clean
              ? 'w-full'
              : fullWidth
                ? 'max-w-none w-full px-8'
                : 'max-w-2xl',
            'mx-auto my-auto',
            'flex flex-col justify-center gap-12',
            !clean && 'divide-y divide-gray-200 dark:divide-gray-900',
            'rounded-lg'
          )}
        >
          <div>{children}</div>
          <footer>
            <Footer />
          </footer>
        </main>
      </div>
    </>
  )
}
