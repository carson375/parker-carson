import React, { useState, useEffect, useRef } from 'react'

import Image from 'next/image'

interface GalleryProps {
  images: string[]
  perRow?: number
  layout?: 'grid' | 'stack'
}

export const Gallery = ({
  images,
  perRow = 1,
  layout = 'grid',
}: GalleryProps) => {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)
  const [activeIndex, setActiveIndex] = useState<number>(0)
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  // Handle Keyboard Navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedIndex === null) return
      if (e.key === 'Escape') setSelectedIndex(null)
    }
    if (selectedIndex !== null) {
      window.addEventListener('keydown', handleKeyDown)
      document.body.style.overflow = 'hidden'
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = 'unset'
    }
  }, [selectedIndex])

  // Scroll to the selected image when the lightbox opens
  useEffect(() => {
    if (selectedIndex !== null && scrollContainerRef.current) {
      const element = document.getElementById(`lightbox-img-${selectedIndex}`)
      if (element) {
        element.scrollIntoView({ behavior: 'auto' })
        setActiveIndex(selectedIndex)
      }
    }
  }, [selectedIndex])

  // Track active index during scroll
  useEffect(() => {
    if (selectedIndex === null || !scrollContainerRef.current) return

    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const index = parseInt(entry.target.id.split('-').pop() || '0')
            setActiveIndex(index)
          }
        })
      },
      {
        root: scrollContainerRef.current,
        threshold: 0.6, // Trigger when 60% of the image is visible
      }
    )

    const childElements = scrollContainerRef.current.children
    Array.from(childElements).forEach(child => observer.observe(child))

    return () => observer.disconnect()
  }, [selectedIndex, images.length])

  const isStack = layout === 'stack'

  const getGridCols = (cols: number) => {
    if (cols === 1) return 'grid-cols-1'
    if (cols === 2) return 'grid-cols-2'
    return 'grid-cols-2 lg:grid-cols-3'
  }

  return (
    <div className={isStack ? 'w-full' : 'p-1 md:p-6'}>
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
            className={`relative w-full overflow-hidden bg-gray-100 dark:bg-gray-800 cursor-zoom-in group transition-all duration-500 hover:z-10 ${
              isStack
                ? 'aspect-[4/3] rounded-3xl'
                : 'aspect-[4/3] rounded-sm md:rounded-2xl md:hover:scale-[1.02] md:hover:shadow-2xl'
            }`}
            onClick={() => setSelectedIndex(index)}
          >
            <Image
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

      {/* Lightbox Modal - Cinema & Scrubber Version */}
      {selectedIndex !== null && (
        <div className='fixed inset-0 z-[200] bg-white/80 dark:bg-black/60 backdrop-blur-3xl animate-in fade-in duration-500'>
          {/* Top Pill Navigation */}
          <div className='absolute top-6 left-1/2 -translate-x-1/2 z-[210] flex items-center gap-3 px-4 py-2 rounded-full bg-gray-100/50 dark:bg-gray-800/50 backdrop-blur-md border border-white/20 text-xs font-bold tracking-widest uppercase text-primary animate-in slide-in-from-top-4 duration-700'>
            <span>{activeIndex + 1}</span>
            <span className='opacity-30'>/</span>
            <span className='opacity-50'>{images.length}</span>
          </div>

          {/* Close Button */}
          <button
            className='absolute top-6 right-6 p-2 rounded-full bg-gray-100/50 dark:bg-gray-800/50 text-primary z-[210] hover:bg-white dark:hover:bg-gray-700 transition-all active:scale-95 border border-white/10'
            onClick={() => setSelectedIndex(null)}
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

          {/* Scrubber Progress Bar (Left Side) - Brighter & More Obvious */}
          {images.length > 1 && (
            <div className='absolute left-4 top-1/2 -translate-y-1/2 h-64 w-1.5 bg-white/10 dark:bg-white/5 rounded-full z-[210] hidden md:block overflow-hidden border border-white/10'>
              <div
                className='w-full bg-white shadow-[0_0_15px_rgba(255,255,255,0.5)] transition-all duration-300 rounded-full'
                style={{
                  height: `${((activeIndex + 1) / images.length) * 100}%`,
                }}
              />
            </div>
          )}

          {/* Scrollable Container */}
          <div
            ref={scrollContainerRef}
            className='h-screen w-full overflow-y-scroll snap-y snap-mandatory scroll-smooth overscroll-contain no-scrollbar'
          >
            {images.map((image, index) => (
              <div
                key={`lightbox-${index}`}
                id={`lightbox-img-${index}`}
                className='h-screen w-full flex-none flex items-center justify-center snap-start snap-always p-4 md:p-12'
                onClick={() => setSelectedIndex(null)}
              >
                <div
                  className={`relative w-full h-full max-w-6xl max-h-[85vh] flex items-center justify-center transition-all duration-700 ${
                    images.length === 1 || activeIndex === index
                      ? 'scale-100 opacity-100 blur-0'
                      : 'scale-95 opacity-20 blur-sm'
                  }`}
                  onClick={e => e.stopPropagation()}
                >
                  <Image
                    src={image}
                    alt={`Full screen view ${index + 1}`}
                    fill
                    className='object-contain'
                    priority={Math.abs(index - activeIndex) <= 1}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Mobile Scroll Hint */}
          {images.length > 1 && activeIndex === 0 && (
            <div className='absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-secondary pointer-events-none opacity-40 md:hidden animate-in fade-in slide-in-from-bottom-4 duration-1000'>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                width='24'
                height='24'
                viewBox='0 0 24 24'
                fill='none'
                stroke='currentColor'
                strokeWidth='2'
                strokeLinecap='round'
                strokeLinejoin='round'
                className='animate-bounce'
              >
                <path d='M7 13l5 5 5-5M7 6l5 5 5-5'></path>
              </svg>
            </div>
          )}
        </div>
      )}
    </div>
  )
}