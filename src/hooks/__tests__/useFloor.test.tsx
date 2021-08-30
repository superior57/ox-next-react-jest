import { useFloor } from '@/hooks/useFloor'

jest.mock('@/hooks/useFloor')

const mockUseFloor = useFloor as jest.MockedFunction<typeof useFloor>

describe('useFloor hook', () => {
  it('should return a floor', () => {
    const floorId = '322'
    const token = '19Gd2g332d'
    const mockData = {
      assetId: '42',
      assetName: 'assetName',
      assetType: 'assetType',
      deviceCount: 3,
      parent: {},
      children: [],
      devices: [],
    }

    mockUseFloor.mockReturnValue({
      data: mockData,
      isLoading: false,
      isError: false,
    })

    const fetchData = useFloor(floorId, token)

    expect(mockUseFloor).toBeCalledTimes(1)
    expect(mockUseFloor).toBeCalledWith(floorId, token)
    expect(fetchData.data).toBeInstanceOf(Object)
    expect(typeof fetchData.data.assetId).toEqual('string')
  })
})
