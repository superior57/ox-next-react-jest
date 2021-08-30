import { useBuildings } from '@/hooks/useBuildings'

jest.mock('@/hooks/useBuildings')

const mockUseBuildings = useBuildings as jest.MockedFunction<typeof useBuildings>

describe('useBuildings hook', () => {
  it('should return an array of buildings', () => {
    const token = '19Gd2g332d'
    const mockData = [
      {
        assetId: '42',
        assetName: 'assetName',
        assetType: 'assetType',
        deviceCount: 3,
        parent: {},
        children: [],
        devices: [],
      },
    ]

    mockUseBuildings.mockReturnValue({
      data: mockData,
      isLoading: false,
      isError: false,
    })

    const fetchData = useBuildings(token)

    expect(mockUseBuildings).toBeCalledTimes(1)
    expect(mockUseBuildings).toBeCalledWith(token)
    expect(fetchData.data).toBeInstanceOf(Array)
    expect(typeof fetchData.data[0].assetId).toEqual('string')
  })
})
