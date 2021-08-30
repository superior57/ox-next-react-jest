import { useUnits } from '@/hooks/useUnits'

jest.mock('@/hooks/useUnits')

const mockUseUnits = useUnits as jest.MockedFunction<typeof useUnits>

describe('useUnits hook', () => {
  it('should return a unit', () => {
    const token = '19Gd2g3!32d'
    const mockData = [
      {
        id: 2,
        unitId: 'unitId',
        name: 'name',
        description: 'description',
        customerAccountId: 8,
        summary: {},
        details: {},
      },
    ]

    mockUseUnits.mockReturnValue({
      data: mockData,
      isLoading: false,
      isError: false,
    })

    const fetchData = mockUseUnits(token)

    expect(mockUseUnits).toBeCalledTimes(1)
    expect(mockUseUnits).toBeCalledWith(token)
    expect(fetchData.data).toBeInstanceOf(Array)
    expect(typeof fetchData.data[0].id).toEqual('number')
  })
})
