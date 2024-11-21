import { shallowMount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'
import { nextTick } from 'vue'
import placementOptions from '../../constants/placementOptions'
import PTooltip from '.'
import type { PTooltipProps } from './PTooltipTypes'

const content = 'Test Tooltip'
const disabled = true
const placement = placementOptions[0].value

const defaultProps: PTooltipProps = {
  pContent: content,
  disabled,
  pPlacement: placement,
}

const slotContent = 'Slot Content'

const createWrapper = (props = defaultProps) =>
  shallowMount(PTooltip, {
    props,
    slots: {
      default: slotContent,
    },
    global: {
      stubs: {
        ElTooltip: {
          name: 'ElTooltip',
          template: '<div><slot /></div>',
          props: [
            'content',
            'disabled',
            'placement',
          ],
        },
      },
    },
  })

describe('pTooltip', () => {
  it('should pass props to ElTooltip component', async () => {
    const wrapper = createWrapper()
    const elPopper = wrapper.findComponent({ name: 'ElTooltip' })
    const expectedProps = {
      content: 'Test Tooltip',
      disabled: true,
      placement: 'top',
    }

    expect(elPopper.props()).toStrictEqual(expectedProps)
    expect(elPopper.text()).toBe(slotContent)
  })
})
