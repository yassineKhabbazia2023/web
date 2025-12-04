import { sanitizeUrl } from './url.utils'

describe('sanitizeUrl', () => {
  describe('valid URLs without options', () => {
    const validUrls = [
      { url: 'http://example.com', reason: 'http URL' },
      { url: 'https://example.com', reason: 'https URL' },
      { url: 'https://example.com/path', reason: 'https URL with path' },
      { url: 'https://example.com/path?query=1', reason: 'https URL with query' },
      { url: 'https://example.com/path?query=1#anchor', reason: 'https URL with query and anchor' },
      { url: 'https://user:pass@example.com', reason: 'https URL with auth' },
      { url: 'https://example.com:8080', reason: 'https URL with port' },
      { url: 'ftp://files.example.com', reason: 'ftp URL' },
    ]

    it.each(validUrls)('should return the URL when it is a $reason', ({ url }) => {
      expect(sanitizeUrl(url)).toBe(url)
    })
  })

  describe('relative URLs', () => {
    const relativeUrls = [
      { url: '/path/to/page', reason: 'absolute path' },
      { url: '/path/to/page?query=1', reason: 'absolute path with query' },
      { url: './relative/path', reason: 'relative dot path' },
      { url: '../parent/path', reason: 'parent relative path' },
      { url: '#anchor', reason: 'anchor only' },
      { url: '?query=1', reason: 'query only' },
      { url: '//example.com/path', reason: 'protocol-relative URL' },
    ]

    it.each(relativeUrls)('should return the URL when it is a $reason', ({ url }) => {
      expect(sanitizeUrl(url)).toBe(url)
    })
  })

  describe('URLs with allowed schemes option', () => {
    it('should return mailto URL when mailto is allowed', () => {
      expect(sanitizeUrl('mailto:test@example.com', { allowedSchemes: ['mailto'] })).toBe('mailto:test@example.com')
    })

    it('should return tel URL when tel is allowed', () => {
      expect(sanitizeUrl('tel:+33123456789', { allowedSchemes: ['tel'] })).toBe('tel:+33123456789')
    })

    it('should return custom scheme URL when it is allowed', () => {
      expect(sanitizeUrl('ms-teams://call', { allowedSchemes: ['ms-teams'] })).toBe('ms-teams://call')
    })

    it('should allow multiple schemes', () => {
      const options = { allowedSchemes: ['mailto', 'tel'] as const }
      expect(sanitizeUrl('mailto:test@example.com', options)).toBe('mailto:test@example.com')
      expect(sanitizeUrl('tel:+33123456789', options)).toBe('tel:+33123456789')
    })

    it('should be case insensitive for allowed schemes', () => {
      expect(sanitizeUrl('MAILTO:test@example.com', { allowedSchemes: ['mailto'] })).toBe('MAILTO:test@example.com')
      expect(sanitizeUrl('mailto:test@example.com', { allowedSchemes: ['MAILTO'] })).toBe('mailto:test@example.com')
    })
  })

  describe('URLs with non-allowed schemes', () => {
    it('should return about:blank for mailto without option', () => {
      expect(sanitizeUrl('mailto:test@example.com')).toBe('about:blank')
    })

    it('should return about:blank for tel without option', () => {
      expect(sanitizeUrl('tel:+33123456789')).toBe('about:blank')
    })

    it('should return about:blank for unknown scheme', () => {
      expect(sanitizeUrl('custom://something')).toBe('about:blank')
    })
  })

  describe('dangerous URLs - javascript scheme', () => {
    const dangerousUrls = [
      { url: 'javascript:alert(1)', reason: 'basic javascript' },
      { url: 'JAVASCRIPT:alert(1)', reason: 'uppercase javascript' },
      { url: 'JaVaScRiPt:alert(1)', reason: 'mixed case javascript' },
      { url: 'javascript:alert("XSS")', reason: 'javascript with XSS' },
      { url: '   javascript:alert(1)', reason: 'javascript with leading spaces' },
    ]

    it.each(dangerousUrls)('should return about:blank for $reason', ({ url }) => {
      expect(sanitizeUrl(url)).toBe('about:blank')
    })

    it('should block javascript even if explicitly allowed (dangerous schemes are always blocked)', () => {
      expect(sanitizeUrl('javascript:alert(1)', { allowedSchemes: ['javascript'] })).toBe('about:blank')
    })
  })

  describe('dangerous URLs - data scheme', () => {
    const dataUrls = [
      { url: 'data:text/html,<script>alert(1)</script>', reason: 'data URL with script' },
      { url: 'data:text/html;base64,PHNjcmlwdD5hbGVydCgxKTwvc2NyaXB0Pg==', reason: 'data URL base64' },
      { url: 'DATA:text/html,test', reason: 'uppercase data' },
    ]

    it.each(dataUrls)('should return about:blank for $reason', ({ url }) => {
      expect(sanitizeUrl(url)).toBe('about:blank')
    })
  })

  describe('dangerous URLs - vbscript scheme', () => {
    const vbscriptUrls = [
      { url: 'vbscript:msgbox(1)', reason: 'basic vbscript' },
      { url: 'VBSCRIPT:msgbox(1)', reason: 'uppercase vbscript' },
      { url: 'VbScRiPt:msgbox(1)', reason: 'mixed case vbscript' },
    ]

    it.each(vbscriptUrls)('should return about:blank for $reason', ({ url }) => {
      expect(sanitizeUrl(url)).toBe('about:blank')
    })
  })

  describe('obfuscated dangerous URLs - HTML entities', () => {
    const obfuscatedUrls = [
      { url: '&#106;avascript:alert(1)', reason: 'HTML entity for j' },
      { url: '&#74;avascript:alert(1)', reason: 'HTML entity for J' },
      { url: '&#x6a;avascript:alert(1)', reason: 'hex HTML entity for j' },
      { url: '&#x6A;avascript:alert(1)', reason: 'hex HTML entity for J uppercase' },
      { url: '&#106;&#97;&#118;&#97;&#115;&#99;&#114;&#105;&#112;&#116;:alert(1)', reason: 'full HTML entity encoded' },
    ]

    it.each(obfuscatedUrls)('should return about:blank for $reason', ({ url }) => {
      expect(sanitizeUrl(url)).toBe('about:blank')
    })
  })

  describe('obfuscated dangerous URLs - URL encoding', () => {
    const urlEncodedUrls = [
      { url: '%6Aavascript:alert(1)', reason: 'URL encoded j' },
      { url: '%6aavascript:alert(1)', reason: 'URL encoded j lowercase' },
      { url: '%6A%61%76%61%73%63%72%69%70%74:alert(1)', reason: 'full URL encoded javascript' },
    ]

    it.each(urlEncodedUrls)('should return about:blank for $reason', ({ url }) => {
      expect(sanitizeUrl(url)).toBe('about:blank')
    })
  })

  describe('obfuscated dangerous URLs - double encoding', () => {
    const doubleEncodedUrls = [
      { url: '%26%23106%3Bavascript:alert(1)', reason: 'double encoded HTML entity' },
      { url: '%25%36%41avascript:alert(1)', reason: 'double URL encoded' },
    ]

    it.each(doubleEncodedUrls)('should return about:blank for $reason', ({ url }) => {
      expect(sanitizeUrl(url)).toBe('about:blank')
    })
  })

  describe('obfuscated dangerous URLs - whitespace injection', () => {
    const whitespaceUrls = [
      { url: 'java\tscript:alert(1)', reason: 'tab in javascript' },
      { url: 'java\nscript:alert(1)', reason: 'newline in javascript' },
      { url: 'java\rscript:alert(1)', reason: 'carriage return in javascript' },
      { url: 'java\0script:alert(1)', reason: 'null byte in javascript' },
    ]

    it.each(whitespaceUrls)('should return about:blank for $reason', ({ url }) => {
      expect(sanitizeUrl(url)).toBe('about:blank')
    })
  })

  describe('obfuscated dangerous URLs - control characters', () => {
    const controlCharUrls = [
      { url: '\u0000javascript:alert(1)', reason: 'null byte prefix' },
      { url: '\u001Fjavascript:alert(1)', reason: 'control char prefix' },
      { url: '\uFEFFjavascript:alert(1)', reason: 'BOM prefix' },
      { url: 'java\u200Bscript:alert(1)', reason: 'zero-width space in javascript' },
      { url: 'java\u200Dscript:alert(1)', reason: 'zero-width joiner in javascript' },
    ]

    it.each(controlCharUrls)('should return about:blank for $reason', ({ url }) => {
      expect(sanitizeUrl(url)).toBe('about:blank')
    })
  })

  describe('edge cases - empty and null values', () => {
    it('should return about:blank for null', () => {
      expect(sanitizeUrl(null)).toBe('about:blank')
    })

    it('should return about:blank for undefined', () => {
      expect(sanitizeUrl(undefined)).toBe('about:blank')
    })

    it('should return about:blank for empty string', () => {
      expect(sanitizeUrl('')).toBe('about:blank')
    })

    it('should return about:blank for whitespace only', () => {
      expect(sanitizeUrl('   ')).toBe('about:blank')
      expect(sanitizeUrl('\t\n')).toBe('about:blank')
    })
  })

  describe('edge cases - invalid http URLs', () => {
    it('should return about:blank for malformed http URL', () => {
      expect(sanitizeUrl('http://')).toBe('about:blank')
    })

    it('should return about:blank for http URL with only protocol', () => {
      expect(sanitizeUrl('http:')).toBe('about:blank')
    })

    it('should return about:blank for https URL without host', () => {
      expect(sanitizeUrl('https://')).toBe('about:blank')
    })
  })

  describe('edge cases - URLs without scheme', () => {
    it('should return the URL if it has no scheme and is not relative', () => {
      expect(sanitizeUrl('example.com')).toBe('example.com')
    })

    it('should return the URL if it is just text', () => {
      expect(sanitizeUrl('just some text')).toBe('just some text')
    })
  })

  describe('complex URL patterns', () => {
    it('should handle Office forms URL', () => {
      const url = 'https://forms.office.com/pages/responsepage.aspx?id=abc123'
      expect(sanitizeUrl(url)).toBe(url)
    })

    it('should handle SSO URL', () => {
      const url = 'https://app.example.com/sso/client'
      expect(sanitizeUrl(url)).toBe(url)
    })

    it('should handle tel: link', () => {
      expect(sanitizeUrl('tel:+33123456789', { allowedSchemes: ['tel'] })).toBe('tel:+33123456789')
    })

    it('should handle mailto: link', () => {
      expect(sanitizeUrl('mailto:contact@example.com', { allowedSchemes: ['mailto'] })).toBe('mailto:contact@example.com')
    })

    it('should handle RSS feed URL', () => {
      const url = 'https://news.example.com/feed/article/123?utm_source=rss'
      expect(sanitizeUrl(url)).toBe(url)
    })

    it('should handle SharePoint URL with encoded path and query params', () => {
      const url = 'https://company.sharepoint.com/sites/Project/Documents%20partages/Forms/AllItems.aspx?id=%2fsites%2fProject%2fDocuments%20partages%2fFiles%2fDocument%2Epdf&parent=%2fsites%2fProject%2fDocuments%20partages%2fFiles'
      expect(sanitizeUrl(url)).toBe(url)
    })

    it('should handle SAML SSO URL with hash token', () => {
      const url = 'https://auth.example.com/auth/saml/init/a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2'
      expect(sanitizeUrl(url)).toBe(url)
    })

    it('should handle CAS login URL with query params', () => {
      const url = 'https://auth.example.com/cas/login?client=app-name'
      expect(sanitizeUrl(url)).toBe(url)
    })

    it('should handle Microsoft MyApps launcher URL with GUID and tenantId', () => {
      const url = 'https://launcher.myapps.microsoft.com/api/signin/00000000-0000-0000-0000-000000000000?tenantId=00000000-0000-0000-0000-000000000000'
      expect(sanitizeUrl(url)).toBe(url)
    })

    it('should handle external forms URL with hash ID', () => {
      const url = 'https://share-eu1.hsforms.com/1abc123def456ghi789jkl0'
      expect(sanitizeUrl(url)).toBe(url)
    })

    it('should handle help center article URL with slug', () => {
      const url = 'https://help.example.com/fr/articles/123456-article-title-with-slug'
      expect(sanitizeUrl(url)).toBe(url)
    })
  })
})
