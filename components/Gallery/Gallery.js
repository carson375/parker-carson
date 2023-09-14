import React from 'react'
import Image from 'next/image'
import Imgix from 'react-imgix'
import Bridge from '../../public/photography/Bridge.JPG'

const images = [
  '/photography/Bridge.JPG',
  '/photography/ASundayAfternoonInParis.JPG',
  '/photography/Eiffel.JPG',
  '/photography/Eiffel2.JPG',
  '/photography/LuxemborgGardens.JPG',
  '/photography/LuxemborgGardens.JPG',
  '/photography/LuxGardens2.JPG',
  '/photography/LuxGardensBuilding.JPG',
  '/photography/LuxGardensBuilding2.JPG',
  '/photography/LuxGardensEiffel.JPG',
  '/photography/LuxGardensStatue.JPG',
  '/photography/NotreDame.JPG',
  '/photography/NotreDame2.JPG',
  '/photography/NotreDameSide.JPG',
  '/photography/Pantheon.JPG',
  '/photography/PantheonClose.JPG',
  '/photography/ParisBuilding.JPG',
  '/photography/Street.JPG',
]

export const Gallery = () => (
  <div className='gallery'>
    {images.map(image => (
      <Image
        alt='Next.js Conf photo'
        className='transform rounded-lg brightness-90 transition will-change-auto group-hover:brightness-110'
        style={{ transform: 'translate3d(0, 0, 0)' }}
        src={image}
        width={720}
        height={480}
        sizes='(max-width: 640px) 100vw,
        (max-width: 1280px) 50vw,
        (max-width: 1536px) 33vw,
        25vw'
      />
    ))}
  </div>
)
