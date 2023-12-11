import { debounce, dateFormatter } from './utils'
import { expect, describe, it, vi } from 'vitest'

describe('utils helpers', () => {
  it('should emit once after 500ms', async () => {
    vi.useFakeTimers()
    const mockFunction = vi.fn()
    const functionDebounced = debounce(mockFunction)
    functionDebounced(23)
    functionDebounced(54)
    await vi.advanceTimersByTimeAsync(550)
    expect(mockFunction).toHaveBeenCalledTimes(1)
  })
  it('should format date accordingly', () => {
    const dateFormatted = dateFormatter(
      '2022-07-27T00:00:00')
    expect(dateFormatted).toBe('27/07/2022')
  })
})
