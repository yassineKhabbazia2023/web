
import { createPinia } from 'pinia'
import type { VueWrapper } from '@vue/test-utils'
import { flushPromises, shallowMount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import type { DocumentsPreviewProps } from './DocumentPreviewTypes'
import { documentMock } from '../../mocks/documentMock'
import { downloadDocument, previewDocument } from '@ged/services/Documents'
import DocumentPreview from '.'

const defaultProps: DocumentsPreviewProps = {
  document: documentMock,
  serviceId: 'serviceId',
  entityId: 'entityId',
  openDrawer: true,
  selectedDocumentIndex: 1,
  totalDocumentsCount: 10,
}

const pinia = createPinia()

const createWrapper = (
  props: DocumentsPreviewProps = defaultProps,
): VueWrapper<any> => {
  return shallowMount(DocumentPreview, {
    props,
    global: {
      plugins: [pinia],
      stubs: {
        PDocumentViewer: {
          name: 'PDocumentViewer',
          template: '<div><slot name="iconDocument" /><slot name="media" /><slot name="content" /></div>',
          props: [
            'pSize',
            'pDirection',
            'pShowClose',
            'pDestroyOnClose',
            'pTitleDocument',
            'pActiveDocument',
            'pTotalDocuments',
            'pHasIcon',
            'pHasPagination',
            'pShowCloseButton',
            'pShowPreviousDocument',
            'pShowNextDocument',
          ],
        },
        PIcon: {
          name: 'PIcon',
          template: '<div><slot /></div>',
        },
        DocumentsTabs: true,
        PDocumentDisplay: {
          name: 'PDocumentDisplay',
          template: '<div />',
          props: ['pIsLoading', 'pDocumentExtension'],
        },
      },
    },
  })
}

const previewDocumentMock = vi.hoisted(() => vi.fn(() => {
  return Promise.resolve({
    data: new ArrayBuffer(1),
    headers: { 'content-type': 'image/jpeg' },
  })
}))

vi.mock('@ged/services/Documents', () => ({
  previewDocument: previewDocumentMock,
  downloadDocument: vi.fn(),
}))

describe('documentPreview', () => {
  describe('props', () => {
    it('should render PDocumentViewer properly binded', async () => {
      const wrapper = createWrapper()
      const expectedProps = {
        'pActiveDocument': 1,
        'pDestroyOnClose': '',
        'pDirection': 'rtl',
        'pHasIcon': '',
        'pHasPagination': '',
        'pShowClose': false,
        'pShowCloseButton': '',
        'pShowNextDocument': true,
        'pShowPreviousDocument': false,
        'pSize': '100%',
        'pTitleDocument': documentMock.name,
        'pTotalDocuments': 10,
      }

      const pDocumentViewer = wrapper.findComponent({ name: 'PDocumentViewer' })
      expect(pDocumentViewer.props()).toStrictEqual(expectedProps)

      const pIcon = wrapper.findComponent({ name: 'PIcon' })
      expect(pIcon.exists()).toBeTruthy()
      const pIFiletypePdf = pIcon.findComponent({ name: 'PIFiletypePdf' })
      expect(pIFiletypePdf.exists()).toBeTruthy()
      pDocumentViewer.vm.$emit(
        'next-document-button-click',
      )
      expect(wrapper.emitted('next-document-preview-button-click')).toBeTruthy()

      pDocumentViewer.vm.$emit(
        'previous-document-button-click',
      )
      expect(wrapper.emitted('previous-document-preview-button-click')).toBeTruthy()
      expect(vi.mocked(downloadDocument)).toHaveBeenCalledTimes(1)
    })

    it('should render PDocumentDisplay properly binded', async () => {
      const wrapper = createWrapper()

      const pDocumentDisplay = wrapper.findComponent({ name: 'PDocumentDisplay' })
      expect(pDocumentDisplay.props('pIsLoading')).toBeTruthy()
      expect(pDocumentDisplay.props('pDocumentExtension')).toBe('pdf')
    })

    it('should show unsupported extension error message by default', async () => {
      const document = { ...documentMock, name: 'cool_picture.jpg' }

      const wrapper = createWrapper({ ...defaultProps, document })
      await flushPromises()

      const pDocumentDisplayWrapper = wrapper.findComponent(PDocumentDisplay)
      expect(pDocumentDisplayWrapper.props('errorMsgText')).toBe('Le format de document n\'est pas supporté')
    })

    it('should show not available message if image has failed to resolve', async () => {
      const documentWithEmptyName = { ...documentMock, name: '' }
      previewDocumentMock.mockRejectedValueOnce({})

      const wrapper = createWrapper({ ...defaultProps, document: documentWithEmptyName })
      await flushPromises()
      const pDocumentDisplayWrapper = wrapper.findComponent(PDocumentDisplay)

      expect(pDocumentDisplayWrapper.props('errorMsgText')).toBe('La prévisualisation du document n\'est pas disponible pour le moment')
    })
  })

  describe('interactions', () => {
    it('should emit event when button next clicked', async () => {
      const wrapper = createWrapper()

      const pviewer = wrapper.findComponent({ name: 'PDocumentViewer' })
      pviewer.vm.$emit(
        'next-document-button-click',
      )
      expect(wrapper.emitted('next-document-preview-button-click')).toBeTruthy()
    })

    it('should emit event when button previous clicked', async () => {
      const wrapper = createWrapper()

      const pviewer = wrapper.findComponent({ name: 'PDocumentViewer' })
      pviewer.vm.$emit(
        'previous-document-button-click',
      )
      expect(wrapper.emitted('previous-document-preview-button-click')).toBeTruthy()
    })

    it('should call downloadDocument to get the document', async () => {
      const wrapper = createWrapper()

      wrapper.findComponent({ name: 'PDocumentViewer' })
      expect(vi.mocked(downloadDocument)).toHaveBeenCalledTimes(1)
    })

    it('should call previewDocument to get the document', async () => {
      documentMock.name = 'document.jpeg'
      const wrapper = createWrapper({ ...defaultProps, document: documentMock })

      wrapper.findComponent({ name: 'PDocumentViewer' })
      const pDocumentDisplay = wrapper.findComponent({ name: 'PDocumentDisplay' })
      expect(pDocumentDisplay.props('pDocumentExtension')).toBe('jpeg')
      expect(vi.mocked(previewDocument)).toHaveBeenCalledTimes(1)
    })

    it('should emit close draxer-close event oppon PDocumentViewer arrow click event', async () => {
      const wrapper = createWrapper()

      const pDocumentViewerWrapper = wrapper.findComponent({ name: 'PDocumentViewer' })
      pDocumentViewerWrapper.vm.$emit('update:modelValue')

      expect(wrapper.emitted('close-drawer')).toBeTruthy()
    })
  })
})
