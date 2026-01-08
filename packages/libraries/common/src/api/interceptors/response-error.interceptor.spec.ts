import { AxiosError } from 'axios'
import { getUnauthorizedCallbackMock } from '../../__mocks__/vitest'

import { responseInterceptorError } from './response-error.interceptor'


vi.mock('../../unauthorized-callback', () => ({
  getUnauthorizedCallback: getUnauthorizedCallbackMock,
}))

describe('responseInterceptorError', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should call Promise.reject', async () => {
    const promiseRejectSpy = vi.spyOn(Promise, 'reject')
    const error: AxiosError = {
      name: 'fatal error',
      message: 'fatal error message',
      status: 500,
      isAxiosError: true,
      toJSON: () => ({}),
    }

    await expect(responseInterceptorError(error)).rejects.toStrictEqual(error)

    expect(promiseRejectSpy).toHaveBeenCalledExactlyOnceWith(error)
  })

  it('should call unauthorizedCallback twice when 401 occurs twice', async () => {
    const unauthorizedCallbackMock = vi.fn()
    getUnauthorizedCallbackMock.mockReturnValue(unauthorizedCallbackMock)
    const error: AxiosError = {
      name: 'error',
      message: 'error message',
      status: 401,
      isAxiosError: true,
      toJSON: () => ({}),
    }

    await expect(responseInterceptorError(error)).rejects.toStrictEqual(error)
    await expect(responseInterceptorError(error)).rejects.toStrictEqual(error)

    expect(unauthorizedCallbackMock).toHaveBeenCalledTimes(2)
  })
})
