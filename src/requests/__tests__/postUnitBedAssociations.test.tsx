import { postUnitBedAssociations } from '@/requests/postUnitBedAssociations'
import axios from 'axios'

jest.mock('axios')

const mockedAxios = axios as jest.Mocked<typeof axios>

describe('request postUnitBedAssociations', () => {
  it('should get valid params', async () => {
    const associations = null
    const token = ''
    const errorMessage = 'token or associations is missing.'
    const error = postUnitBedAssociations(associations, token)

    await expect(error).rejects.toEqual(errorMessage)
  })

  it('request should succeed', async () => {
    const token = 'dsf3saf33Haa0df3556'
    const associations = [{ id: 3, bedId: '41', unitId: '55' }]
    const response = {
      data: [{ id: 3, bedId: '41', unitId: '55' }],
    }

    mockedAxios.post.mockImplementationOnce(() => Promise.resolve(response))

    const postResponse = await postUnitBedAssociations(associations, token)

    expect(postResponse).toEqual(response)
    expect(mockedAxios.post).toHaveBeenCalledTimes(1)
    expect(mockedAxios.post).toHaveBeenCalledWith(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/unit-bed-associations`,
      associations,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )
  })
})
