/* eslint-disable vitest/max-expects */
// eslint-disable-next-line vitest/max-expects
import { createPinia } from 'pinia'
import { nextTick } from 'vue'
import { VueWrapper, mount } from '@vue/test-utils'
import { expect, describe, it, vi } from 'vitest'
import { PDocumentDisplay, PDocumentViewer, PIcon } from '@kpmg/styleguide'
import { DocumentsPreviewProps } from './DocumentPreviewTypes'
import { documentMock } from '../../mocks/documentMock'
import DocumentPreview from '.'
import { downloadDocument, previewDocument } from '@/services/Documents'
import { getFileIcon } from '../../helpers/filesExtensions'

const defaultProps: DocumentsPreviewProps = {
  document: documentMock,
  serviceId: 'serviceId',
  entityId: 'entityId',
  openDrawer: true,
  selectedDocumentIndex: 1,
  totalDocumentsCount: 10
}
vi.mock('@kpmg/common', async () => ({
  commonApi: () => ({
    ds: vi.fn()
  }),
  commonStore: () => ({
    $delete: vi.fn(),
    $patch: vi.fn(),
    $get: vi.fn(),
    $post: vi.fn()
  })
}))

const pinia = createPinia()

const createWrapper = (
  props: DocumentsPreviewProps = defaultProps
): VueWrapper<any> => {
  return mount(DocumentPreview, {
    props,
    global: {
      plugins: [pinia]
    }
  })
}
vi.mock('@/services/Documents', () => ({
  previewDocument: vi.fn(() => {
    return Promise.resolve({
      data: new ArrayBuffer(1),
      headers: { 'content-type': 'image/jpeg' }
    })
  }),
  downloadDocument: vi.fn()
}))

describe('documentPreview', () => {
  describe('props', () => {
    it('should render PDocumentViewer properly binded', async () => {
      const wrapper = createWrapper()
      expect(wrapper.exists()).toBeTruthy()

      await nextTick()

      const pviewer = wrapper.findComponent(PDocumentViewer)
      expect(pviewer.props('pSize')).toBe('100%')
      expect(pviewer.props('pDirection')).toBe('rtl')
      expect(pviewer.props('pTitleDocument')).toStrictEqual(documentMock.name)
      expect(pviewer.props('pActiveDocument')).toBe(1)
      expect(pviewer.props('pTotalDocuments')).toBe(10)
      expect(pviewer.props('pShowClose')).toBeTruthy()
      expect(pviewer.props('pDestroyOnClose')).toBeTruthy()
      expect(pviewer.props('pHasIcon')).toBeTruthy()
      expect(pviewer.props('pHasPagination')).toBeTruthy()
      expect(pviewer.props('pShowCloseButton')).toBeTruthy()
      expect(pviewer.props('pShowPreviousDocument')).toBeFalsy()
      expect(pviewer.props('pShowNextDocument')).toBeTruthy()
      const icon = wrapper.findComponent(PIcon)
      await nextTick()
      expect(icon.exists()).toBeTruthy()
      expect(getFileIcon(documentMock.name).name).toBe('PIFiletypePdf')
      await pviewer.vm.$emit(
        'next-document-button-click'
      )
      await nextTick()
      expect(wrapper.emitted('next-document-preview-button-click')).toBeTruthy()

      await pviewer.vm.$emit(
        'previous-document-button-click'
      )
      await nextTick()
      expect(wrapper.emitted('previous-document-preview-button-click')).toBeTruthy()
      expect(vi.mocked(downloadDocument)).toHaveBeenCalledTimes(1)
    })

    it('should render PDocumentDisplay properly binded', async () => {
      const wrapper = createWrapper()
      expect(wrapper.exists()).toBeTruthy()

      await nextTick()

      const pDocumentDisplay = wrapper.findComponent(PDocumentDisplay)
      expect(pDocumentDisplay.props('pIsLoading')).toBeTruthy()
      expect(pDocumentDisplay.props('pDocumentExtension')).toBe('pdf')
    })
  })

  describe('interactions', () => {
    it('should emit event when button next clicked', async () => {
      const wrapper = createWrapper()
      expect(wrapper.exists()).toBeTruthy()

      await nextTick()

      const pviewer = wrapper.findComponent(PDocumentViewer)
      await pviewer.vm.$emit(
        'next-document-button-click'
      )
      await nextTick()
      expect(wrapper.emitted('next-document-preview-button-click')).toBeTruthy()
    })

    it('should emit event when button previous clicked', async () => {
      const wrapper = createWrapper()
      expect(wrapper.exists()).toBeTruthy()

      await nextTick()

      const pviewer = wrapper.findComponent(PDocumentViewer)
      await pviewer.vm.$emit(
        'previous-document-button-click'
      )
      await nextTick()
      expect(wrapper.emitted('previous-document-preview-button-click')).toBeTruthy()
    })

    it('should call downloadDocument to get the document', async () => {
      const wrapper = createWrapper()
      expect(wrapper.exists()).toBeTruthy()

      await nextTick()

      await wrapper.findComponent(PDocumentViewer)
      expect(vi.mocked(downloadDocument)).toHaveBeenCalledTimes(1)
    })

    it('should call previewDocument to get the document', async () => {
      documentMock.name = 'document.jpeg'
      const wrapper = createWrapper({ ...defaultProps, document: documentMock })
      expect(wrapper.exists()).toBeTruthy()

      await nextTick()

      await wrapper.findComponent(PDocumentViewer)
      const pDocumentDisplay = wrapper.findComponent(PDocumentDisplay)
      expect(pDocumentDisplay.props('pDocumentExtension')).toBe('jpeg')
      expect(vi.mocked(previewDocument)).toHaveBeenCalledTimes(1)

    })

    it('should emit close draxer-close event oppon PDocumentViewer close event', async () => {
      const wrapper = createWrapper()
      await nextTick()

      const pDocumentViewerWrapper = wrapper.findComponent(PDocumentViewer)
      await pDocumentViewerWrapper.vm.$emit('close')

      await nextTick()

      expect(wrapper.emitted('close-drawer')).toBeTruthy()
    })
  })
})
