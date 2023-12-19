import { afterEach, beforeEach, describe, it, expect, vi } from 'vitest'
import { manageClick } from './mouse'

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
  it('should manage simple click', async () => {
    clickMe()
    vi.runAllTimers()
    expect(dummyFunction).toHaveBeenCalledWithExactlyOnceWith()
  })

  it('should manage double click', () => {
    clickMe()
    setTimeout(() => {
      clickMe()
    }, 100)
    vi.runAllTimers()
    expect(fooBarFunction).toHaveBeenCalledWithExactlyOnceWith()
  })
})
