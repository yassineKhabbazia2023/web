import { nextTick } from 'vue'
import { type VueWrapper, shallowMount } from '@vue/test-utils'
import { expect, describe, it, beforeEach } from 'vitest'
import CreateScheduleReminders from '.'
import type { CreateScheduleRemindersProps } from './CreateScheduleRemindersTypes'

const createWrapper = (override: Partial<CreateScheduleRemindersProps> = {}) => {
  const defaultProps: CreateScheduleRemindersProps = {
    modelValue: [],
  }
  const props = {
    ...defaultProps,
    ...override,
  }

  return shallowMount(CreateScheduleReminders, {
    props,
  })
}

describe('test CreateScheduleReminders', () => {
  describe('when two different reminders', () => {
    const modelValue = [
      -1,
      2,
    ]
    let wrapper: VueWrapper
    beforeEach(() => {
      wrapper = createWrapper({ modelValue })
    })

    it('should display two reminders with proper values', () => {
      const scheduleReminders = wrapper.findAllComponents({ name: 'ScheduleReminder' })
      expect(scheduleReminders).toHaveLength(2)
      expect(scheduleReminders.at(0)?.props('modelValue')).toBe(modelValue[0])
      expect(scheduleReminders.at(1)?.props('modelValue')).toBe(modelValue[1])
    })

    it('should emit proper update:model-value when click on add button', async () => {
      const defaultReminder = -1
      const expectedReminders = [
        ...modelValue,
        defaultReminder,
      ]
      const addReminderButton = wrapper.find('[data-testid="create-schedule-add"]')
      await addReminderButton.trigger('click')

      expect(wrapper.emitted('update:model-value')).toStrictEqual([[expectedReminders]])
    })

    it('should emit proper update:model-value when changes first reminder value', async () => {
      const newReminderValue = 3
      const expectedReminders = [
        newReminderValue,
        modelValue[1],
      ]
      const firstScheduleReminder = wrapper.findComponent({ name: 'ScheduleReminder' })
      await firstScheduleReminder.vm.$emit('update:model-value', newReminderValue)

      expect(wrapper.emitted('update:model-value')).toStrictEqual([[expectedReminders]])
    })

    it('should emit proper update:model-value when delete first reminder', async () => {
      const expectedReminders = [
        modelValue[1],
      ]
      const firstScheduleReminder = wrapper.findComponent({ name: 'ScheduleReminder' })
      await firstScheduleReminder.vm.$emit('delete')

      expect(wrapper.emitted('update:model-value')).toStrictEqual([[expectedReminders]])
    })

    it('should disable add button when 3 reminders', () => {
      const modelValue = [
        -1,
        2,
        1,
      ]
      wrapper = createWrapper({ modelValue })
      const pButton = wrapper.findComponent({ name: 'PButton' })
      expect(pButton.props('pDisabled')).toBeTruthy()
    })

    it('getIsValid should return true when reminders there is no duplicate', () => {
      const modelValue = [
        -1,
        2,
        1,
      ]
      wrapper = createWrapper({ modelValue })
      const isValid = (wrapper.vm as any).getIsValid()
      expect(isValid).toBeTruthy()
    })
  })

  describe('when there is duplicates reminders', () => {
    const modelValue = [
      -1,
      2,
      -1,
    ]
    let wrapper: VueWrapper
    beforeEach(() => {
      wrapper = createWrapper({ modelValue })
    })

    it('should manage isError status', async () => {
      const isValid = (wrapper.vm as any).getIsValid()
      await nextTick()
      const scheduleReminders = wrapper.findAllComponents({ name: 'ScheduleReminder' })

      expect(isValid).toBeFalsy()
      expect(scheduleReminders.at(0)?.props('isError')).toBeTruthy()
      expect(scheduleReminders.at(1)?.props('isError')).toBeFalsy()
      expect(scheduleReminders.at(2)?.props('isError')).toBeTruthy()
    })
  })

  describe('when there is more then 3 reminders (edge case)', () => {
    const modelValue = [
      1,
      2,
      3,
      4,
    ]
    let wrapper: VueWrapper
    beforeEach(() => {
      wrapper = createWrapper({ modelValue })
    })

    it('add button should be disabled', () => {
      const pButton = wrapper.findComponent({ name: 'PButton' })
      expect(pButton.props('pDisabled')).toBeTruthy()
    })

    it('getIsValid should return false', () => {
      const isValid = (wrapper.vm as any).getIsValid()
      expect(isValid).toBeFalsy()
    })
  })
})

