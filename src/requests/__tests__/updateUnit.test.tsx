import { updateUnit } from '@/requests/updateUnit'
import axios from 'axios'

jest.mock('axios')

const mockedAxios = axios as jest.Mocked<typeof axios>

describe('request updateUnit', () => {
  it('should get valid params', async () => {
    const unitId = ''
    const unit = null
    const token = ''
    const errorMessage = 'token, unitId, or unit is missing.'
    const error = updateUnit(unitId, unit, token)

    await expect(error).rejects.toEqual(errorMessage)
  })

  it('should return updated unitId and bedId', async () => {
    const unitId = '33'
    const unit = {
      id: 2,
      unitId: '33',
      name: 'Test',
      description: 'Description',
      customerAccountId: 33,
      summary: {
        roomsTotal: 3,
        bedsTotal: 5,
        devicesTotal: 1,
        devicesOnline: 1,
      },
      details: {
        beds: [{ id: 2, bedId: '4', bedName: 'test' }],
      },
    }

    const token = 'dsf3saf33Haa0df3556'
    const response = {
      data: [
        {
          id: 2,
          unitId: '100',
          name: 'Test',
          description: 'Description',
          customerAccountId: 33,
          summary: {
            roomsTotal: 3,
            bedsTotal: 5,
            devicesTotal: 1,
            devicesOnline: 1,
          },
          details: {
            beds: [{ id: 2, bedId: '4', bedName: 'test' }],
          },
        },
      ],
    }

    mockedAxios.put.mockImplementationOnce(() => Promise.resolve(response))

    const updateResponse = await updateUnit(unitId, unit, token)

    expect(updateResponse).toEqual(response.data)
    expect(mockedAxios.put).toHaveBeenCalledTimes(1)
    expect(mockedAxios.put).toHaveBeenCalledWith(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/units/${unitId}`,
      unit,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )
  })
})
