import { describe, it, expect, vi } from 'vitest'
import { useCopyClipboard } from './clipboard'

const copy = vi.fn()

vi.mock('@vueuse/core', () => {
  return {
    useClipboard: vi.fn((value) => {
      return {
        copy,
        source: {
          value
        }
      }
    })
  }
})

describe('clipboard', () => {
  it('should copy to clipboard a value', async () => {
    const value = 'abc'
    useCopyClipboard(value)
    expect(copy).toHaveBeenCalledWithExactlyOnceWith()
  })
})
