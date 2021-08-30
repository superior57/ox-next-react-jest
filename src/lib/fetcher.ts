export const fetcher = async <T>(input: RequestInfo): Promise<T> => {
  const res = await fetch(input)
  const data = await res.json()
  return data
}
