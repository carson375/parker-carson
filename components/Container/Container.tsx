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
    image:
      'https://parker-carson.com/static/images/banner.png',
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
          <nav className='sticky w-full bg-gray-100/40 z-[1] filter-blur dark:bg-gray-1000/40 top-2 md:top-4 max-w-2xl px-4 py-2 rounded-md mx-auto flex justify-between items-center'>
            <div className='flex flex-row gap-1 text-tertiary'>
              <Link
                href='/'
                className='transition-all cursor-pointer hover:text-primary'
              >
                Home
              </Link>
              <p> | </p>
              <Link
                href='/photos'
                className='transition-all cursor-pointer hover:text-primary'
              >
                Photography
              </Link>
              <p> | </p>
              <div className='relative group'>
                <button className='transition-all cursor-pointer hover:text-primary flex items-center gap-1'>
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
                    className='opacity-50 group-hover:rotate-180 transition-transform duration-200'
                  >
                    <polyline points='6 9 12 15 18 9'></polyline>
                  </svg>
                </button>
                <div className='absolute left-1/2 -translate-x-1/2 pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10'>
                  <div className='bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden shadow-xl min-w-[120px]'>
                    <Link
                      href='/hobbies/running'
                      className='block px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors'
                    >
                      Running
                    </Link>
                    <Link
                      href='/hobbies/skiing'
                      className='block px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors'
                    >
                      Skiing
                    </Link>
                    <Link
                      href='/hobbies/climbing'
                      className='block px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors'
                    >
                      Climbing
                    </Link>
                    <Link
                      href='/hobbies/golfing'
                      className='block px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors'
                    >
                      Golfing
                    </Link>
                  </div>
                </div>
              </div>
            </div>
            <div className='flex flex-row items-center space-x-4'>
              <a
                href='https://github.com/carson375'
                className='visible'
                target='_blank'
                rel='noreferrer'
                aria-label='Github'
              >
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  width='18'
                  height='18'
                  viewBox='0 0 24 24'
                  className='text-gray-900 transition-all duration-500 fill-current dark:text-white dark:text-opacity-40 dark:hover:text-opacity-100 text-opacity-40 hover:text-opacity-100 '
                >
                  <path d='M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z' />
                </svg>
              </a>
              <button
                aria-label='Toggle Dark Mode'
                type='button'
                className='flex items-center justify-center transition-all bg-gray-200 rounded-lg w-9 h-9 dark:bg-gray-600 hover:ring-2 ring-gray-300'
                onClick={() =>
                  setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')
                }
              >
                {mounted && (
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    viewBox='0 0 24 24'
                    fill='none'
                    stroke='currentColor'
                    className='w-5 h-5 text-gray-800 dark:text-gray-200'
                  >
                    {resolvedTheme === 'dark' ? (
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth={2}
                        d='M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z'
                      />
                    ) : (
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth={2}
                        d='M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z'
                      />
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
