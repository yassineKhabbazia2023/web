import { shallowMount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'
import PCompletionTrackerListItem from '.'
import type { PCompletionTrackerListItemProps } from './PCompletionTrackerListItemTypes'

const defaultProps: PCompletionTrackerListItemProps = {
  pLabel: 'Informations dirigeant',
}

const createWrapper = (props = defaultProps) => shallowMount(PCompletionTrackerListItem, {
  props,
})

describe('pCompletionTrackerListItem', () => {
  describe('props', () => {
    it('should render the label', () => {
      const wrapper = createWrapper()

      expect(wrapper.find('[data-testid=completion-tracker-list-item-label]').text()).toContain('Informations dirigeant')
    })

    it('should default to pending status', () => {
      const wrapper = createWrapper()
      const item = wrapper.find('[data-testid=completion-tracker-list-item]')

      expect(item.classes()).toContain('p-completion-tracker-list-item--pending')
    })

    it('should apply in-progress status class', () => {
      const wrapper = createWrapper({ ...defaultProps, pStatus: 'in-progress' })
      const item = wrapper.find('[data-testid=completion-tracker-list-item]')

      expect(item.classes()).toContain('p-completion-tracker-list-item--in-progress')
    })

    it('should apply completed status class', () => {
      const wrapper = createWrapper({ ...defaultProps, pStatus: 'completed' })
      const item = wrapper.find('[data-testid=completion-tracker-list-item]')

      expect(item.classes()).toContain('p-completion-tracker-list-item--completed')
    })

    it('should render secondary text when provided', () => {
      const wrapper = createWrapper({ ...defaultProps, pSecondaryText: 'CNI manquante' })

      expect(wrapper.find('[data-testid=completion-tracker-list-item-secondary]').text()).toContain('CNI manquante')
    })

    it('should not render secondary text when not provided', () => {
      const wrapper = createWrapper()

      expect(wrapper.find('[data-testid=completion-tracker-list-item-secondary]').exists()).toBe(false)
    })

    it('should apply selected class when pSelected is true', () => {
      const wrapper = createWrapper({ ...defaultProps, pSelected: true })
      const item = wrapper.find('[data-testid=completion-tracker-list-item]')

      expect(item.classes()).toContain('p-completion-tracker-list-item--selected')
    })

    it('should not apply selected class by default', () => {
      const wrapper = createWrapper()
      const item = wrapper.find('[data-testid=completion-tracker-list-item]')

      expect(item.classes()).not.toContain('p-completion-tracker-list-item--selected')
    })

    it('should apply both completed and selected classes', () => {
      const wrapper = createWrapper({ ...defaultProps, pStatus: 'completed', pSelected: true })
      const item = wrapper.find('[data-testid=completion-tracker-list-item]')

      expect(item.classes()).toContain('p-completion-tracker-list-item--completed')
      expect(item.classes()).toContain('p-completion-tracker-list-item--selected')
    })
  })

  describe('events', () => {
    it('should emit select event when clicked', () => {
      const wrapper = createWrapper()

      wrapper.find('[data-testid=completion-tracker-list-item]').trigger('click')

      expect(wrapper.emitted('select')).toHaveLength(1)
    })
  })
})
