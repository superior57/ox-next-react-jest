import { render } from '@/lib/test-utils'
import { useWarnIfUnsavedChanges } from '@/hooks/useWarnIfUnsavedChanges'

function TestComponent({ unsavedChanges, message }): null {
  useWarnIfUnsavedChanges(unsavedChanges, message)
  return null
}

describe('useWarnIfUnsavedChanges', () => {
  afterEach(() => {
    jest.restoreAllMocks()
  })

  it('has to work properly', () => {
    const events = {}

    jest.spyOn(window, 'addEventListener').mockImplementation((event, handle) => {
      events[event] = handle
    })

    jest.spyOn(window, 'removeEventListener').mockImplementation((event) => {
      events[event] = undefined
    })

    const { unmount } = render(<TestComponent unsavedChanges={true} message="Hello" />)

    const e = { preventDefault: jest.fn() }

    events['beforeunload'](e)

    expect(window.addEventListener).toBeCalledWith('beforeunload', expect.any(Function))

    expect(e.preventDefault).toBeCalledTimes(1)

    unmount()

    expect(window.removeEventListener).toBeCalledWith('beforeunload', expect.any(Function))
  })
})
