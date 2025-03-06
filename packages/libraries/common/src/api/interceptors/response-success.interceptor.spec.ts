import { responseInterceptorSuccess } from './response-success.interceptor'

describe('responseInterceptorSuccess', () => {
  it('should return the response unchanged', () => {
    const mockResponse = {
      data: {
        id: 1,
        name: 'test',
      },
      status: 200,
      headers: {
        'content-type': 'application/json',
      },
    }

    const result = responseInterceptorSuccess(mockResponse)

    expect(result).toBe(mockResponse)
  })
})