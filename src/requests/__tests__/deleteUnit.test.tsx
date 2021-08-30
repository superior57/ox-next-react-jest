import { deleteUnit } from '@/requests/deleteUnit'
import axios from 'axios'

jest.mock('axios')

const mockedAxios = axios as jest.Mocked<typeof axios>

describe('request deleteUnit', () => {
  it('request should get valid params', async () => {
    const unitId = ''
    const token = ''
    const errorMessage = 'token or unitId is missing.'
    const error = deleteUnit(unitId, token)

    await expect(error).rejects.toEqual(errorMessage)
  })
  it('request should succeed', async () => {
    const unitId = '1'
    const token = '123'

    mockedAxios.delete.mockImplementationOnce(() => Promise.resolve())

    const deleteResponse = await deleteUnit(unitId, token)

    expect(deleteResponse).toEqual(undefined)
    expect(mockedAxios.delete).toHaveBeenCalledTimes(1)
    expect(mockedAxios.delete).toHaveBeenCalledWith(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/units/${unitId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )
  })
})
