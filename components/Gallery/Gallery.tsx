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
      }
    }
  }, [selectedIndex])

  const isStack = layout === 'stack'

  return (
    <div className={isStack ? 'w-full' : 'p-4 md:p-6'}>
      <div
        className={isStack ? 'flex flex-col gap-12' : 'grid gap-4'}
        style={
          !isStack
            ? {
                gridTemplateColumns: `repeat(${perRow}, minmax(0, 1fr))`,
              }
            : {}
        }
      >
        {images.map((image, index) => (
          <div
            key={index}
            className={`relative w-full overflow-hidden bg-gray-100 dark:bg-gray-800 cursor-zoom-in group ${
              isStack ? 'aspect-[4/3] rounded-3xl' : 'aspect-[4/3] rounded-2xl'
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
                  : '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
              }
              className='object-cover transition-transform duration-500 group-hover:scale-105 group-hover:brightness-110'
              loading='lazy'
            />
          </div>
        ))}
      </div>

      {/* Lightbox Modal - Scroll Snap Version */}
      {selectedIndex !== null && (
        <div className='fixed inset-0 z-[200] bg-white/90 dark:bg-black/90 backdrop-blur-xl animate-in fade-in duration-300'>
          {/* Close Button */}
          <button
            className='absolute top-6 right-6 p-2 rounded-full bg-gray-100/80 dark:bg-gray-800/80 text-primary z-[210] hover:bg-gray-200 dark:hover:bg-gray-700 transition-all active:scale-95'
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

          {/* Scrollable Container */}
          <div
            ref={scrollContainerRef}
            className='h-screen w-full overflow-y-scroll snap-y snap-mandatory scroll-smooth overscroll-contain'
          >
            {images.map((image, index) => (
              <div
                key={`lightbox-${index}`}
                id={`lightbox-img-${index}`}
                className='h-screen w-full flex-none flex items-center justify-center snap-start snap-always p-4 md:p-16'
                onClick={() => setSelectedIndex(null)}
              >
                <div
                  className='relative w-full h-full max-w-6xl max-h-[85vh] flex items-center justify-center'
                  onClick={e => e.stopPropagation()}
                >
                  <Image
                    src={image}
                    alt={`Full screen view ${index + 1}`}
                    fill
                    className='object-contain'
                    priority={Math.abs(index - selectedIndex) <= 1}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Scroll Hint */}
          {images.length > 1 && (
            <div className='absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-secondary pointer-events-none opacity-50'>
              <span className='text-xs font-bold uppercase tracking-widest'>
                Scroll
              </span>
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