import { flushPromises } from '@vue/test-utils'
import wrapperFactory from '@/schedule/tests/utils/wrapperFactory'
import Drawer from '.'
import { expect, describe, it, vi } from 'vitest'
import * as scheduleService from '@/schedule/services'
import CreateScheduleForm from '@/schedule/components/CreateSchedule/Form'
import { accountsCollection } from '@/schedule/tests/mocks/Account'
import { createScheduleMockWithTypeLong } from '@/schedule/tests/mocks/Deadline'

const createWrapper = (props: any = {}) =>
  wrapperFactory(Drawer, {
    props,
  })

vi.mock('@/schedule/services', () => {
  return {
    postSchedule: vi.fn(),
    getAccountsCollection: vi.fn(() => Promise.resolve(accountsCollection)),
    getScheduleModels: () => [{
      key: 'TVA',
      label: 'TVA au 21',
    }],
  }
})

describe('drawer.vue', () => {
  it('renders the component when modelValue is true', () => {
    const wrapper = createWrapper({ modelValue: true })
    expect(wrapper.html()).toContain('New schedule')
  })

  it('should emit update:modelValue event', async () => {
    const wrapper = createWrapper({ modelValue: true })
    await wrapper.vm.triggerFormEvaluation()
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
    const scheduleForm = wrapper.findComponent(CreateScheduleForm)
    scheduleForm.vm.$emit('update-schedule-model', createScheduleMockWithTypeLong)

    // Assert
    expect(scheduleService.postSchedule).toHaveBeenCalledWith(createScheduleMockWithTypeLong)
  })
})

