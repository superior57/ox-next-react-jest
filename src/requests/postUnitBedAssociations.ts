import { definitions, operations } from '@/types'
import axios from 'axios'

type Response = operations['createUnitBedAssociations']['responses']['200']['schema']

export const postUnitBedAssociations = (
  associations: definitions['ArrayOfUnitBedAssociations'],
  token: string
): Promise<Response> => {
  if (associations && token) {
    return axios.post(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/unit-bed-associations`,
      associations,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )
  }

  return Promise.reject('token or associations is missing.')
}
