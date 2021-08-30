import { render, screen } from '@/lib/test-utils'
import { SexText } from './SexText'

jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key.replace('patient:', '') }),
}))

describe('Sex Text', () => {
  it('display sex female text ', () => {
    render(<SexText sex="female" />)
    screen.getByText('Female')
  })
  it('display sex male text ', () => {
    render(<SexText sex="male" />)
    screen.getByText('Male')
  })
})
