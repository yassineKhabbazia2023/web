import { type VueWrapper, shallowMount } from '@vue/test-utils'
import { vi, describe, it, expect } from 'vitest'
import { nextTick } from 'vue'
import { documentMock } from '@ged/__mocks__/documents.mocks'
import { documentsServiceMock } from '@ged/__mocks__/documents.service.mocks'
import type { DocumentRenameProps } from './DocumentRenameTypes'
import { renameDocument } from '@ged/services/Documents'
import { trackDocumentRename } from '@ged/services/tracking/tracking.service'
import { PNotification as PNotificationMock } from '@pulse/styleguide'

import DocumentRename from './'

vi.mock('@pulse/styleguide')

vi.mock('@ged/services/Documents', () => documentsServiceMock)

vi.mock('@ged/services/tracking/tracking.service')
const defaultProps: DocumentRenameProps = {
  modelValue: false,
  selectedEntity: 'a1b2',
  accountId: 1234,
  currentService: 'accounting',
  document: documentMock,
}

const createWrapper = (
  props: DocumentRenameProps = defaultProps,
): VueWrapper<any> => {
  return shallowMount(DocumentRename, {
    props,
  })
}

describe('interactions', () => {
  it('should call rename API on rename-confirmed and close modal and toast', async () => {
    const wrapper = createWrapper({ ...defaultProps, modelValue: true })
    const renameModalWrapper = wrapper.findComponent({ name: 'DocumentRenameModal' })
    await renameModalWrapper.vm.$emit('rename-confirmed', 'abcd')
    await nextTick()
    expect(vi.mocked(renameDocument)).toHaveBeenCalledWith(
      defaultProps.currentService,
      defaultProps.selectedEntity,
      defaultProps.document.id,
      'abcd',
      defaultProps.accountId,
    )

    await nextTick()
    expect(PNotificationMock).toHaveBeenCalledTimes(1)
    expect(trackDocumentRename).toHaveBeenCalledWith({ isRenameSuccessful: true })
  })

  it('should reset rename button state upon failure', async () => {
    vi.mocked(renameDocument).mockImplementation(() => {
      throw new Error('fail')
    })

    const wrapper = createWrapper({ ...defaultProps, modelValue: true })
    const renameModalWrapper = wrapper.findComponent({ name: 'DocumentRenameModal' })
    await renameModalWrapper.vm.$emit('rename-confirmed', 'abcd')

    await nextTick()
    expect(PNotificationMock).toHaveBeenCalledTimes(1)
    expect(trackDocumentRename).toHaveBeenCalledWith({ isRenameSuccessful: false })
    expect(renameModalWrapper.props('isConfirmButtonLoading')).toBeFalsy()
  })

  it('should close rename modal upon close-rename-modal event', async () => {
    const wrapper = createWrapper({ ...defaultProps, modelValue: true })
    const renameModalWrapper = wrapper.findComponent({ name: 'DocumentRenameModal' })
    await renameModalWrapper.vm.$emit('close-rename-modal')
    await nextTick()

    expect(wrapper.emitted('update:modelValue')).toStrictEqual([[false]])
  })
})
