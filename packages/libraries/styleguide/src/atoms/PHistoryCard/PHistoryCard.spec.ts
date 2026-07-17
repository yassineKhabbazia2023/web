// Import necessary modules
import { shallowMount } from '@vue/test-utils'
import PHistoryCard from '.'

import type { PHistoryCardProps } from './PHistoryCardTypes'
import { nextTick } from 'vue'

const props: PHistoryCardProps = {
  pDate: '12/12/24',
  pType: 'Délégation',
  pEntityIconName: 'shop',
  pEntity: 'Entity',
}
const createWrapper = (defaultProps = props, slots: Record<string, string> = {}) => {
  return shallowMount(PHistoryCard, {
    props: defaultProps,
    slots,
    global: {
      stubs: {
        PTag: {
          name: 'PTag',
          template: '<div :data-color="pColor">{{ pContent }}</div>',
          props: ['pContent', 'pIconLeftName', 'pColor'],
        },
        PTooltip: {
          name: 'PTooltip',
          template: '<div><slot /></div>',
          props: ['pContent', 'disabled'],
        },
        PIcon: {
          name: 'PIcon',
          template: '<div v-bind="$attrs">{{ pName }}</div>',
          props: ['pName'],
        },
        PAccordion: {
          name: 'PAccordion',
          template: '<div v-if="pIsOpen"><slot /></div>',
          props: ['pIsOpen', 'pHasHeader'],
        },
      },
    },
  })
}

describe('pHistoryCard', () => {
  describe('props', () => {
    it('should display slots if exist', () => {
      const wrapper = createWrapper(props, {
        text: 'Text Content',
        action: 'Action Content',
      })
      expect(wrapper.find('.p-history-card__text').text()).toContain('Text Content')
      expect(wrapper.find('.p-history-card__action').text()).toContain('Action Content')
    })

    it('should display tag content if content is set', () => {
      const wrapper = createWrapper(props)
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

    it('should display pTime tag when provided', () => {
      const wrapper = createWrapper({
        ...props,
        pTime: '10:30',
      })
      const timeTag = wrapper.find('[data-testid="history-card-time"]')
      expect(timeTag.exists()).toBeTruthy()
      expect(timeTag.text()).toContain('10:30')
    })

    it('should not display pTime tag when not provided', () => {
      const wrapper = createWrapper(props)
      const timeTag = wrapper.find('[data-testid="history-card-time"]')
      expect(timeTag.exists()).toBeFalsy()
    })

    it('should display pDescription tag when provided', () => {
      const wrapper = createWrapper({
        ...props,
        pDescription: 'Description test',
      })
      const descriptionTag = wrapper.find('[data-testid="history-card-description"]')
      expect(descriptionTag.exists()).toBeTruthy()
      expect(descriptionTag.text()).toContain('Description test')
    })

    it('should not display pDescription tag when not provided', () => {
      const wrapper = createWrapper(props)
      const descriptionTag = wrapper.find('[data-testid="history-card-description"]')
      expect(descriptionTag.exists()).toBeFalsy()
    })

    it('should use default dark-blue color for date tag when pDateColor is not provided', () => {
      const wrapper = createWrapper(props)
      const dateTag = wrapper.find('[data-testid="history-card-date"]')
      expect(dateTag.attributes('data-color')).toBe('dark-blue')
    })

    it('should use custom color for date tag when pDateColor is provided', () => {
      const wrapper = createWrapper({
        ...props,
        pDateColor: 'green',
      })
      const dateTag = wrapper.find('[data-testid="history-card-date"]')
      expect(dateTag.attributes('data-color')).toBe('green')
    })
  })

  describe('accordion', () => {
    it('should display chevron when pHasAccordion is true', () => {
      const wrapper = createWrapper({
        ...props,
        pHasAccordion: true,
      }, {
        details: 'Details Content',
      })
      const chevron = wrapper.find('[data-testid="history-card-chevron"]')
      expect(chevron.exists()).toBeTruthy()
    })

    it('should not display chevron when pHasAccordion is false', () => {
      const wrapper = createWrapper(props)
      const chevron = wrapper.find('[data-testid="history-card-chevron"]')
      expect(chevron.exists()).toBeFalsy()
    })

    it('should hide details slot by default when accordion is closed', () => {
      const wrapper = createWrapper({
        ...props,
        pHasAccordion: true,
      }, {
        details: 'Details Content',
      })
      const details = wrapper.find('[data-testid="history-card-details"]')
      expect(details.exists()).toBeFalsy()
    })

    it('should show details slot after clicking on the card', async () => {
      const wrapper = createWrapper({
        ...props,
        pHasAccordion: true,
      }, {
        details: 'Details Content',
      })
      const card = wrapper.find('.p-history-card')
      await card.trigger('click')
      await nextTick()

      const details = wrapper.find('[data-testid="history-card-details"]')
      expect(details.exists()).toBeTruthy()
      expect(details.text()).toContain('Details Content')
    })

    it('should show details slot after clicking on the chevron', async () => {
      const wrapper = createWrapper({
        ...props,
        pHasAccordion: true,
      }, {
        details: 'Details Content',
      })
      const chevron = wrapper.find('[data-testid="history-card-chevron"]')
      await chevron.trigger('click')
      await nextTick()

      const details = wrapper.find('[data-testid="history-card-details"]')
      expect(details.exists()).toBeTruthy()
      expect(details.text()).toContain('Details Content')
    })

    it('should toggle accordion state on multiple clicks on the card', async () => {
      const wrapper = createWrapper({
        ...props,
        pHasAccordion: true,
      }, {
        details: 'Details Content',
      })
      const card = wrapper.find('.p-history-card')

      // First click - open
      await card.trigger('click')
      await nextTick()
      expect(wrapper.find('[data-testid="history-card-details"]').exists()).toBeTruthy()

      // Second click - close
      await card.trigger('click')
      await nextTick()
      expect(wrapper.find('[data-testid="history-card-details"]').exists()).toBeFalsy()

      // Third click - open again
      await card.trigger('click')
      await nextTick()
      expect(wrapper.find('[data-testid="history-card-details"]').exists()).toBeTruthy()
    })

    it('should add clickable class when pHasAccordion is true and details slot exists', () => {
      const wrapper = createWrapper({
        ...props,
        pHasAccordion: true,
      }, {
        details: 'Details Content',
      })
      expect(wrapper.find('.p-history-card--clickable').exists()).toBeTruthy()
    })

    it('should not add clickable class when pHasAccordion is false', () => {
      const wrapper = createWrapper(props, {
        details: 'Details Content',
      })
      expect(wrapper.find('.p-history-card--clickable').exists()).toBeFalsy()
    })

    it('should display chevronDown icon when accordion is closed', () => {
      const wrapper = createWrapper({
        ...props,
        pHasAccordion: true,
      }, {
        details: 'Details Content',
      })
      const chevron = wrapper.find('[data-testid="history-card-chevron"]')
      expect(chevron.text()).toBe('chevronDown')
    })

    it('should display chevronUp icon when accordion is open', async () => {
      const wrapper = createWrapper({
        ...props,
        pHasAccordion: true,
      }, {
        details: 'Details Content',
      })
      const card = wrapper.find('.p-history-card')
      await card.trigger('click')
      await nextTick()
      const chevron = wrapper.find('[data-testid="history-card-chevron"]')
      expect(chevron.text()).toBe('chevronUp')
    })

    it('should display both action slot and chevron when both are present', () => {
      const wrapper = createWrapper({
        ...props,
        pHasAccordion: true,
      }, {
        action: 'Action Content',
        details: 'Details Content',
      })
      expect(wrapper.find('.p-history-card__action').exists()).toBeTruthy()
      expect(wrapper.find('[data-testid="history-card-chevron"]').exists()).toBeTruthy()
    })
  })
})
