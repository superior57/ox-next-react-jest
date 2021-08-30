import { fetchWithToken } from '@/lib/fetchWithToken'

jest.mock('@/lib/fetchWithToken')

const mockFetchWithToken = fetchWithToken as jest.MockedFunction<typeof fetchWithToken>
describe('fetchWithToken function', () => {
  it('should succeed ', () => {
    const input = 'fetch input'
    const token = 'jd&3mB592X'

    const fetchData = fetchWithToken(input, token)

    expect(typeof token).toEqual('string')
    expect(typeof input).toEqual('string')
    expect(mockFetchWithToken).toBeCalledTimes(1)
    expect(mockFetchWithToken).toBeCalledWith(input, token)
    expect(fetchData).toEqual(undefined)
  })
})
