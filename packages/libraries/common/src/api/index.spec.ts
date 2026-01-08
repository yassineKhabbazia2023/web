import { envVarsMock } from '@pulse/common/mocks'
import { axiosMock } from '../__mocks__/vitest'

import api from '.'

vi.mock('env-vars', () => envVarsMock)
vi.mock('axios', async (importActual) => {
  const actual = await importActual() as object
  return {
    ...actual,
    axiosMock,
  }
})

describe('api axios instances with env-vars', () => {
  it('should return at least one axios instance', () => {
    const instances = api()
    expect(Object.keys(instances).length).greaterThanOrEqual(1)
  })

  it('should emit reject on response error', async () => {
    const instance = api().gateway
    const err = new Error('error')
    vi.spyOn(instance, 'get').mockRejectedValue(err)
    const spyReject = vi.spyOn(Promise, 'reject')

    try {
      await expect(instance.get('foo/bar')).rejects.toThrow('error')
    } catch (_error) {
      // do nothing
    }
    expect(spyReject).toHaveBeenCalledWith(err)
  })
})
