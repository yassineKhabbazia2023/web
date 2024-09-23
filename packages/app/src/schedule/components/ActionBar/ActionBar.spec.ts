import { describe, it, expect } from 'vitest'
import { shallowMount } from '@vue/test-utils'
import ActionBar from '.'
import type { ActionBarProps } from './ActionBarTypes'

const TEST_DATE = '2024-04-10'

function createWrapper(override: Partial<ActionBarProps> = {}) {
  const defaultProps: ActionBarProps = {
    modelValue: 'list',
    activeDate: new Date(TEST_DATE),
    isCollab: false,
    searchTerm: '',
    isSearchState: false,
    activeFilters: 0,
  }
  const props = {
    ...defaultProps,
    ...override,
  }

  return shallowMount(ActionBar, {
    props,
  })
}

describe('action bar', () => {
  describe('display', () => {
    const tests = [{
      isSearchState: false,
      expected: true,
    }, {
      isSearchState: true,
      expected: false,
    }]
    it.each(tests)('actionBarRight.exists should be $expected when isSearchState is $isSearchState', ({
      isSearchState,
      expected,
    }) => {
      const wrapper = createWrapper({
        isSearchState,
      })

      const actionBarRight = wrapper.find('[data-testid="action-bar-right"]')

      expect(actionBarRight.exists()).toBe(expected)
    })
  })

  describe('interactions', () => {
    it('should emit create-schedule when create deadline button is clicked when isCollab', async () => {
      const wrapper = createWrapper({
        isCollab: true,
      })

      await wrapper.find('[data-testid="action-bar-create-schedule-button"]').trigger('click')

      expect(wrapper.emitted('create-schedule')).toStrictEqual([[]])
    })

    it('should emit update:modelValue on tab change', () => {
      const wrapper = createWrapper()
      const emitValue = 'calendar'
      wrapper.findComponent({ name: 'PTabs' }).vm.$emit('update:modelValue', emitValue)

      const emittedEvent = wrapper.emitted('update:modelValue')
      expect(emittedEvent).toHaveLength(1)
      expect(emittedEvent).toBeDefined()
      expect(emittedEvent?.at(0)).toStrictEqual([emitValue])
    })

    it('should emit update:active-date', () => {
      const wrapper = createWrapper()
      const newDate = new Date('2024-05-03')
      const actionBarLeft = wrapper.findComponent({ name: 'ActionBarLeft' })
      actionBarLeft.vm.$emit('update:active-date', newDate)
      expect(wrapper.emitted('update:active-date')).toStrictEqual([[newDate]])
    })

    it('should not show create schedule when NOT isCollab', () => {
      const wrapper = createWrapper()
      expect(wrapper.find('[data-testid="action-bar-create-schedule-button"]').exists()).toBeFalsy()
    })

    it('should emit update:search-term when actionBarLeft emits update:search-term', () => {
      const searchTermBefore = 'before'
      const searchTermAfter = 'after'
      const wrapper = createWrapper({
        searchTerm: searchTermBefore,
        modelValue: 'list',
      })

      const actionBarLeft = wrapper.findComponent({ name: 'ActionBarLeft' })
      expect(actionBarLeft.props('searchTerm')).toBe(searchTermBefore)

      actionBarLeft.vm.$emit('update:search-term', searchTermAfter)

      expect(wrapper.emitted('update:search-term')).toStrictEqual([[searchTermAfter]])
    })

    it('should emit update:is-search-state when actionBarLeft emits update:is-search-state', () => {
      const isSearchStateBefore = true
      const isSearchStateAfter = false
      const wrapper = createWrapper({
        isSearchState: isSearchStateBefore,
      })

      const actionBarLeft = wrapper.findComponent({ name: 'ActionBarLeft' })
      expect(actionBarLeft.props('isSearchState')).toBe(isSearchStateBefore)

      actionBarLeft.vm.$emit('update:is-search-state', isSearchStateAfter)

      expect(wrapper.emitted('update:is-search-state')).toStrictEqual([[isSearchStateAfter]])
    })

    it('should emit open-drawer-filters when triggered in  actionBarLeft', () => {
      const wrapper = createWrapper()

      const actionBarLeft = wrapper.findComponent({ name: 'ActionBarLeft' })

      actionBarLeft.vm.$emit('open-drawer-filters', true)

      expect(wrapper.emitted('open-drawer-filters')).toStrictEqual([[true]])
    })
  })
})
