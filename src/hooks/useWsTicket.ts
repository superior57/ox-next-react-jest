import { definitions, DataFetcher } from '@/types'
import { fetchWithToken } from '@/lib/fetchWithToken'
import { useEffect, useState } from 'react'

// Note: we don't use swr here because the ticket is not supposed to be cached
export const useWsTicket = (token: string): DataFetcher<string> => {
  const [isLoading, setIsLoading] = useState(false)
  const [isError, setIsError] = useState(false)
  const [data, setData] = useState<string>()

  useEffect(() => {
    if (!token) {
      setIsError(true)
      return
    }

    const fetchTicket = async (): Promise<void> => {
      setIsError(false)
      setIsLoading(true)

      try {
        const res = await fetchWithToken<definitions['WsTicket']>(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/ws-ticket`,
          token
        )
        setData(res.value)
      } catch (error) {
        setIsError(true)
      }

      setIsLoading(false)
    }

    fetchTicket()
  }, [token])

  return {
    data,
    isLoading,
    isError,
  }
}
