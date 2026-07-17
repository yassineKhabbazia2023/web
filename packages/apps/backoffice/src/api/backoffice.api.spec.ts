import { VITE_API_BASE_URL } from 'env-vars'
import { apiGatewayMock } from '@pulse/common/mocks/vitest'
import { capturedApiInstanceDomains } from '@pulse/common/mocks/vitest/api.mocks'
import { backofficeApi } from './backoffice.api'

// '@pulse/common/api' is hub-mocked by vitest.setup.ts: the canonical factory
// records the domains it receives in a plain array (reset-proof), and always
// returns the shared gateway spies.
describe('backofficeApi', () => {
  it('should be built via the shared factory with the base URL', () => {
    expect(capturedApiInstanceDomains).toContain(VITE_API_BASE_URL)
  })

  it('should export the instance returned by the factory', () => {
    expect(backofficeApi).toBe(apiGatewayMock)
  })
})
