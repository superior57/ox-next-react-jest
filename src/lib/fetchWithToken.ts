export const fetchWithToken = async <T>(input: RequestInfo, token: string): Promise<T> => {
  const res = await fetch(input, { headers: { Authorization: `Bearer ${token}` } })
  const data = await res.json()
  return data
}
