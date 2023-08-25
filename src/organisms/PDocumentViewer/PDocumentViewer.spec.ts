import { mount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'
import PDocumentViewer from '.'
import { ElDrawer } from 'element-plus'

const defaultProps = {
  titleDocument: 'Facture-achat_20643228.pdf',
  activeDocument: 5,
  totalDocuments: 25,
  hasIcon: true,
  hasPagination: true,
  showCloseButton: true,
  showPreviousDocument: true,
  showNextDocument: true
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
        hasIcon: true,
        shouldHaveIconClass: true,
        text: 'show'
      },
      {
        hasIcon: false,
        shouldHaveIconClass: false,
        text: 'hide'
      }
    ])('should $text icon zone when hasIcon is $hasIcon',
      ({ hasIcon, text, shouldHaveIconClass }) => {
        const wrapper = createWrapper({
          ...defaultProps,
          hasIcon,
          text
        })
        const hasIconClass = wrapper.find('.p-document-viewer__icon-document').exists()
        expect(hasIconClass).toBe(shouldHaveIconClass)
      }
    )

    it.each([
      {
        hasPagination: true,
        shouldHavePaginationClass: true,
        text: 'show'
      },
      {
        hasPagination: false,
        shouldHavePaginationClass: false,
        text: 'hide'
      }
    ])('should $text pagination zone when hasPagination is $hasPagination',
      ({ hasPagination, shouldHavePaginationClass, text }) => {
        const wrapper = createWrapper({
          ...defaultProps,
          hasPagination,
          text
        })
        const hasPaginationClass = wrapper.find('.p-document-viewer__header-right').exists()
        expect(hasPaginationClass).toBe(shouldHavePaginationClass)
      }
    )

    it.each([
      {
        showCloseButton: true,
        shouldHaveCloseButtonClass: true,
        text: 'show'
      },
      {
        showCloseButton: false,
        shouldHaveCloseButtonClass: false,
        text: 'hide'
      }
    ])('should $text close button zone when showCloseButton is $showCloseButton',
      ({ showCloseButton, text, shouldHaveCloseButtonClass }) => {
        const wrapper = createWrapper({
          ...defaultProps,
          showCloseButton,
          text
        })
        const showCloseButtonClass = wrapper.find('.p-document-viewer__btn-close').exists()
        expect(showCloseButtonClass).toBe(shouldHaveCloseButtonClass)
      }
    )

    it.each([
      {
        showPreviousDocument: true,
        shouldHavePreviousButtonClass: false,
        text: 'show'
      },
      {
        showPreviousDocument: false,
        shouldHavePreviousButtonClass: true,
        text: 'hide'
      }
    ])('should $text previous document button zone ' +
      'when showPreviousDocument is $showPreviousDocument',
    ({ showPreviousDocument, text, shouldHavePreviousButtonClass }) => {
      const wrapper = createWrapper({
        ...defaultProps,
        showPreviousDocument,
        text
      })
      const showPreviousDocumentClass =
        wrapper.find('.p-document-viewer__btn-previous[disabled]').exists()
      expect(showPreviousDocumentClass).toBe(shouldHavePreviousButtonClass)
    })

    it.each([
      {
        showNextDocument: true,
        shouldHaveNextDocumentClass: false,
        text: 'show'
      },
      {
        showNextDocument: false,
        shouldHaveNextDocumentClass: true,
        text: 'hide'
      }
    ])('should $text next document button zone when showNextDocument is $showNextDocument',
      ({ showNextDocument, text, shouldHaveNextDocumentClass }) => {
        const wrapper = createWrapper({
          ...defaultProps,
          showNextDocument,
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
