import { nextTick } from 'vue'
import { expect, beforeEach, describe, it, vi } from 'vitest'
import { type VueWrapper, mount, flushPromises } from '@vue/test-utils'
import type { AccountRow } from '@/common/types'
import TableData from '@/pages/folder/pages/usersClient/components/TableData'
import * as walletServices from '@/services/wallet'
import ResendActivationEmailDrawer from '.'

// Mocks
const mockedAccountType = 'Client Company'
const mockedAccount: AccountRow = {
  accountId: 1,
  name: 'Pizza Planet',
  accountNumber: '70006400886',
}
const mockedUserClientAccount = {
  contactId: 68,
  contactGlobalUniqueId: 'c65ab52a-89a4-4eb7-93e5-5e3bb2d54676',
  firstName: 'Hugo',
  lastName: 'Lopez',
  email: 'hugo.lopez@example.com',
  status: 'Declared',
  personaName: 'ADMIN/Dirigeant',
  creationDate: '2024-04-29T09:33:07.8366667',
}
vi.mock('vue-router')
vi.mock('@/services/wallet', () => ({
  fetchAccountContacts: vi.fn(() => Promise.resolve({ items: [mockedUserClientAccount] })),
}))

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
      usersClientAccountTable.vm.$emit('select-user', [mockedUserClientAccount.contactId])
      await nextTick()

      expect(wrapper.vm.selectedUsersIds).toStrictEqual([mockedUserClientAccount.contactId])
    })
    it('should display a console error if the request to fetch users client account fails', async () => {
      const spyConsole = vi.spyOn(console, 'error')
      const expectedErrorMessage = 'API Error: 503 Service Unavailable'
      vi.spyOn(walletServices, 'fetchAccountContacts').mockRejectedValue(
        expectedErrorMessage,
      )
      wrapper = createWrapper()
      await flushPromises()

      expect(spyConsole).toHaveBeenCalledOnce()
      expect(spyConsole).toHaveBeenCalledWith(
        'Error fetching users client account :',
        expectedErrorMessage,
      )
    })
  })
})
