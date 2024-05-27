import { nextTick } from 'vue'
import { expect, beforeEach, describe, it, vi } from 'vitest'
import { type VueWrapper, mount, flushPromises } from '@vue/test-utils'
import { dataFromApi } from '@/pages/folder/pages/usersCollab/mockData'
import * as authorizationServices from '@/services/authorization'
import { getMockedAuthorizationsConfig } from './components/RightsList/RightsListMocks'
import ManageRightsDrawer from '.'

// Mocks
const mockedAuthorizationsConfig = getMockedAuthorizationsConfig()
const mockedAccountId = 602
const mockedUser = {
  contactId: 25,
  fullName: "Johnny's Pizza",
  initials: 'JP',
  ...dataFromApi.data.items[0],
}
vi.mock('vue-router', () => ({
  useRoute: () => ({
    params: {
      id: mockedAccountId,
    },
  }),
}))
vi.mock('@/services/authorization', () => ({
  fetchAuthorizationsConfig: vi.fn(() =>
    Promise.resolve(mockedAuthorizationsConfig),
  ),
  updateUserPermissions: vi.fn(),
}))

const createWrapper = (): VueWrapper<any> => {
  return mount(ManageRightsDrawer, {
    props: {
      modelValue: true,
      selectedUser: mockedUser,
    },
  })
}

describe('manageRightsDrawer', () => {
  let wrapper: VueWrapper<any>
  beforeEach(async () => {
    wrapper = createWrapper()
    await flushPromises()
  })
  describe('display', () => {
    it("should correctly display the drawer header with the user's information and rights list", () => {
      const userRoleTag = wrapper.findComponent({ name: 'PTag' })
      const userCard = wrapper.findComponent({ name: 'PUserCard' })
      const rightsList = wrapper.findComponent({ name: 'RightsList' })

      const expectedUserCardProps = {
        pTitle: mockedUser.fullName,
        pSubtitle: mockedUser.email,
      }
      const expectedUserRoleTagProps = {
        pContent: mockedUser.role,
      }

      expect(rightsList.exists()).toBeTruthy()
      expect(userCard.props()).toMatchObject(expectedUserCardProps)
      expect(userRoleTag.props()).toMatchObject(expectedUserRoleTagProps)
    })
  })
  describe('events', () => {
    it('should close manage rights drawer when clicking on close buton', async () => {
      const manageRightsDrawer = wrapper.findComponent({ name: 'PDrawer' })
      manageRightsDrawer.vm.$emit('close-drawer-button')
      await nextTick()

      expect(wrapper.emitted('update:modelValue')).toStrictEqual([[false]])
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

      expect(spyAuthServices).toHaveBeenCalledOnce()
      expect(spyAuthServices).toHaveBeenCalledWith(
        mockedUser.contactId,
        mockedAccountId,
        ['CLUSER001', 'CLUSER002', 'COADMI001'],
      )
    })
    it('should display a console error if the request to update permissions fails', async () => {
      const spyConsole = vi.spyOn(console, 'error')
      const expectedErrorMessage = 'API Error: 503 Service Unavailable'
      vi.spyOn(
        authorizationServices,
        'updateUserPermissions',
      ).mockRejectedValue(expectedErrorMessage)
      wrapper = createWrapper()
      await flushPromises()
      const submitButton = wrapper.find(
        '[data-testid=manage-rights-submit-button]',
      )

      await submitButton.trigger('click')

      expect(spyConsole).toHaveBeenCalledOnce()
      expect(spyConsole).toHaveBeenCalledWith(
        'Permission update unsuccessful :',
        expectedErrorMessage,
      )
    })
  })
})
