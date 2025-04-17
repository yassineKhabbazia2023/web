import type { DocumentUploadProps } from './DocumentsUploadTypes'
import type { VueWrapper } from '@vue/test-utils'
import { mount } from '@vue/test-utils'
import type { ComponentPublicInstance } from 'vue'
import { documentsServiceMock } from '@ged/__mocks__/documents.service.mocks'
import { findComponentByNameInWrapper } from '@ged/__mocks__/component.wrapper'
import { nextTick } from 'vue'
import { defaultProps, type DocumentUploadSetup } from '../../helpers/testHelpers'

import DocumentsUpload from '.'

export type DocumentsUploadWrapper = VueWrapper<
  ComponentPublicInstance<DocumentUploadProps, DocumentUploadSetup>
>

vi.mock('@ged/services/Documents', () => ({
  ...documentsServiceMock,
  uploadDocument: vi.fn(() => {
    throw new Error('something uncool')
  }),
}))

vi.mock('@pulse/styleguide')

const createWrapper = (
  props: DocumentUploadProps = defaultProps,
): DocumentsUploadWrapper => {
  return mount(DocumentsUpload, {
    props,
  }) as unknown as DocumentsUploadWrapper
}

describe('test DocumentsUpload failure', () => {
  beforeEach(() => {
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
