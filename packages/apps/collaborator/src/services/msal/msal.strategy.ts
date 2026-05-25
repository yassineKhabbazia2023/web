import { logger } from '@pulse/toolbox'
import type { LogoutStrategy } from '@pulse/common/services/logout'
import type { TokenProviderStrategy } from '@pulse/common/services/token-provider'
import { MsalService } from '@pulse/common/services/msal'
import { tokenIsValid } from '@pulse/common/stores'

export class MsalLogoutStrategy implements LogoutStrategy {
  async cleanup(): Promise<void> {
    await MsalService.logout()
  }
}

export class MsalTokenStrategy implements TokenProviderStrategy {
  async refreshToken(): Promise<string> {
    logger.info('Refreshing MSAL token silently')
    const newToken = await MsalService.getFreshMSALToken()

    if (tokenIsValid(newToken)) {
      return newToken
    }

    throw new Error('Invalid token received from MSAL refresh')
  }
}
