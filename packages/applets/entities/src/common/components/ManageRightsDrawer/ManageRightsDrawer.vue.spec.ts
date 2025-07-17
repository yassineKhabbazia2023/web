import { authorizationServiceMock } from '@entities/__mocks__/authorization.service.mocks'
import { loggerMock, featureFlagManagerMock } from '@pulse/core/mocks'
import { expect, beforeEach, describe, it, vi, type Mock } from 'vitest'
import { type VueWrapper, mount, flushPromises } from '@vue/test-utils'
import type { User } from '@entities/pages/folder/pages/usersCollab/types'
import { useRoute, useRouter } from 'vue-router'
import * as authorizationServices from '@entities/services/authorization'
import { mockedAccountId } from '@entities/__mocks__/account.mocks'
import { dataFromApi } from '@entities/__mocks__/api.mocks'
import { RouteParam } from '@pulse/common/enums'
import { getMockedEntity } from '@pulse/common/mocks'

import ManageRightsDrawer from '.'

vi.mock('@pulse/common/services/pennylane')

// Mocks
const mockedUseRoute = useRoute as Mock
const mockedUseRouter = useRouter as Mock
const mockedUser = {
  fullName: "Johnny's Pizza",
  initials: 'JP',
  ...dataFromApi.data.items[0],
}
vi.mock('@entities/services/authorization', () => authorizationServiceMock)
vi.mock('@pulse/core', () => ({
  logger: loggerMock,
  FeatureFlagManager: featureFlagManagerMock,
}))
vi.mock('vue-router')

const createWrapper = (selectedUser: User = mockedUser): VueWrapper<any> => {
  return mount(ManageRightsDrawer, {
    props: {
      modelValue: true,
      selectedUser,
      selectedEntity: getMockedEntity(),
    },
  })
}

describe('manageRightsDrawer', () => {
  let wrapper: VueWrapper<any>
  beforeEach(async () => {
    vi.useFakeTimers()
    mockedUseRouter.mockReturnValue({
      go: vi.fn(),
    })
    mockedUseRoute.mockReturnValue({
      params: {
        [RouteParam.ENTITY_ID]: mockedAccountId,
      },
    })
    wrapper = createWrapper()
    await flushPromises()
  })
  describe('events', () => {
    it("should send a request to update the user's permissions if the accountID is missing", async () => {
      const spyAuthServices = vi.spyOn(
        authorizationServices,
        'updateUserPermissions',
      )
      mockedUseRoute.mockReturnValue({
        params: {
          [RouteParam.ENTITY_ID]: undefined,
        },
      })
      wrapper = createWrapper()
      await flushPromises()
      const submitButton = wrapper.find(
        '[data-testid=manage-rights-submit-button]',
      )

      await submitButton.trigger('click')

      vi.advanceTimersByTime(800)

      expect(wrapper.vm.isManageRightsDrawerOpened).toBeFalsy()
      expect(spyAuthServices).toHaveBeenCalledOnce()
      expect(spyAuthServices).toHaveBeenCalledWith(
        mockedUser.contactId,
        null,
        ['CLUSER001', 'CLUSER002', 'COADMI001'],
      )
    })
    it("should send a request to update the user's permissions when the submit button is clicked", async () => {
      const spyAuthServices = vi.spyOn(
        authorizationServices,
        'updateUserPermissions',
      )
      wrapper = createWrapper()
      await flushPromises()
      const submitButton = wrapper.find(
        '[data-testid=manage-rights-submit-button]',
      )

      await submitButton.trigger('click')

      vi.advanceTimersByTime(800)

      expect(wrapper.vm.isManageRightsDrawerOpened).toBeFalsy()
      expect(spyAuthServices).toHaveBeenCalledOnce()
      expect(spyAuthServices).toHaveBeenCalledWith(
        mockedUser.contactId,
        mockedAccountId,
        ['CLUSER001', 'CLUSER002', 'COADMI001'],
      )
    })
  })
})
