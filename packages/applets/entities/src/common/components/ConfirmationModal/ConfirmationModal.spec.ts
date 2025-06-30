import { shallowMount } from '@vue/test-utils'
import { nextTick } from 'vue'
import type { ConfirmationModalProps } from './ConfirmationModalTypes'

import ConfirmationModal from '.'

const defaultProps: ConfirmationModalProps = {
  modelValue: true,
  title: 'Test',
  content: 'Test Content',
  confirmButtonLabel: 'Confirmer',
  cancelButtonLabel: 'Annuler',
  isCancelButtonDisabled: false,
  isConfirmButtonDisabled: false,
  isConfirmButtonLoading: false,
}

const createWrapper = (override: Partial<ConfirmationModalProps> = {}) => {
  const props = {
    ...defaultProps,
    ...override,
  }

  return shallowMount(ConfirmationModal, {
    props,
    global: {
      stubs: {
        PDialog: {
          name: 'PDialog',
          template: '<div v-if="modelValue"><slot name="footer" /><slot /></div>',
          props: ['modelValue'],
        },
        PImage: true,
        PButton: true,
      },
    },
  })
}

describe('confirmationModal', () => {
  describe('display', () => {
    it('should display correctly the confirmation modal', () => {
      const wrapper = createWrapper()
      const dialog = wrapper.findComponent({ name: 'PDialog' })
      const cancelButton = wrapper.find('[data-testid="cancel-button"]')
      const confirmButton = wrapper.find('[data-testid="confirm-button"]')

      expect(dialog.exists()).toBeTruthy()
      expect(cancelButton.exists()).toBeTruthy()
      expect(confirmButton.exists()).toBeTruthy()
      expect(wrapper.props()).toStrictEqual(defaultProps)
    })

    it('should display the confirm button as disabled', async () => {
      const wrapper = createWrapper({
        isConfirmButtonDisabled: true,
      })
      await nextTick()
      const buttons = wrapper.findAllComponents({ name: 'PButton' })
      const confirmButton = buttons[1]

      expect(confirmButton.props('pDisabled')).toBeTruthy()
      expect(wrapper.html()).toMatchFileSnapshot('__snap__/ConfirmationModal.html')
    })

    const tests = [{
      isCancelButtonDisabled: false,
      isConfirmButtonDisabled: false,
      isConfirmButtonLoading: false,
      description: 'defaultState',
    }, {
      isCancelButtonDisabled: true,
      isConfirmButtonDisabled: true,
      isConfirmButtonLoading: true,
      description: 'loadingState',
    }]
    it.each(tests)('should display properly when buttons are disabled', async ({
      isCancelButtonDisabled,
      isConfirmButtonDisabled,
      isConfirmButtonLoading,
      description,
    }) => {
      const wrapper = createWrapper({
        isCancelButtonDisabled,
        isConfirmButtonDisabled,
        isConfirmButtonLoading,
      })

      const snapFilepath = `__snap__/ConfirmationModal.${description}.html`
      expect(wrapper.html()).toMatchFileSnapshot(snapFilepath)
    })
  })
  describe('events', () => {
    let wrapper: ReturnType<typeof createWrapper>
    beforeEach(async () => {
      wrapper = createWrapper()
      await nextTick()
    })
    it("should emit 'update:modelValue' when the model value is changed", async () => {
      const pDialog = wrapper.findComponent({ name: 'PDialog' })
      pDialog.vm.$emit('update:modelValue', false)
      await nextTick()

      expect(wrapper.emitted('update:modelValue')).toStrictEqual([[false]])
    })
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
