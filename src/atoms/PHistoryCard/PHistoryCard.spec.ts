// Import necessary modules
import { mount } from '@vue/test-utils'
import PHistoryCard from '.'
import { describe, it, expect } from 'vitest'
import type { PHistoryCardProps } from './PHistoryCardTypes'

const props: PHistoryCardProps = {
  pDate: '12/12/24',
  pType: 'Délégation',
  pEntityIcon: 'PIShop',
  pEntity: 'Entity',
}
const createWrapper = (defaultProps = props, hasSlots = false) => {
  const testSlots = {
    text: 'Text Content',
    action: 'Action Content',
  }
  const slots = hasSlots ? testSlots : undefined

  return mount(PHistoryCard, {
    props: defaultProps,
    slots,
  })
}

describe('pHistoryCard', () => {
  describe('props', () => {
    it('should display slots if exist', () => {
      const wrapper = createWrapper({
        ...props,
      }, true)
      expect(wrapper.find('.p-history-card__text').text()).toContain('Text Content')
      expect(wrapper.find('.p-history-card__action').text()).toContain('Action Content')
    })
    it('should display tag content if content is set', () => {
      const wrapper = createWrapper({
        ...props,
      })
      expect(wrapper.find('[data-testid="history-card-date"]').text()).toContain('12/12/24')
      expect(wrapper.find('[data-testid="history-card-type"]').text()).toContain('Délégation')
      const entity = wrapper.find('[data-testid="history-card-entity"]')
      expect(entity.text()).toContain('Entity')
      expect(entity.findComponent({ name: 'PIShop' as string })).toBeTruthy()
    })
  })
})
