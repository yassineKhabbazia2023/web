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
  describe('interactions', () => {
    it('should emit create-schedule when create deadline button is clicked when isCollab', async () => {
      const wrapper = createWrapper({
        isCollab: true,
      })

      await wrapper.find('[data-testid="create-schedule"]').trigger('click')

      expect(wrapper.emitted('create-schedule')).toHaveLength(1)
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
      expect(wrapper.find('[data-testid="create-schedule"]').exists()).toBeFalsy()
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
  })
})
