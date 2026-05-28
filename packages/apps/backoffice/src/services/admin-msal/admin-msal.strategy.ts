import { logger } from '@pulse/toolbox'
import type { TokenProviderStrategy } from '@pulse/common/services/token-provider'
import { tokenIsValid } from '@pulse/common/stores'

import { AdminMsalService } from './admin-msal.service'

// Backoffice token strategy plugged into the shared TokenProviderService, so the
// common request interceptor can refresh the Azure AD token like any other app.
export class AdminMsalTokenStrategy implements TokenProviderStrategy {
  async refreshToken(): Promise<string> {
    logger.info('Refreshing admin MSAL token silently')
    const newToken = await AdminMsalService.getFreshMSALToken()

    if (tokenIsValid(newToken)) {
      return newToken
    }

    throw new Error('Invalid token received from admin MSAL refresh')
  }
}
