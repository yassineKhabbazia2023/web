import { beforeEach, describe, expect, it, vi } from 'vitest'
import { envVarsMock } from '@pulse/core/mocks'
import { navigateToWalletMock, useNavigationMock } from '@login/__mocks__/useNavigation.composable.mocks'
import { isTokenRetrieveFalseMock, useInitUserAuthMock } from '@login/__mocks__/useInitUserAuth.composable.mocks'
import { flushPromises, mount } from '@vue/test-utils'

import LoginCollab from '.'

vi.mock('env-vars', () => envVarsMock)

vi.mock('@pulse/common', () => ({
  msalInstance: {
    loginRedirect: vi.fn(),
  },
  amplitudeService: {
    reset: vi.fn(),
  },
}))

vi.mock('@login/composable/useInitUserAuth', () => ({
  default: () => ({
    ...useInitUserAuthMock,
    isTokenRetrieve: isTokenRetrieveFalseMock,
  }),
}))
vi.mock('@login/composable/useNavigation', () => ({
  default: () => useNavigationMock,
}))

const createWrapper = () => mount(LoginCollab, {
  shallow: true,
})

describe('loginCollab', () => {
  beforeEach(async () => {
    createWrapper()
    await flushPromises()
  })
  describe('events', () => {
    it('should not redirect to the wallet if the user is unauthenticated', () => {
      expect(navigateToWalletMock).toHaveBeenCalledTimes(0)
    })
  })
})
