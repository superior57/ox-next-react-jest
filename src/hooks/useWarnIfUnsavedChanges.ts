import { useEffect } from 'react'
import Router from 'next/router'

// https://github.com/vercel/next.js/issues/2476#issuecomment-563190607
export const useWarnIfUnsavedChanges = (unsavedChanges: boolean, message: string): void => {
  useEffect(() => {
    const routeChangeStart = (url: string): void => {
      if (Router.asPath !== url && unsavedChanges && !confirm(message)) {
        Router.events.emit('routeChangeError')
        Router.replace(Router, Router.asPath)
        throw 'Abort route change. Please ignore this error.'
      }
    }

    const beforeunload = (e): string => {
      if (unsavedChanges) {
        e.preventDefault()
        e.returnValue = message
        return message
      }
    }

    window.addEventListener('beforeunload', beforeunload)
    Router.events.on('routeChangeStart', routeChangeStart)

    return () => {
      window.removeEventListener('beforeunload', beforeunload)
      Router.events.off('routeChangeStart', routeChangeStart)
    }
  }, [unsavedChanges, message])
}
