import { describe, it, expect } from 'vitest'
import { shallowMount } from '@vue/test-utils'
import type { DrawerActionButtonsProps } from './drawer-action-buttons.types'

import DrawerActionButtons from '.'

const defaultProps = {
  cancelTestId: 'cancel-btn',
  submitTestId: 'submit-btn',
  cancelDisabled: false,
  submitDisabled: false,
  loading: false,
}

const createWrapper = (props: DrawerActionButtonsProps = defaultProps) => {
  return shallowMount(DrawerActionButtons, {
    props: {
      ...defaultProps,
      ...props,
    },
    global: {
      stubs: {
        PButton: {
          name: 'PButton',
          template: '<button><slot /></button>',
          props: ['pDisabled', 'pLoading'],
        },
      },
    },
  })
}

describe('DrawerActionButtons', () => {
  it('renders both buttons with correct labels and test IDs', () => {
    const wrapper = createWrapper()

    const cancelBtn = wrapper.findComponent('[data-testid="cancel-btn"]')
    const submitBtn = wrapper.findComponent('[data-testid="submit-btn"]')

    expect(cancelBtn.text()).toBe('Cancel')
    expect(submitBtn.text()).toBe('Submit')
  })

  it('emits close-drawer when cancel button is clicked', async () => {
    const wrapper = createWrapper()
    await wrapper.get('[data-testid="cancel-btn"]').trigger('click')
    expect(wrapper.emitted()['close-drawer']).toHaveLength(1)
  })

  it('emits submit-action when submit button is clicked', async () => {
    const wrapper = createWrapper()
    await wrapper.get('[data-testid="submit-btn"]').trigger('click')
    expect(wrapper.emitted()['submit-action']).toHaveLength(1)
  })

  it('disables buttons when corresponding props are true', () => {
    const wrapper = createWrapper({
      loading: false,
      cancelDisabled: true,
      submitDisabled: true,
    })

    const actionButtons = wrapper.findAllComponents({ name: 'PButton' })
    const cancelBtn = actionButtons[0]
    const submitBtn = actionButtons[1]

    expect(cancelBtn.props('pDisabled')).toBe(true)
    expect(submitBtn.props('pDisabled')).toBe(true)
  })
})
