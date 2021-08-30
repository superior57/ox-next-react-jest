import { definitions, operations } from '@/types'
import axios from 'axios'

type Response = operations['createUnit']['responses']['200']['schema']

export const postUnit = async (
  name: definitions['Unit']['name'],
  token: string
): Promise<Response> => {
  if (name && token) {
    const res = await axios.post(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/units`,
      {
        name,
        customerAccountId: process.env.NEXT_PUBLIC_CUSTOMER_ACCOUNT_ID,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )
    return res.data
  }

  return Promise.reject('token or name is missing.')
}
