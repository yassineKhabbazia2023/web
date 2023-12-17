import { describe, it, expect } from 'vitest'
import { VueWrapper, mount } from '@vue/test-utils'
import type { POptionProps } from './POptionTypes'
import PSelect from '@/molecules/PSelect'
import POption from '.'

function createWrapper(options: POptionProps[], slotContent: string): VueWrapper {
  const Component = {
    template: `
      <PSelect :pTeleported="false">
        <POption
          v-for="({pValue, pLabel, pDisabled}, index) in options"
          :key="index"
          data-ut="option"
          :pValue="pValue" 
          :pLabel="pLabel" 
          :pDisabled="pDisabled" 
        >
          <div data-ut="slot" v-if="slotContent !== ''">{{ slotContent }}</div>
        </POption>
      </PSelect>
    `,
    data() {
      return {
        options,
        slotContent
      }
    }
  }

  return mount(Component, {
    global: {
      components: {
        PSelect,
        POption
      }
    }
  })
}

const options = [{
  pValue: 'a',
  pLabel: 'A',
  pDisabled: false
}, {
  pValue: 'b',
  pLabel: 'B',
  pDisabled: true
}]

describe('pOption', () => {
  it('should render options properly without Slot', () => {
    const wrapper = createWrapper(options, '')

    const pOptions = wrapper.findAll('[data-ut="option"]')

    expect(pOptions).toHaveLength(options.length)

    expect(pOptions.at(0)?.text()).toBe(options.at(0)?.pLabel)
    expect(pOptions.at(1)?.text).toBe(options.at(0)?.pLabel)

    const slots = wrapper.findAll('[data-ut="slot"]')
    expect(slots).toHaveLength(0)
  })

  it('should contain Slots', () => {
    const slotContent = 'slot-content'
    const wrapper = createWrapper(options, slotContent)

    const slots = wrapper.findAll('[data-ut="slot"]')
    expect(slots).toHaveLength(options.length)
    expect(slots.at(0)?.text()).toBe(slotContent)
  })
})
