import { mount, type VueWrapper } from '@vue/test-utils'
import { beforeEach, describe, expect, it, type MockInstance, vi } from 'vitest'
import { deleteContactFromAccount } from '@entities/services/account'
import * as accountServices from '@entities/services/account'
import { nextTick } from 'vue'
import RemoveUserDialog from '.'

const ACCOUNT_ID = '42'
const USER_TO_REMOVE = {
  initials: 'ab',
  fullName: 'a b',
  email: 'customEmail@labas.be',
  contactId: 4,
}

const spyPNotification = vi.hoisted(() => vi.fn())
vi.mock('@pulse/styleguide', () => ({
  PNotification: spyPNotification,
}))

vi.mock('@entities/services/account', () => ({
  deleteContactFromAccount: vi.fn(() => Promise.resolve()),
}))

vi.mock('vue-router', () => ({
  useRoute: () => ({
    params: {
      id: ACCOUNT_ID,
    },
  }),
}))

let wrapper: VueWrapper<any>
const createWrapper = (userToRemove: any): VueWrapper<any> =>
  mount(RemoveUserDialog, {
    props: {
      userToRemove,
      modelValue: true,
    },
    global: {
      stubs: {
        PDialog: {
          name: 'PDialog',
          template: '<div><slot/><slot name="footer"/></div>',
          events: ['update:model-value'],
        },
      },
    },
  })

describe('removeUserDialog', () => {
  beforeEach(() => {
    wrapper = createWrapper(USER_TO_REMOVE)
  })

  it('displays the user information that will be removed', () => {
    const { initials, fullName, email } = USER_TO_REMOVE

    const pUserCardComponent = wrapper.findComponent({ name: 'PUserCard' })

    expect(pUserCardComponent.props()).toMatchObject({
      pAssetContent: initials,
      pTitle: fullName,
      pSubtitle: email,
    })
  })

  it('should not display the user card if the user to be removed is not selected', () => {
    wrapper = createWrapper(undefined)
    const pUserCardComponent = wrapper.findComponent({ name: 'PUserCard' })

    expect(pUserCardComponent.exists()).toBeFalsy()
  })

  describe('events', () => {
    it('should close the dialog when the cancel button is clicked', async () => {
      const dialog = wrapper.findComponent({ name: 'PDialog' })
      const dialogCloseButton = wrapper.findComponent(
        '[data-testid=dialog-close-button]',
      )

      dialogCloseButton.trigger('click')
      await nextTick()

      expect(dialog.props('modelValue')).toBeFalsy()
      expect(wrapper.emitted('update:modelValue')).toStrictEqual([[false]])
    })

    it("should emit the 'update:model-value' event when modelValue changes", async () => {
      const dialog = wrapper.findComponent({ name: 'PDialog' })

      dialog.vm.$emit('update:model-value', false)
      await nextTick()

      expect(wrapper.emitted('update:modelValue')).toStrictEqual([[false]])
    })

    it('removes a user and display a success notification', async () => {
      expect(spyPNotification).not.toHaveBeenCalled()

      const removeUserButton = wrapper.find('[data-testid=remove-user-button]')
      await removeUserButton.trigger('click')

      expect(vi.mocked(deleteContactFromAccount)).toHaveBeenCalledOnce()
      expect(vi.mocked(deleteContactFromAccount)).toHaveBeenCalledWith(
        Number(ACCOUNT_ID),
        USER_TO_REMOVE.contactId,
      )
      expect(spyPNotification).toHaveBeenCalledOnce()
      expect(wrapper.emitted('user-removed')).toBeTruthy()
      expect(wrapper.emitted('update:modelValue')).toStrictEqual([[false]])
    })

    it('removes a user and displays an error notification if the operation fails', async () => {
      const spyConsole = vi.spyOn(console, 'error')
      const expectedErrorMessage = 'API Error: 503 Service Unavailable'
      vi.spyOn(accountServices, 'deleteContactFromAccount').mockRejectedValue(
        expectedErrorMessage,
      )
      wrapper = createWrapper(USER_TO_REMOVE)
      expect(spyPNotification).not.toHaveBeenCalled()

      const removeUserButton = wrapper.find('[data-testid=remove-user-button]')
      await removeUserButton.trigger('click')
      await nextTick()

      expect(spyConsole).toHaveBeenCalledOnce()
      expect(spyPNotification).toHaveBeenCalledOnce()
      expect(spyConsole).toHaveBeenCalledWith(expectedErrorMessage)
    })
  })
})
