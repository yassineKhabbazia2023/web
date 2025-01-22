import SingleInputModal from '@ged/modules/common/templates/modals'
import type { VueWrapper } from '@vue/test-utils'
import { mount } from '@vue/test-utils'
import { describe, it, expect, beforeEach } from 'vitest'
import { type SingleInputModalProps } from '@ged/modules/common/templates/modals/SingleInputModalTypes'
import { createPinia, setActivePinia } from 'pinia'
import type { ComponentPublicInstance } from 'vue'
import { nextTick } from 'vue'

const defaultProps: SingleInputModalProps = {
  modalTitle: 'string',
  isDialogVisible: false,
  inputLabel: 'string',
  inputPlaceHolder: 'string',
  confirmBtnabel: 'string',
  cancelBtnLabel: 'string',
  isConfirmButtonDisabled: false,
  isValidInput: false,
  showErrorMsg: false,
  errorMsg: 'string',
  isConfirmButtonLoading: false,
  defaultInputContentValue: '',
}

// To access variables declared within the setup
type SingleInputModalSetup = {
  inputContent: string
  isDialogVisible: boolean
}

export type SingleInputModalWrapper = VueWrapper<
  ComponentPublicInstance<SingleInputModalProps, SingleInputModalSetup>
>

const pinia = createPinia()

const createWrapper = (
  props: SingleInputModalProps = defaultProps,
): SingleInputModalWrapper => {
  return mount(SingleInputModal, {
    props,
    global: {
      plugins: [pinia],
    },
    attrs: {
      inputContent: String,
    },
  }) as SingleInputModalWrapper
}

describe('singleInputModal', () => {

  beforeEach(() => {
    setActivePinia(pinia)
  })

  describe('props', () => {
    it('should set unValid class to the modal input when not valid', async () => {
      const updatedProps: SingleInputModalProps = {
        ...defaultProps,
        isDialogVisible: true,
        isValidInput: false,
      }

      const wrapper = createWrapper(updatedProps)
      await nextTick()
      const unvalidInput = wrapper.findComponent('.unValid')
      expect(unvalidInput.exists()).toBeTruthy()
    })

    it('should display error message section when showErrorMsg is true', async () => {
      const updatedProps: SingleInputModalProps = {
        ...defaultProps,
        isDialogVisible: true,
        showErrorMsg: true,
      }
      const wrapper = createWrapper(updatedProps)
      await nextTick()

      const errorMsgSection = wrapper.find(
        '.single-input-modal__input-error',
      )
      expect(
        errorMsgSection.exists(),
      ).toBeTruthy()
    })

    it('shoud display suffix if it is defined', async () => {
      const wrapper = createWrapper({
        ...defaultProps,
        isDialogVisible: true,
        inputSuffix: '.jpg',
      })

      await nextTick()
      const unvalidInput = wrapper.find(
        '.single-input-modal__suffix',
      )

      expect(unvalidInput.exists()).toBeTruthy()
    })
  })

  describe('interactions', () => {
    it('should emit on-confirm-action-click on confirm btn click', async () => {
      const updatedProps: SingleInputModalProps = {
        ...defaultProps,
        isDialogVisible: true,
        isValidInput: true,
      }

      const wrapper = createWrapper(updatedProps)
      await nextTick()

      const input = wrapper.find('input')
      input.setValue('hellooooo')
      const confirmButton = wrapper.find(
        '.el-button--primary',
      )

      await confirmButton.trigger('click')

      await nextTick()
      expect(wrapper.emitted('on-confirm-action-click')).toHaveLength(1)
    })
    it('should emit on-cancel-action-click when cancel btn click', async () => {
      const updatedProps: SingleInputModalProps = {
        ...defaultProps,
        isDialogVisible: true,
        isValidInput: true,
      }

      const wrapper = createWrapper(updatedProps)
      await nextTick()

      const cancelButton = wrapper.find('.cancel-action-button')

      await cancelButton.trigger('click')

      await nextTick()

      expect(wrapper.emitted('on-cancel-action-click')).toHaveLength(1)
    })

    it('should emit on-close-modal when click on close dilaog button', async () => {
      const updatedProps: SingleInputModalProps = {
        ...defaultProps,
        isDialogVisible: true,
      }
      const wrapper = createWrapper(updatedProps)
      await nextTick()

      const pdialog = wrapper.findComponent({ name: 'PDialog' })

      await pdialog.vm.$emit('close')
      await nextTick()

      expect(wrapper.emitted('on-close-modal')).toBeTruthy()
    })
    it('should emit update:isDialogVisible when isDialogVisible has changed', async () => {
      const wrapper = createWrapper()

      wrapper.vm.isDialogVisible = true
      await nextTick()

      expect(wrapper.emitted('update:isDialogVisible')).toBeTruthy()
    })
  })
})
