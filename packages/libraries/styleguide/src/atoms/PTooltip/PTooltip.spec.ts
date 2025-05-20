import { shallowMount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'
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

  it.each([
    {
      testName: 'should be disabled when content is empty and disabled is false',
      content: '',
      disabled: false,
      shouldBeDisabled: true,
    },
    {
      testName: 'should be disabled when content is undefined and disabled is false',
      content: undefined,
      disabled: false,
      shouldBeDisabled: true,
    },
    {
      testName: 'should be disabled when content is empty and disabled is true',
      content: '',
      disabled: true,
      shouldBeDisabled: true,
    },
    {
      testName: 'should be disabled when content is undefined and disabled is true',
      content: undefined,
      disabled: true,
      shouldBeDisabled: true,
    },
    {
      testName: 'should be enabled when content has a value and disabled is false',
      content: 'Au5',
      disabled: false,
      shouldBeDisabled: false,
    },
    {
      testName: 'should be disabled when content has value and disabled is true',
      content: 'Unprocessed',
      disabled: true,
      shouldBeDisabled: true,
    },
  ])('should be disabled if no content is given', ({ content, disabled, shouldBeDisabled }) => {
    const wrapper = createWrapper({
      ...defaultProps,
      pContent: content,
      disabled,
    })

    const sourceTooltip = wrapper.findComponent({ name: 'ElTooltip' })
    expect(sourceTooltip.props('disabled')).toBe(shouldBeDisabled)
  })
})
