import useSWR from 'swr'
import { definitions, DataFetcher } from '@/types'
import { fetchWithToken } from '@/lib/fetchWithToken'

export const useBeds = (
  floorId: definitions['Asset']['assetId'],
  availableOnly: boolean,
  token: string
): DataFetcher<definitions['ArrayOfBeds']> => {
  const { data, error } = useSWR<definitions['ArrayOfBeds']>(
    () =>
      floorId && token
        ? [
            `${process.env.NEXT_PUBLIC_API_BASE_URL}/beds?asset-id=${floorId}&available-only=${availableOnly}`,
            token,
          ]
        : null,
    fetchWithToken
  )
  return {
    data: data || [],
    isLoading: !error && !data,
    isError: error,
  }
}
