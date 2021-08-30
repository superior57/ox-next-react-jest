import { useAlerts } from '@/hooks/useAlerts'

jest.mock('@/hooks/useAlerts')

const mockUseAlerts = useAlerts as jest.MockedFunction<typeof useAlerts>

describe('useAlerts hook', () => {
  it('should return an array of alerts', () => {
    const patientId = '3443'
    const token = '123sAdf7lKJ35Rn7'
    const mockData = [
      {
        id: 3,
        deviceId: '42',
        status: 'online',
        detail: {
          duration: 555,
          activity: 'active',
        },
        createdAt: '1627000106185',
        updatedAt: '1627000122665',
        patient: {
          id: 2,
          patientId: '44',
          firstName: 'Test',
          lastName: 'Test',
          sex: 'male',
          age: 55,
          dateOfBirth: '945/08/22',
          phoneNumber: '8188126171',
        },
        healthSummary: [],
        tags: [],
        customerAccountId: 44,
        unitId: 4,
        roomId: 8,
        bedId: 2,
        alertConfig: {
          id: 34,
          name: 'name',
          description: 'Description',
          scope: 'scope',
          ownerId: 'ownerId',
          severity: 'severity',
          groupName: 'group',
          enabled: true,
          configType: 'type',
          binaryConfig: {},
          statisticsConfig: {
            eventType: 'event',
            metricType: 'metric',
            aggregationType: 'aggregation',
            aggregationWindowSec: 432,
            incidentLimit: 5,
            timeFrame: 5000,
            operator: 'operator',
            thresholdType: 'threshold',
            threshold: 44,
          },
        },
        lastAction: {},
      },
    ]

    mockUseAlerts.mockReturnValue({
      data: mockData,
      isLoading: false,
      isError: false,
    })

    const fetchData = mockUseAlerts(patientId, token)

    expect(typeof patientId).toEqual('string')
    expect(mockUseAlerts).toBeCalledTimes(1)
    expect(mockUseAlerts).toBeCalledWith(patientId, token)
    expect(fetchData.data).toBeInstanceOf(Array)
    expect(typeof fetchData.data[0].id).toEqual('number')
  })
})
