import { mount } from '@vue/test-utils'
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

const createWrapper = (props = defaultProps) =>
  mount(PTooltip, {
    props,
    slots: {
      default: '<PButton>Hover Button</PButton>',
    },
    global: {
      stubs: {
        PButton: { template: '<button><slot /></button>' },
      },
    },
    attachTo: document.body,
  })

describe('pTooltip', () => {
  it.skip('should pass props to ElTooltip component', async () => {
    const wrapper = createWrapper()
    const elPopper = wrapper.findComponent('.el-popper')

    expect(elPopper.attributes()['data-popper-placement']).toBeFalsy()
    await wrapper.findComponent('.el-tooltip__trigger').trigger('mouseenter')
    await nextTick()
    expect(elPopper.attributes()['data-popper-reference-hidden']).toBe('true')
    expect(elPopper.attributes()['data-popper-escaped']).toBe('true')
    expect(elPopper.attributes()['data-popper-placement']).toBe(placement)
    expect(document.body.innerHTML.includes(content)).toBeTruthy()
  })
})
