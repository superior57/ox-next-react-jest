import { postPatient } from '@/requests/postPatient'
import axios from 'axios'

const patient = {
  id: 1,
  patientId: '33',
  firstName: 'Test',
  lastName: 'Test LN',
  dateOfBirth: '1900-03-27',
  sex: 'Male',
  unitId: '23444',
  bedId: '2443566',
  roomId: '86633',
  healthSummary: {
    primaryDoctor: 'Lincoln',
    primaryNurse: 'Paulo',
  },
  tags: [
    {
      key: 'fall_risk',
      value: 'Medium',
    },
    {
      key: 'alert_sensitivity',
      value: 'BED_EXIT',
    },
  ],
}

jest.mock('axios')

const mockedAxios = axios as jest.Mocked<typeof axios>

describe('request postPatient', () => {
  it('request should get valid params', async () => {
    const token = ''
    const patientInfo = patient
    const errorMessage = 'token or patientInfo is missing.'
    const error = postPatient(patientInfo, token)

    await expect(error).rejects.toEqual(errorMessage)
  })

  it('request should succeed', async () => {
    const token = '7373g3j1llLs4'
    const patientInfo = patient
    const response = { data: [{ patient }] }

    mockedAxios.post.mockImplementationOnce(() => Promise.resolve(response))

    const postResponse = await postPatient(patientInfo, token)

    expect(postResponse).toEqual(response.data)
    expect(mockedAxios.post).toHaveBeenCalledTimes(1)
    expect(mockedAxios.post).toHaveBeenCalledWith(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/patients`,
      patientInfo,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )
  })
})
