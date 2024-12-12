import { mount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'
import PBlockHeader from '.'
import type { PBlockHeaderProps } from './PBlockHeaderTypes'
import { setAssetsBaseUrl } from '../../utils/imageResolverInit'

const title = 'Add collaborators'
const description = 'You can add collaborators on this offer.'
type PBlockHeaderPropsSize = PBlockHeaderProps['pSize']
type PBlockHeaderPropsColor = PBlockHeaderProps['pColor']
const componentRootCSSClass = 'p-block-header'

const defaultProps = {
  pTitle: title,
  pDescription: description,
  pSize: 'default',
  pColor: 'persian',
  pHasButton: false,
  pImage: {
    pFit: 'fill',
    pType: 'paupulse',
    pName: 'add-user',
  },
}

const createWrapper = (props: any = defaultProps, slots: any = {}) =>
  mount(PBlockHeader, {
    props,
    slots,
  })

describe('pBlockHeader', () => {
  beforeEach(() => {
    setAssetsBaseUrl('https://www.example.kpmg')
  })
  describe('props', () => {
    it('should render the title values of the component', () => {
      const wrapper = createWrapper()

      expect(wrapper.find(`.${componentRootCSSClass}__title`).text())
        .toContain(title)
    })

    it('should render the description values of the component', () => {
      const wrapper = createWrapper()

      expect(wrapper.find(`.${componentRootCSSClass}__description`).text())
        .toContain(description)
    })

    it('should render the PImage Component', () => {
      const wrapper = createWrapper()

      const image = wrapper.findComponent({ name: 'PImage' })
      expect(image.exists()).toBeTruthy()
    })

    it.each([
      {
        pHasButton: true,
        shouldHaveButtonClass: true,
      },
      {
        pHasButton: false,
        shouldHaveButtonClass: false,
      },
    ])('should show button zone when pHasButton is true',
      ({ pHasButton, shouldHaveButtonClass }) => {
        const wrapper = createWrapper({
          ...defaultProps,
          pHasButton,
        })
        const hasButtonClass = wrapper.find(`.${componentRootCSSClass}__button`).exists()
        expect(hasButtonClass).toBe(shouldHaveButtonClass)
      },
    )

    it('should have the "default" size by default', () => {
      const wrapper = createWrapper()
      expect(wrapper.classes()).toContain(`${componentRootCSSClass}--size-default`)
    })

    it.each([
      {
        pSize: 'big',
        expectedClassBinding: `${componentRootCSSClass}--size-big`,
      },
    ])(
      'should always bind class based on current size',
      ({ pSize, expectedClassBinding }) => {
        const wrapper = createWrapper({
          ...defaultProps,
          pSize: pSize as PBlockHeaderPropsSize,
        })
        expect(wrapper.classes()).toContain(expectedClassBinding)
      },
    )

    it.each([
      {
        pColor: 'gray',
        expectedClassBinding: `${componentRootCSSClass}--color-gray`,
      },
      {
        pColor: 'persian',
        expectedClassBinding: `${componentRootCSSClass}--color-persian`,
      },
    ])(
      'should always bind class based on current color',
      ({ pColor, expectedClassBinding }) => {
        const wrapper = createWrapper({
          ...defaultProps,
          pColor: pColor as PBlockHeaderPropsColor,
        })
        expect(wrapper.classes()).toContain(expectedClassBinding)
      },
    )
  })
  describe('slots', () => {
    it("should display the content of the 'suffix' slot when it exists", () => {
      const wrapper = createWrapper(
        defaultProps,
        {
          suffix: "<button data-testid='suffix-slot'>Suffix Test Button</button>",
        },
      )
      const suffixSlot = wrapper.find('[data-testid=suffix-slot]')

      expect(suffixSlot.exists()).toBeTruthy()
      expect(suffixSlot.text()).toBe('Suffix Test Button')
    })
  })
})
