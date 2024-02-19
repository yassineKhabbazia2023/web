import api from './index'
import { vi } from 'vitest'
import { tokenService } from '../main'

vi.mock('env-vars')
vi.mock('axios')

describe('api axios instances with env-vars', () => {
  const token = 'abcdef-123456'
  beforeEach(() => {
    vi.spyOn(tokenService, 'getToken').mockReturnValue(token)
  })
  it('should return at least one axios instance', () => {
    const instances = api()
    expect(Object.keys(instances).length).greaterThanOrEqual(1)
  })

  it('each axios REST methods should have the user\'s token in request headers', async () => {
    const instance = api().portal
    await instance.get('foo/bar')
    await instance.post('foo/bar')
    await instance.put('foo/bar')
    await instance.delete('foo/bar')
    expect(instance.defaults.headers.Authorization).toBe(`Bearer ${token}`)
  })

  it('should emit reject on response error', async () => {
    const instance = api().portal
    const err = new Error('error')
    vi.spyOn(instance, 'get').mockRejectedValue(err)
    const spyReject = vi.spyOn(Promise, 'reject')
    try {
      await expect(instance.get('foo/bar')).rejects.toThrow('error')
    } catch {
    }
    expect(spyReject).toHaveBeenCalledWith(err)
  })
})
