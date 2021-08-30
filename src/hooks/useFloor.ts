import useSWR from 'swr'
import { definitions, DataFetcher } from '@/types'
import { fetchWithToken } from '@/lib/fetchWithToken'

export const useFloor = (
  floorId: definitions['Asset']['assetId'],
  token: string
): DataFetcher<definitions['Asset']> => {
  const { data, error } = useSWR<definitions['Asset']>(
    () =>
      floorId && token
        ? [`${process.env.NEXT_PUBLIC_API_BASE_URL}/assets/floor/${floorId}`, token]
        : null,
    fetchWithToken
  )
  return {
    data,
    isLoading: !error && !data,
    isError: error,
  }
}
