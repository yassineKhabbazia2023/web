/* eslint-disable vitest/no-hooks */

import { describe, it, expect, beforeEach, vi } from 'vitest'
import { foldersData } from '../Treeview/mocks/treeFoldersMock'
import Documents from './Documents.vue'
import { createPinia, setActivePinia } from 'pinia'
import { VueWrapper, mount } from '@vue/test-utils'
import { dynamicUntilFoundComponent } from '@kpmg/common/src/testing-helpers'
import DocumentsList from './sections/DocumentsList'
import { DocumentsProps } from './DocumentsTypes'
import { fetchFolderDocuments } from '@/services/Documents'
import { documentsResponsePayload }
  from '@/modules/Documents/mocks/documentsWithTableStructureDataMock'
import { DocumentsWithTableStructure } from '@/models/Document'
import { ComponentPublicInstance, nextTick } from 'vue'

type DocumentsSetup = {
  documents: DocumentsWithTableStructure
}

export type DocumentsWrapper = VueWrapper<
  ComponentPublicInstance<DocumentsSetup, DocumentsProps>
>
const pinia = createPinia()

const defaultProps = {
  currentService: foldersData[0][0].children[0].serviceId,
  selectedEntity: 'my-entity',
  selectedFolder: foldersData[0][0].children[0]
}

const createWrapper = (
  props: DocumentsProps = defaultProps
): DocumentsWrapper => {
  return mount(Documents, {
    props,
    global: {
      plugins: [pinia]
    }
  }) as unknown as DocumentsWrapper
}

vi.mock('@/services/Documents', () => ({
  fetchFolderDocuments: vi.fn()
}))

describe('documents', () => {
  beforeEach(() => {
    setActivePinia(pinia)
  })
  describe('events', () => {
    it('should call fetch documents when on-sort-change is emitted', async () => {
      const wrapper = createWrapper()
      const componentInstance = wrapper.vm
      componentInstance.documents = documentsResponsePayload
      await nextTick()
      const documents = await dynamicUntilFoundComponent(wrapper, DocumentsList)
      await nextTick()

      await documents.vm.$emit('on-sort-change', '+name')

      expect(vi.mocked(fetchFolderDocuments)).toHaveBeenCalledWith(
        foldersData[0][0].children[0].serviceId,
        foldersData[0][0].children[0].id,
        'my-entity',
        0,
        10,
        '+name'
      )
    })
  })
})
