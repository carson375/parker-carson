import React, { useMemo } from 'react'
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

interface Location {
  name: string
  lat: number
  lng: number
  description?: string
}

interface TripMapProps {
  locations: Location[]
  route?: [number, number][]
}

export const TripMap = ({ locations, route }: TripMapProps) => {
  // Leaflet icons are only available in the browser
  const icon = useMemo(() => {
    if (typeof window === 'undefined') return null
    return L.icon({
      iconUrl:
        'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
      shadowUrl:
        'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
    })
  }, [])

  if (typeof window === 'undefined' || !icon) return null

  // Calculate bounds to fit all markers and route points
  const points: [number, number][] = [
    ...locations.map(loc => [loc.lat, loc.lng] as [number, number]),
    ...(route || []),
  ]
  const bounds = points.length > 0 
    ? L.latLngBounds(points)
    : L.latLngBounds([[37.2982, -113.0263]]) // Default to Zion if no points

  return (
    <div className='w-full h-[450px] rounded-[24px] overflow-hidden border border-gray-100 dark:border-gray-800'>
      <MapContainer
        bounds={bounds}
        style={{ height: '100%', width: '100%' }}
        scrollWheelZoom={false}
        keyboard={false}
      >
        {/* CartoDB Positron (Light/Silver Theme) */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          url='https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png'
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

        {locations.map((loc, index) => (
          <Marker key={index} position={[loc.lat, loc.lng]} icon={icon}>
            <Popup>
              <div className='p-1 min-w-[150px]'>
                <h4 className='font-bold text-gray-900 mb-0.5 m-0 leading-tight'>
                  {loc.name}
                </h4>
                {loc.description && (
                  <p className='text-xs text-gray-600 leading-tight m-0 mt-1'>
                    {loc.description}
                  </p>
                )}
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  )
}
