import { useDebounce } from './useDebounce'

describe('useDebounce', () => {
  it('should debounce calls correctly', async () => {
    const fn = vi.fn()
    const debouncedFn = useDebounce(fn, 100)

    debouncedFn('call1')
    debouncedFn('call2')
    debouncedFn('call3')

    expect(fn).not.toHaveBeenCalled()

    // attend un peu plus que le délai (100ms)
    await new Promise((r) => setTimeout(r, 150))

    expect(fn).toHaveBeenCalledTimes(1)
    expect(fn).toHaveBeenCalledWith('call3')
  })
})
