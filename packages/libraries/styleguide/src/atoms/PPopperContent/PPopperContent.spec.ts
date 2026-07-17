import type { VueWrapper } from '@vue/test-utils'
import { shallowMount } from '@vue/test-utils'

import { POPPER_INJECTION_KEY } from 'element-plus'
import PPopperContent from '.'
import { computed, ref } from 'vue'
import type { PPopperContentProps } from './PPopperContentTypes'

const propsValue: PPopperContentProps = {
  pBoundariesPadding: 0,
  pFallbackPlacements: [],
  pGpuAcceleration: true,
  pOffset: 12,
  pPlacement: 'bottom',
  pPopperOptions: {},
  pStrategy: 'absolute',
}

const popperInjection = {
  triggerRef: ref(),
  popperInstanceRef: ref(),
  contentRef: ref(),
  role: computed(() => 'test-role'),
}

const createWrapper = () => shallowMount(PPopperContent, {
  props: propsValue,
  global: {
    provide: {
      [POPPER_INJECTION_KEY as symbol]: popperInjection,
    },
  },
})

describe('pPopperContent', () => {
  it('should render correctly', () => {
    const wrapper: VueWrapper<any> = createWrapper()
    const component = wrapper.findComponent({ name: 'ElPopperContent' })

    const expectedProps = {
      boundariesPadding: propsValue.pBoundariesPadding,
      fallbackPlacements: propsValue.pFallbackPlacements,
      gpuAcceleration: propsValue.pGpuAcceleration,
      offset: propsValue.pOffset,
      placement: propsValue.pPlacement,
      popperOptions: propsValue.pPopperOptions,
      strategy: propsValue.pStrategy,
    }

    const props = component.props()
    expect(props).toMatchObject(expectedProps)
  })
})
