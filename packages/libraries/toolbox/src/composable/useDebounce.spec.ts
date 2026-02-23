import { useDebounce } from './useDebounce'
import { DEBOUNCE_TIMING } from '../constants'

describe('useDebounce', () => {
  it('should debounce calls correctly', async () => {
    vi.useFakeTimers()
    const fn = vi.fn()
    const debouncedFn = useDebounce(fn)

    debouncedFn('call1')
    debouncedFn('call2')
    debouncedFn('call3')

    expect(fn).not.toHaveBeenCalled()

    await vi.advanceTimersByTimeAsync(DEBOUNCE_TIMING.DEFAULT + 1)

    expect(fn).toHaveBeenCalledTimes(1)
    expect(fn).toHaveBeenCalledWith('call3')
    vi.useRealTimers()
  })
})
