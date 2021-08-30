import { definitions } from '@/types'
import axios from 'axios'

export const deleteUnit = (unitId: definitions['Unit']['unitId'], token: string): Promise<void> => {
  return unitId && token
    ? axios.delete(`${process.env.NEXT_PUBLIC_API_BASE_URL}/units/${unitId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
    : Promise.reject('token or unitId is missing.')
}
