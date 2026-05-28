import { escapeHtml } from './html.utils'

describe('escapeHtml', () => {
  it('should escape ampersand', () => {
    expect(escapeHtml('foo & bar')).toBe('foo &amp; bar')
  })

  it('should escape less than', () => {
    expect(escapeHtml('<script>')).toBe('&lt;script&gt;')
  })

  it('should escape greater than', () => {
    expect(escapeHtml('1 > 0')).toBe('1 &gt; 0')
  })

  it('should escape double quotes', () => {
    expect(escapeHtml('say "hello"')).toBe('say &quot;hello&quot;')
  })

  it('should escape single quotes', () => {
    expect(escapeHtml("it's")).toBe('it&#39;s')
  })

  it('should escape multiple special characters', () => {
    expect(escapeHtml('<a href="test">link</a>')).toBe('&lt;a href=&quot;test&quot;&gt;link&lt;/a&gt;')
  })

  it('should return same string if no special characters', () => {
    expect(escapeHtml('normal text')).toBe('normal text')
  })
})
