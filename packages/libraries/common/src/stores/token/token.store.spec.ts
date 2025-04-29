import { setActivePinia, createPinia } from 'pinia'
import { describe, expect, it, vi } from 'vitest'
import { useTokenStore } from './token.store'
import { tokenMock, tokenSubMock, tokenExpMock } from '@common/__mocks__'

const getTokenExpSubMock = vi.hoisted(() => vi.fn())
vi.mock('./token.store.utils', () => ({
  getTokenExpSub: getTokenExpSubMock,
}))

describe('test tokenStore', () => {
  let tokenStore: ReturnType<typeof useTokenStore>

  beforeEach(() => {
    setActivePinia(createPinia())
    getTokenExpSubMock.mockReturnValue({
      sub: tokenSubMock,
      exp: tokenExpMock,
    })

    tokenStore = useTokenStore()
  })

  it('should set token properly when setTokenExpiration() is called', () => {
    tokenStore.setTokenExpiration(tokenMock)

    expect(tokenStore.tokenSub).toBe(tokenSubMock)
    expect(tokenStore.tokenExp).toBe(tokenExpMock)
    expect(getTokenExpSubMock).toHaveBeenCalledOnce()
    expect(getTokenExpSubMock).toHaveBeenCalledWith(tokenMock)
  })
})
