import { flushPromises, mount } from '@vue/test-utils'
import { expect, describe, it, vi } from 'vitest'
import { postScheduleMock, scheduleServicesMock, TEST_DATE } from '@app/__mocks__/schedule.service.mocks'
import { getMonthlyMockSchedule } from '@app/__mocks__/schedule.mocks'
import type { ScheduleDrawerProps } from './ScheduleDrawerTypes'
import { nextTick } from 'vue'

import ScheduleDrawer from '.'

vi.mock('@app/schedule/services', () => scheduleServicesMock)

const mockedToday = new Date(TEST_DATE)
const createScheduleMockWithTypeLong = getMonthlyMockSchedule()
const amplitudeTrackMock = vi.hoisted(() => vi.fn())

function createWrapper(override: Partial<ScheduleDrawerProps> = {}) {
  const defaultProps: ScheduleDrawerProps = {
    modelValue: true,
    defaultCreateDate: mockedToday,
  }
  const props = {
    ...defaultProps,
    ...override,
  }

  return mount(ScheduleDrawer, {
    props,
    global: {
      stubs: {
        PLoader: true,
        CreateScheduleForm: true,
        PButton: true,
      },
    },
  })
}


vi.mock('@pulse/common', () => ({
  amplitudeService: {
    track: amplitudeTrackMock,
  },
}))

describe('test ScheduleDrawer', () => {
  it('renders the component when modelValue is true', () => {
    const wrapper = createWrapper({ modelValue: true })
    expect(wrapper.html()).toContain('New schedule')
  })

  it('should emit update:modelValue event', async () => {
    const wrapper = createWrapper({ modelValue: true })
    const sendReminderButton = wrapper.find('[data-testid="schedule-send-reminder-button"]')
    await sendReminderButton.trigger('click')
    await wrapper.find('.p-drawer__close-button').trigger('click')
    expect(wrapper.emitted('update:modelValue')).toStrictEqual([
      [false],
    ])
  })

  it('should call sendReminder service when the cta send-reminder is clicked', async () => {
    // Arrange
    const wrapper = createWrapper({ modelValue: true })

    // Act
    await flushPromises()
    const scheduleForm = wrapper.findComponent({ name: 'CreateScheduleForm' })
    scheduleForm.vm.$emit('update-schedule-model', createScheduleMockWithTypeLong)
    await nextTick()
    // Assert
    expect(postScheduleMock).toHaveBeenCalledWith(createScheduleMockWithTypeLong)
    expect(amplitudeTrackMock).toHaveBeenCalledOnce()
  })
})
