import { mount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'
import PDocumentViewer from '.'
import { ElDrawer } from 'element-plus'

const defaultProps = {
  pDirection: 'rtl',
  pSize: '100%',
  pDestroyOnClose: true,
  pShowClose: false,
  pTitleDocument: 'Facture-achat_20643228.pdf',
  pActiveDocument: 5,
  pTotalDocuments: 25,
  pHasIcon: true,
  pHasPagination: true,
  pShowCloseButton: true,
  pShowPreviousDocument: true,
  pShowNextDocument: true
}

const createWrapper = (props: any = defaultProps, slots: any = {}) =>
  mount(PDocumentViewer, {
    props,
    slots,
    global: {
      stubs: {
        ElDrawer
      }
    }
  })

describe('pDocumentViewer', () => {
  describe('props', () => {
    it.each([
      {
        pHasIcon: true,
        shouldHaveIconClass: true,
        text: 'show'
      },
      {
        pHasIcon: false,
        shouldHaveIconClass: false,
        text: 'hide'
      }
    ])('should $text icon zone when pHasIcon is $pHasIcon',
      ({ pHasIcon, text, shouldHaveIconClass }) => {
        const wrapper = createWrapper({
          ...defaultProps,
          pHasIcon,
          text
        })
        const hasIconClass = wrapper.find('.p-document-viewer__icon-document').exists()
        expect(hasIconClass).toBe(shouldHaveIconClass)
      }
    )

    it.each([
      {
        pHasPagination: true,
        shouldHavePaginationClass: true,
        text: 'show'
      },
      {
        pHasPagination: false,
        shouldHavePaginationClass: false,
        text: 'hide'
      }
    ])('should $text pagination zone when pHasPagination is $pHasPagination',
      ({ pHasPagination, shouldHavePaginationClass, text }) => {
        const wrapper = createWrapper({
          ...defaultProps,
          pHasPagination,
          text
        })
        const hasPaginationClass = wrapper.find('.p-document-viewer__header-right').exists()
        expect(hasPaginationClass).toBe(shouldHavePaginationClass)
      }
    )

    it.each([
      {
        pShowCloseButton: true,
        shouldHaveCloseButtonClass: true,
        text: 'show'
      },
      {
        pShowCloseButton: false,
        shouldHaveCloseButtonClass: false,
        text: 'hide'
      }
    ])('should $text close button zone when pShowCloseButton is $pShowCloseButton',
      ({ pShowCloseButton, text, shouldHaveCloseButtonClass }) => {
        const wrapper = createWrapper({
          ...defaultProps,
          pShowCloseButton,
          text
        })
        const showCloseButtonClass = wrapper.find('.p-document-viewer__btn-close').exists()
        expect(showCloseButtonClass).toBe(shouldHaveCloseButtonClass)
      }
    )

    it.each([
      {
        pShowPreviousDocument: true,
        shouldHavePreviousButtonClass: false,
        text: 'show'
      },
      {
        pShowPreviousDocument: false,
        shouldHavePreviousButtonClass: true,
        text: 'hide'
      }
    ])('should $text previous document button zone ' +
      'when pShowPreviousDocument is $pShowPreviousDocument',
    ({ pShowPreviousDocument, text, shouldHavePreviousButtonClass }) => {
      const wrapper = createWrapper({
        ...defaultProps,
        pShowPreviousDocument,
        text
      })
      const showPreviousDocumentClass =
        wrapper.find('.p-document-viewer__btn-previous[disabled]').exists()
      expect(showPreviousDocumentClass).toBe(shouldHavePreviousButtonClass)
    })

    it.each([
      {
        pShowNextDocument: true,
        shouldHaveNextDocumentClass: false,
        text: 'show'
      },
      {
        pShowNextDocument: false,
        shouldHaveNextDocumentClass: true,
        text: 'hide'
      }
    ])('should $text next document button zone when pShowNextDocument is $pShowNextDocument',
      ({ pShowNextDocument, text, shouldHaveNextDocumentClass }) => {
        const wrapper = createWrapper({
          ...defaultProps,
          pShowNextDocument,
          text
        })
        const showNextDocumentClass =
          wrapper.find('.p-document-viewer__btn-next[disabled]').exists()
        expect(showNextDocumentClass).toBe(shouldHaveNextDocumentClass)
      }
    )

    it('should emit previous-document-button-click event', async () => {
      const wrapper = createWrapper()

      await wrapper.find('.p-document-viewer__btn-previous').trigger('click')
      const emittedDocumentViewerPreviousButton = wrapper.emitted('previous-document-button-click')
      expect(emittedDocumentViewerPreviousButton).toBeTruthy()
    })

    it('should emit next-document-button-click event', async () => {
      const wrapper = createWrapper()

      await wrapper.find('.p-document-viewer__btn-next').trigger('click')
      const emittedDocumentViewerNextButton = wrapper.emitted('next-document-button-click')
      expect(emittedDocumentViewerNextButton).toBeTruthy()
    })

    it('should emit update:modelValue event', async () => {
      const wrapper = createWrapper()

      await wrapper.find('.p-document-viewer__btn-close').trigger('click')
      const emittedModelValue: any = wrapper.emitted('update:modelValue')
      expect(emittedModelValue).toBeTruthy()
      expect(emittedModelValue[0]).toStrictEqual([false])
    })

    it('should render the text values of the component', () => {
      const wrapper = createWrapper()

      expect(wrapper.find('.p-document-viewer__title').text())
        .toContain('Facture-achat_20643228.pdf')
      const paginationItems = wrapper.findAll('.p-document-viewer__pagination-item')
      expect(paginationItems[0].text()).toContain('5')
      expect(paginationItems[2].text()).toContain('25')
    })
  })
})
