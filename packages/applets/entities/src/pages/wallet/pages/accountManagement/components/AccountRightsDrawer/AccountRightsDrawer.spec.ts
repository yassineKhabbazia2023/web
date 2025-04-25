import { nextTick } from 'vue'
import '@entities/__mocks__/common.import.mocks'
import { loggerErrorSpy, loggerMock } from '@pulse/core/mocks'
import { authorizationServiceMock } from '@entities/__mocks__/authorization.service.mocks'
import { mockedAccount, mockedAccountType } from '@entities/__mocks__/account.mocks'
import { expect, beforeEach, describe, it, vi } from 'vitest'
import { type VueWrapper, mount, flushPromises } from '@vue/test-utils'
import * as authorizationServices from '@entities/services/authorization'
import { ContactType } from '@pulse/common/enums'
import AccountRightsDrawer from '.'

// Mocks
vi.mock('@entities/services/authorization', () => authorizationServiceMock)
vi.mock('@pulse/core', () => ({ logger: loggerMock }))
vi.mock('vue-router')

const createWrapper = (): VueWrapper<any> => {
  return mount(AccountRightsDrawer, {
    props: {
      modelValue: true,
      selectedAccount: mockedAccount,
    },
  })
}

describe('accountRightsDrawer', () => {
  let wrapper: VueWrapper<any>
  beforeEach(async () => {
    wrapper = createWrapper()
    await flushPromises()
  })
  describe('display', () => {
    it("should correctly display the drawer header with the account's information and rights list", () => {
      const permissionTypeTabs = wrapper.findComponent({ name: 'PTabs' })
      const accountTypeTag = wrapper.findComponent({ name: 'PTag' })
      const accountCard = wrapper.findComponent({ name: 'PUserCard' })
      const rightsList = wrapper.findComponent({ name: 'RightsList' })

      const expectedActiveTab = 'clientPermissions'
      const expectedAccountCardProps = {
        pTitle: mockedAccount.name,
        pSubtitle: mockedAccount.accountNumber,
      }
      const expectedAccountTypeTagProps = {
        pContent: mockedAccountType,
      }

      expect(rightsList.exists()).toBeTruthy()
      expect(permissionTypeTabs.exists()).toBeTruthy()
      expect(wrapper.vm.activeTab).toBe(expectedActiveTab)
      expect(accountCard.props()).toMatchObject(expectedAccountCardProps)
      expect(accountTypeTag.props()).toMatchObject(expectedAccountTypeTagProps)
    })
  })
  describe('events', () => {
    it('should close account rights drawer when clicking on close buton', async () => {
      const accountRightsDrawer = wrapper.findComponent({ name: 'PDrawer' })
      accountRightsDrawer.vm.$emit('close-drawer-button')
      await nextTick()

      expect(wrapper.emitted('update:modelValue')).toStrictEqual([[false]])
    })
    it("should request an update to clients' account permissions when the submit button is clicked", async () => {
      const spyAuthServices = vi.spyOn(
        authorizationServices,
        'updateAccountPermissions',
      )
      wrapper = createWrapper()
      await flushPromises()
      const submitButton = wrapper.find(
        '[data-testid=account-rights-submit-button]',
      )

      await submitButton.trigger('click')

      expect(spyAuthServices).toHaveBeenCalledOnce()
      expect(spyAuthServices).toHaveBeenCalledWith(
        mockedAccount.accountId,
        ContactType.CUSTOMER,
        ['CLUSER001', 'CLUSER002', 'COADMI001'],
      )
    })
    it("should request an update to collabs' account permissions when the submit button is clicked", async () => {
      const spyAuthServices = vi.spyOn(
        authorizationServices,
        'updateAccountPermissions',
      )
      wrapper = createWrapper()
      await flushPromises()
      wrapper.vm.activeTab = 'collabPermissions'
      await flushPromises()
      const submitButton = wrapper.find(
        '[data-testid=account-rights-submit-button]',
      )

      await submitButton.trigger('click')

      expect(spyAuthServices).toHaveBeenCalledOnce()
      expect(spyAuthServices).toHaveBeenCalledWith(
        mockedAccount.accountId,
        ContactType.COLLABORATOR,
        ['CLUSER001', 'CLUSER002', 'COADMI001'],
      )
    })
    it('should display a console error if the request to update permissions fails', async () => {

      const expectedErrorMessage = 'API Error: 503 Service Unavailable'
      vi.spyOn(
        authorizationServices,
        'updateAccountPermissions',
      ).mockRejectedValue(expectedErrorMessage)
      wrapper = createWrapper()
      await flushPromises()
      const submitButton = wrapper.find(
        '[data-testid=account-rights-submit-button]',
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
