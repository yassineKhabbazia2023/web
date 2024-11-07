import type { VueWrapper } from '@vue/test-utils'
import { mount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'
import PCheckbox from '.'
import type { PCheckboxProps } from './PCheckboxTypes'

const props: PCheckboxProps = {
  pRounded: true,
}
const createWrapper = () => mount(PCheckbox, {
  props,
})

describe('pCheckbox', () => {
  it('should render correctly', () => {
    const wrapper: VueWrapper<any> = createWrapper()
    expect(wrapper.find('.p-checkbox--rounded')).toBeTruthy()
  })
})
