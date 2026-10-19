import React, { useMemo } from 'react'

import L from 'leaflet'
import Image from 'next/image'
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet'

import 'leaflet/dist/leaflet.css'
import { cloudinaryLoader } from 'lib/cloudinary'

export interface TripLocation {
  name: string
  lat: number
  lng: number
  description?: string
  photos?: string[]
}

interface TripMapProps {
  locations: TripLocation[]
  route?: [number, number][]
  onPhotoClick?: (photo: string) => void
}

export const TripMap = ({ locations, route, onPhotoClick }: TripMapProps) => {
  // Leaflet icons are only available in the browser
  const createPinIcon = useMemo(() => {
    if (typeof window === 'undefined') return () => undefined
    return (photoCount: number = 0) =>
      L.divIcon({
        className: 'trip-map-pin',
        html: `
          <div style="position: relative; width: 34px; height: 34px; display: flex; align-items: center; justify-content: center;">
            <div style="
              width: 30px;
              height: 30px;
              background: #2563eb;
              border: 2.5px solid #ffffff;
              border-radius: 50%;
              box-shadow: 0 4px 12px rgba(0,0,0,0.35);
              display: flex;
              align-items: center;
              justify-content: center;
              color: white;
              font-size: 14px;
              cursor: pointer;
              transition: transform 0.2s ease;
            ">
              ${photoCount > 0 ? '📷' : '📍'}
            </div>
            ${
              photoCount > 0
                ? `<div style="
                    position: absolute;
                    top: -4px;
                    right: -4px;
                    background: #ef4444;
                    color: white;
                    font-size: 10px;
                    font-weight: 800;
                    min-width: 17px;
                    height: 17px;
                    padding: 0 4px;
                    border-radius: 9999px;
                    border: 1.5px solid white;
                    box-shadow: 0 2px 5px rgba(0,0,0,0.3);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    line-height: 1;
                  ">${photoCount}</div>`
                : ''
            }
          </div>
        `,
        iconSize: [34, 34],
        iconAnchor: [17, 17],
        popupAnchor: [0, -18],
      })
  }, [])

  if (typeof window === 'undefined') return null

  // Calculate bounds to fit all markers and route points
  const points: [number, number][] = [
    ...locations.map(loc => [loc.lat, loc.lng] as [number, number]),
    ...(route || []),
  ]
  const bounds =
    points.length > 0
      ? L.latLngBounds(points)
      : L.latLngBounds([[37.2982, -113.0263]]) // Default to Zion if no points

  return (
    <div className='w-full h-[450px] rounded-[24px] overflow-hidden border border-gray-100 dark:border-gray-800 shadow-sm'>
      <MapContainer
        bounds={bounds}
        boundsOptions={{ padding: [50, 50] }}
        style={{ height: '100%', width: '100%' }}
        scrollWheelZoom={false}
        keyboard={false}
      >
        {/* Esri World Street Map - No API key required, high quality */}
        <TileLayer
          attribution='Tiles &copy; <a href="https://www.esri.com/">Esri</a> &mdash; Source: Esri, DeLorme, USGS, NPS'
          url='https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}'
          maxZoom={18}
        />

        {route && route.length > 0 && (
          <Polyline
            positions={route}
            pathOptions={{
              color: '#3b82f6',
              weight: 4,
              opacity: 0.7,
              dashArray: '5, 10',
            }}
          />
        )}

        {locations.map((loc, index) => {
          const photoCount = loc.photos?.length || 0
          const icon = createPinIcon(photoCount)

          return (
            <Marker key={index} position={[loc.lat, loc.lng]} icon={icon}>
              <Popup minWidth={220} maxWidth={320}>
                <div className='p-1'>
                  <h4 className='font-black text-gray-950 text-sm mb-0.5 leading-snug'>
                    {loc.name}
                  </h4>
                  {loc.description && (
                    <p className='text-xs text-gray-600 leading-snug mb-2'>
                      {loc.description}
                    </p>
                  )}

                  {loc.photos && loc.photos.length > 0 && (
                    <div className='mt-2.5 pt-2 border-t border-gray-100'>
                      <div className='flex items-center justify-between mb-1.5'>
                        <span className='text-[10px] font-bold uppercase tracking-wider text-gray-400'>
                          {loc.photos.length}{' '}
                          {loc.photos.length === 1 ? 'Photo' : 'Photos'}
                        </span>
                        <span className='text-[10px] text-blue-600 font-bold'>
                          Click photo to view &rarr;
                        </span>
                      </div>
                      <div className='flex gap-2 overflow-x-auto pb-1.5 pt-0.5'>
                        {loc.photos.map((photo, pIdx) => (
                          <button
                            key={pIdx}
                            type='button'
                            onClick={e => {
                              e.stopPropagation()
                              onPhotoClick?.(photo)
                            }}
                            className='relative w-16 h-16 shrink-0 rounded-lg overflow-hidden border border-gray-200 hover:border-blue-500 hover:ring-2 hover:ring-blue-400/50 transition-all shadow-sm group bg-gray-100 cursor-pointer'
                            title='View full size'
                          >
                            <Image
                              loader={cloudinaryLoader}
                              src={photo}
                              alt={`${loc.name} photo ${pIdx + 1}`}
                              fill
                              sizes='64px'
                              className='object-cover group-hover:scale-110 transition-transform duration-300'
                            />
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </Popup>
            </Marker>
          )
        })}
      </MapContainer>
    </div>
  )
}
