import { AxiosError } from 'axios'
import { getUnauthorizedCallbackMock } from '../../__mocks__/vitest'
import { responseInterceptorError } from './response-error.interceptor'
import { SKIP_CALLBACK_CODES } from '../../constants'
import type { ApiErrorResponse } from '../api.types'

vi.mock('../../unauthorized-callback', () => ({
  getUnauthorizedCallback: getUnauthorizedCallbackMock,
}))

const unauthorizedCallbackMock = vi.fn()

describe('responseInterceptorError', () => {
  beforeEach(() => {
    getUnauthorizedCallbackMock.mockReturnValue(unauthorizedCallbackMock)
  })

  it('should call Promise.reject', async () => {
    const promiseRejectSpy = vi.spyOn(Promise, 'reject')
    const error: AxiosError<ApiErrorResponse> = {
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
    const error: AxiosError<ApiErrorResponse> = {
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

  it('should NOT call unauthorizedCallback when 401 occurs with INVALID_CREDENTIALS error code', async () => {
    const error: AxiosError<ApiErrorResponse> = {
      name: 'error',
      message: 'error message',
      status: 401,
      isAxiosError: true,
      toJSON: () => ({}),
      response: {
        data: {
          errorCode: SKIP_CALLBACK_CODES[0],
        },
        status: 401,
        statusText: 'Unauthorized',
        headers: {},
        config: {} as any,
      },
    }

    await expect(responseInterceptorError(error)).rejects.toStrictEqual(error)

    expect(unauthorizedCallbackMock).not.toHaveBeenCalled()
  })

  it('should NOT call unauthorizedCallback when 401 occurs with CNT111 error code', async () => {
    const error: AxiosError<ApiErrorResponse> = {
      name: 'error',
      message: 'error message',
      status: 401,
      isAxiosError: true,
      toJSON: () => ({}),
      response: {
        data: {
          errorCode: SKIP_CALLBACK_CODES[1],
        },
        status: 401,
        statusText: 'Unauthorized',
        headers: {},
        config: {} as any,
      },
    }

    await expect(responseInterceptorError(error)).rejects.toStrictEqual(error)

    expect(unauthorizedCallbackMock).not.toHaveBeenCalled()
  })

  it('should call unauthorizedCallback when 401 occurs with a different error code', async () => {
    const error: AxiosError<ApiErrorResponse> = {
      name: 'error',
      message: 'error message',
      status: 401,
      isAxiosError: true,
      toJSON: () => ({}),
      response: {
        data: {
          errorCode: 'SOME_OTHER_ERROR',
        },
        status: 401,
        statusText: 'Unauthorized',
        headers: {},
        config: {} as any,
      },
    }

    await expect(responseInterceptorError(error)).rejects.toStrictEqual(error)

    expect(unauthorizedCallbackMock).toHaveBeenCalledOnce()
  })

  it('should call unauthorizedCallback when 401 occurs without error code', async () => {
    const error: AxiosError<ApiErrorResponse> = {
      name: 'error',
      message: 'error message',
      status: 401,
      isAxiosError: true,
      toJSON: () => ({}),
      response: {
        data: {},
        status: 401,
        statusText: 'Unauthorized',
        headers: {},
        config: {} as any,
      },
    }

    await expect(responseInterceptorError(error)).rejects.toStrictEqual(error)

    expect(unauthorizedCallbackMock).toHaveBeenCalledOnce()
  })
})
