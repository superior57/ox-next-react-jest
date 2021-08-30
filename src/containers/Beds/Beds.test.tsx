import { render } from '@/lib/test-utils'
import '@testing-library/jest-dom/extend-expect'
import { Status } from './Beds'
import { BedStatusText } from '@/components/BedStatusText'
import { Bed } from '@/components/Bed'

jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}))

jest.mock('next/router', () => ({
  useRouter() {
    return {
      route: '',
      pathname: '',
      query: { unitId: '1' },
      asPath: '',
      isReady: false,
    }
  },
}))

describe('Testing Beds Status and Status Icon', () => {
  it('should return status Offline Icon', () => {
    const { getByTestId } = render(<Status status="Offline" />)
    const { container } = render(<BedStatusText status="Offline" />)
    expect(getByTestId(/Offline/)).toBeInTheDocument()
    expect(container.getElementsByClassName('capitalize')[0].textContent).toBe('Offline')
  })

  it('should return status BedExit Icon', () => {
    const { getByTestId } = render(<Status status="BedExit" />)
    expect(getByTestId(/BedExit/)).toBeInTheDocument()
    const { container } = render(<BedStatusText status="BedExit" />)
    expect(container.getElementsByClassName('capitalize')[0].textContent).toBe('Bed exit')
  })

  it('should return status Fall Icon', () => {
    const { getByTestId } = render(<Status status="Fall" />)
    expect(getByTestId(/Fall/)).toBeInTheDocument()
    const { container } = render(<BedStatusText status="Fall" />)
    expect(container.getElementsByClassName('capitalize')[0].textContent).toBe('Fall')
  })

  it('should return status MultiplePeople Icon', () => {
    const { getByTestId } = render(<Status status="MultiplePeople" />)
    const { container } = render(<BedStatusText status="MultiplePeople" />)
    expect(container.getElementsByClassName('capitalize')[0].textContent).toBe('Multiple people')
    expect(getByTestId(/MultiplePeople/)).toBeInTheDocument()
  })
})

describe('Testing Beds Components', () => {
  it('should return offline Beds information', () => {
    const { container } = render(<Bed bedName="2009" variant="Offline" isHighRisk={false} />)
    expect(container.getElementsByClassName('text-2xl')[0].textContent).toBe('2009')
  })

  it('should return Exit Beds information', () => {
    const { container } = render(<Bed bedName="2100" variant="BedExit" isHighRisk={false} />)
    expect(container.getElementsByClassName('text-2xl')[0].textContent).toBe('2100')
    expect(container.firstChild).toHaveClass('bg-warning')
  })

  it('should return Fall Beds information', () => {
    const { container } = render(<Bed bedName="2190" variant="Fall" isHighRisk={false} />)
    expect(container.getElementsByClassName('text-2xl')[0].textContent).toBe('2190')
    expect(container.firstChild).toHaveClass('bg-critical')
  })

  it('should return HighRisk Icon when isHighRisk is true', () => {
    const { getByTestId, queryByTestId } = render(
      <Bed bedName="2190" variant="Fall" isHighRisk={true} />
    )
    expect(queryByTestId('highRiskSection')).not.toBeNull()
    expect(getByTestId(/highRiskSection/)).toBeInTheDocument()
  })
})
