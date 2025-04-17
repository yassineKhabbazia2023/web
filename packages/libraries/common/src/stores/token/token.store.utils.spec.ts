import { describe, expect, it, vi } from 'vitest'
import { getTokenExpSub } from './token.store.utils'
import { tokenMock, tokenSubMock, tokenExpMock } from '@common/__mocks__'

const jwtDecodeMock = vi.hoisted(() => vi.fn())
vi.mock('jwt-decode', () => ({
  default: jwtDecodeMock,
}))

describe('test token.store.utils', () => {
  beforeEach(() => {
    jwtDecodeMock.mockReturnValue({
      sub: tokenSubMock,
      exp: tokenExpMock,
    })
  })
  describe('getTokenExpSub', () => {
    const tests = [{
      token: tokenMock,
      expectedSubExp: {
        sub: tokenSubMock,
        exp: tokenExpMock,
      },
    }, {
      token: '',
      expectedSubExp: {
        sub: undefined,
        exp: undefined,
      },
    }]

    it.each(tests)('should return $expected when token is $token', ({
      token,
      expectedSubExp,
    }) => {
      const subExp = getTokenExpSub(token)

      expect(subExp).toStrictEqual(expectedSubExp)
    })
  })
})
