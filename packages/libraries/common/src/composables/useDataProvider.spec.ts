import { describe, it, expect, vi } from 'vitest'
import {
  getMockedUserApi,
  getMockedUserPermissions,
  getStoreMock,
} from '../__mocks__'
import { permissionServiceMock } from '../__mocks__/permissions.service.mocks'
import { useTokenStore } from '../stores/token/token.store'
import { usePermissionsStore } from '../stores/permissions/permissions.store'
import { useDataProvider } from './useDataProvider'

const tokenStoreMock = getStoreMock(useTokenStore)
const permissionsStoreMock = getStoreMock(usePermissionsStore)

vi.mock('../../services/permissions/permissions.service', () => permissionServiceMock)

const fakeUser = getMockedUserApi()
const mockGetMe = vi.fn(() => ({ data: fakeUser }))

vi.mock('../api', () => ({
  default: () => ({
    gateway: {
      get: mockGetMe,
    },
  }),
}))

const fetchUserPermissionsMock = vi.hoisted(() => vi.fn())
vi.mock('../services/permissions/permissions.service', () => ({
  fetchUserPermissions: fetchUserPermissionsMock,
}))

const mockedUserPermissions = getMockedUserPermissions()
describe('useDataProvider', () => {
  beforeEach(() => {
    fetchUserPermissionsMock.mockResolvedValue(mockedUserPermissions)
  })

  it.skip('fetches user data when authenticated', async () => {
    tokenStoreMock.isAuthenticated = true

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
    expect(permissionsStoreMock.setUserPermissions).toHaveBeenCalledOnce()
    expect(permissionsStoreMock.setUserPermissions).toHaveBeenNthCalledWith(1, mockedUserPermissions)
  })

  it('returns null when not authenticated', async () => {
    tokenStoreMock.isAuthenticated = false

    const { fetchUserData } = useDataProvider()
    const user = await fetchUserData()
    expect(user).toBeUndefined()
  })
})
