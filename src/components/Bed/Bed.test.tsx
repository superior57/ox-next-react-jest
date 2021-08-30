import { render, screen } from '@/lib/test-utils'
import { Bed } from './Bed'

const BedExit = 'bg-warning animate-bedExit hover:bg-warningDarker'
const Unassigned = 'hover:border-secondary cursor-copy'
const Fall = 'bg-critical animate-fall hover:bg-criticalDarker'
const Default = 'bg-primary hover:bg-secondary'

describe('Bed', () => {
  it('display a bed number', () => {
    render(<Bed bedName="1" />)
    screen.getByText('1')
  })
  it('display an Unassigned variant', () => {
    const { container } = render(<Bed bedName="1" variant="Unassigned" />)
    expect(container.getElementsByClassName(Unassigned).length).toBe(1)
  })
  it('display a BedExit variant', () => {
    const { container } = render(<Bed bedName="1" variant="BedExit" />)
    expect(container.getElementsByClassName(BedExit).length).toBe(1)
  })
  it('display a Fall variant', () => {
    const { container } = render(<Bed bedName="1" variant="Fall" />)
    expect(container.getElementsByClassName(Fall).length).toBe(1)
  })
  it('display a default variant', () => {
    const { container } = render(<Bed bedName="1" />)
    expect(container.getElementsByClassName(Default).length).toBe(1)
  })
})
