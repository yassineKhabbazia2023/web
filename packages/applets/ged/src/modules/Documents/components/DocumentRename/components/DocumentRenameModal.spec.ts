import DocumentRenameModal from './DocumentRenameModal.vue'
import { type VueWrapper, mount } from '@vue/test-utils'
import { describe, it, expect, beforeEach } from 'vitest'
import type { DocumentRenameModalProps } from './DocumentRenameModalTypes'
import { createPinia, setActivePinia } from 'pinia'
import { documentMock } from '@ged/modules/Documents/mocks/documentMock'

const defaultProps: DocumentRenameModalProps = {
  document: documentMock,
  isConfirmButtonLoading: false,
  isRenameModalOpened: true,
}

const pinia = createPinia()

const createWrapper = (
  props: DocumentRenameModalProps = defaultProps,
): VueWrapper<any> => {
  return mount(DocumentRenameModal, {
    props,
    global: {
      plugins: [pinia],
    },
  })
}

const findSingleInputModalWrapper = (wrapper: VueWrapper<any>) =>
  wrapper.findComponent({ name: 'SingleInputModal' })
describe('props', () => {
  beforeEach(() => {
    setActivePinia(pinia)
  })
  it('should have appropriate base name', () => {
    const wrapper = createWrapper({ ...defaultProps, isRenameModalOpened: true })

    const singleInputModalWrapper = findSingleInputModalWrapper(wrapper)

    // The output of the name is nested in multiple component
    // this is why i'm targeting the child prop directly to verify it has the appropriate value
    expect(singleInputModalWrapper.props('defaultInputContentValue')).toBe('My Document')
  })
})

describe('interactions', () => {
  it('should emit close-rename-modal on on-cancel-action-click', () => {
    const wrapper = createWrapper()
    const singleInputModalWrapper = findSingleInputModalWrapper(wrapper)

    singleInputModalWrapper.vm.$emit('on-cancel-action-click')
    expect(wrapper.emitted()).toHaveProperty('close-rename-modal')
  })

  it('should emit close-rename-modal on on-close-modal', () => {
    const wrapper = createWrapper()
    const singleInputModalWrapper = findSingleInputModalWrapper(wrapper)

    singleInputModalWrapper.vm.$emit('on-close-modal')
    expect(wrapper.emitted()).toHaveProperty('close-rename-modal')
  })

  it('should emit rename-confirmed on on-confirm-action-click', () => {
    const wrapper = createWrapper()
    const singleInputModalWrapper = findSingleInputModalWrapper(wrapper)

    singleInputModalWrapper.vm.$emit('on-confirm-action-click')
    expect(wrapper.emitted()).toHaveProperty('rename-confirmed')
  })
})
