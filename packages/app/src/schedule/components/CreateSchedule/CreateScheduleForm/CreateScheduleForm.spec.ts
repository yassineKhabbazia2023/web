import { flushPromises, mount } from '@vue/test-utils'
import { expect, describe, it, vi } from 'vitest'
import { nextTick } from 'vue'
import CreateScheduleForm from '.'
import {
  PSelect,
  PAlert,
  PUpload,
} from '@pulse/styleguide/components'
import type { FormProps } from './CreateScheduleFormTypes'
import { accountsCollection, recipientsIdCollection } from '@app/schedule/tests/mocks/Account'
import { accountsDataTransformer } from '@app/schedule/helpers/utils'
import { getMockSchedule, getMonthlyMockSchedule, frequenciesMock }
  from '@app/schedule/tests/mocks/Schedule'
import { TEMPLATE_TYPE_SHORT_OTHER } from '@app/schedule/helpers/scheduleConsts'
import { TEST_DATE } from '@app/schedule/tests/mocks/commonViMock'

const mockedReminders = [2]
const createScheduleMock = getMockSchedule(mockedReminders)
const createScheduleMockWithTypeLong = getMonthlyMockSchedule(mockedReminders)

const createWrapper = (props: FormProps) =>
  mount(CreateScheduleForm, { props })

vi.mock('@app/schedule/services', () => {
  return {
    getScheduleModels: (longLabels: boolean) => [{
      key: 'TVA',
      label: longLabels ? 'TVA au 21' : 'TVA',
    }],
  }
})

describe('test CreateScheduleForm', () => {
  it.each([
    {
      type: 'TVA',
      typeShort: 'TVA',
      expected: createScheduleMock,
      frequency: 'None',
    }, {
      type: TEMPLATE_TYPE_SHORT_OTHER,
      typeShort: 'IS',
      expected: createScheduleMockWithTypeLong,
      frequency: 'Monthly',
    },
  ])('emits the schedule model with reminder as $type', async ({ typeShort, expected, frequency }) => {
    const wrapper = createWrapper(
      {
        recipientsCollection: accountsDataTransformer(accountsCollection),
        frequenciesCollection: frequenciesMock,
      })
    const [
      DropdownScheduleComponent,
      DropdownMultiSelectWithToggleAllComponent,
    ] = wrapper.findAllComponents({ name: 'PDropdown' })

    DropdownScheduleComponent.vm.$emit('update:modelValue', typeShort)
    DropdownMultiSelectWithToggleAllComponent.vm.$emit('update:modelValue', recipientsIdCollection)

    const PDatePickerComponent = wrapper.findComponent({ name: 'PDatePicker' })
    const newDate = new Date(expected.scheduling.date)
    PDatePickerComponent.vm.$emit('update:modelValue', newDate)

    const createScheduleReminders = wrapper.findComponent({ name: 'CreateScheduleReminders' })
    createScheduleReminders.vm.$emit('update:model-value', mockedReminders)

    await wrapper.setProps({ checkValidity: true })
    const frequencyComponent = wrapper.findAllComponents(PSelect)[2]
    await frequencyComponent.setValue(frequency)
    await flushPromises()
    const emittedScheduleModel = wrapper.emitted('update-schedule-model')
    expect(emittedScheduleModel?.[0]).toStrictEqual([
      expected,
    ])
  })

  it('should not emit update-schedule-model when data is not valid', async () => {
    const mockedReminders = [
      1,
      1,
    ]
    const typeShort = 'TVA'
    const frequency = 'None'

    const wrapper = createWrapper(
      {
        recipientsCollection: accountsDataTransformer(accountsCollection),
        frequenciesCollection: frequenciesMock,
      })
    const [
      DropdownScheduleComponent,
      DropdownMultiSelectWithToggleAllComponent,
    ] = wrapper.findAllComponents({ name: 'PDropdown' })

    DropdownScheduleComponent.vm.$emit('update:modelValue', typeShort)
    DropdownMultiSelectWithToggleAllComponent.vm.$emit('update:modelValue', recipientsIdCollection)

    const PDatePickerComponent = wrapper.findComponent({ name: 'PDatePicker' })
    const newDate = new Date(TEST_DATE)
    PDatePickerComponent.vm.$emit('update:modelValue', newDate)

    const createScheduleReminders = wrapper.findComponent({ name: 'CreateScheduleReminders' })
    createScheduleReminders.vm.$emit('update:model-value', mockedReminders)

    await wrapper.setProps({ checkValidity: true })
    const frequencyComponent = wrapper.findAllComponents(PSelect)[2]
    await frequencyComponent.setValue(frequency)
    await flushPromises()

    expect(wrapper.emitted('update-schedule-model')).toBeUndefined()
  })

  it('should show alert message', async () => {
    const wrapper = createWrapper(
      {
        recipientsCollection: accountsDataTransformer(accountsCollection),
        frequenciesCollection: frequenciesMock,
      })
    const frequencyComponent = wrapper.findAllComponents(PSelect)[2]
    await frequencyComponent.setValue('Monthly')
    const PDatePickerComponent = wrapper.findComponent({ name: 'PDatePicker' })
    PDatePickerComponent.vm.$emit('update:modelValue',
      new Date('April 29, 2024'))
    await nextTick()
    expect(wrapper.findComponent(PAlert).text())

      .toContain("Certains mois contiennent moins de 29 jours. Pour ces mois, l'occurrence sera créée le dernier jour du mois.")
  })
  it('should add attachment', () => {
    const wrapper = createWrapper(
      {
        recipientsCollection: accountsDataTransformer(accountsCollection),
        frequenciesCollection: frequenciesMock,
      })
    const mockFile = new File(['file content'], 'example.pdf', { type: 'application/pdf' })
    const PUploadComponent = wrapper.findComponent(PUpload)
    PUploadComponent.vm.$emit('delete-file')
    PUploadComponent.vm.$emit('files-selected',
      [mockFile])
    expect(wrapper.find('[data-testid="schedule-attachment-error"]').exists())
      .toBeFalsy()
  })
  it.each([
    {
      file: { type: 'text/plain', size: 12345 },
      label: 'unallowed file extension',
      isErrorTriggered: true,
    },
    {
      file: { type: 'application/pdf', size: 1234567891211212 },
      label: 'unallowed size attachment',
      isErrorTriggered: true,
    },
    {
      file: { type: 'application/pdf', size: 12345 },
      label: 'allow size and file extension',
      isErrorTriggered: false,
    },
  ])('should test $label', async ({ file, isErrorTriggered }) => {
    const wrapper = createWrapper(
      {
        recipientsCollection: accountsDataTransformer(accountsCollection),
        frequenciesCollection: frequenciesMock,
      })
    wrapper.vm.beforeAttachmentUpload(file as File)
    await nextTick()
    expect(wrapper.find('[data-testid="schedule-attachment-error"]').exists())
      .toBe(isErrorTriggered)
  })
})

