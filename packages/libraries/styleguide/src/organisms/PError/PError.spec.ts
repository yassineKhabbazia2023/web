import { mount, VueWrapper } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'
import PError from '.'
import type { PErrorBlockProps } from './PErrorTypes'
import { setAssetsBaseUrl } from '../../utils/imageResolverInit'

const defaultProps: PErrorBlockProps = {
  pButtonText: 'Look at that button text',
  pDescription: 'There is something wrong in here',
  pErrorName: '401',
  pErrorText: 'Something wrong',
  pHasFooter: true,
  pTitle: 'Crazy Error',
  pIllustrationName: 'error-page-1',
}

const createWrapper = (props: PErrorBlockProps = defaultProps, slots: any = {}) =>
  mount(PError, {
    props,
    slots,
  })

function findSkewedButton(wrapper: VueWrapper) {
  return wrapper.findComponent({ name: 'PSkewedButton' })
}

describe('pError', () => {
  beforeEach(() => {
    setAssetsBaseUrl('https://www.example.test')
  })
  describe('props', () => {
    it.each([
      {
        isFooterDisplayed: true,
      },
      {
        isFooterDisplayed: false,
      },
    ])('should not render the footer section when pHasFooter is false', ({ isFooterDisplayed }) => {
      const wrapper = createWrapper({
        ...defaultProps,
        pHasFooter: isFooterDisplayed,
      })

      const footerWrapper = wrapper.find('[data-testid="footer-content"')
      expect(footerWrapper.exists()).toBe(isFooterDisplayed)
    })

    it.each([
      {
        buttonText: 'you can click me',
        isButtonDisplayed: true,
      },
      {
        buttonText: undefined,
        isButtonDisplayed: false,
      },
    ])('should not render the button when the pButtonText prop has a value', ({ buttonText, isButtonDisplayed }) => {
      const wrapper = createWrapper({
        ...defaultProps,
        pButtonText: buttonText,
      })

      const skewedButtonWrapper = findSkewedButton(wrapper)
      expect(skewedButtonWrapper.exists()).toBe(isButtonDisplayed)
    })
  })

  describe('events', () => {
    it('should emit handle-click when button is clicked', async () => {
      const wrapper = createWrapper()
      const skewedButtonWrapper = findSkewedButton(wrapper)

      await skewedButtonWrapper.trigger('click')
      expect(wrapper.emitted('handle-click')).toHaveLength(1)
    })
  })
})
