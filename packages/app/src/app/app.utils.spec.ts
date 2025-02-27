import { describe, expect, it, vi, afterEach } from 'vitest'
import { getExpirationDelays } from './app.utils'

const mockedNow = '2024-10-04T12:00:00.0000Z'
const fakeSystemDate = new Date(mockedNow)

describe('getExpirationDelays', () => {
  afterEach(() => {
    vi.useRealTimers()
  })
  it('should return proper expiration delays', () => {
    vi.useFakeTimers()
    vi.setSystemTime(fakeSystemDate)

    const oneHourInMS = 60000
    const tokenExp = oneHourInMS + fakeSystemDate.getTime() / 1000

    const expirationDelays = getExpirationDelays(tokenExp)
    const expectedExpirationDelays = {
      expiredTokenDelay: 60000000,
      openPopupDelay: 59700000,
    }

    expect(expirationDelays).toStrictEqual(expectedExpirationDelays)
  })
})
