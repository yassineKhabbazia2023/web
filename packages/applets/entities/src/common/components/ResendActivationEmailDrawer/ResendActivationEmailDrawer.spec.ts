import { nextTick } from 'vue'
import '@entities/__mocks__/common.import.mocks'
import { authorizationServiceMock } from '@entities/__mocks__/authorization.service.mocks'
import { loggerErrorSpy, loggerMock } from '@pulse/core/mocks'
import { walletServiceMock } from '@entities/__mocks__/wallet.service.mocks'
import { mockedAccount, mockedAccountType, mockedUserClientAccount } from '@entities/__mocks__/account.mocks'
import { expect, beforeEach, describe, it, vi } from 'vitest'
import { type VueWrapper, mount, flushPromises } from '@vue/test-utils'
import TableData from '@entities/pages/folder/pages/usersClient/components/TableData'
import * as walletServices from '@entities/services/wallet'
import * as contactServices from '@entities/services/contact'
import * as helpers from '@entities/common/utils'
import { AmplitudeService } from '@pulse/common/services/amplitude'
import ResendActivationEmailDrawer from '.'

// Mocks
vi.mock('@entities/services/authorization', () => authorizationServiceMock)
vi.mock('@pulse/core', () => ({ logger: loggerMock }))
vi.mock('vue-router')
vi.mock('@entities/services/wallet', () => walletServiceMock)

const createWrapper = (): VueWrapper<any> => {
  return mount(ResendActivationEmailDrawer, {
    props: {
      modelValue: true,
      selectedAccount: mockedAccount,
    },
  })
}

describe('resendActivationEmailDrawer', () => {
  let wrapper: VueWrapper<any>
  beforeEach(async () => {
    wrapper = createWrapper()
    await flushPromises()
  })
  describe('display', () => {
    it("should correctly display the drawer header with the account information and the user's client table", () => {
      const accountTypeTag = wrapper.findComponent({ name: 'PTag' })
      const accountCard = wrapper.findComponent({ name: 'PUserCard' })
      const usersClientAccountTable = wrapper.findComponent(TableData)

      const expectedAccountCardProps = {
        pTitle: mockedAccount.name,
        pSubtitle: mockedAccount.accountNumber,
      }
      const expectedAccountTypeTagProps = {
        pContent: mockedAccountType,
      }

      expect(usersClientAccountTable.exists()).toBeTruthy()
      expect(accountCard.props()).toMatchObject(expectedAccountCardProps)
      expect(accountTypeTag.props()).toMatchObject(expectedAccountTypeTagProps)
    })
  })
  describe('events', () => {
    it('should close resend activation email drawer when clicking on close buton', async () => {
      const resendActivationEmailDrawer = wrapper.findComponent({
        name: 'PDrawer',
      })
      resendActivationEmailDrawer.vm.$emit('close-drawer-button')
      await nextTick()

      expect(wrapper.emitted('update:modelValue')).toStrictEqual([[false]])
    })
    it('should handle selecting a user when a user clicks on a user in the table', async () => {
      const usersClientAccountTable = wrapper.findComponent(TableData)
      usersClientAccountTable.vm.$emit('select-user', [
        mockedUserClientAccount.contactId,
      ])
      await nextTick()

      expect(wrapper.vm.selectedUsersIds).toStrictEqual([
        mockedUserClientAccount.contactId,
      ])
    })
    it('should send a request to the contact API to invite all selected customers when submitting', async () => {
      const trackAmplitudeSpy = vi.spyOn(AmplitudeService, 'track')
      const inviteCustomersSpy = vi
        .spyOn(contactServices, 'inviteCustomers')
        .mockResolvedValue([mockedUserClientAccount.contactId])
      const displayNotificationSpy = vi.spyOn(helpers, 'displayNotification')
      wrapper = createWrapper()
      await flushPromises()
      const usersClientAccountTable = wrapper.findComponent(TableData)
      const resendActivationEmailButton = wrapper.findComponent(
        '[data-testid=resend-activation-email-submit-button]',
      )
      usersClientAccountTable.vm.$emit('select-user', [
        mockedUserClientAccount.contactId,
      ])
      await nextTick()
      resendActivationEmailButton.trigger('click')
      await flushPromises()

      expect(trackAmplitudeSpy).toHaveBeenCalledOnce()
      expect(inviteCustomersSpy).toHaveBeenCalledOnce()
      expect(displayNotificationSpy).toHaveBeenCalledOnce()
      expect(inviteCustomersSpy).toHaveBeenCalledWith(
        [mockedUserClientAccount.contactId],
        mockedAccount.accountNumber,
      )
      expect(displayNotificationSpy).toHaveBeenCalledWith(
        'success',
        'The selected customer has been successfully invited.',
      )
    })
    it('should display a toast notification if the request to invite customers fails', async () => {
      const expectedErrorMessage = 'API Error: 503 Service Unavailable'
      const trackAmplitudeSpy = vi.spyOn(AmplitudeService, 'track')
      const spyInviteCustomers = vi
        .spyOn(contactServices, 'inviteCustomers')
        .mockRejectedValue(expectedErrorMessage)
      const spyDisplayNotification = vi.spyOn(helpers, 'displayNotification')
      wrapper = createWrapper()
      await flushPromises()
      const usersClientAccountTable = wrapper.findComponent(TableData)
      const resendActivationEmailButton = wrapper.findComponent(
        '[data-testid=resend-activation-email-submit-button]',
      )
      usersClientAccountTable.vm.$emit('select-user', [
        mockedUserClientAccount.contactId,
      ])
      await nextTick()
      resendActivationEmailButton.trigger('click')
      await flushPromises()

      expect(trackAmplitudeSpy).toHaveBeenCalledOnce()
      expect(spyInviteCustomers).toHaveBeenCalledOnce()
      expect(spyDisplayNotification).toHaveBeenCalledOnce()
      expect(spyInviteCustomers).toHaveBeenCalledWith(
        [mockedUserClientAccount.contactId],
        mockedAccount.accountNumber,
      )
      expect(spyDisplayNotification).toHaveBeenCalledWith(
        'error',
        'There was an issue inviting all selected customers.',
      )
    })
    it('should display a console error if the request to fetch users client account fails', async () => {

      const expectedErrorMessage = 'API Error: 503 Service Unavailable'
      vi.spyOn(walletServices, 'fetchAccountContacts').mockRejectedValue(
        expectedErrorMessage,
      )
      wrapper = createWrapper()
      await flushPromises()

      expect(loggerErrorSpy).toHaveBeenCalledOnce()
      expect(loggerErrorSpy).toHaveBeenCalledWith(
        'Error fetching users client account :',
        expectedErrorMessage,
      )
    })
  })
  describe('functions', () => {
    it('should return the appropriate status object', () => {
      const { getStatus } = wrapper.vm
      const declared = getStatus('Declared')
      const connected = getStatus('Connected')
      const invited = getStatus('Invited')

      expect(declared).toMatchObject({
        text: 'Declared',
        iconName: 'patchCheck',
        color: 'gray-900',
      })
      expect(connected).toMatchObject({
        text: 'Connected',
        iconName: 'power',
        color: 'success',
      })
      expect(invited).toMatchObject({
        text: 'Invited',
        iconName: 'person',
        color: 'persian',
      })
    })
  })
})
