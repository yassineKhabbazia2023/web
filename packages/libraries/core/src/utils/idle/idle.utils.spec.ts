import { describe, it, vi, expect } from 'vitest'
import { setIdle } from './idle.utils'

const idleMock = {
  whenNotInteractive: vi.fn(() => idleMock),
  within: vi.fn(() => idleMock),
  do: vi.fn(() => idleMock),
  start: vi.fn(() => idleMock),
}

vi.mock('idlejs', () => {
  const Idle = vi.fn(() => idleMock)

  return { Idle }
})


describe('setIdle', () => {
  it('should initialize Idle and set up the idle callback', () => {
    const withinMinutes = 60
    const callbackMock = vi.fn()

    setIdle(withinMinutes, callbackMock)

    expect(idleMock.whenNotInteractive).toHaveBeenCalledOnce()
    expect(idleMock.within).toHaveBeenCalledWith(withinMinutes)
    expect(idleMock.do).toHaveBeenCalledWith(callbackMock)
    expect(idleMock.start).toHaveBeenCalledOnce()
  })
})