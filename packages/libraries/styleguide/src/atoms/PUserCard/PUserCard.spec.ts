import { shallowMount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'
import PUserCard from '.'
import type { PUserCardProps } from './PUserCardTypes'

const title = 'Jeanne MICHE'
const subtitle = 'jeanne.miche@lefournil.fr'
const description = 'Description of user'
const componentRootCSSClass = 'p-user-card'

const defaultProps: PUserCardProps = {
  pTitle: title,
  pSubtitle: subtitle,
  pDescription: description,
  pImageName: 'activation',
  pColor: 'gray',
}

const createWrapper = (props: PUserCardProps = defaultProps, slots: any = {}) =>
  shallowMount(PUserCard, {
    props,
    slots,
    global: {
      stubs: {
        PImage: {
          name: 'PImage',
          template: '<div><slot /></div>',
          props: [
            'pName',
          ],
        },
        PAvatar: {
          name: 'PAvatar',
          template: '<div><slot /></div>',
        },
        PTag: {
          name: 'PTag',
          template: '<div><slot /></div>',
        },
      },
    },
  })

describe('pUserCard', () => {
  describe('props', () => {
    it('should render the title values of the component', () => {
      const wrapper = createWrapper()

      expect(wrapper.find(`.${componentRootCSSClass}__title`).text()).toContain(
        title,
      )
    })

    it('should render the subtitle values of the component', () => {
      const wrapper = createWrapper()

      expect(
        wrapper.find(`.${componentRootCSSClass}__subtitle`).text(),
      ).toContain(subtitle)
    })

    it('should render the description values of the component', () => {
      const wrapper = createWrapper()

      expect(
        wrapper.find(`.${componentRootCSSClass}__description`).text(),
      ).toContain(description)
    })

    it('should render the color of the component', () => {
      const wrapper = createWrapper()

      expect(wrapper.classes()).toContain(
        `${componentRootCSSClass}--color-${defaultProps.pColor}`,
      )
    })

    it('should render the PImage component in the left block if it exists', () => {
      const wrapper = createWrapper()
      const leftAsset = wrapper.find('[data-ut=left-asset]')
      const pImage = leftAsset.findComponent({ name: 'PImage' })

      expect(leftAsset.exists()).toBeTruthy()
      expect(pImage.exists()).toBeTruthy()
      expect(pImage.props('pName')).toBe(defaultProps.pImageName)
    })

    it('should render the PTag component if it exists', () => {
      const wrapper = createWrapper({
        ...defaultProps,
        pTag: {
          pColor: 'persian',
          pSize: 'small',
          pIconLeftName: 'person',
          pContent: 'Client',
        },
      })
      const userCardTag = wrapper.find('[data-ut=user-card-tag]')

      expect(userCardTag.exists()).toBeTruthy()
    })

    it('should render the PAvatar component in the left block if it exists', () => {
      const pAvatarContent = 'AB'
      const wrapper = createWrapper({
        ...defaultProps,
        pAvatarContent,
      })
      const leftAsset = wrapper.find('[data-ut=left-asset]')
      const pAvatar = leftAsset.findComponent({ name: 'PAvatar' })

      expect(leftAsset.exists()).toBeTruthy()
      expect(pAvatar.exists()).toBeTruthy()
      expect(pAvatar.text()).toBe(pAvatarContent)
    })
  })
  describe('slots', () => {
    it('should render the right header if exist', () => {
      const wrapper = createWrapper(
        {
          ...defaultProps,
        },
        {
          default: '<div>Call to action</div>',
        },
      )
      const headerRight = wrapper.find('[data-ut=header-right]')

      expect(headerRight.exists()).toBeTruthy()
    })
  })
})
