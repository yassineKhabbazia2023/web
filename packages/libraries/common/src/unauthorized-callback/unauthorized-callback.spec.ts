import { setUnauthorizedCallback, getUnauthorizedCallback } from './unauthorized-callback'

describe('test unauthorized-callback', () => {
  it('getUnauthorizedCallback should be undefined by default', () => {
    const unauthorizedCallback = getUnauthorizedCallback()

    expect(unauthorizedCallback).toBeUndefined()
  })

  it('getUnauthorizedCallback should return callback set by setUnauthorizedCallback', () => {
    const callback = vi.fn()

    setUnauthorizedCallback(callback)
    const unauthorizedCallback = getUnauthorizedCallback()

    expect(unauthorizedCallback).toStrictEqual(callback)
  })
})
