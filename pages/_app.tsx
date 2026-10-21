import type { AppProps } from 'next/app'
import { ThemeProvider } from 'next-themes'

import 'leaflet/dist/leaflet.css'
import 'styles/globals.css'
import DevCommentOverlay from 'components/DevCommentOverlay'

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider attribute='class' disableTransitionOnChange>
      <Component {...pageProps} />
      {process.env.NODE_ENV === 'development' && <DevCommentOverlay />}
    </ThemeProvider>
  )
}

export default MyApp
