import { sanitizeUrl } from '@pulse/toolbox/utils/url'
import { CookieService } from '@pulse/common/services/storage'
import {
  SSO_ORIGIN_COOKIE,
  SSO_ORIGIN_RYDGE,
  SSO_ORIGIN_COOKIE_MAX_AGE,
} from '@pulse/common/constants'
import { VITE_PENNYLANE_COLLAB_SSO_URL, VITE_PENNYLANE_SSO_URL } from 'env-vars'

export class PennylaneSsoManager {
  static getUrl(isCollab: boolean = false): string {
    const envUrl = isCollab ? VITE_PENNYLANE_COLLAB_SSO_URL : VITE_PENNYLANE_SSO_URL
    return sanitizeUrl(envUrl)
  }

  static setSsoOrigin(): void {
    CookieService.set(SSO_ORIGIN_COOKIE, SSO_ORIGIN_RYDGE, SSO_ORIGIN_COOKIE_MAX_AGE)
  }
}
