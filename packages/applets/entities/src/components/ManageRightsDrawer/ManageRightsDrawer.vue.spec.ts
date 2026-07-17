import { armAuthorizationServiceMocks, updateUserPermissionsMock } from '@entities/__mocks__/vitest'
import { getMockedEntity } from '@pulse/common/mocks'
import { flushPromises, mount, type VueWrapper } from '@vue/test-utils'
import type { User } from '@entities/types'
import { useRoute } from 'vue-router'
import type { RouteLocationNormalizedLoaded } from 'vue-router'
import { mockedAccountId } from '@entities/__mocks__/account.mocks'
import { dataFromApi } from '@entities/__mocks__/api.mocks'
import { RouteParam, CollaboratorPermission, CustomerPermission } from '@pulse/common/enums'
import { displayNotification } from '@pulse/styleguide'
import { getAdditionalOptionByActionCode } from './utils'

import ManageRightsDrawer from '.'

const mockedUser: User = {
  fullName: "Johnny's Pizza",
  initials: 'JP',
  ...dataFromApi.data.items[0],
}

// The enabled actions of mockedAuthorizationsConfig (armed by
// armAuthorizationServiceMocks): the rights the drawer submits by default.
const expectedActionCodes = [
  CustomerPermission.ACCEDER_DONNEES_BANCAIRES,
  CustomerPermission.ACCEDER_GED_COMPTABLE,
  CollaboratorPermission.ACCEDER_DONNEES_BANCAIRES,
]

beforeEach(() => {
  armAuthorizationServiceMocks()
  // Skips the PennylaneService call behind the additional-option loading.
  vi.mocked(getAdditionalOptionByActionCode).mockResolvedValue({})
  vi.mocked(useRoute).mockReturnValue({
    params: {
      [RouteParam.ENTITY_ID]: mockedAccountId,
    },
  } as unknown as RouteLocationNormalizedLoaded)
})

const createWrapper = (selectedUser: User = mockedUser): VueWrapper<any> =>
  mount(ManageRightsDrawer, {
    props: {
      modelValue: true,
      selectedUser,
      currentEntity: getMockedEntity(),
    },
  })

const clickPrimaryCta = (wrapper: VueWrapper<any>) => {
  wrapper.findComponent({ name: 'PDrawerActions' }).vm.$emit('click-primary-cta')
}

describe('manageRightsDrawer', () => {
  describe('events', () => {
    it("should send a request to update the user's permissions without an account id if the route has none", async () => {
      vi.mocked(useRoute).mockReturnValue({
        params: {},
      } as unknown as RouteLocationNormalizedLoaded)
      const wrapper = createWrapper()
      await flushPromises()

      clickPrimaryCta(wrapper)
      await flushPromises()

      expect(updateUserPermissionsMock).toHaveBeenCalledExactlyOnceWith(mockedUser.contactId, null, expectedActionCodes)
    })

    it("should send a request to update the user's permissions with the route account id when the submit button is clicked", async () => {
      const wrapper = createWrapper()
      await flushPromises()

      clickPrimaryCta(wrapper)
      await flushPromises()

      expect(updateUserPermissionsMock).toHaveBeenCalledExactlyOnceWith(mockedUser.contactId, mockedAccountId, expectedActionCodes)
      // The identity i18n stub returns the raw key: the wording itself is not asserted.
      expect(vi.mocked(displayNotification)).toHaveBeenCalledExactlyOnceWith('success', 'rightsModificationSucceeded')
    })

    it('should close the drawer once the permissions update succeeded', async () => {
      vi.useFakeTimers()
      const wrapper = createWrapper()
      await flushPromises()

      clickPrimaryCta(wrapper)
      await flushPromises()
      vi.advanceTimersByTime(700)

      expect(wrapper.emitted('update:modelValue')).toStrictEqual([[false]])
      vi.useRealTimers()
    })
  })
})
