import { postPatientAnnotation } from '@/requests/postPatientAnnotation'
import axios from 'axios'

jest.mock('axios')

const mockedAxios = axios as jest.Mocked<typeof axios>

describe('request patientAnnotation', () => {
  it('should get valid params', async () => {
    const patientAnnotation = null
    const token = ''
    const errorMessage = 'token or patientAnnotation is missing.'
    const error = postPatientAnnotation(patientAnnotation, token)

    await expect(error).rejects.toEqual(errorMessage)
  })

  it('request should succeed', async () => {
    const token = 'dsf3saf33Haa0df3556'
    const patientAnnotation = {
      id: 32,
      patientId: '3',
      annotator: 'Annotator',
      annotation: 'Annotation',
      createdAt: 1626926202369,
    }
    const response = {
      data: [
        {
          id: 32,
          patientId: '3',
          annotator: 'Annotator',
          annotation: 'Annotation',
          createdAt: 1626926202369,
        },
      ],
    }

    mockedAxios.post.mockImplementationOnce(() => Promise.resolve(response))

    const postResponse = await postPatientAnnotation(patientAnnotation, token)

    expect(postResponse).toEqual(response.data)
    expect(mockedAxios.post).toHaveBeenCalledTimes(1)
    expect(mockedAxios.post).toHaveBeenCalledWith(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/patient-annotations`,
      patientAnnotation,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )
  })
})
