import { definitions, operations } from '@/types'
import axios from 'axios'

type Response = operations['updateUnit']['responses']['200']['schema']

export const updateUnit = async (
  unitId: definitions['Unit']['unitId'],
  unit: definitions['Unit'],
  token: string
): Promise<Response> => {
  if (unitId && unit && token) {
    const res = await axios.put(`${process.env.NEXT_PUBLIC_API_BASE_URL}/units/${unitId}`, unit, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    return res.data
  }

  return Promise.reject('token, unitId, or unit is missing.')
}
