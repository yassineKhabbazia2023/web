import { mount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'
import POfferCard from '.'

const logo = 'loop-color'
const title = 'Gestion Smart'
const description = 'My Management Expert (MEG) in start version (included in Pulse)'

const defaultProps = {
  pLogo: logo,
  pTitle: title,
  pDescription: description,
}

const createWrapper = (props: any = defaultProps) =>
  mount(POfferCard, {
    props,
  })

describe('pOfferCard', () => {
  describe('props', () => {
    it('should render the text values of the component', () => {
      const wrapper = createWrapper()

      const image = wrapper.findComponent({ name: 'PImage' })
      expect(image.exists()).toBeTruthy()

      const icon = wrapper.findComponent({ name: 'PIcon' })
      expect(icon.exists()).toBeTruthy()

      expect(wrapper.find('.p-offer-card__title').text()).toContain(title)
      expect(wrapper.find('.p-offer-card__description').text()).toContain(description)
    })
  })
})
