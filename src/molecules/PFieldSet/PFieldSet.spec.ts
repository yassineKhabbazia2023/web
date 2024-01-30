import { VueWrapper, mount } from '@vue/test-utils'
import { describe, it, expect, beforeEach } from 'vitest'
import PBankCard from '.'
import type { PFieldSetProps } from './PFieldSetTypes'
import { getMockedFields } from './PFieldSetMock'

function createWrapper(props: PFieldSetProps) {
  return mount(PBankCard, {
    props
  })
}

const pFields = getMockedFields('companyIdentification') ?? []

const props: PFieldSetProps = {
  pModel: {},
  pFields
}

describe('test PFieldSet', () => {
  let wrapper: VueWrapper

  let pFieldComponents: ReturnType<typeof wrapper.findAllComponents>
  beforeEach(() => {
    wrapper = createWrapper(props)
    pFieldComponents = wrapper.findAllComponents({ name: 'PField' })
  })

  it('should render PInput', () => {
    expect.hasAssertions()

    expect(pFieldComponents).toHaveLength(pFields.length)
  })

  it('should emit update:pModel when enter date', () => {
    expect.hasAssertions()
    const fieldKey = pFields.at(0)?.pFieldKey
    const newValue = 'Henry'

    const pFieldComponent = pFieldComponents.at(0) as VueWrapper
    pFieldComponent.vm.$emit('update:model-value', newValue)
    expect(wrapper.emitted('update:pModel')).toStrictEqual([[fieldKey, newValue]])
  })
})
