import { render, screen } from '@/lib/test-utils'
import { BedStatusText } from './BedStatusText'

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key.replace('common:', ''),
  }),
}))

describe('Bed Status', () => {
  it('display bed status with Unassigned', () => {
    render(<BedStatusText status="Unassigned" />)
    screen.getByText('Unassigned')
  })
  it('display bed status with Offline', () => {
    render(<BedStatusText status="Offline" />)
    screen.getByText('Offline')
  })
  it('display bed status with Still', () => {
    render(<BedStatusText status="Still" />)
    screen.getByText('Still')
  })
  it('display bed status with Restless', () => {
    render(<BedStatusText status="Restless" />)
    screen.getByText('Restless')
  })
  it('display bed status with Likely bed exit', () => {
    render(<BedStatusText status="LikelyBedExit" />)
    screen.getByText('Likely bed exit')
  })
  it('display bed status with Bed exit', () => {
    render(<BedStatusText status="BedExit" />)
    screen.getByText('Bed exit')
  })
  it('display bed status with Fall', () => {
    render(<BedStatusText status="Fall" />)
    screen.getByText('Fall')
  })
  it('display bed status with Multiple people', () => {
    render(<BedStatusText status="MultiplePeople" />)
    screen.getByText('Multiple people')
  })
  it('display bed status with Unknown', () => {
    render(<BedStatusText status="Unknown" />)
    screen.getByText('Unknown')
  })
})
