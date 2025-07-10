import { shallowMount, type VueWrapper } from '@vue/test-utils'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { loggerErrorSpy, loggerMock } from '@pulse/core/mocks'
import { deleteContactFromAccount } from '@entities/services/account'
import * as accountServices from '@entities/services/account'
import { nextTick } from 'vue'
import { RemoveUserDialogProps } from './RemoveUserDialogTypes'
import { RouteParam } from '@pulse/common/enums'

import RemoveUserDialog from '.'

const ACCOUNT_ID = '42'
const USER_TO_REMOVE: RemoveUserDialogProps['userToRemove'] = {
  initials: 'ab',
  fullName: 'a b',
  email: 'customEmail@labas.be',
  contactId: 4,
}

const spyPNotification = vi.hoisted(() => vi.fn())
vi.mock('@pulse/core', () => ({ logger: loggerMock }))

vi.mock('@pulse/styleguide', () => ({
  PNotification: spyPNotification,
}))

vi.mock('@entities/services/account', () => ({
  deleteContactFromAccount: vi.fn(() => Promise.resolve()),
}))

vi.mock('vue-router', () => ({
  useRoute: () => ({
    params: {
      [RouteParam.ENTITY_ID]: ACCOUNT_ID,
    },
  }),
}))

let wrapper: VueWrapper<any>
const createWrapper = (userToRemove: RemoveUserDialogProps['userToRemove'], isCollab?: boolean): VueWrapper<any> =>
  shallowMount(RemoveUserDialog, {
    props: {
      userToRemove,
      modelValue: true,
      isCollab,
    },
    global: {
      stubs: {
        PDialog: {
          name: 'PDialog',
          template: '<div><slot/><slot name="footer"/></div>',
          events: ['update:model-value'],
        },
        PUserCard: true,
      },
    },
  })

describe('removeUserDialog', () => {
  it('displays the user information that will be removed is FALSE', () => {
    wrapper = createWrapper(USER_TO_REMOVE)
    const { initials, fullName, email } = USER_TO_REMOVE
    const expectedConfirmationMessage = [
      'You are about to remove the user from this entity,',
      ' he will no longer be able to access it. Are you sure you want to continue?',
    ].join('\n')

    const pUserCardComponent = wrapper.findComponent({ name: 'PUserCard' })
    const confirmationMessage = wrapper.find('[data-testid="remove-user-dialog-confirmation-message"]')

    expect(pUserCardComponent.props()).toMatchObject({
      pAvatarContent: initials,
      pTitle: fullName,
      pSubtitle: email,
    })

    expect(confirmationMessage.text()).toBe(expectedConfirmationMessage)
  })

  it('displays the user information that will be removed when isCollab is TRUE', () => {
    wrapper = createWrapper(USER_TO_REMOVE, true)
    const expectedConfirmationMessage = [
      'You are about to remove the user from this folder,',
      ' he will no longer be able to access it. Are you sure you want to continue?',
    ].join('\n')

    const confirmationMessage = wrapper.find('[data-testid="remove-user-dialog-confirmation-message"]')

    expect(confirmationMessage.text()).toBe(expectedConfirmationMessage)
  })

  it('should not display the user card if the user to be removed is not selected', () => {
    wrapper = createWrapper(undefined)
    const pUserCardComponent = wrapper.findComponent({ name: 'PUserCard' })

    expect(pUserCardComponent.exists()).toBeFalsy()
  })

  describe('events', () => {
    beforeEach(() => {
      wrapper = createWrapper(USER_TO_REMOVE)
    })

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

      const expectedErrorMessage = 'API Error: 503 Service Unavailable'
      vi.spyOn(accountServices, 'deleteContactFromAccount').mockRejectedValue(
        expectedErrorMessage,
      )
      wrapper = createWrapper(USER_TO_REMOVE)
      expect(spyPNotification).not.toHaveBeenCalled()

      const removeUserButton = wrapper.find('[data-testid=remove-user-button]')
      await removeUserButton.trigger('click')
      await nextTick()

      expect(loggerErrorSpy).toHaveBeenCalledOnce()
      expect(spyPNotification).toHaveBeenCalledOnce()
      expect(loggerErrorSpy).toHaveBeenCalledWith(expectedErrorMessage)
    })
  })
})
