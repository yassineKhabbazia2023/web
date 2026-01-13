import { describe, it, expect, vi, beforeEach } from 'vitest'
import { PennylaneSsoManager } from './pennylane-sso.manager'
import { SSO_ORIGIN_COOKIE, SSO_ORIGIN_RYDGE } from '@pulse/common/constants'

vi.mock('@pulse/toolbox/utils/url', () => ({
  sanitizeUrl: (url: string) => url,
}))

const mockCookieSet = vi.fn()

vi.mock('@pulse/common/services/storage', () => ({
  CookieService: {
    set: (...args: unknown[]) => mockCookieSet(...args),
  },
}))

vi.mock('@pulse/common/constants', () => ({
  SSO_ORIGIN_COOKIE: 'sso-origin',
  SSO_ORIGIN_RYDGE: 'rydge',
  SSO_ORIGIN_COOKIE_MAX_AGE: 300,
}))

vi.mock('env-vars', () => ({
  VITE_PENNYLANE_SSO_URL: 'https://pennylane-sso.example.com',
  VITE_PENNYLANE_COLLAB_SSO_URL: 'https://pennylane-collab-sso.example.com',
}))

describe('PennylaneSsoManager', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('getUrl', () => {
    it('should return customer URL when isCollab is false', () => {
      const url = PennylaneSsoManager.getUrl(false)

      expect(url).toBe('https://pennylane-sso.example.com')
    })

    it('should return customer URL by default', () => {
      const url = PennylaneSsoManager.getUrl()

      expect(url).toBe('https://pennylane-sso.example.com')
    })

    it('should return collab URL when isCollab is true', () => {
      const url = PennylaneSsoManager.getUrl(true)

      expect(url).toBe('https://pennylane-collab-sso.example.com')
    })
  })

  describe('setSsoOrigin', () => {
    it('should set cookie with correct parameters', () => {
      PennylaneSsoManager.setSsoOrigin()

      expect(mockCookieSet).toHaveBeenCalledWith(SSO_ORIGIN_COOKIE, SSO_ORIGIN_RYDGE, 300)
    })
  })
})
