import ScheduleReminder from '.'
import { expect, describe, it, beforeEach } from 'vitest'
import type { ScheduleReminderProps } from './ScheduleReminderTypes'
import { type VueWrapper, shallowMount } from '@vue/test-utils'

const createWrapper = (override: Partial<ScheduleReminderProps> = {}) => {
  const defaultProps: ScheduleReminderProps = {
    modelValue: 0,
    isError: false,
  }
  const props = {
    ...defaultProps,
    ...override,
  }

  return shallowMount(ScheduleReminder, {
    props,
    global: {
      stubs: {
        PFormItem: {
          name: 'PFormItem',
          template: '<div><slot /></div>',
          props: ['pError'],
        },
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
  const PFormItem = wrapper.findComponent({ name: 'PFormItem' })
  const pInput = wrapper.findComponent({ name: 'PInput' })
  const pDropdown = wrapper.findComponent({ name: 'PDropdown' })

  return {
    PFormItem,
    pInput,
    pDropdown,
  }
}

describe('test ScheduleReminder', () => {
  describe('when modelValue is < 0', () => {
    const modelValue = -1
    const expectedValue = `${-modelValue}`
    let wrapper:VueWrapper
    beforeEach(() => {
      wrapper = createWrapper({ modelValue })
    })

    it('should display properly', () => {
      const {
        PFormItem,
        pInput,
        pDropdown,
      } = getComponents(wrapper)
      expect(PFormItem.props('pError')).toBe('')
      expect(pInput.props('modelValue')).toBe(expectedValue)
      expect(pDropdown.props('modelValue')).toBeFalsy()
    })

    it('should emit update:model-value with proper value when input value', () => {
      const newValue = '2.2'
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

    it('should emit update:model-value with 0 when input string value', () => {
      const newValue = 'abc'
      const expectedValue = 0
      const pInput = wrapper.findComponent({ name: 'PInput' })
      pInput.vm.$emit('update:model-value', newValue)

      expect(wrapper.emitted('update:model-value')).toStrictEqual([[expectedValue]])
    })
  })

  describe('when modelValue is > 0', () => {
    const modelValue = 1
    const expectedValue = `${modelValue}`
    let wrapper:VueWrapper
    beforeEach(() => {
      wrapper = createWrapper({ modelValue })
    })

    it('should display properly', () => {
      const {
        pInput,
        pDropdown,
      } = getComponents(wrapper)
      expect(pInput.props('modelValue')).toBe(expectedValue)
      expect(pDropdown.props('modelValue')).toBeTruthy()
    })

    it('should emit update:model-value with proper value when input value', () => {
      const newValue = '2'
      const expectedValue = 2
      const pInput = wrapper.findComponent({ name: 'PInput' })
      pInput.vm.$emit('update:model-value', newValue)

      expect(wrapper.emitted('update:model-value')).toStrictEqual([[expectedValue]])
    })

    it('should emit update:model-value with proper value when change option', () => {
      const pInput = wrapper.findComponent({ name: 'PDropdown' })
      pInput.vm.$emit('update:model-value', true)

      expect(wrapper.emitted('update:model-value')).toStrictEqual([[modelValue]])
    })

    it('should emit update:model-value with 0 when input string value', () => {
      const newValue = 'abc'
      const expectedValue = 0
      const pInput = wrapper.findComponent({ name: 'PInput' })
      pInput.vm.$emit('update:model-value', newValue)

      expect(wrapper.emitted('update:model-value')).toStrictEqual([[expectedValue]])
    })
  })

  describe('when isError', () => {
    const isError = true
    let wrapper:VueWrapper
    beforeEach(() => {
      wrapper = createWrapper({ isError })
    })

    it('should set PFormItem pError', () => {
      const {
        PFormItem,
      } = getComponents(wrapper)
      expect(PFormItem.props('pError')).toBe('error')
    })
  })
})
