import { flushPromises } from '@vue/test-utils'
import { expect, describe, it, vi } from 'vitest'
import wrapperFactory from '@/schedule/tests/utils/wrapperFactory'
import CreateScheduleForm from '.'
import {
  PDatePicker,
} from '@kpmg/styleguide'
import DropdownSchedule from '@/schedule/components/CreateSchedule/DropdownSchedule'
import DropdownMultiSelectWithToggleAll from '@/schedule/components/Common/DropdownMultiSelectWithToggleAll'
import type { FormProps } from './FormTypes'
import { accountsCollection, recipientsIdCollection } from '@/schedule/tests/mocks/Account'
import { accountsDataTransformer } from '@/schedule/helpers/utils'
import { createScheduleMock, createScheduleMockWithTypeLong } from '@/schedule/tests/mocks/Deadline'

const createWrapper = (props: FormProps) =>
  wrapperFactory(CreateScheduleForm, { props })

vi.mock('@/schedule/services', () => {
  return {
    getScheduleModels: (longLabels: boolean) => [{
      key: 'TVA',
      label: longLabels ? 'TVA au 21' : 'TVA',
    }],
  }
})

describe('form.vue', () => {
  it.each([
    { type: 'TVA', typeShort: 'TVA', expected: createScheduleMock },
    { type: 'autre', typeShort: 'IS', expected: createScheduleMockWithTypeLong },
  ])('emits the schedule model with reminder as $type', async ({ typeShort, expected }) => {
    const wrapper = createWrapper(
      { recipientsCollection: accountsDataTransformer(accountsCollection) })
    const DropdownScheduleComponent = wrapper.findComponent(DropdownSchedule)
    DropdownScheduleComponent.vm.$emit('update:modelValue', typeShort)
    const DropdownMultiSelectWithToggleAllComponent = wrapper.findComponent(
      DropdownMultiSelectWithToggleAll,
    )
    DropdownMultiSelectWithToggleAllComponent.vm.$emit('update:modelValue', recipientsIdCollection)
    const PDatePickerComponent = wrapper.findComponent(PDatePicker)
    PDatePickerComponent.vm.$emit('update:modelValue',
      new Date('Wed Mar 20 2024 11:55:50 GMT+0100 (heure normale d’Europe centrale)'))
    await wrapper.setProps({ checkValidity: true })
    await flushPromises()
    const emittedScheduleModel = wrapper.emitted('update-schedule-model')
    expect(emittedScheduleModel?.[0]).toStrictEqual([
      expected,
    ])
  })
})

