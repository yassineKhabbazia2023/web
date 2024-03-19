/* eslint-disable vitest/no-hooks */
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { binDocumentsMock } from './mocks/binDocumentMock'
import BinDocuments from './BinDocuments.vue'
import { createPinia, setActivePinia } from 'pinia'
import type { VueWrapper } from '@vue/test-utils'
import { mount } from '@vue/test-utils'
import BinDocumentsList from './sections/BinDocumentsList'
import type { BinDocumentProps } from './BinDocumentsTypes'
import {
  fetchBinDocuments,
} from '@/services/BinDocuments'
import type { ComponentPublicInstance } from 'vue'
import { nextTick } from 'vue'
import DocumentRestoreModal from '@/modules/Bin/components/DocumentRestoreModal'
import { PBreadcrumb, PPagination, PLoader } from '@kpmg/styleguide'
import type { BinDocument, BinDocumentsWithTableStructure } from '@/models/Document'

const defaultProps: BinDocumentProps = {
  currentBinService: 'serv',
  selectedEntity: 'ent',
  selectedServiceName: 'compta',
}

type BinDocumentsSetup = {
  binDocuments: BinDocumentsWithTableStructure
  documentToRestore: BinDocument
  isRestoring: boolean
  isLoading: boolean
}

export type BinDocumentsWrapper = VueWrapper<
  ComponentPublicInstance<BinDocumentsSetup, BinDocumentProps>
>

const pinia = createPinia()

const createWrapper = (
  props: BinDocumentProps = defaultProps,
): BinDocumentsWrapper => {
  return mount(BinDocuments, {
    props,
    global: {
      plugins: [pinia],
    },
  }) as unknown as BinDocumentsWrapper
}

vi.mock('@/services/BinDocuments', () => ({
  restoreDocuments: vi.fn(),
  fetchBinDocuments: vi.fn(() => {
    return binDocumentsMock
  }),
}))

describe('binDocuments', () => {
  beforeEach(() => {
    setActivePinia(pinia)
  })
  describe('events', () => {
    describe('props', () => {
      it('should render PBreadcrumb when currentBinService is set', async () => {
        expect.hasAssertions()
        const items = []
        items.push({
          pId: -1,
          pText: 'Corbeille',
        })
        items.push({
          pId: -1,
          pText: defaultProps.selectedServiceName,
        })
        const wrapper = createWrapper()
        await nextTick()

        const breadcrumb = wrapper.findComponent(PBreadcrumb)
        expect(breadcrumb.exists()).toBeTruthy()
        expect(breadcrumb.props('pElements')).toStrictEqual(items)
      })
      // eslint-disable-next-line max-len
      it('should render BinDocumentsList and PPagination when currentBinService is set', async () => {
        expect.hasAssertions()
        const wrapper = createWrapper()
        await nextTick()

        expect(vi.mocked(fetchBinDocuments)).toHaveBeenCalledWith(
          defaultProps.currentBinService,
          defaultProps.selectedEntity,
          0,
          10,
          '-deleted',
        )
        await nextTick()
        const binList = wrapper.findComponent(BinDocumentsList)
        expect(binList.exists()).toBeTruthy()
        expect(binList.props('binDocuments')).toStrictEqual(binDocumentsMock)
        const pagination = wrapper.findComponent(PPagination)
        expect(pagination.exists()).toBeTruthy()
        expect(pagination.props('pCurrentPage')).toBe(1)
        expect(pagination.props('pPageSize')).toBe(10)
        expect(pagination.props('pTotal')).toBe(binDocumentsMock.documentsPage.totalItems)
        const paginationLabel = pagination.find('p')
        expect(paginationLabel.text().replaceAll(/\s/g, '')).toBe('1-10sur18894')
      })
      it('should render DocumentRestoreModal when currentBinService is set', async () => {
        expect.hasAssertions()
        const wrapper = createWrapper()
        await nextTick()

        const restoreModal = wrapper.findComponent(DocumentRestoreModal)
        expect(restoreModal.exists()).toBeTruthy()
        expect(restoreModal.props('isVisible')).toBeFalsy()
        expect(restoreModal.props('serviceId')).toBe(defaultProps.currentBinService)
        expect(restoreModal.props('entityId')).toBe(defaultProps.selectedEntity)
        expect(restoreModal.props('document')).toBeNull()
      })
      it('should display loader when fetching documents', async () => {
        expect.hasAssertions()
        const wrapper = createWrapper()
        const componentInstance = wrapper.vm
        componentInstance.isLoading = true
        await nextTick()
        const loader = wrapper.findComponent(PLoader)
        expect(loader.exists()).toBeTruthy()
        const binList = wrapper.findComponent(BinDocumentsList)
        expect(binList.exists()).toBeFalsy()
        const pagination = wrapper.findComponent(PPagination)
        expect(pagination.exists()).toBeFalsy()
      })
    })
    describe('events', () => {
      it('should call fetch documents when on-sort-change is emitted', async () => {
        expect.hasAssertions()
        const wrapper = createWrapper()
        await nextTick()
        const componentInstance = wrapper.vm
        componentInstance.binDocuments = binDocumentsMock
        await nextTick()
        const documents = wrapper.findComponent(BinDocumentsList)
        await documents.vm.$emit('on-sort-change', '+name')
        await nextTick()
        expect(vi.mocked(fetchBinDocuments)).toHaveBeenCalledWith(
          defaultProps.currentBinService,
          defaultProps.selectedEntity,
          0,
          10,
          '+name',
        )
      })
      it('should open restore modal when restore-document-action is emitted', async () => {
        expect.hasAssertions()
        const wrapper = createWrapper()
        await nextTick()
        const componentInstance = wrapper.vm
        componentInstance.binDocuments = binDocumentsMock
        await nextTick()
        const documents = wrapper.findComponent(BinDocumentsList)
        await documents.vm.$emit('restore-document-action', binDocumentsMock.documentsPage.items[0])
        await nextTick()
        const restoreModal = wrapper.findComponent(DocumentRestoreModal)
        expect(restoreModal.props('isVisible')).toBeTruthy()
        expect(restoreModal.props('document'))
          .toStrictEqual(binDocumentsMock.documentsPage.items[0])
      })
      it('should fetch documents when on-page-range-changed is emitted', async () => {
        expect.hasAssertions()
        const wrapper = createWrapper()
        await nextTick()
        const componentInstance = wrapper.vm
        componentInstance.binDocuments = binDocumentsMock
        await nextTick()
        const pagination = wrapper.findComponent(PPagination)
        await pagination.vm.$emit('on-page-range-changed', 50)
        await nextTick()
        expect(pagination.props('pPageSize')).toBe(50)
        expect(vi.mocked(fetchBinDocuments)).toHaveBeenCalledWith(
          defaultProps.currentBinService,
          defaultProps.selectedEntity,
          0,
          50,
          '-deleted',
        )
      })
      it('should call fetch documents when confirm-restore-document is emitted', async () => {
        expect.hasAssertions()
        const wrapper = createWrapper()
        const componentInstance = wrapper.vm
        componentInstance.binDocuments = binDocumentsMock
        componentInstance.documentToRestore = binDocumentsMock.documentsPage.items[0]
        componentInstance.isRestoring = true
        await nextTick()
        const restoreModal = wrapper.findComponent(DocumentRestoreModal)
        await nextTick()

        await restoreModal.vm.$emit('confirm-restore-document')
        await nextTick()

        expect(restoreModal.props('isVisible')).toBeFalsy()
        expect(restoreModal.props('document')).toBeNull()
        expect(vi.mocked(fetchBinDocuments)).toHaveBeenCalledWith(
          defaultProps.currentBinService,
          defaultProps.selectedEntity,
          0,
          10,
          '-deleted',
        )
      })
      it('should close restore modal when cancel-restore-document is emitted', async () => {
        expect.hasAssertions()
        const wrapper = createWrapper()
        const componentInstance = wrapper.vm
        componentInstance.binDocuments = binDocumentsMock
        componentInstance.documentToRestore = binDocumentsMock.documentsPage.items[0]
        componentInstance.isRestoring = true
        await nextTick()
        const restoreModal = wrapper.findComponent(DocumentRestoreModal)
        await nextTick()

        await restoreModal.vm.$emit('cancel-restore-document')
        await nextTick()

        expect(restoreModal.props('isVisible')).toBeFalsy()
        expect(restoreModal.props('document')).toBeNull()
      })
      it('should emit navigate-to-folder when navigate-to-folder is emitted', async () => {
        expect.hasAssertions()
        const wrapper = createWrapper()
        const componentInstance = wrapper.vm
        componentInstance.binDocuments = binDocumentsMock
        componentInstance.documentToRestore = binDocumentsMock.documentsPage.items[0]
        componentInstance.isRestoring = true
        await nextTick()
        const restoreModal = wrapper.findComponent(DocumentRestoreModal)
        await nextTick()

        await restoreModal.vm.$emit('navigate-to-folder', 123)
        await nextTick()
        expect(wrapper.emitted('navigate-to-folder')).toStrictEqual([[123]])
      })
    })
  })
})

