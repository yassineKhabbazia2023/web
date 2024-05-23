import ScheduleReminder from '.'
import { expect, describe, it, beforeEach } from 'vitest'
import type { ScheduleReminderProps } from './ScheduleReminderTypes'
import { type VueWrapper, shallowMount } from '@vue/test-utils'

const createWrapper = (override: Partial<ScheduleReminderProps> = {}) => {
  const defaultProps: ScheduleReminderProps = {
    modelValue: 0,
  }
  const props = {
    ...defaultProps,
    ...override,
  }

  return shallowMount(ScheduleReminder, {
    props,
    global: {
      stubs: {
        PInput: {
          name: 'PInput',
          template: '<div />',
          props: ['modelValue'],
        },
        PDropdown: {
          name: 'PDropdown',
          template: '<div />',
          props: ['modelValue'],
        },
      },
    },
  })
}

function getComponents(wrapper: VueWrapper) {
  const pInput = wrapper.findComponent({ name: 'PInput' })
  const pDropdown = wrapper.findComponent({ name: 'PDropdown' })

  return {
    pInput,
    pDropdown,
  }
}

describe('test ScheduleReminder', () => {
  describe('when modelValue is < 0', () => {
    const modelValue = -1
    let wrapper:VueWrapper
    beforeEach(() => {
      wrapper = createWrapper({ modelValue })
    })

    it('should display properly', () => {
      const {
        pInput,
        pDropdown,
      } = getComponents(wrapper)
      expect(pInput.props('modelValue')).toStrictEqual(-modelValue)
      expect(pDropdown.props('modelValue')).toBeFalsy()
    })

    it('should emit update:model-value with proper value when input value', () => {
      const newValue = 2.2
      const expectedNewValue = -2
      const pInput = wrapper.findComponent({ name: 'PInput' })
      pInput.vm.$emit('update:model-value', newValue)

      expect(wrapper.emitted('update:model-value')).toStrictEqual([[expectedNewValue]])
    })

    it('should emit update:model-value with proper value when change option', () => {
      const pInput = wrapper.findComponent({ name: 'PDropdown' })
      pInput.vm.$emit('update:model-value', true)

      expect(wrapper.emitted('update:model-value')).toStrictEqual([[-modelValue]])
    })

    it('should emit delete when click on delete button', async () => {
      const deleteButton = wrapper.find('[data-testid="schedule-reminder-delete"]')
      await deleteButton.trigger('click')

      expect(wrapper.emitted('delete')).toStrictEqual([[]])
    })
  })
  describe('when modelValue is > 0', () => {
    const modelValue = 1
    let wrapper:VueWrapper
    beforeEach(() => {
      wrapper = createWrapper({ modelValue })
    })

    it('should display properly', () => {
      const {
        pInput,
        pDropdown,
      } = getComponents(wrapper)
      expect(pInput.props('modelValue')).toStrictEqual(modelValue)
      expect(pDropdown.props('modelValue')).toBeTruthy()
    })

    it('should emit update:model-value with proper value when input value', () => {
      const newValue = 2
      const pInput = wrapper.findComponent({ name: 'PInput' })
      pInput.vm.$emit('update:model-value', newValue)

      expect(wrapper.emitted('update:model-value')).toStrictEqual([[newValue]])
    })

    it('should emit update:model-value with proper value when change option', () => {
      const pInput = wrapper.findComponent({ name: 'PDropdown' })
      pInput.vm.$emit('update:model-value', true)

      expect(wrapper.emitted('update:model-value')).toStrictEqual([[modelValue]])
    })
  })
})

