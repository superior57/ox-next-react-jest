import { render, screen, within } from '@/lib/test-utils'
import { format } from 'date-fns'
import { eventToBedStatus } from '@/lib/utils'
import '@testing-library/jest-dom/extend-expect'
import EventHistory from './EventHistory'
const activities = ['LIKELY_BED_EXIT', 'BED_EXIT', 'RESTLESS', 'FALL', 'MULTI_PEOPLE']

const alerts = [
  {
    alertConfig: {
      id: '1',
    },
    detail: {
      activity: 'LIKELY_BED_EXIT',
    },
    createdAt: '1626983564778',
  },
  {
    alertConfig: {
      id: '2',
    },
    detail: {
      activity: 'BED_EXIT',
    },
    createdAt: '1626983708273',
  },
  {
    alertConfig: {
      id: '3',
    },
    detail: {
      activity: 'RESTLESS',
    },
    createdAt: '1626983719027',
  },
  {
    alertConfig: {
      id: '4',
    },
    detail: {
      activity: 'FALL',
    },
    createdAt: '1626914270000',
  },
  {
    alertConfig: {
      id: '5',
    },
    detail: {
      activity: 'FALL',
    },
    createdAt: '1626914270000',
  },
]

jest.mock('@/hooks/useAlerts', () => ({
  useAlerts() {
    return {
      isLoading: false,
      isError: false,
      data: alerts,
    }
  },
}))

jest.mock('@/hooks/useUnits', () => ({
  useUnits() {
    return {
      data: [
        {
          bedId: '1',
          bedName: 'first',
          patient: true,
        },
        {
          bedId: '2',
          bedName: 'second',
          patient: false,
        },
        {
          bedId: '3',
          bedName: 'third',
          patient: true,
        },
      ],
      isLoading: false,
    }
  },
}))

jest.mock('next/router', () => ({
  useRouter() {
    return {
      route: '',
      pathname: '',
      query: {
        unitId: '1',
        bedId: '1',
      },
      asPath: '',
      isReady: false,
    }
  },
}))

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key.replace('patient:', ''),
  }),
}))

describe('EventHistory', () => {
  it('The Event History screen shall display the following', () => {
    render(<EventHistory />)
    expect(screen.getAllByText('Event History')).toHaveLength(2)
    expect(screen.getByRole('table')).toBeInTheDocument()
  })

  it('The screen shall display a list with the events triggered for the patient, including the name and timestamp of the event', () => {
    render(<EventHistory />)
    alerts.forEach(({ detail, createdAt }) => {
      let statusText = ''
      switch (eventToBedStatus(detail.activity)) {
        case 'Loading':
          statusText = ''
          break
        case 'Unassigned':
          statusText = 'Unassigned'
          break
        case 'Offline':
          statusText = 'Offline'
          break
        case 'Still':
          statusText = 'Still'
          break
        case 'Restless':
          statusText = 'Restless'
          break
        case 'LikelyBedExit':
          statusText = 'Likely bed exit'
          break
        case 'BedExit':
          statusText = 'Bed exit'
          break
        case 'Fall':
          statusText = 'Fall'
          break
        case 'MultiplePeople':
          statusText = 'Multiple people'
          break
        default:
          statusText = 'Unknown'
          break
      }
      if (activities.includes(detail.activity)) {
        screen.getAllByText(statusText).map((text) => {
          const row = text.closest('tr')
          const utils = within(row)
          expect(utils.getByText(statusText)).toBeInTheDocument()
          const regexNum = new RegExp('^[0-9]+$')
          expect(regexNum.test(createdAt)).toBeTruthy()
          expect(
            utils.queryByText(format(parseInt(createdAt), 'M/d/y • h:m aaa'))
          ).toBeInTheDocument()
        })
      } else {
        expect(screen.queryAllByText('Unknown')).toBeTruthy()
      }
    })
  })
})
