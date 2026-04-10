import type { RequestHandler } from 'msw'
// import { http, HttpResponse } from 'msw'

// Dev mock handlers — add your selective API mocks here.
// These handlers only activate when VITE_DEV_MOCKS=true.
// Any request NOT matched here passes through to real APIs.
//
// Usage:
//   1. Uncomment the `http` and `HttpResponse` import above
//   2. Add handlers to the array below
//   3. Run `npm run dev:mocks` in the app workspace
//
// Example:
//   http.get('*/contact/me', () => {
//     return HttpResponse.json({ id: 1, firstName: 'Dev', lastName: 'User' })
//   }),
//
// You can also import existing mock factories:
//   import { getCurrentUserResponseMock } from '@pulse/common/mocks'
//
//   http.get('*/contact/me', () => {
//     return HttpResponse.json(getCurrentUserResponseMock())
//   }),

export const devMockHandlers: RequestHandler[] = [
  // Add your handlers here
]
