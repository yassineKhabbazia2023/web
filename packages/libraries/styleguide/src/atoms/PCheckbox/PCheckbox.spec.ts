import type { VueWrapper } from '@vue/test-utils'
import { shallowMount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'
import PCheckbox from '.'
import type { PCheckboxProps } from './PCheckboxTypes'

const props: PCheckboxProps = {
  pRounded: true,
}
const createWrapper = () => shallowMount(PCheckbox, {
  props,
})

describe('pCheckbox', () => {
  it('should render correctly', () => {
    const wrapper: VueWrapper<any> = createWrapper()
    expect(wrapper.find('.p-checkbox--rounded')).toBeTruthy()
  })
})
