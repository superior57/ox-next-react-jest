import { definitions, operations } from '@/types'
import axios from 'axios'

type Response = operations['createPatientAnnotation']['responses']['200']['schema']
export const postPatientAnnotation = async (
  patientAnnotation: definitions['PatientAnnotation'],
  token: string
): Promise<Response> => {
  if (token && patientAnnotation) {
    const res = await axios.post(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/patient-annotations`,
      patientAnnotation,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )
    return res.data
  }

  return Promise.reject('token or patientAnnotation is missing.')
}
