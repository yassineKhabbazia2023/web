import { nextTick } from 'vue'
import '@entities/__mocks__/common.import.mocks'
import { authorizationServiceMock } from '@entities/__mocks__/authorization.service.mocks'
import { loggerErrorSpy, loggerMock } from '@entities/__mocks__/logger.mocks'
import { expect, beforeEach, describe, it, vi, type Mock } from 'vitest'
import { type VueWrapper, mount, flushPromises } from '@vue/test-utils'
import type { User } from '@entities/pages/folder/pages/usersCollab/types'
import { useRoute, useRouter } from 'vue-router'
import * as authorizationServices from '@entities/services/authorization'
import ManageRightsDrawer from '.'
import { mockedAccountId } from '@entities/__mocks__/account.mocks'
import { dataFromApi } from '@entities/__mocks__/api.mocks'

// Mocks
const mockedUseRoute = useRoute as Mock
const mockedUseRouter = useRouter as Mock
const mockedUser = {
  fullName: "Johnny's Pizza",
  initials: 'JP',
  ...dataFromApi.data.items[0],
}
vi.mock('@entities/services/authorization', () => authorizationServiceMock)
vi.mock('@pulse/core', () => ({ logger: loggerMock }))
vi.mock('vue-router')

const createWrapper = (selectedUser: User = mockedUser): VueWrapper<any> => {
  return mount(ManageRightsDrawer, {
    props: {
      modelValue: true,
      selectedUser,
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
        id: mockedAccountId,
      },
    })
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

    it('should not display the tag if the role does not exist', async () => {
      wrapper = createWrapper({ ...mockedUser, role: undefined })
      await flushPromises()
      const pTag = wrapper.findComponent({ name: 'PTag' })

      expect(pTag.exists()).toBeFalsy()
    })
  })
  describe('events', () => {
    it("should emit 'update:modelValue' event when the drawer is closed", async () => {
      const pDrawer = wrapper.findComponent({ name: 'PDrawer' })
      pDrawer.vm.$emit('update:modelValue', false)
      await nextTick()

      expect(wrapper.emitted('update:modelValue')).toStrictEqual([[false]])
    })
    it('should close manage rights drawer when clicking on close buton', async () => {
      const manageRightsDrawer = wrapper.findComponent({ name: 'PDrawer' })
      manageRightsDrawer.vm.$emit('close-drawer-button')
      await nextTick()

      expect(wrapper.emitted('update:modelValue')).toStrictEqual([[false]])
    })
    it("should send a request to update the user's permissions if the accountID is missing", async () => {
      const spyAuthServices = vi.spyOn(
        authorizationServices,
        'updateUserPermissions',
      )
      mockedUseRoute.mockReturnValue({
        params: {
          id: undefined,
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
    it('should display a console error if the request to update permissions fails', async () => {

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

      expect(loggerErrorSpy).toHaveBeenCalledOnce()
      expect(loggerErrorSpy).toHaveBeenCalledWith(
        'Permission update unsuccessful :',
        expectedErrorMessage,
      )
    })
  })
})
