import { flushPromises } from '@vue/test-utils'
import { expect, describe, it, vi } from 'vitest'
import { nextTick } from 'vue'
import wrapperFactory from '@/schedule/tests/utils/wrapperFactory'
import CreateScheduleForm from '.'
import {
  PDatePicker,
  PSelect,
  PAlert,
} from '@kpmg/styleguide'
import DropdownSchedule from '@/schedule/components/CreateSchedule/DropdownSchedule'
import DropdownMultiSelectWithToggleAll from '@/schedule/components/Common/DropdownMultiSelectWithToggleAll'
import type { FormProps } from './CreateScheduleFormTypes'
import { accountsCollection, recipientsIdCollection } from '@/schedule/tests/mocks/Account'
import { accountsDataTransformer } from '@/schedule/helpers/utils'
import { getMockSchedule, getMonthlyMockSchedule, frequenciesMock }
  from '@/schedule/tests/mocks/Schedule'

const createScheduleMock = getMockSchedule()
const createScheduleMockWithTypeLong = getMonthlyMockSchedule()

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
    { type: 'TVA', typeShort: 'TVA', expected: createScheduleMock, frequency: 'None' },
    { type: 'autre', typeShort: 'IS', expected: createScheduleMockWithTypeLong, frequency: 'Monthly' },
  ])('emits the schedule model with reminder as $type', async ({ typeShort, expected, frequency }) => {
    const wrapper = createWrapper(
      {
        recipientsCollection: accountsDataTransformer(accountsCollection),
        frequenciesCollection: frequenciesMock,
      })
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
    const frequencyComponent = wrapper.findAllComponents(PSelect)[2]
    await frequencyComponent.setValue(frequency)
    await flushPromises()
    const emittedScheduleModel = wrapper.emitted('update-schedule-model')
    expect(emittedScheduleModel?.[0]).toStrictEqual([
      expected,
    ])
  })
  it('should show alert message', async () => {
    const wrapper = createWrapper(
      {
        recipientsCollection: accountsDataTransformer(accountsCollection),
        frequenciesCollection: frequenciesMock,
      })
    const frequencyComponent = wrapper.findAllComponents(PSelect)[2]
    await frequencyComponent.setValue('Monthly')
    const PDatePickerComponent = wrapper.findComponent(PDatePicker)
    PDatePickerComponent.vm.$emit('update:modelValue',
      new Date('April 29, 2024'))
    await nextTick()
    expect(wrapper.findComponent(PAlert).text())
      // eslint-disable-next-line max-len
      .toContain("Certains mois contiennent moins de 29 jours. Pour ces mois, l'occurrence sera créée le dernier jour du mois.")
  })
})

