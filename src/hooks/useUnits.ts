import useSWR, { mutate } from 'swr'
import { definitions, DataFetcher } from '@/types'
import { fetchWithToken } from '@/lib/fetchWithToken'

const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/units?customer-account-id=${process.env.NEXT_PUBLIC_CUSTOMER_ACCOUNT_ID}`

export const useUnits = (token: string): DataFetcher<definitions['ArrayOfUnits']> => {
  const { data, error } = useSWR<definitions['ArrayOfUnits']>(
    () => (token ? [url, token] : null),
    fetchWithToken
  )
  return {
    data: data || [],
    isLoading: !error && !data,
    isError: error,
  }
}

export type NewUnitsFunction = (cached: definitions['ArrayOfUnits']) => definitions['ArrayOfUnits']

export const mutateLocalUnits = (
  newUnits: definitions['ArrayOfUnits'] | NewUnitsFunction,
  token: string
): void => {
  mutate([url, token], newUnits, false)
}

export const revalidateUnits = (token: string): Promise<void> => mutate([url, token])
