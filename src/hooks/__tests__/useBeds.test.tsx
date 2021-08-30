import { useBeds } from '@/hooks/useBeds'

jest.mock('@/hooks/useBeds')

const mockUseBeds = useBeds as jest.MockedFunction<typeof useBeds>

describe('useBeds hook', () => {
  it('should return an array of beds', () => {
    const floorId = '1'
    const token = '123'
    const availableOnly = true
    const mockData = [
      {
        id: 1,
        bedId: '1',
        bedName: 'bed1',
        room: {
          assetId: '1',
          assetName: 'asset1',
          assetType: 'assetType1',
          deviceCount: 2,
          children: [],
          devices: [],
        },
        patient: {
          id: 1,
          patientId: '1',
          firstName: 'firstName',
          lastName: 'lastName',
          sex: 'male',
          age: 19,
          dateOfBirth: '1987/09/10',
          phoneNumber: '123456',
          customerAccountId: 1,
          unitId: '1',
          roomId: '1',
          bedId: '1',
        },
      },
    ]

    mockUseBeds.mockReturnValue({
      data: mockData,
      isLoading: false,
      isError: false,
    })

    const fetchData = useBeds(floorId, availableOnly, token)

    expect(typeof floorId).toEqual('string')
    expect(mockUseBeds).toBeCalledTimes(1)
    expect(mockUseBeds).toBeCalledWith(floorId, availableOnly, token)
    expect(fetchData.data).toBeInstanceOf(Array)
    expect(typeof fetchData.data[0].id).toEqual('number')
  })
})
