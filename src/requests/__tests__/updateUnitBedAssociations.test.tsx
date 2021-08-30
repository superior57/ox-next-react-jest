import { updateUnitBedAssociations } from '@/requests/updateUnitBedAssociations'
import { operations } from '@/types'
import axios from 'axios'

jest.mock('axios')

const mockedAxios = axios as jest.Mocked<typeof axios>

describe('request updateUnitBedAssociations', () => {
  it('should get valid params', () => {
    const unitId = ''
    const token = ''
    const bedIds = []
    const errorMessage = 'token, bedIds, or unitId is missing.'
    const error = updateUnitBedAssociations(unitId, bedIds, token)

    expect(error).rejects.toEqual(errorMessage)
  })
  it('should return updated unitId and bedId', async () => {
    const unitId = '1'
    const token = '1233hdJ7f'
    const bedIds = ['1', '2']
    const response = [
      {
        id: 1,
        unitId: '1',
        bedId: '1',
      },
      {
        id: 2,
        unitId: '1',
        bedId: '2',
      },
    ]

    type Response = operations['updateUnitBedAssociations']['responses']['200']['schema']

    mockedAxios.put.mockImplementationOnce((): Promise<Response> => Promise.resolve(response))

    const updateResponse = await updateUnitBedAssociations(unitId, bedIds, token)

    expect(updateResponse).toEqual(response)
    expect(mockedAxios.put).toHaveBeenCalledTimes(1)
    expect(mockedAxios.put).toHaveBeenCalledWith(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/unit-bed-associations/${unitId}`,
      bedIds,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )
  })
})
