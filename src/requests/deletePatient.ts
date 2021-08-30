import { definitions } from '@/types'
import axios from 'axios'

export const deletePatient = async (
  patientId: definitions['Patient']['patientId'],
  token: string
): Promise<void> => {
  return patientId && token
    ? await axios.delete(`${process.env.NEXT_PUBLIC_API_BASE_URL}/patients/${patientId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
    : Promise.reject('token or patientId is missing.')
}
