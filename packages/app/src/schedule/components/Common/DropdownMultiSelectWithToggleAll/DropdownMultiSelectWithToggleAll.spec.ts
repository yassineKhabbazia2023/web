import DropdownMultiSelectWithToggleAll from '.'
import wrapperFactory from '@app/schedule/tests/utils/wrapperFactory'
import type { DropdownMultiSelectWithToggleAllProps } from './DropdownMultiSelectWithToggleAllTypes'
import { expect, describe, it } from 'vitest'
import { PSelect, PCheckbox } from '@kpmg/styleguide'
import { accountsCollection } from '@app/schedule/tests/mocks/Account'
import { accountsDataTransformer } from '@app/schedule/helpers/utils'

function createWrapper(
  dropdownMultiSelectWithToggleAllProps: DropdownMultiSelectWithToggleAllProps,
) {
  return wrapperFactory(DropdownMultiSelectWithToggleAll, {
    props: dropdownMultiSelectWithToggleAllProps,
  })
}

describe('schedule title component', () => {
  it('emits a value in the existing field values in select options', async () => {
    const dropdownMultiSelectWithToggleAllProps: DropdownMultiSelectWithToggleAllProps = {
      optionsCollection: accountsDataTransformer(accountsCollection),
      modelValue: [],
    }
    const selectedValue = '70005321111'

    const wrapper = createWrapper(dropdownMultiSelectWithToggleAllProps)

    const reminderSelectElement = wrapper
      .findComponent(PSelect)
    reminderSelectElement.setValue(selectedValue)
    await reminderSelectElement.trigger('change')
    const emittedModelValue: any = wrapper.emitted('update:modelValue')
    expect(emittedModelValue[0]).toStrictEqual([selectedValue])
  })
  it('emits a value created and not existing in the field values of select options', () => {
    const dropdownMultiSelectWithToggleAllProps: DropdownMultiSelectWithToggleAllProps = {
      optionsCollection: accountsDataTransformer(accountsCollection),
      modelValue: [],
    }
    const wrapper = createWrapper(dropdownMultiSelectWithToggleAllProps)
    const checkbox = wrapper.findComponent(PCheckbox)
    checkbox.vm.$emit('change', true)
    const emittedModelValue: any = wrapper.emitted('update:modelValue')
    expect(emittedModelValue[0]).toBeTruthy()
    checkbox.vm.$emit('change', false)
    expect(emittedModelValue[1]).toStrictEqual([[]])
  })
})
