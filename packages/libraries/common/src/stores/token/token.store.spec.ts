import { setActivePinia, createPinia } from 'pinia'
import { describe, expect, it, vi } from 'vitest'
import { useTokenStore } from './token.store'
import { tokenMock, tokenExpMock } from '@common/__mocks__'

const getTokenExpMock = vi.hoisted(() => vi.fn())
vi.mock('./token.store.utils', () => ({
  getTokenExp: getTokenExpMock,
}))

describe('test tokenStore', () => {
  let tokenStore: ReturnType<typeof useTokenStore>

  beforeEach(() => {
    setActivePinia(createPinia())
    getTokenExpMock.mockReturnValue({
      exp: tokenExpMock,
    })

    tokenStore = useTokenStore()
  })

  it('should set token properly when setTokenExpiration() is called', () => {
    tokenStore.setTokenExpiration(tokenMock)

    expect(tokenStore.tokenExp).toBe(tokenExpMock)
    expect(getTokenExpMock).toHaveBeenCalledOnce()
    expect(getTokenExpMock).toHaveBeenCalledWith(tokenMock)
  })
})
