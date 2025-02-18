import { shallowMount } from '@vue/test-utils'
import { describe, it } from 'vitest'
import PSkewedButton from '.'
import type { PSkewedButtonProps } from './PSkewedButton.types'

const defaultProps: PSkewedButtonProps = {
  pType: 'primary',
  pDisabled: false,
  pContent: 'content',
  pHasLoader: false,
}
function createWrapper(overriddenProps: Partial<PSkewedButtonProps> = {}) {
  const props = {
    ...defaultProps,
    ...overriddenProps,
  }

  return shallowMount(PSkewedButton, {
    props,
  })
}

describe('PSkewedButton', () => {
  it('should render properly primary case', async () => {
    const wrapper = createWrapper()

    await expect(wrapper.html()).toMatchFileSnapshot('__snap__/PSkewedButton/primary.snap')
  })
  it('should render properly secondary case', async () => {
    const wrapper = createWrapper({
      pType: 'secondary',
      pDisabled: true,
      pHasLoader: true,
    })

    await expect(wrapper.html()).toMatchFileSnapshot('__snap__/PSkewedButton/second.snap')
  })
})
