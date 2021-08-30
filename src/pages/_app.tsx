import { KeycloakProvider, useKeycloak } from '@/providers/KeycloakProvider'
import { LinearProgress } from '@dawnlight/ui-web'
import '@dawnlight/ui-web/styles.css'
import createCache from '@emotion/cache'
import { CacheProvider as EmotionProvider } from '@emotion/react'
import { appWithTranslation } from 'next-i18next'
import { AppProps } from 'next/app'
import Head from 'next/head'
import React from 'react'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import 'tailwindcss/tailwind.css'

const key = 'emotion'

const emotionCache = createCache({ key })

interface Cookies {
  [key: string]: string
}

interface InitialProps {
  cookies: Cookies
}

const AuthLoader: React.FC = ({ children }) => {
  const keycloakInstance = useKeycloak()

  return keycloakInstance ? (
    <>{children}</>
  ) : (
    <div className="flex items-center justify-around h-full">
      <LinearProgress />
    </div>
  )
}

function MyApp({ Component, pageProps }: AppProps & InitialProps): JSX.Element {
  return (
    <>
      <Head>
        <meta name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="preload" href="/fonts/DINPro-Regular.otf" as="font" crossOrigin="" />
      </Head>
      <KeycloakProvider>
        <AuthLoader>
          <EmotionProvider value={emotionCache}>
            <Component {...pageProps} />
            <ToastContainer
              position="top-right"
              autoClose={8000}
              hideProgressBar={false}
              newestOnTop={false}
              draggable={false}
              closeOnClick
              pauseOnHover
            />
          </EmotionProvider>
        </AuthLoader>
      </KeycloakProvider>
    </>
  )
}

export default appWithTranslation(MyApp)
