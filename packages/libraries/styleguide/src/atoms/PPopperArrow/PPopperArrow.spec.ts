import type { VueWrapper } from '@vue/test-utils'
import { mount } from '@vue/test-utils'

import { ElPopperArrow, POPPER_CONTENT_INJECTION_KEY } from 'element-plus'
import PPopperArrow from '.'
import { ref } from 'vue'

const propsValue = {
  pArrowOffset: 5,
}

const popperContentInjection = {
  arrowRef: ref(null),
  arrowOffset: ref(0),
}

const createWrapper = () => mount(PPopperArrow, {
  props: propsValue,
  global: {
    provide: {
      [POPPER_CONTENT_INJECTION_KEY as symbol]: popperContentInjection,
    },
  },
})

describe('pPopperArrow', () => {
  it('should render correctly', () => {
    const wrapper: VueWrapper<any> = createWrapper()
    const componentVM = wrapper.findComponent(ElPopperArrow).vm
    expect(componentVM.arrowOffset).toBe(propsValue.pArrowOffset)
  })
})
