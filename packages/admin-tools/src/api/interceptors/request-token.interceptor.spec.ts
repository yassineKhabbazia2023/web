import type { InternalAxiosRequestConfig } from 'axios'
import { loggerMock } from '@pulse/toolbox/mocks'
import { requestTokenInterceptor } from './request-token.interceptor'
import { AdminMsalService } from '@admin-tools/services/admin-msal/admin-msal.service'

vi.mock('@pulse/toolbox', () => ({ logger: loggerMock }))
vi.mock('@admin-tools/services/admin-msal/admin-msal.service')

describe('requestTokenInterceptor', () => {
  it('should add Authorization header when token is available', async () => {
    const mockToken = 'mock-access-token-123'
    vi.spyOn(AdminMsalService, 'getMSALToken').mockResolvedValue(mockToken)

    const config: InternalAxiosRequestConfig = {
      headers: {} as any,
      url: '/test',
    } as InternalAxiosRequestConfig

    const result = await requestTokenInterceptor(config)

    expect(AdminMsalService.getMSALToken).toHaveBeenCalledExactlyOnceWith()
    expect(result.headers.Authorization).toBe(`Bearer ${mockToken}`)
  })

  it('should create headers object if undefined', async () => {
    const mockToken = 'mock-access-token-456'
    vi.spyOn(AdminMsalService, 'getMSALToken').mockResolvedValue(mockToken)

    const config: InternalAxiosRequestConfig = {
      url: '/test',
    } as InternalAxiosRequestConfig

    const result = await requestTokenInterceptor(config)

    expect(result.headers).toBeDefined()
    expect(result.headers.Authorization).toBe(`Bearer ${mockToken}`)
  })

  it('should not add Authorization header when token is null', async () => {
    vi.spyOn(AdminMsalService, 'getMSALToken').mockResolvedValue(null)

    const config: InternalAxiosRequestConfig = {
      headers: {} as any,
      url: '/test',
    } as InternalAxiosRequestConfig

    const result = await requestTokenInterceptor(config)

    expect(AdminMsalService.getMSALToken).toHaveBeenCalledExactlyOnceWith()
    expect(result.headers.Authorization).toBeUndefined()
  })

  it('should not add Authorization header when token is empty string', async () => {
    vi.spyOn(AdminMsalService, 'getMSALToken').mockResolvedValue('')

    const config: InternalAxiosRequestConfig = {
      headers: {} as any,
      url: '/test',
    } as InternalAxiosRequestConfig

    const result = await requestTokenInterceptor(config)

    expect(AdminMsalService.getMSALToken).toHaveBeenCalledExactlyOnceWith()
    expect(result.headers.Authorization).toBeUndefined()
  })

  it('should handle errors gracefully and return config', async () => {
    vi.spyOn(AdminMsalService, 'getMSALToken').mockRejectedValue(new Error('Token fetch failed'))

    const config: InternalAxiosRequestConfig = {
      headers: {} as any,
      url: '/test',
    } as InternalAxiosRequestConfig

    const result = await requestTokenInterceptor(config)

    expect(AdminMsalService.getMSALToken).toHaveBeenCalledExactlyOnceWith()
    expect(result).toBe(config)
    expect(result.headers.Authorization).toBeUndefined()
  })

  it('should preserve existing headers when adding Authorization', async () => {
    const mockToken = 'mock-token-789'
    vi.spyOn(AdminMsalService, 'getMSALToken').mockResolvedValue(mockToken)

    const config: InternalAxiosRequestConfig = {
      headers: {
        'Content-Type': 'application/json',
        'X-Custom-Header': 'custom-value',
      } as any,
      url: '/test',
    } as InternalAxiosRequestConfig

    const result = await requestTokenInterceptor(config)

    expect(result.headers['Content-Type']).toBe('application/json')
    expect(result.headers['X-Custom-Header']).toBe('custom-value')
    expect(result.headers.Authorization).toBe(`Bearer ${mockToken}`)
  })

  it('should always return the config object', async () => {
    vi.spyOn(AdminMsalService, 'getMSALToken').mockResolvedValue('token')

    const config: InternalAxiosRequestConfig = {
      headers: {} as any,
      url: '/test',
      method: 'GET',
    } as InternalAxiosRequestConfig

    const result = await requestTokenInterceptor(config)

    expect(result).toBeDefined()
    expect(result.url).toBe('/test')
    expect(result.method).toBe('GET')
  })
})
