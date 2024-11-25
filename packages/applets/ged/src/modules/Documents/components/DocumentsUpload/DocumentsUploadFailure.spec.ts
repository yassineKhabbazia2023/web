 
 
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import type { DocumentUploadProps } from './DocumentsUploadTypes'
import type { VueWrapper } from '@vue/test-utils'
import { mount } from '@vue/test-utils'
import type { ComponentPublicInstance } from 'vue'
import { nextTick } from 'vue'
import DocumentsUpload from '.'
import { defaultProps, type DocumentUploadSetup } from '../../helpers/testHelpers'
import { findComponentByNameInWrapper } from '@ged/modules/Documents/helpers/testHelpers'

export type DocumentsUploadWrapper = VueWrapper<
  ComponentPublicInstance<DocumentUploadProps, DocumentUploadSetup>
>

vi.mock('@ged/services/Documents', () => ({
  uploadDocument: vi.fn(() => {
    throw new Error('something uncool')
  }),
}))

const mockToastPlugin = vi.fn()

const createWrapper = (
  props: DocumentUploadProps = defaultProps,
): DocumentsUploadWrapper => {
  return mount(DocumentsUpload, {
    props,
    global: {
      plugins: [pinia],
      provide: {
        toast: mockToastPlugin,
      },
    },
  }) as unknown as DocumentsUploadWrapper
}

const pinia = createPinia()

describe('test DocumentsUpload failure', () => {
  beforeEach(() => {
    setActivePinia(pinia)
    vi.useFakeTimers()
  })

  describe('interactions', () => {
    describe('upload', () => {
      describe('confirm', () => {
        it('should update explorerDocuments to ERROR on modal-action-clicked event', async () => {
          const updatedProps = { ...defaultProps, isUploadModalOpened: true }

          const wrapper = createWrapper(updatedProps)

          const documentExplorerModalWrapper =
                findComponentByNameInWrapper(wrapper, 'DocumentsExplorerModal')

          await documentExplorerModalWrapper.vm.$emit(
            'modal-action-clicked',
            'modal-add-document-action-click',
          )

          await nextTick()

          expect(wrapper.vm.explorerDocuments).toHaveLength(
            wrapper.vm.explorerDocuments.filter(
              (d) => d.givenActionState === 'ERROR',
            ).length,
          )
        })
      })
    })
  })
})
