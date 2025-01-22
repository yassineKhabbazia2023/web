import { describe, it, expect } from 'vitest'
import { flushPromises } from '@vue/test-utils'
import { msalInstance } from '../msal'
import api from '../api'
import { getInitials, logoutClient, logoutCollaborator, logoutGigyaSSO } from '.'

const loggerDebugSpy = vi.hoisted(() => vi.fn())
const loggerWarnSpy = vi.hoisted(() => vi.fn())
const loggerErrorSpy = vi.hoisted(() => vi.fn())

vi.mock('@pulse/core', () => ({
  logger: {
    debug: loggerDebugSpy,
    warn: loggerWarnSpy,
    error: loggerErrorSpy,
  },
}))

declare let window: {
  gigya: any
} & Window

const mockedGigyaUserId = 'gigya-user-id-value'
const mockGigyaAccountsLogout = vi.hoisted(() => vi.fn())

window.gigya = {
  accounts: {
    logout: mockGigyaAccountsLogout,
  },
}

describe('getInitials', () => {
  it.each([
    ['Janelle', 'Boyd', 'JB'],
    ['Janelle', '', 'J'],
    ['', 'Boyd', 'B'],
    [undefined, 'Boyd', 'B'],
    ['', '', ''],
    [undefined, undefined, ''],
  ])(
    'returns correct initials (%s, %s) => %s',
    (firstName, lastName, expected) => {
      const initials = getInitials(firstName, lastName)
      expect(initials).toBe(expected)
    },
  )
})

describe('logoutCollaborator', () => {
  it('should invoke the logout function on msalInstance', () => {
    const msalLogoutSpy = vi.spyOn(msalInstance, 'logout')
    logoutCollaborator()

    expect(msalLogoutSpy).toHaveBeenCalledOnce()
  })
})

describe('logoutGigyaSSO', () => {
  it('should invoke the logout function on Gigya', () => {
    logoutGigyaSSO()

    expect(mockGigyaAccountsLogout).toHaveBeenCalledOnce()
  })
})

describe('logoutClient', () => {
  it('should call the API with the correct endpoint and payload to logout the client', () => {
    const gatewayPostSpy = vi.spyOn(api().gateway, 'post')
    logoutClient(mockedGigyaUserId)

    expect(gatewayPostSpy).toHaveBeenCalledOnce()
    expect(gatewayPostSpy).toHaveBeenCalledWith('authentication/api/logout', { gigyaUserId: mockedGigyaUserId })
  })
  it('should log an error when the API call fails to logout the user', async () => {
    const expectedErrorMessage = 'API Error: 503 Service Unavailable'

    vi.spyOn(api().gateway, 'post').mockRejectedValue(expectedErrorMessage)
    logoutClient(mockedGigyaUserId)
    await flushPromises()

    expect(loggerErrorSpy).toHaveBeenCalledOnce()
    expect(loggerErrorSpy).toHaveBeenCalledWith('Error during client logout: ', expectedErrorMessage)
  })
})
