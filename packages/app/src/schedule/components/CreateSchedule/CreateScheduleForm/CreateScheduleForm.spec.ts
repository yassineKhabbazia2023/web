import { flushPromises, shallowMount } from '@vue/test-utils'
import { expect, describe, it, vi } from 'vitest'
import { nextTick } from 'vue'
import type { FormProps } from './CreateScheduleFormTypes'
import { accountsCollection, recipientsIdCollection } from '@app/__mocks__/accounts.mocks'
import { getMockSchedule, getMonthlyMockSchedule, frequenciesMock } from '@app/__mocks__/schedule.mocks'
import { scheduleServicesMock, TEST_DATE } from '@app/__mocks__/schedule.service.mocks'
import { accountsDataTransformer } from '@app/schedule/helpers/utils'
import { TEMPLATE_TYPE_SHORT_OTHER } from '@app/schedule/helpers/scheduleConsts'

import CreateScheduleForm from '.'

const mockedReminders = [2]
const createScheduleMock = getMockSchedule(mockedReminders)
const createScheduleMockWithTypeLong = getMonthlyMockSchedule(mockedReminders)

vi.mock('@app/schedule/services', () => scheduleServicesMock)

const mockedGetIsValid = vi.hoisted(() => vi.fn())
const createWrapper = (props: FormProps) =>
  shallowMount(CreateScheduleForm, {
    props,
    global: {
      stubs: {
        PDropdown: true,
        PDatePicker: true,
        PInput: true,
        PAlert: {
          name: 'PAlert',
          template: '<div><slot /></div>',
        },
        PFormItem: {
          name: 'PFormItem',
          template: '<div><slot /></div>',
          props: ['pLabel'],
        },
        PForm: {
          name: 'PForm',
          template: '<div><slot /></div>',
          props: ['pModel'],
          methods: {
            validate: vi.fn((cb: Function) => cb(true)),
          },
        },
        CreateScheduleReminders: {
          name: 'CreateScheduleReminders',
          template: '<div />',
          methods: {
            getIsValid: mockedGetIsValid,
          },
        },
        PRow: { template: '<div><slot /></div>' },
        PCol: { template: '<div><slot /></div>' },
      },
    },
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
    mockedGetIsValid.mockReturnValue(true)
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

    const frequencyComponent = wrapper.findAllComponents({ name: 'PDropdown' })[2]
    frequencyComponent.vm.$emit('update:modelValue', frequency)

    wrapper.setProps({ checkValidity: true })
    await nextTick()

    const emittedScheduleModel = wrapper.emitted('update-schedule-model')
    expect(emittedScheduleModel).toStrictEqual([
      [expected],
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
    const frequencyComponent = wrapper.findAllComponents({ name: 'PDropdown' })[2]
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
    const frequencyComponent = wrapper.findAllComponents({ name: 'PDropdown' })[2]
    await frequencyComponent.setValue('Monthly')
    const PDatePickerComponent = wrapper.findComponent({ name: 'PDatePicker' })
    PDatePickerComponent.vm.$emit('update:modelValue', new Date('April 29, 2024'))
    await nextTick()
    expect(wrapper.findComponent({ name: 'PAlert' }).text())
      .toContain("Certains mois contiennent moins de 29 jours. Pour ces mois, l'occurrence sera créée le dernier jour du mois.")
  })
  it('should add attachment', () => {
    const wrapper = createWrapper(
      {
        recipientsCollection: accountsDataTransformer(accountsCollection),
        frequenciesCollection: frequenciesMock,
      })
    const mockFile = new File(['file content'], 'example.pdf', { type: 'application/pdf' })
    const PUploadComponent = wrapper.findComponent({ name: 'PUpload' })
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
