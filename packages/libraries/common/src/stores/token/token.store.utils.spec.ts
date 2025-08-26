import { describe, expect, it, vi } from 'vitest'
import { getTokenExp } from './token.store.utils'
import { tokenMock, tokenExpMock } from '@common/__mocks__'

const jwtDecodeMock = vi.hoisted(() => vi.fn())
vi.mock('jwt-decode', () => ({
  default: jwtDecodeMock,
}))

describe('test token.store.utils', () => {
  beforeEach(() => {
    jwtDecodeMock.mockReturnValue({
      exp: tokenExpMock,
    })
  })
  describe('getTokenExp', () => {
    const tests = [{
      token: tokenMock,
      expected: {
        exp: tokenExpMock,
      },
    }, {
      token: '',
      expected: {
        exp: undefined,
      },
    }]

    it.each(tests)('should return $expected when token is $token', ({
      token,
      expected,
    }) => {
      const exp = getTokenExp(token)

      expect(exp).toStrictEqual(expected)
    })
  })
})
