import { backofficeApi } from './backoffice.api'

// Args are captured into a plain array (not a mock) so the import-time creation
// survives the global clearMocks/restoreMocks.
const { createApiInstanceMock, capturedArgs } = vi.hoisted(() => {
  const capturedArgs: unknown[][] = []
  const createApiInstanceMock = vi.fn((...args: unknown[]) => {
    capturedArgs.push(args)
    return { id: 'backoffice-api-instance' }
  })
  return { createApiInstanceMock, capturedArgs }
})

vi.mock('@pulse/common/api', () => ({ createApiInstance: createApiInstanceMock }))
vi.mock('env-vars', () => ({ VITE_API_BASE_URL: 'https://api.test.com' }))

describe('backofficeApi', () => {
  it('should be built via the shared factory with the base URL', () => {
    expect(capturedArgs).toEqual([['https://api.test.com']])
  })

  it('should export the instance returned by the factory', () => {
    expect(backofficeApi).toEqual({ id: 'backoffice-api-instance' })
  })
})
