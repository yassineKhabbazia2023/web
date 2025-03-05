import { vi } from 'vitest'
import { envVarsMock } from '@pulse/core/mocks'
import { logger } from '@pulse/core'
import type { AxiosError } from 'axios'

import api, {
  requestInterceptor,
  responseInterceptorSuccess,
  responseInterceptorError,
} from './index'

vi.mock('env-vars', () => envVarsMock)
vi.mock('axios')

const getUnauthorizedCallbackMock = vi.hoisted(() => vi.fn())

vi.mock('@common/unauthorized-callback', () => ({
  getUnauthorizedCallback: getUnauthorizedCallbackMock,
}))

const getTokenMocked = vi.hoisted(() => vi.fn(() => ('abcdef-123456')))

vi.mock('../main', () => ({
  tokenService: {
    getToken: getTokenMocked,
  },
}))

describe('api axios instances with env-vars', () => {
  it('should return at least one axios instance', () => {
    const instances = api()
    expect(Object.keys(instances).length).greaterThanOrEqual(1)
  })

  it('each axios REST methods should have the user\'s token in request headers', async () => {
    const expectedAuthorization = 'Bearer abcdef-123456'
    const instance = api().gateway

    await instance.get('foo/bar')
    await instance.post('foo/bar')
    await instance.put('foo/bar')
    await instance.delete('foo/bar')

    expect(instance.defaults.headers.Authorization).toBe(expectedAuthorization)
  })

  it('should emit reject on response error', async () => {
    const instance = api().gateway
    const err = new Error('error')
    getTokenMocked.mockRejectedValueOnce(err)
    vi.spyOn(instance, 'get').mockRejectedValue(err)
    const spyReject = vi.spyOn(Promise, 'reject')
    try {
      await expect(instance.get('foo/bar')).rejects.toThrow('error')
    } catch (e) {
      logger.error(e)
    }
    expect(spyReject).toHaveBeenCalledWith(err) // this is a falsy test
  })
})

describe('requestInterceptor', () => {
  const mockedToken = 'mocked-token'
  const tests = [{
    token: mockedToken,
    expected: `Bearer ${mockedToken}`,
  }, {
    token: '',
    expected: '',
  }]
  it.each(tests)('should set proper headersAuthorization when token is $token', ({
    token,
    expected,
  }) => {
    const config = {
      headers: {
        Authorization: '',
      },
    }
    getTokenMocked.mockReturnValueOnce(token)
    requestInterceptor(config)
    expect(config.headers.Authorization).toBe(expected)
  })
})

describe('responseInterceptorSuccess', () => {
  it('should return response it-self', () => {
    const response = {}

    expect(responseInterceptorSuccess(response)).toStrictEqual(response)
  })
})

describe('responseInterceptorError', () => {
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

    expect(promiseRejectSpy).toHaveBeenCalledOnce()
    expect(promiseRejectSpy).toHaveBeenCalledWith(error)
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
