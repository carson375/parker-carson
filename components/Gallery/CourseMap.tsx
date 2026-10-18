import React, { useEffect, useRef } from 'react'

import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

export interface CourseMapProps {
  courseName: string
  cityState: string
  lat: number
  lng: number
  zoom?: number
}

export const CourseMap = ({
  courseName,
  cityState,
  lat,
  lng,
  zoom = 15,
}: CourseMapProps) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<L.Map | null>(null)

  useEffect(() => {
    if (!containerRef.current) return

    // Clean up any existing map instance on this ref
    if (mapRef.current) {
      mapRef.current.remove()
      mapRef.current = null
    }

    const container = containerRef.current
    if ((container as unknown as { _leaflet_id?: number })._leaflet_id) {
      delete (container as unknown as { _leaflet_id?: number })._leaflet_id
    }

    try {
      const map = L.map(container, {
        center: [lat, lng],
        zoom: zoom,
        scrollWheelZoom: false,
        zoomControl: true,
      })
      mapRef.current = map

      // Esri World Street Map tiles - 100% free, crisp, high-resolution, no watermark, no API key required
      L.tileLayer(
        'https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}',
        {
          attribution:
            'Tiles &copy; <a href="https://www.esri.com/">Esri</a> &mdash; Source: Esri, DeLorme, USGS, NPS',
          maxZoom: 18,
        }
      ).addTo(map)

      // Sleek golf pin marker
      const pinIcon = L.divIcon({
        className: 'golf-pin-marker',
        html: `
          <div style="
            width: 36px;
            height: 36px;
            background: #059669;
            border: 3px solid #ffffff;
            border-radius: 50%;
            box-shadow: 0 4px 14px rgba(0,0,0,0.4);
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 16px;
            cursor: pointer;
          ">
            ⛳
          </div>
        `,
        iconSize: [36, 36],
        iconAnchor: [18, 18],
        popupAnchor: [0, -18],
      })

      const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
        `${courseName} ${cityState}`
      )}`

      const marker = L.marker([lat, lng], { icon: pinIcon }).addTo(map)
      marker.bindPopup(`
        <div style="padding: 2px 4px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
          <p style="font-weight: 800; font-size: 13px; color: #111827; margin: 0 0 2px 0; line-height: 1.2;">
            ${courseName}
          </p>
          <p style="font-size: 11px; color: #6b7280; margin: 0 0 6px 0; line-height: 1.2;">
            ${cityState}
          </p>
          <a href="${googleMapsUrl}" target="_blank" rel="noopener noreferrer" style="font-size: 11px; font-weight: 700; color: #059669; text-decoration: none;">
            Open in Google Maps &rarr;
          </a>
        </div>
      `)

      // Open popup automatically
      marker.openPopup()

      // Ensure proper sizing after animation
      const t1 = setTimeout(() => {
        if (mapRef.current) {
          mapRef.current.invalidateSize()
        }
      }, 100)
      const t2 = setTimeout(() => {
        if (mapRef.current) {
          mapRef.current.invalidateSize()
        }
      }, 350)

      return () => {
        clearTimeout(t1)
        clearTimeout(t2)
        if (mapRef.current) {
          mapRef.current.remove()
          mapRef.current = null
        }
      }
    } catch {
      // Ignore map initialization errors during teardown
    }
  }, [lat, lng, zoom, courseName, cityState])

  return (
    <div className='relative w-full h-[280px] md:h-[320px] rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-800 shadow-inner bg-gray-100 dark:bg-gray-800'>
      <div ref={containerRef} className='w-full h-full' />
    </div>
  )
}
