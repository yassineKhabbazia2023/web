import { flushPromises, mount } from '@vue/test-utils'
import ScheduleDrawer from '.'
import { expect, describe, it, vi } from 'vitest'
import * as scheduleService from '@/schedule/services'
import { accountsCollection } from '@/schedule/tests/mocks/Account'
import { getMonthlyMockSchedule, frequenciesMock } from '@/schedule/tests/mocks/Schedule'
import type { ScheduleDrawerProps } from './ScheduleDrawerTypes'

const TEST_DATE = '2024-08-14'
const mockedToday = new Date(TEST_DATE)
const createScheduleMockWithTypeLong = getMonthlyMockSchedule()

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
  })
}

vi.mock('@/schedule/services', () => {
  return {
    postSchedule: vi.fn(),
    getAccountsCollection: vi.fn(() => Promise.resolve(accountsCollection)),
    getScheduleModels: () => [{
      key: 'TVA',
      label: 'TVA au 21',
    }],
    getFrequenciesCollection: vi.fn(() => Promise.resolve(frequenciesMock)),
  }
})

describe('drawer.vue', () => {
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

    // Assert
    expect(scheduleService.postSchedule).toHaveBeenCalledWith(createScheduleMockWithTypeLong)
  })
})

