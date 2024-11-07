import { mount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'
import PError from '.'
import type { PErrorBlockProps } from './PErrorTypes'

const description = 'test description'
const button = 'test button'
const errorName = 'test error name'
const errorText = 'test error text'

const defaultProps: PErrorBlockProps = {
  pDescription: description,
  pButtonText: button,
  pErrorName: errorName,
  pErrorText: errorText,
  pIllustrationName: 'error-generic',
}

const createWrapper = (props: any = defaultProps, slots: any = {}) =>
  mount(PError, {
    props,
    slots,
  })

describe('pError', () => {
  describe('props', () => {
    it('should emit error-block-button-click event', async () => {
      const wrapper = createWrapper()

      await wrapper.find('[data-testid="error-block-button"]').trigger('click')
      const emittedErrorBlockButton = wrapper.emitted(
        'handleClick',
      )
      expect(emittedErrorBlockButton).toBeTruthy()
    })

    it('should render the text values of the component', () => {
      const wrapper = createWrapper()

      expect(wrapper.find('[data-testid="error-block-button"]').text()).toContain(
        button,
      )
      expect(wrapper.find('.p-error-block__description').text()).toContain(
        description,
      )
      expect(wrapper.find('.p-error-block__error-name').text()).toContain(
        errorName,
      )
      expect(wrapper.find('.p-error-block__error-text').text()).toContain(
        errorText,
      )
    })
  })
  describe('slots', () => {
    it('should display the content of the slots when they exists', () => {
      const wrapper = createWrapper(
        defaultProps,
        {
          title: "<button data-testid='title-slot'>Title Test Button</button>",
          footer: "<button data-testid='footer-slot'>Footer Test Button</button>",
        },
      )
      const titleSlot = wrapper.find('.p-error-block__title')
      const footerSlot = wrapper.find('.p-error-page__footer')

      expect(titleSlot.exists()).toBeTruthy()
      expect(titleSlot.text()).toBe('Title Test Button')

      expect(footerSlot.exists()).toBeTruthy()
      expect(footerSlot.text()).toBe('Footer Test Button')
    })
    it("should not display the content of the slots when they don't exists", () => {
      const wrapper = createWrapper()
      const titleSlot = wrapper.find('.p-error-block__title')
      const footerSlot = wrapper.find('.p-error-page__footer')

      expect(titleSlot.exists()).toBeFalsy()

      expect(footerSlot.exists()).toBeFalsy()
    })
  })
})
