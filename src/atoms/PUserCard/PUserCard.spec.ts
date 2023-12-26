import { mount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'
import PUserCard from '.'

const title = 'Jeanne MICHE'
const subtitle = 'jeanne.miche@lefournil.fr'
const description = 'Description of user'
const componentRootCSSClass = 'p-user-card'

const defaultProps = {
  pTitle: title,
  pSubtitle: subtitle,
  pDescription: description,
  pAssetLeft: 'Image',
  pAssetContent: 'activation'
}

const createWrapper = (props: any = defaultProps, slots: any = {}) =>
  mount(PUserCard, {
    props,
    slots
  })

describe('pUserCard', () => {
  describe('props', () => {
    it('should render the title values of the component', () => {
      const wrapper = createWrapper()

      expect(wrapper.find(`.${componentRootCSSClass}__title`).text()).toContain(
        title
      )
    })

    it('should render the subtitle values of the component', () => {
      const wrapper = createWrapper()

      expect(
        wrapper.find(`.${componentRootCSSClass}__subtitle`).text()
      ).toContain(subtitle)
    })

    it('should render the description values of the component', () => {
      const wrapper = createWrapper()

      expect(
        wrapper.find(`.${componentRootCSSClass}__description`).text()
      ).toContain(description)
    })

    it('should render the PImage component in the left block if it exists', () => {
      const wrapper = createWrapper()
      const leftAsset = wrapper.find('[data-ut=left-asset]')

      expect(leftAsset.exists()).toBeTruthy()
      expect(leftAsset.findComponent({ name: 'PImage' }).exists()).toBeTruthy()
    })

    it('should render the PTag component if it exists', () => {
      const wrapper = createWrapper({
        ...defaultProps,
        pTag: {
          pColor: 'persian',
          pSize: 'small',
          pIconLeft: 'PIPerson',
          pContent: 'Client',
          pEffect: 'light'
        }
      })
      const userCardTag = wrapper.find('[data-ut=user-card-tag]')

      expect(userCardTag.exists()).toBeTruthy()
    })

    it('should render the PAvatar component in the left block if it exists', () => {
      const wrapper = createWrapper({
        ...defaultProps,
        pAssetLeft: 'Avatar',
        pAssetContent: 'AB'
      })
      const leftAsset = wrapper.find('[data-ut=left-asset]')

      expect(leftAsset.exists()).toBeTruthy()
      expect(leftAsset.findComponent({ name: 'PAvatar' }).exists()).toBeTruthy()
    })
  })
  describe('slots', () => {
    it('should render the right header if exist', () => {
      const wrapper = createWrapper(
        {
          ...defaultProps
        },
        {
          default: '<PButton>Call to action</PButton>'
        }
      )
      const headerRight = wrapper.find('[data-ut=header-right]')

      expect(headerRight.exists()).toBeTruthy()
    })
  })
})
