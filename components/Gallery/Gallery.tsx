import React, { useState, useEffect } from 'react'
import Image from 'next/image'

interface GalleryProps {
  images: string[]
  perRow?: number
}

export const Gallery = ({ images, perRow = 1 }: GalleryProps) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null)

  // Handle Escape key to close modal
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSelectedImage(null)
    }
    if (selectedImage) {
      window.addEventListener('keydown', handleEsc)
      document.body.style.overflow = 'hidden'
    }
    return () => {
      window.removeEventListener('keydown', handleEsc)
      document.body.style.overflow = 'unset'
    }
  }, [selectedImage])

  return (
    <div className='p-4 md:p-6'>
      <div
        className='grid gap-4'
        style={{
          gridTemplateColumns: `repeat(${perRow}, minmax(0, 1fr))`,
        }}
      >
        {images.map((image, index) => (
          <div
            key={index}
            className='relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-gray-100 dark:bg-gray-800 cursor-zoom-in group'
            onClick={() => setSelectedImage(image)}
          >
            <Image
              src={image}
              alt={`Gallery image ${index + 1}`}
              fill
              sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
              className='object-cover transition-transform duration-500 group-hover:scale-105 group-hover:brightness-110'
              loading='lazy'
            />
          </div>
        ))}
      </div>

      {/* Lightbox Modal */}
      {selectedImage && (
        <div
          className='fixed inset-0 z-[200] flex items-center justify-center bg-white/90 dark:bg-black/95 backdrop-blur-xl animate-in fade-in duration-300'
          onClick={() => setSelectedImage(null)}
        >
          <button
            className='absolute top-6 right-6 p-2 rounded-full bg-gray-100 dark:bg-gray-800 text-primary z-[210] hover:bg-gray-200 dark:hover:bg-gray-700 transition-all active:scale-95'
            onClick={(e) => {
              e.stopPropagation()
              setSelectedImage(null)
            }}
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

          <div
            className='relative w-full h-full p-4 md:p-12 flex items-center justify-center'
            onClick={(e) => e.stopPropagation()}
          >
            <div className='relative w-full h-full max-w-6xl max-h-[85vh]'>
              <Image
                src={selectedImage}
                alt='Full screen view'
                fill
                className='object-contain'
                priority={true}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
