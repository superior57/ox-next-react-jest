import { useWsTicket } from '@/hooks/useWsTicket'

jest.mock('@/hooks/useWsTicket')

const mockUseWsTicket = useWsTicket as jest.MockedFunction<typeof useWsTicket>

describe('useWsTicket hook', () => {
  it('should return a ws ticket', () => {
    const token = '4K73nbk58G'
    const mockData = 'sd35'

    mockUseWsTicket.mockReturnValue({
      data: mockData,
      isLoading: false,
      isError: false,
    })

    const fetchData = useWsTicket(token)

    expect(typeof token).toEqual('string')
    expect(mockUseWsTicket).toBeCalledTimes(1)
    expect(mockUseWsTicket).toBeCalledWith(token)
    expect(typeof fetchData.data).toEqual('string')
  })
})
