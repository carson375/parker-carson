import type { AppProps } from 'next/app'
import { ThemeProvider } from 'next-themes'

import 'leaflet/dist/leaflet.css'
import 'styles/globals.css'

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider attribute='class' disableTransitionOnChange>
      <Component {...pageProps} />
    </ThemeProvider>
  )
}

export default MyApp
