import { CookieService } from './cookie.service'

describe('CookieService', () => {
  beforeEach(() => {
    // Reset cookies
    document.cookie.split(';').forEach((cookie) => {
      const name = cookie.split('=')[0].trim()
      if (name) {
        document.cookie = `${name}=; max-age=0; path=/`
      }
    })
  })

  describe('set', () => {
    it('should set a cookie with default max-age', () => {
      CookieService.set('test-cookie', 'test-value')

      expect(document.cookie).toContain('test-cookie=test-value')
    })

    it('should encode special characters in value', () => {
      CookieService.set('test-cookie', 'value with spaces & special=chars')

      const value = CookieService.get('test-cookie')
      expect(value).toBe('value with spaces & special=chars')
    })
  })

  describe('get', () => {
    it('should return cookie value when cookie exists', () => {
      document.cookie = 'my-cookie=my-value; path=/'

      const result = CookieService.get('my-cookie')

      expect(result).toBe('my-value')
    })

    it('should return undefined when cookie does not exist', () => {
      const result = CookieService.get('non-existent-cookie')

      expect(result).toBeUndefined()
    })

    it('should decode encoded values', () => {
      document.cookie = `encoded-cookie=${encodeURIComponent('hello world')}; path=/`

      const result = CookieService.get('encoded-cookie')

      expect(result).toBe('hello world')
    })

    it('should escape regex special characters in cookie name', () => {
      document.cookie = 'sso.origin=test-value; path=/'

      const result = CookieService.get('sso.origin')

      expect(result).toBe('test-value')
    })

    it('should not match similar cookie names due to regex escaping', () => {
      document.cookie = 'sso-origin=correct; path=/'
      document.cookie = 'ssoXorigin=wrong; path=/'

      const result = CookieService.get('sso-origin')

      expect(result).toBe('correct')
    })
  })

  describe('remove', () => {
    it('should remove an existing cookie', () => {
      document.cookie = 'to-remove=value; path=/'
      expect(CookieService.get('to-remove')).toBe('value')

      CookieService.remove('to-remove')

      expect(CookieService.get('to-remove')).toBeUndefined()
    })
  })

  describe('consume', () => {
    it('should return value and remove cookie when cookie exists', () => {
      document.cookie = 'consumable=consume-me; path=/'

      const result = CookieService.consume('consumable')

      expect(result).toBe('consume-me')
      expect(CookieService.get('consumable')).toBeUndefined()
    })

    it('should return undefined when cookie does not exist', () => {
      const result = CookieService.consume('non-existent')

      expect(result).toBeUndefined()
    })

    it('should not call remove when cookie does not exist', () => {
      const removeSpy = vi.spyOn(CookieService, 'remove')

      CookieService.consume('non-existent')

      expect(removeSpy).not.toHaveBeenCalled()
      removeSpy.mockRestore()
    })
  })
})
