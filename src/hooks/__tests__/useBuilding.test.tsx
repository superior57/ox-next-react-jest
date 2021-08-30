import { useBuilding } from '@/hooks/useBuilding'

jest.mock('@/hooks/useBuilding')

const mockUseBuilding = useBuilding as jest.MockedFunction<typeof useBuilding>

describe('useBuilding hook', () => {
  it('should return a building', () => {
    const token = '19Gd2g3!32d'
    const buildingId = '333'
    const mockData = {
      assetId: '42',
      assetName: 'assetName',
      assetType: 'assetType',
      deviceCount: 3,
      parent: {},
      children: [],
      devices: [],
    }

    mockUseBuilding.mockReturnValue({
      data: mockData,
      isLoading: false,
      isError: false,
    })

    const fetchData = useBuilding(buildingId, token)

    expect(mockUseBuilding).toBeCalledTimes(1)
    expect(mockUseBuilding).toBeCalledWith(buildingId, token)
    expect(fetchData.data).toBeInstanceOf(Object)
    expect(typeof fetchData.data.assetId).toEqual('string')
  })
})
