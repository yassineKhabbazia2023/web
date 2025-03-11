import type { VueWrapper } from '@vue/test-utils'
import { mount } from '@vue/test-utils'
import { describe, it, expect, beforeEach } from 'vitest'
import type { PFieldSetProps } from './PFieldSetTypes'
import { getMockedFields } from './PFieldSetMock'
import { nextTick } from 'vue'
import PFieldSet from '.'

type T = Record<string, any>

function createWrapper(props: PFieldSetProps<T>) {
  return mount(PFieldSet, {
    props,
  })
}

const pFields = getMockedFields('companyIdentification') ?? []

const props: PFieldSetProps<T> = {
  pModel: {},
  pFields,
}

describe('test PFieldSet', () => {
  let wrapper: ReturnType<typeof createWrapper>

  let pFieldComponents: ReturnType<typeof wrapper.findAllComponents>
  beforeEach(() => {
    wrapper = createWrapper(props)
    pFieldComponents = wrapper.findAllComponents({ name: 'PField' })
  })

  it('should render PInput', () => {
    expect(pFieldComponents).toHaveLength(pFields.length)
  })

  it('should emit update:pModel when enter date', () => {
    const fieldKey = pFields.at(0)?.pFieldKey
    const newValue = 'Henry'

    const pFieldComponent = pFieldComponents.at(0) as VueWrapper
    pFieldComponent.vm.$emit('update:model-value', newValue)
    expect(wrapper.emitted('update:pModel')).toStrictEqual([[fieldKey, newValue]])
  })
  it('should add fieldKey to the disabledFields array if the field is disabled', async () => {
    const fieldKey = pFields.at(0)?.pFieldKey as string
    const pFieldComponent = pFieldComponents.at(0) as VueWrapper

    wrapper.vm.disableField(fieldKey)
    await nextTick()

    expect(pFieldComponent.props()).toMatchObject({ pDisabled: true })
  })
  it('should remove the fieldKey from the disabledFields array if it is already disabled', async () => {
    const fieldKey = pFields.at(0)?.pFieldKey as string
    const pFieldComponent = pFieldComponents.at(0) as VueWrapper

    wrapper.vm.disableField(fieldKey)
    await nextTick()

    expect(pFieldComponent.props()).toMatchObject({ pDisabled: true })

    wrapper.vm.enableField(fieldKey)
    await nextTick()

    expect(pFieldComponent.props()).toMatchObject({ pDisabled: false })
  })
})
