import { useEffect } from 'react'

// Registers /sw.js in production only, so the dev server (design
// iteration, HMR) is never fighting a cache. Failure is non-fatal:
// the site works exactly as before without the worker.
export default function ServiceWorkerRegister() {
  useEffect(() => {
    if (process.env.NODE_ENV !== 'production') return
    if (!('serviceWorker' in navigator) || !window.isSecureContext) return

    navigator.serviceWorker.register('/sw.js').catch(() => {
      // Non-fatal — standalone install still works via the manifest.
    })
  }, [])

  return null
}
