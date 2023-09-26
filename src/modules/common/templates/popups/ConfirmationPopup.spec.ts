import ConfirmationPopup from '@/modules/common/templates/popups'
import { VueWrapper, mount } from '@vue/test-utils'
import { describe, it, expect, beforeEach } from 'vitest'
import { type ConfirmationPopupProps } from
  '@/modules/common/templates/popups/ConfirmationPopupTypes'
import { dynamicUntilFound, dynamicUntilFoundComponent } from '@kpmg/common/src/testing-helpers'
import { createPinia, setActivePinia } from 'pinia'
import { PDialog } from '@kpmg/styleguide'
import { ComponentPublicInstance } from 'vue'

const defaultProps: ConfirmationPopupProps = {
  isPopupVisible: false,
  title: '',
  message: '',
  confirmButtonContent: '',
  cancelButtonContent: '',
  isConfirmButtonLoading: false
}

type ConfirmationPopupSetup = {
  isPopupVisible: boolean
}

export type ConfirmationPopupWrapper = VueWrapper<
  ComponentPublicInstance<ConfirmationPopupProps, ConfirmationPopupSetup>
>

const pinia = createPinia()

const createWrapper = (
  props: ConfirmationPopupProps = defaultProps
): ConfirmationPopupWrapper =>
  mount(ConfirmationPopup, {
    props,
    global: {
      plugins: [pinia]
    }
  }) as unknown as ConfirmationPopupWrapper

describe('confirmationPopup', () => {
  // eslint-disable-next-line vitest/no-hooks
  beforeEach(() => {
    setActivePinia(pinia)
  })

  describe('props', () => {

    it('should display popup when isPopupVisible is true', async () => {

      const wrapper = createWrapper()
      expect(wrapper.find('.confirmation-popup__message').exists()).toBeFalsy()
    })

    it('should hide popup when isPopupVisible is false', async () => {
      const updatedProps: ConfirmationPopupProps = {
        ...defaultProps,
        isConfirmButtonLoading: false
      }

      const wrapper = createWrapper(updatedProps)
      const dialog = await dynamicUntilFoundComponent(wrapper, PDialog)
      expect(dialog.exists()).toBeTruthy()
    })

    it('should set the confirmation button in loading state when loading prop is true',
      async () => {
        const updatedProps: ConfirmationPopupProps = {
          ...defaultProps,
          isPopupVisible: true,
          isConfirmButtonLoading: true
        }

        const wrapper = createWrapper(updatedProps)
        const confirmationButton = await dynamicUntilFound(
          wrapper,
          '.confirmation-popup__confirm-button'
        )

        expect(confirmationButton.find('.is-loading').exists()).toBeTruthy()
      })
  })

  describe('interactions', () => {
    it('should emit on-confirm-button-click when click on confirmation button', async () => {
      const updatedProps: ConfirmationPopupProps = {
        ...defaultProps,
        isPopupVisible: true
      }
      const wrapper = createWrapper(updatedProps)

      const confirmationButton = await dynamicUntilFound(
        wrapper,
        '.confirmation-popup__confirm-button'
      )

      await confirmationButton.trigger('click')

      await wrapper.vm.$nextTick()

      expect(wrapper.emitted('on-confirm-button-click')).toBeTruthy()

    })

    it('should emit on-cancel-button-click when click on cancel button', async () => {
      const updatedProps: ConfirmationPopupProps = {
        ...defaultProps,
        isPopupVisible: true
      }
      const wrapper = createWrapper(updatedProps)

      const cancelButton = await dynamicUntilFound(
        wrapper,
        '.confirmation-popup__cancel-button'
      )

      await cancelButton.trigger('click')

      await wrapper.vm.$nextTick()

      expect(wrapper.emitted('on-cancel-button-click')).toBeTruthy()
    })

    it('should emit on-close-popup when click on close dilaog button', async () => {
      const updatedProps: ConfirmationPopupProps = {
        ...defaultProps,
        isPopupVisible: true
      }
      const wrapper = createWrapper(updatedProps)
      const pdialog = await dynamicUntilFoundComponent(wrapper, PDialog)

      await pdialog.vm.$emit('close')
      await wrapper.vm.$nextTick()

      expect(wrapper.emitted('on-close-popup')).toBeTruthy()
    })
    it('should emit update:isPopupVisible when isPopupVisible value has changed', async () => {
      const updatedProps: ConfirmationPopupProps = {
        ...defaultProps
      }
      const wrapper = createWrapper(updatedProps)
      wrapper.vm.isPopupVisible = true

      await wrapper.vm.$nextTick()

      expect(wrapper.emitted('update:isPopupVisible')).toBeTruthy()
    })
  })

})
