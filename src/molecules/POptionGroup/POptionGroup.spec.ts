import { describe, it, expect } from 'vitest'
import { VueWrapper, mount } from '@vue/test-utils'
import type { POptionGroupProps } from './POptionGroupTypes'
import PSelect from '@/molecules/PSelect'
import POption from '@/atoms/POption'
import POptionGroup from '.'

function createWrapper(optionGroups: POptionGroupProps[], slotContent: string): VueWrapper {
  const Component = {
    template: `
      <PSelect :pTeleported="false">
        <POptionGroup
          v-for="({pLabel, pDisabled, options}, index) in optionGroups"
          :key="index"
          data-ut="optionGroup"
          :pLabel="pLabel" 
          :pDisabled="pDisabled" 
        >
          <POption
            v-for="({pValue, pLabel, pDisabled}, index2) in options"
            :key="index * 10 + index2"
            data-ut="option"
            :pValue="pValue" 
            :pLabel="pLabel" 
            :pDisabled="pDisabled" 
          />
          <div data-ut="slot" v-if="slotContent !== ''">{{ slotContent }}</div>
        </POptionGroup>
      </PSelect>
    `,
    data() {
      return {
        optionGroups,
        slotContent
      }
    }
  }

  return mount(Component, {
    global: {
      components: {
        PSelect,
        POptionGroup,
        POption
      }
    }
  })
}

const options1 = [{
  pValue: 'a1',
  pLabel: 'A1',
  pDisabled: false
}, {
  pValue: 'b1',
  pLabel: 'B1',
  pDisabled: true
}]
const options2 = [{
  pValue: 'a2',
  pLabel: 'A2',
  pDisabled: false
}]

const optionGroups = [{
  pLabel: 'Group 1',
  pDisabled: false,
  options: options1
}, {
  pLabel: 'Group 2',
  pDisabled: true,
  options: options2
}]

describe('pOptionGroup', () => {
  it('should render options properly without Slot', () => {
    const wrapper = createWrapper(optionGroups, '')

    const pOptionGroups = wrapper.findAll('[data-ut="optionGroup"]')
    const pOptions = wrapper.findAll('[data-ut="optionGroup"] [data-ut="option"]')
    expect(pOptionGroups).toHaveLength(optionGroups.length)
    expect(pOptions).toHaveLength(options1.length + options2.length)

    const pOptionGroupTitle0 = pOptionGroups?.at(0)?.find('li')
    expect(pOptionGroupTitle0?.text()).toBe(optionGroups.at(0)?.pLabel)

    const pOptionGroupTitle1 = pOptionGroups?.at(1)?.find('li')
    expect(pOptionGroupTitle1?.text()).toBe(optionGroups.at(1)?.pLabel)

    const slots = wrapper.findAll('[data-ut="slot"]')
    expect(slots).toHaveLength(0)
  })

  it('should contain Slots', () => {
    const slotContent = 'slot-content'
    const wrapper = createWrapper(optionGroups, slotContent)

    const slots = wrapper.findAll('[data-ut="slot"]')
    expect(slots).toHaveLength(optionGroups.length)
    expect(slots.at(0)?.text()).toBe(slotContent)
  })
})
