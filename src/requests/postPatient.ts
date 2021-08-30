import { definitions, operations } from '@/types'
import axios from 'axios'

type Response = operations['createPatient']['responses']['200']['schema']

export const postPatient = async (
  patientInfo: definitions['Patient'],
  token: string
): Promise<Response> => {
  if (token && patientInfo) {
    const res = await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/patients`, patientInfo, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    return res.data
  }

  return Promise.reject('token or patientInfo is missing.')
}
