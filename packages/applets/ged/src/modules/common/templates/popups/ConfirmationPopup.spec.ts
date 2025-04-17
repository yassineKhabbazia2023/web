import ConfirmationPopup from '@ged/modules/common/templates/popups'
import type { VueWrapper } from '@vue/test-utils'
import { mount } from '@vue/test-utils'
import { type ConfirmationPopupProps } from
  '@ged/modules/common/templates/popups/ConfirmationPopupTypes'
import type { ComponentPublicInstance } from 'vue'
import { nextTick } from 'vue'

const defaultProps: ConfirmationPopupProps = {
  isPopupVisible: false,
  title: '',
  message: '',
  confirmButtonContent: '',
  cancelButtonContent: 'Content !',
  isConfirmButtonLoading: false,
  showClose: true,
  alignCenter: false,
}

type ConfirmationPopupSetup = {
  isPopupVisible: boolean
}

export type ConfirmationPopupWrapper = VueWrapper<
  ComponentPublicInstance<ConfirmationPopupProps, ConfirmationPopupSetup>
>

const createWrapper = (
  props: ConfirmationPopupProps = defaultProps,
): ConfirmationPopupWrapper =>
  mount(ConfirmationPopup, {
    props,
  }) as unknown as ConfirmationPopupWrapper

const getPopupConfirmationButton = (wrapper: VueWrapper) =>
  wrapper.find('.confirmation-popup__confirm-button')
describe('confirmationPopup', () => {
  describe('props', () => {
    it('should display popup when isPopupVisible is true', () => {
      const wrapper = createWrapper()
      expect(wrapper.find('.confirmation-popup__message').exists()).toBeFalsy()
    })

    it('should hide popup when isPopupVisible is false', () => {
      const updatedProps: ConfirmationPopupProps = {
        ...defaultProps,
        isConfirmButtonLoading: false,
      }

      const wrapper = createWrapper(updatedProps)
      const dialog = wrapper.findComponent({ name: 'PDialog' })
      expect(dialog.exists()).toBeTruthy()
    })

    it('should set the confirmation button in loading state when loading prop is true',
      async () => {
        const updatedProps: ConfirmationPopupProps = {
          ...defaultProps,
          isPopupVisible: true,
          isConfirmButtonLoading: true,
        }

        const wrapper = createWrapper(updatedProps)
        await nextTick()
        const confirmationButton = getPopupConfirmationButton(wrapper)

        expect(confirmationButton.find('.is-loading').exists()).toBeTruthy()
      })
  })

  describe('interactions', () => {
    it('should emit on-confirm-button-click when click on confirmation button', async () => {
      const updatedProps: ConfirmationPopupProps = {
        ...defaultProps,
        isPopupVisible: true,
      }
      const wrapper = createWrapper(updatedProps)
      await nextTick()

      const confirmationButton = getPopupConfirmationButton(wrapper)

      await confirmationButton.trigger('click')
      expect(wrapper.emitted('on-confirm-button-click')).toBeTruthy()
    })

    it('should emit on-cancel-button-click when click on cancel button', async () => {
      const updatedProps: ConfirmationPopupProps = {
        ...defaultProps,
        isPopupVisible: true,
      }
      const wrapper = createWrapper(updatedProps)
      await nextTick()
      const cancelButton = wrapper.find('.confirmation-popup__cancel-button')

      await cancelButton.trigger('click')

      expect(wrapper.emitted('on-cancel-button-click')).toBeTruthy()
    })

    it('should emit on-close-popup when click on close dialog button', async () => {
      const updatedProps: ConfirmationPopupProps = {
        ...defaultProps,
        isPopupVisible: true,
      }
      const wrapper = createWrapper(updatedProps)
      const pdialog = wrapper.findComponent({ name: 'PDialog' })

      await pdialog.vm.$emit('close')
      await nextTick()

      expect(wrapper.emitted('on-close-popup')).toBeTruthy()
    })
    it('should emit update:isPopupVisible when isPopupVisible value has changed', async () => {
      const updatedProps: ConfirmationPopupProps = {
        ...defaultProps,
      }
      const wrapper = createWrapper(updatedProps)
      wrapper.vm.isPopupVisible = true

      await nextTick()

      expect(wrapper.emitted('update:isPopupVisible')).toBeTruthy()
    })
  })
})
