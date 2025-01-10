// Import necessary modules
import { shallowMount } from '@vue/test-utils'
import PHistoryCard from '.'
import { describe, it, expect } from 'vitest'
import type { PHistoryCardProps } from './PHistoryCardTypes'
import { nextTick } from 'vue'

const props: PHistoryCardProps = {
  pDate: '12/12/24',
  pType: 'Délégation',
  pEntityIconName: 'shop',
  pEntity: 'Entity',
}
const createWrapper = (defaultProps = props, hasSlots = false) => {
  const testSlots = {
    text: 'Text Content',
    action: 'Action Content',
  }
  const slots = hasSlots ? testSlots : undefined

  return shallowMount(PHistoryCard, {
    props: defaultProps,
    slots,
    global: {
      stubs: {
        PTag: {
          name: 'PTag',
          template: '<div>{{ pContent }}</div>',
          props: ['pContent', 'pIconLeftName'],
        },
        PTooltip: {
          name: 'PTooltip',
          template: '<div><slot /></div>',
          props: ['pContent', 'disabled'],
        },
        PIcon: {
          name: 'PIcon',
          template: '<div><slot /></div>',
          props: ['pName'],
        },
      },
    },
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
      const pTag = entity.findComponent({ name: 'PTag' })
      expect(pTag.exists()).toBeTruthy()
      expect(pTag.props('pIconLeftName')).toBe('shop')
    })
    it('should display Tooltip content if content is set', async () => {
      const pTooltipEntityContent = 'Test'
      const wrapper = createWrapper({
        ...props,
        pTooltipEntityContent,
      })
      await nextTick()
      const pTooltip = wrapper.findComponent({ name: 'PTooltip' })
      expect(pTooltip.exists()).toBeTruthy()
      expect(pTooltip.props('pContent')).toBe(pTooltipEntityContent)
    })
  })
})
