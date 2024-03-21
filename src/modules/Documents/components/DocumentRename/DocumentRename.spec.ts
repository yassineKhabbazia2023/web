import { createPinia } from 'pinia'
import { type VueWrapper, shallowMount } from '@vue/test-utils'
import { vi, describe, it, expect } from 'vitest'
import DocumentRename from './'
import DocumentRenameModal from './components/DocumentRenameModal.vue'
import type { DocumentRenameProps } from './DocumentRenameTypes'
import { documentMock } from '@/modules/Documents/mocks/documentMock'
import { renameDocument } from '@/services/Documents'
import { nextTick } from 'vue'

const defaultProps: DocumentRenameProps = {
  modelValue: false,
  selectedEntity: 'a1b2',
  currentService: 'accounting',
  document: documentMock,
}

vi.mock('@/services/Documents', () => ({
  renameDocument: vi.fn(),
}))

const mockToastPlugin = vi.fn()

const pinia = createPinia()

const createWrapper = (
  props: DocumentRenameProps = defaultProps,
): VueWrapper<any> => {
  return shallowMount(DocumentRename, {
    props,
    global: {
      plugins: [pinia],
      provide: {
        toast: mockToastPlugin,
      },
    },
  })
}
describe('interactions', () => {
  it('should emit update:modelValue on close-rename-modal', () => {
    const wrapper = createWrapper({ ...defaultProps, modelValue: true })
    const renameModalWrapper = wrapper.findComponent(DocumentRenameModal)
    renameModalWrapper.trigger('close-reame-modal')
    expect(wrapper.vm.isRenameDocumentModalOpened).toBeTruthy()
  })

  it('should call rename API on rename-confirmed and close modal and toast', async () => {
    const wrapper = createWrapper({ ...defaultProps, modelValue: true })
    const renameModalWrapper = wrapper.findComponent(DocumentRenameModal)
    await renameModalWrapper.vm.$emit('rename-confirmed', 'abcd')
    await nextTick()
    expect(vi.mocked(renameDocument)).toHaveBeenCalledWith(
      defaultProps.currentService,
      defaultProps.selectedEntity,
      defaultProps.document.id,
      'abcd',
    )

    expect(mockToastPlugin).toHaveBeenCalledTimes(1)
  })
})
