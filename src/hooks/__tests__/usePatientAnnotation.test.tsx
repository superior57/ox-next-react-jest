import { usePatientAnnotations } from '@/hooks/usePatientAnnotations'

jest.mock('@/hooks/usePatientAnnotations')

const mockUsePatientAnnotations = usePatientAnnotations as jest.MockedFunction<
  typeof usePatientAnnotations
>

describe('usePatientAnnotations hook', () => {
  it('should return a patient annotation', () => {
    const patientId = '33'
    const token = '19Gd2g3!32d'
    const mockData = [
      {
        id: 2,
        patientId: '4',
        annotator: 'Annotator',
        annotation: 'some text',
        createdAt: 1627067530799,
      },
    ]

    mockUsePatientAnnotations.mockReturnValue({
      data: mockData,
      isLoading: false,
      isError: false,
    })

    const fetchData = usePatientAnnotations(patientId, token)

    expect(usePatientAnnotations).toBeCalledTimes(1)
    expect(usePatientAnnotations).toBeCalledWith(patientId, token)
    expect(fetchData.data).toBeInstanceOf(Array)
    expect(typeof fetchData.data[0].id).toEqual('number')
  })
})
