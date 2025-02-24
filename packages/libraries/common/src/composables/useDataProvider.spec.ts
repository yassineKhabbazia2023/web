import { describe, it, expect, vi } from 'vitest'
import { createTestingPinia } from '@pinia/testing'
import { setActivePinia } from 'pinia'
import { getMockedUser } from '../__mocks__'
import store from '../stores'
import { useDataProvider } from './useDataProvider'

const fakeUser = getMockedUser()
const mockGetMe = vi.fn((_url) => {
  return Promise.resolve({
    data: fakeUser,
  })
})

vi.mock('../api', () => ({
  default: () => ({
    gateway: {
      get: mockGetMe,
    },
  }),
}),
)

describe('useDataProvider', () => {
  beforeEach(() => {
    setActivePinia(createTestingPinia())
  })

  it('fetches user data when authenticated', async () => {
    const myStore = store()
    // @ts-expect-error: Getter is read only
    myStore.isAuthenticated = true
    const { fetchUserData } = useDataProvider()
    const user = await fetchUserData()
    const expectedResult = {
      id: fakeUser.id,
      firstName: fakeUser.firstName,
      lastName: fakeUser.lastName,
      email: fakeUser.email,
      isCollab: true,
    }
    expect(user).toMatchObject(expectedResult)
  })

  it('returns null when not authenticated', async () => {
    const myStore = store()
    // @ts-expect-error: Getter is read only
    myStore.isAuthenticated = false
    const { fetchUserData } = useDataProvider()
    const user = await fetchUserData()
    expect(user).toBeNull()
  })
})
