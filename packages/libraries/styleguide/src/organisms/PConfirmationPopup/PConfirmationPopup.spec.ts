import { shallowMount } from '@vue/test-utils'

import { type PConfirmationPopupProps } from './PConfirmationPopupTypes'
import { nextTick } from 'vue'
import PConfirmationPopup from '.'
import type { ComponentWrapper } from '@pulse/toolbox/utils/test'

const defaultProps: PConfirmationPopupProps = {
  pIsVisible: true,
  pTitle: 'title',
  pConfirmButtonContent: 'confirm',
  pCancelButtonContent: 'cancel',
  pConfirmButtonIsLoading: false,
  pNoCloseButton: false,
  pAlignCenter: false,
}

function createWrapper(
  overriddenProps: Partial<PConfirmationPopupProps> = {},
): ComponentWrapper<InstanceType <typeof PConfirmationPopup>> {
  const props = {
    ...defaultProps,
    ...overriddenProps,
  }
  return shallowMount(PConfirmationPopup, {
    props,
    global: {
      stubs: {
        PDialog: {
          name: 'PDialog',
          template: '<div><slot /><slot name="footer" /></div>',
          props: [
            'model-value',
            'pTitle',
            'pNoCloseButton',
            'pAlignCenter',
          ],
          events: [
            'update:model-value',
            'close',
          ],
        },
        PButton: true,
      },
    },
  })
}

describe('confirmationPopup', () => {
  describe('props', () => {
    it('should call PDialog with proper props when pIsVisible is TRUE', async () => {
      const wrapper = createWrapper()
      const pDialog = wrapper.findComponent({ name: 'PDialog' })

      expect(pDialog.exists()).toBeTruthy()
      await expect(pDialog.props()).toMatchFileSnapshot('__snap__/pDialog/isVisible.props.snap')
    })

    it('should call PDialog with proper props when pIsVisible is FALSE', async () => {
      const wrapper = createWrapper({
        pIsVisible: false,
      })
      const pDialog = wrapper.findComponent({ name: 'PDialog' })

      expect(pDialog.exists()).toBeTruthy()
      await expect(pDialog.props()).toMatchFileSnapshot('__snap__/pDialog/isNotVisible.props.snap')
    })

    it('should set the confirmation button in loading state when loading prop is true',
      async () => {
        const wrapper = createWrapper({
          pConfirmButtonIsLoading: true,
        })
        const buttons = wrapper.findAllComponents({ name: 'PButton' })
        const confirmationButton = buttons.at(1)

        expect(buttons).toHaveLength(2)
        await expect(confirmationButton?.props()).toMatchFileSnapshot('__snap__/confirmationButton/isLoading.props.snap')
      })
  })

  describe('interactions', () => {
    it('should emit on-confirm-button-click when click on confirm button', async () => {
      const wrapper = createWrapper()
      const confirmButton = wrapper.find('[data-testid="p-confirmation-popup-confirm-button"]')
      await confirmButton.trigger('click')

      expect(wrapper.emitted('on-confirm-button-click')).toBeTruthy()
      expect(wrapper.emitted('on-cancel-button-click')).toBeFalsy()
    })

    it('should emit on-cancel-button-click when click on cancel button', async () => {
      const wrapper = createWrapper()
      const cancelButton = wrapper.find('[data-testid="p-confirmation-popup-cancel-button"]')
      await cancelButton.trigger('click')

      expect(wrapper.emitted('on-confirm-button-click')).toBeFalsy()
      expect(wrapper.emitted('on-cancel-button-click')).toBeTruthy()
    })

    it('should emit on-close-popup when click on close dialog button', async () => {
      const wrapper = createWrapper()
      const pdialog = wrapper.findComponent({ name: 'PDialog' })

      await pdialog.vm.$emit('close')
      await nextTick()

      expect(wrapper.emitted('on-close-popup')).toBeTruthy()
    })
    it('should emit update:pIsVisible when pIsVisible value has changed', async () => {
      const wrapper = createWrapper()
      const pdialog = wrapper.findComponent({ name: 'PDialog' })
      const expectedEmit = false

      await pdialog.vm.$emit('update:model-value', false)

      await nextTick()

      expect(wrapper.emitted('update:pIsVisible')).toStrictEqual([[expectedEmit]])
    })
  })
})
