import SingleInputModal from '@/modules/common/templates/modals'
import { VueWrapper, mount } from '@vue/test-utils'
import { describe, it, expect, beforeEach } from 'vitest'
import { type SingleInputModalProps } from '@/modules/common/templates/modals/SingleInputModalTypes'
import { dynamicUntilFound, dynamicUntilFoundComponent } from '@kpmg/common/src/testing-helpers'
import { createPinia, setActivePinia } from 'pinia'
import { PDialog } from '@kpmg/styleguide'
import { ComponentPublicInstance } from 'vue'

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
  defaultInputContentValue: ''
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
  props: SingleInputModalProps = defaultProps
): SingleInputModalWrapper => {
  return mount(SingleInputModal, {
    props,
    global: {
      plugins: [pinia]
    },
    attrs: {
      inputContent: String
    }
  }) as SingleInputModalWrapper
}

describe('singleInputModal', () => {
  // eslint-disable-next-line vitest/no-hooks
  beforeEach(() => {
    setActivePinia(pinia)
  })

  describe('props', () => {
    it('should set unValid class to the modal input when not valid', async () => {
      const updatedProps: SingleInputModalProps = {
        ...defaultProps,
        isDialogVisible: true,
        isValidInput: false
      }

      const wrapper = createWrapper(updatedProps)
      const unvalidInput = await dynamicUntilFound(wrapper, '.unValid')
      expect(unvalidInput.exists()).toBeTruthy()
    })

    it('should display error message section when showErrorMsg is true', async () => {
      const updatedProps: SingleInputModalProps = {
        ...defaultProps,
        isDialogVisible: true,
        showErrorMsg: true
      }
      const wrapper = createWrapper(updatedProps)
      const errorMsgSection = await dynamicUntilFound(wrapper,
        '.single-input-modal__input-error'
      )
      expect(
        errorMsgSection.exists()
      ).toBeTruthy()
    })
  })

  describe('interactions', () => {
    it('should emit on-confirm-action-click on confirm btn click', async () => {
      const updatedProps: SingleInputModalProps = {
        ...defaultProps,
        isDialogVisible: true,
        isValidInput: true
      }

      const wrapper = createWrapper(updatedProps)

      const input = await dynamicUntilFound(wrapper, 'input')
      input.setValue('hellooooo')
      const confirmButton = await dynamicUntilFound(
        wrapper,
        '.el-button--primary'
      )

      await confirmButton.trigger('click')

      await wrapper.vm.$nextTick()
      expect(wrapper.emitted('on-confirm-action-click')).toHaveLength(1)

    })
    it('should emit on-cancel-action-click when cancel btn click', async () => {
      const updatedProps: SingleInputModalProps = {
        ...defaultProps,
        isDialogVisible: true,
        isValidInput: true
      }

      const wrapper = createWrapper(updatedProps)

      const cancelButton = await dynamicUntilFound(wrapper, '.el-button--secondary')

      await cancelButton.trigger('click')

      await wrapper.vm.$nextTick()

      expect(wrapper.emitted('on-cancel-action-click')).toHaveLength(1)
    })
    it('should emit input-content-changed on input content change', async () => {
      const updatedProps: SingleInputModalProps = {
        ...defaultProps,
        isDialogVisible: true,
        isValidInput: true
      }

      const wrapper = createWrapper(updatedProps)
      const componentInstance = wrapper.vm
      componentInstance.inputContent = 'test'
      await wrapper.vm.$nextTick()
      expect(wrapper.emitted('input-content-changed')).toHaveLength(1)
    })
    it('should emit on-close-modal when click on close dilaog button', async () => {
      const updatedProps: SingleInputModalProps = {
        ...defaultProps,
        isDialogVisible: true
      }
      const wrapper = createWrapper(updatedProps)
      const pdialog = await dynamicUntilFoundComponent(wrapper, PDialog)

      await pdialog.vm.$emit('close')
      await wrapper.vm.$nextTick()

      expect(wrapper.emitted('on-close-modal')).toBeTruthy()
    })
    it('should emit update:isDialogVisible when isDialogVisible has changed', async () => {

      const wrapper = createWrapper()

      wrapper.vm.isDialogVisible = true
      await wrapper.vm.$nextTick()

      expect(wrapper.emitted('update:isDialogVisible')).toBeTruthy()
    })
  })
})
