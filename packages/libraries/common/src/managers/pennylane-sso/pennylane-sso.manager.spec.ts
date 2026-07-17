import { PennylaneSsoManager } from './pennylane-sso.manager'
import { SSO_ORIGIN_COOKIE, SSO_ORIGIN_RYDGE, SSO_ORIGIN_COOKIE_MAX_AGE } from '@pulse/common/constants'
import { envVarsMock } from '@common/__mocks__'
import { setCookieMock } from '@common/__mocks__/vitest'

describe('PennylaneSsoManager', () => {
  describe('getUrl', () => {
    it('should return customer URL when isCollab is false', () => {
      const url = PennylaneSsoManager.getUrl(false)

      expect(url).toBe(envVarsMock.VITE_PENNYLANE_SSO_URL)
    })

    it('should return customer URL by default', () => {
      const url = PennylaneSsoManager.getUrl()

      expect(url).toBe(envVarsMock.VITE_PENNYLANE_SSO_URL)
    })

    it('should return collab URL when isCollab is true', () => {
      const url = PennylaneSsoManager.getUrl(true)

      expect(url).toBe(envVarsMock.VITE_PENNYLANE_COLLAB_SSO_URL)
    })
  })

  describe('setSsoOrigin', () => {
    it('should set cookie with correct parameters', () => {
      PennylaneSsoManager.setSsoOrigin()

      expect(setCookieMock).toHaveBeenCalledWith(SSO_ORIGIN_COOKIE, SSO_ORIGIN_RYDGE, SSO_ORIGIN_COOKIE_MAX_AGE)
    })
  })
})
