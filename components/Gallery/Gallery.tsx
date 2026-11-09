import React, { useState, useEffect, useRef, useCallback } from 'react'

import Image from 'next/image'

import { cloudinaryLoader } from 'lib/cloudinary'

interface GalleryProps {
  images: string[]
  perRow?: number
  layout?: 'grid' | 'stack'
  initialIndex?: number | null
  onOpen?: () => void
  onClose?: () => void
  showThumbnails?: boolean
}

export const Gallery = ({
  images,
  perRow = 1,
  layout = 'grid',
  initialIndex = null,
  onOpen,
  onClose,
  showThumbnails = true,
}: GalleryProps) => {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(
    initialIndex
  )
  const [activeIndex, setActiveIndex] = useState<number>(initialIndex ?? 0)
  const [loadedImages, setLoadedImages] = useState<Record<number, boolean>>({})
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const wheelLockUntil = useRef(0)

  // Reset per-image load state when the gallery's image set changes
  useEffect(() => {
    setLoadedImages({})
  }, [images])

  const close = useCallback(() => {
    setSelectedIndex(null)
    onClose?.()
  }, [onClose])

  /** Scroll the pager to a slide (clamped). Instant = no animation. */
  const goTo = useCallback(
    (index: number, instant = false) => {
      const container = scrollContainerRef.current
      if (!container) return
      const clamped = Math.max(0, Math.min(images.length - 1, index))
      container.scrollTo({
        left: clamped * container.clientWidth,
        behavior: instant ? ('instant' as ScrollBehavior) : 'smooth',
      })
    },
    [images.length]
  )

  // Keyboard navigation & background scroll lock (single effect — see
  // LESSONS.md: competing overflow effects can restore 'hidden' forever).
  useEffect(() => {
    if (selectedIndex === null) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close()
      if (e.key === 'ArrowRight') goTo(activeIndex + 1)
      if (e.key === 'ArrowLeft') goTo(activeIndex - 1)
    }

    window.addEventListener('keydown', handleKeyDown)
    document.body.style.overflow = 'hidden'

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = ''
    }
  }, [selectedIndex, activeIndex, goTo, close])

  // Position the pager on the opened slide, without animating through
  // (and fetching) every slide in between.
  useEffect(() => {
    if (selectedIndex === null) return
    setActiveIndex(selectedIndex)
    requestAnimationFrame(() => goTo(selectedIndex, true))
  }, [selectedIndex, goTo])

  // Derive the active slide from the scroll position itself. (The old
  // IntersectionObserver + setState round-trip lagged behind fast swipes,
  // which is what made slides pop in and out mid-gesture.)
  const handleScroll = useCallback(() => {
    const container = scrollContainerRef.current
    if (!container || container.clientWidth === 0) return
    const index = Math.round(container.scrollLeft / container.clientWidth)
    setActiveIndex(prev => (prev === index ? prev : index))
  }, [])

  // Mouse wheel: a vertical wheel gesture steps one slide. Horizontal
  // trackpad deltas are left alone — the container scrolls natively.
  useEffect(() => {
    const container = scrollContainerRef.current
    if (selectedIndex === null || !container) return

    const handleWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaY) <= Math.abs(e.deltaX)) return
      e.preventDefault()
      const now = performance.now()
      if (now < wheelLockUntil.current) return
      wheelLockUntil.current = now + 550
      goTo(activeIndex + (e.deltaY > 0 ? 1 : -1))
    }

    container.addEventListener('wheel', handleWheel, { passive: false })
    return () => container.removeEventListener('wheel', handleWheel)
  }, [selectedIndex, activeIndex, goTo])

  const isStack = layout === 'stack'

  const getGridCols = (cols: number) => {
    if (cols === 1) return 'grid-cols-1'
    if (cols === 2) return 'grid-cols-2'
    return 'grid-cols-2 lg:grid-cols-3'
  }

  const navButtonClass =
    'absolute top-1/2 -translate-y-1/2 z-[10006] p-3 rounded-full bg-gray-100/50 dark:bg-gray-800/50 text-primary backdrop-blur-md border border-white/20 transition-all active:scale-95 hover:bg-white dark:hover:bg-gray-700'

  return (
    <div className={showThumbnails ? (isStack ? 'w-full' : 'p-1 md:p-6') : ''}>
      {showThumbnails && (
        <div
          className={
            isStack
              ? 'flex flex-col gap-12'
              : `grid gap-1 md:gap-4 ${getGridCols(perRow)}`
          }
        >
          {images.map((image, index) => (
            <div
              key={index}
              className={`relative w-full overflow-hidden bg-gray-100 dark:bg-gray-800 cursor-zoom-in group transition-shadow duration-500 hover:z-10 ${
                isStack
                  ? 'aspect-[4/3] rounded-3xl'
                  : 'aspect-[4/3] rounded-sm md:rounded-2xl md:hover:shadow-2xl'
              }`}
              onClick={() => {
                setSelectedIndex(index)
                setActiveIndex(index)
                onOpen?.()
              }}
            >
              <Image
                loader={cloudinaryLoader}
                src={image}
                alt={`Gallery image ${index + 1}`}
                fill
                sizes={
                  isStack
                    ? '100vw'
                    : '(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw'
                }
                className='object-cover transition-transform duration-700 group-hover:scale-110 group-hover:brightness-110'
                loading='lazy'
              />
            </div>
          ))}
        </div>
      )}

      {/* Lightbox Modal - horizontal pager */}
      {selectedIndex !== null && (
        <div className='fixed inset-0 z-[10005] bg-white/95 dark:bg-black/95 animate-in fade-in duration-500'>
          {/* Top Pill Navigation */}
          <div className='absolute top-6 left-1/2 -translate-x-1/2 z-[10006] flex items-center gap-3 px-4 py-2 rounded-full bg-gray-100/50 dark:bg-gray-800/50 backdrop-blur-md border border-white/20 text-xs font-bold tracking-widest uppercase text-primary animate-in slide-in-from-top-4 duration-700'>
            <span>{activeIndex + 1}</span>
            <span className='opacity-30'>/</span>
            <span className='opacity-50'>{images.length}</span>
          </div>

          {/* Close Button */}
          <button
            aria-label='Close'
            className='absolute top-6 right-6 p-2 rounded-full bg-gray-100/50 dark:bg-gray-800/50 text-primary z-[10006] hover:bg-white dark:hover:bg-gray-700 transition-all active:scale-95 border border-white/10'
            onClick={close}
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

          {/* Prev / Next Buttons */}
          {images.length > 1 && (
            <>
              <button
                aria-label='Previous photo'
                className={`${navButtonClass} left-4 ${
                  activeIndex === 0
                    ? 'opacity-30 pointer-events-none'
                    : 'opacity-100'
                }`}
                onClick={() => goTo(activeIndex - 1)}
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
                  <path d='M15 18l-6-6 6-6'></path>
                </svg>
              </button>
              <button
                aria-label='Next photo'
                className={`${navButtonClass} right-4 ${
                  activeIndex === images.length - 1
                    ? 'opacity-30 pointer-events-none'
                    : 'opacity-100'
                }`}
                onClick={() => goTo(activeIndex + 1)}
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
                  <path d='M9 18l6-6-6-6'></path>
                </svg>
              </button>
            </>
          )}

          {/* Horizontal Pager */}
          <div
            ref={scrollContainerRef}
            onScroll={handleScroll}
            className='h-dvh w-full flex overflow-x-auto overflow-y-hidden snap-x snap-mandatory overscroll-contain no-scrollbar'
          >
            {images.map((image, index) => {
              // Render real content two slides out in each direction so a
              // fast swipe never lands on a blank; distant slides keep a
              // same-size placeholder so the scroll width never changes.
              const shouldRender = Math.abs(index - activeIndex) <= 2
              const isLoaded = loadedImages[index]

              return (
                <div
                  key={`lightbox-${index}`}
                  id={`lightbox-img-${index}`}
                  className='h-full w-full flex-none flex items-center justify-center snap-start snap-always p-4 md:p-12'
                  onClick={close}
                >
                  <div
                    className='relative w-full h-full max-w-6xl max-h-[85vh] flex items-center justify-center'
                    onClick={e => e.stopPropagation()}
                  >
                    {shouldRender ? (
                      <>
                        {/* Instant low-res preview reusing the cached grid thumbnail */}
                        {!isLoaded && (
                          <Image
                            loader={cloudinaryLoader}
                            src={image}
                            alt=''
                            fill
                            sizes='(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 25vw'
                            className='object-contain blur-sm opacity-60 scale-95 pointer-events-none'
                            priority
                          />
                        )}

                        {/* Spinner indicator while full-res loads */}
                        {!isLoaded && (
                          <div className='absolute inset-0 flex items-center justify-center pointer-events-none'>
                            <div className='w-8 h-8 rounded-full border-2 border-primary/20 border-t-primary animate-spin' />
                          </div>
                        )}

                        {/* Crisp full-resolution image */}
                        <Image
                          loader={cloudinaryLoader}
                          src={image}
                          alt={`Full screen view ${index + 1}`}
                          fill
                          sizes='(max-width: 768px) 100vw, (max-width: 1200px) 1200px, 1600px'
                          className={`object-contain transition-opacity duration-300 ${
                            isLoaded ? 'opacity-100' : 'opacity-0'
                          }`}
                          priority={Math.abs(index - activeIndex) <= 1}
                          onLoad={() =>
                            setLoadedImages(prev => ({
                              ...prev,
                              [index]: true,
                            }))
                          }
                        />
                      </>
                    ) : (
                      /* Lightweight placeholder for distant slides to preserve scroll width */
                      <div className='w-full h-full' />
                    )}
                  </div>
                </div>
              )
            })}
          </div>

          {/* Progress Bar (bottom) */}
          {images.length > 1 && (
            <div className='absolute bottom-6 left-1/2 -translate-x-1/2 w-40 h-1 rounded-full bg-gray-900/10 dark:bg-white/10 overflow-hidden z-[10006]'>
              <div
                className='h-full bg-primary/70 rounded-full transition-all duration-300'
                style={{
                  width: `${((activeIndex + 1) / images.length) * 100}%`,
                }}
              />
            </div>
          )}
        </div>
      )}
    </div>
  )
}
