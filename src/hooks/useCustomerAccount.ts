import useSWR from 'swr'
import { definitions, DataFetcher } from '@/types'
import { fetchWithToken } from '@/lib/fetchWithToken'

export const useCustomerAccount = (token: string): DataFetcher<definitions['CustomerAccount']> => {
  const { data, error } = useSWR<definitions['CustomerAccount']>(
    () =>
      token
        ? [
            `${process.env.NEXT_PUBLIC_API_BASE_URL}/customer-accounts/${process.env.NEXT_PUBLIC_CUSTOMER_ACCOUNT_ID}`,
            token,
          ]
        : null,
    fetchWithToken
  )

  return {
    data,
    isLoading: !error && !data,
    isError: error,
  }
}
