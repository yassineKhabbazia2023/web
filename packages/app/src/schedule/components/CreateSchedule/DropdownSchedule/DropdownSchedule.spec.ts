import DropdownSchedule from '.'
import wrapperFactory from '@app/schedule/tests/utils/wrapperFactory'
import type { KeyLabel } from '@app/schedule/models/commonTypes'
import type { DropdownScheduleProps } from './DropdownScheduleTypes'
import { expect, describe, it, vi } from 'vitest'
import { PSelect } from '@pulse/styleguide/components'

const createWrapper = (dropdownScheduleProps: DropdownScheduleProps) =>
  wrapperFactory(DropdownSchedule, { props: dropdownScheduleProps })

function getMockedSchedulesCollection(values: string[]): KeyLabel[] {
  return values.map((key) => ({
    label: key,
    key,
  }))
}

vi.mock('@app/schedule/services', () => {
  return {
    getScheduleModels: () => [{
      key: 'TVA',
      label: 'TVA au 21',
    }],
  }
})

describe('schedule title component', () => {
  it('emit a value in the existing field values in select options', async () => {
    const schedulesCollection = getMockedSchedulesCollection([
      'TVA au 24 (Taxe sur la VA)',
      'TVS (Taxe sur les Véhicules de sociétés)',
    ])
    const dropdownScheduleProps: DropdownScheduleProps = {
      schedulesCollection,
      modelValue: '',
    }
    const selectedValue = 'TVA au 24 (Taxe sur la VA)'

    const wrapper = createWrapper(dropdownScheduleProps)

    const reminderSelectElement = wrapper
      .findComponent(PSelect)
    reminderSelectElement.setValue(selectedValue)
    await reminderSelectElement.trigger('change')
    const emittedModelValue: any = wrapper.emitted('update:modelValue')
    expect(emittedModelValue[0]).toStrictEqual([selectedValue])
  })
  it('emit a value created and not existing in the field values of select options', async () => {
    const schedulesCollection = getMockedSchedulesCollection([
      'TVA au 21 (Taxe sur la VA)',
      'IS (Impôt sur les sociétés)',
    ])
    const dropdownScheduleProps: DropdownScheduleProps = {
      schedulesCollection,
      modelValue: '',
    }
    const selectedValue = 'TVA au 28'

    const wrapper = createWrapper(dropdownScheduleProps)

    const reminderSelectElement = wrapper
      .findComponent(PSelect)
    reminderSelectElement.setValue(selectedValue)
    await reminderSelectElement.trigger('change')
    const emittedModelValue: any = wrapper.emitted('update:modelValue')
    expect(emittedModelValue[0]).toStrictEqual([selectedValue])
  })
})
