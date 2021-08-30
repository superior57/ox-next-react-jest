import { useCustomerAccount } from '@/hooks/useCustomerAccount'

jest.mock('@/hooks/useCustomerAccount')

const mockUseCustomerAccount = useCustomerAccount as jest.MockedFunction<typeof useCustomerAccount>

describe('mockUseCustomerAccount hook', () => {
  it('should return a customer account', () => {
    const token = '19Gd2g3!32d'
    const mockData = {
      id: 21,
      name: 'name',
    }

    mockUseCustomerAccount.mockReturnValue({
      data: mockData,
      isLoading: false,
      isError: false,
    })

    const fetchData = useCustomerAccount(token)

    expect(mockUseCustomerAccount).toBeCalledTimes(1)
    expect(mockUseCustomerAccount).toBeCalledWith(token)
    expect(fetchData.data).toBeInstanceOf(Object)
    expect(typeof fetchData.data.id).toEqual('number')
  })
})
