import type { AppProps } from 'next/app'
import { ThemeProvider } from 'next-themes'

import 'leaflet/dist/leaflet.css'
import 'styles/globals.css'
import DevCommentOverlay from 'components/DevCommentOverlay'
import ServiceWorkerRegister from 'components/ServiceWorkerRegister'

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider attribute='class' disableTransitionOnChange>
      <ServiceWorkerRegister />
      <Component {...pageProps} />
      {process.env.NODE_ENV === 'development' && <DevCommentOverlay />}
    </ThemeProvider>
  )
}

export default MyApp
