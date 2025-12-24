// JWT token with 1 year expiration from now
// Header: {"alg":"HS256","typ":"JWT"}
// Payload: {"sub":"test-user-123","exp":<future_timestamp>,"iat":<now>}
// To regenerate: use jwt.io with secret "test-secret"
function createMockJwt(): string {
  const now = Math.floor(Date.now() / 1000)
  const oneYearFromNow = now + 365 * 24 * 60 * 60

  // Base64url encode header and payload
  const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }))
    .replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
  const payload = btoa(JSON.stringify({ sub: 'test-user-123', exp: oneYearFromNow, iat: now }))
    .replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')

  // Fake signature (not verified in mocks)
  const signature = 'mock-signature'

  return `${header}.${payload}.${signature}`
}

export const tokenMock = createMockJwt()
export const tokenExpMock = Math.floor(Date.now() / 1000) + 365 * 24 * 60 * 60
