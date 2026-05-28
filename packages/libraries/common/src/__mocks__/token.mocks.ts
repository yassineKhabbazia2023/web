// JWT token with configurable expiration (defaults to 1 year)
// Header: {"alg":"HS256","typ":"JWT"}
// Payload: {"sub":"test-user-123","exp":<future_timestamp>,"iat":<now>}
// To regenerate: use jwt.io with secret "test-secret"
export function createMockJwt(expiresInSeconds: number = 365 * 24 * 60 * 60): string {
  const now = Math.floor(Date.now() / 1000)
  const exp = now + expiresInSeconds

  // Base64url encode header and payload
  const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }))
    .replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
  const payload = btoa(JSON.stringify({ sub: 'test-user-123', exp, iat: now }))
    .replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')

  // Fake signature (not verified in mocks)
  const signature = 'mock-signature'

  return `${header}.${payload}.${signature}`
}

export const tokenMock = createMockJwt()
export const tokenExpMock = Math.floor(Date.now() / 1000) + 365 * 24 * 60 * 60
