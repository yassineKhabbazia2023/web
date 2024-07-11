import { it, expect, describe, beforeEach } from 'vitest'
import type { VueWrapper } from '@vue/test-utils'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import type { ConfirmationModalProps } from './ConfirmationModalTypes'
import ConfirmationModal from '.'

const defaultProps: ConfirmationModalProps = {
  modelValue: true,
  title: 'Test',
  content: 'Test Content',
}

const createWrapper = (props = defaultProps) => {
  return mount(ConfirmationModal, {
    props,
  })
}

describe('confirmationModal', () => {
  let wrapper: VueWrapper
  beforeEach(async () => {
    wrapper = createWrapper()
    await nextTick()
  })
  describe('display', () => {
    it('should display correctly the confirmation modal', () => {
      const dialog = wrapper.findComponent({ name: 'PDialog' })
      const cancelButton = wrapper.find('[data-testid="cancel-button"]')
      const confirmButton = wrapper.find('[data-testid="confirm-button"]')

      expect(dialog.exists()).toBeTruthy()
      expect(cancelButton.exists()).toBeTruthy()
      expect(confirmButton.exists()).toBeTruthy()
      expect(wrapper.props()).toStrictEqual(defaultProps)
    })
  })
  describe('events', () => {
    it("should emit 'update:modelValue' when the model value is changed by a click event", async () => {
      const cancelButton = wrapper.find('[data-testid="cancel-button"]')
      wrapper.setProps({ modelValue: false })

      await cancelButton.trigger('click')
      await nextTick()
      expect(wrapper.emitted('update:modelValue')).toStrictEqual([[false]])
    })
    it("should emit the 'confirm' event after clicking the confirm button", async () => {
      const confirmButton = wrapper.find('[data-testid="confirm-button"]')

      await confirmButton.trigger('click')
      await nextTick()
      expect(wrapper.emitted('confirm')).toBeTruthy()
    })
  })
})
