import { manageClick } from './mouse'

const dummyFunction = vi.fn()
const fooBarFunction = vi.fn()

const clickMe = () => {
  const onSingleClick = () => {
    dummyFunction()
  }
  const onDoubleClick = () => {
    fooBarFunction()
  }

  manageClick(onSingleClick, onDoubleClick)
}

describe('mouse simple and double click', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })
  afterEach(() => {
    vi.restoreAllMocks()
  })
  it('should manage simple click', () => {
    clickMe()
    vi.runAllTimers()
    expect(dummyFunction).toHaveBeenCalledWith()
  })

  it('should manage double click', () => {
    clickMe()
    setTimeout(() => {
      clickMe()
    }, 100)
    vi.runAllTimers()
    expect(fooBarFunction).toHaveBeenCalledWith()
  })
})
