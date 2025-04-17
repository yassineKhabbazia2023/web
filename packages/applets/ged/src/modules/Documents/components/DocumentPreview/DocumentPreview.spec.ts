import type { VueWrapper } from '@vue/test-utils'
import { flushPromises, shallowMount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import { documentMock } from '@ged/__mocks__/documents.mocks'
import { documentsServiceMock, previewDocumentMock } from '@ged/__mocks__/documents.service.mocks'
import type { DocumentsPreviewProps } from './DocumentPreviewTypes'
import { downloadDocument, previewDocument } from '@ged/services/Documents'
import DocumentPreview from '.'
import { type IconName } from '@pulse/styleguide/types'

const getIconFileNameMock = vi.hoisted(() => vi.fn())
vi.mock('@pulse/styleguide', () => ({
  getIconFileName: getIconFileNameMock,
}))

const defaultProps: DocumentsPreviewProps = {
  document: documentMock,
  serviceId: 'serviceId',
  entityId: 'entityId',
  accountId: 1234,
  openDrawer: true,
  selectedDocumentIndex: 1,
  totalDocumentsCount: 10,
}

const createWrapper = (
  props: DocumentsPreviewProps = defaultProps,
): VueWrapper<any> => {
  return shallowMount(DocumentPreview, {
    props,
    global: {
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
          props: ['pName'],
        },
        DocumentsTabs: true,
        PDocumentDisplay: {
          name: 'PDocumentDisplay',
          template: '<div />',
          props: ['pIsLoading', 'pDocumentExtension', 'errorMsgText'],
        },
      },
    },
  })
}

vi.mock('@ged/services/Documents', () => ({
  ...documentsServiceMock,
  previewDocument: previewDocumentMock,
}))

describe('documentPreview', () => {
  describe('props', () => {
    it('should render PDocumentViewer properly binded', async () => {
      const mockedIconName: IconName = 'filetypePdf'
      getIconFileNameMock.mockReturnValueOnce(mockedIconName)
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
      expect(getIconFileNameMock).toHaveBeenCalledOnce()
      expect(getIconFileNameMock).toHaveBeenNthCalledWith(1, 'pdf', 'fileText')
      expect(pIcon.exists()).toBeTruthy()
      expect(pIcon.props('pName')).toBe(mockedIconName)
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

      const pDocumentDisplayWrapper = wrapper.findComponent({ name: 'PDocumentDisplay' })
      expect(pDocumentDisplayWrapper.props('errorMsgText')).toBe('Le format de document n\'est pas supporté')
    })

    it('should show not available message if image has failed to resolve', async () => {
      const documentWithEmptyName = { ...documentMock, name: '' }
      previewDocumentMock.mockRejectedValueOnce({})

      const wrapper = createWrapper({ ...defaultProps, document: documentWithEmptyName })
      await flushPromises()
      const pDocumentDisplayWrapper = wrapper.findComponent({ name: 'PDocumentDisplay' })

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
