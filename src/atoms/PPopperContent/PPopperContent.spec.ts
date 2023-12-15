import { VueWrapper, mount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'
import { ElPopperContent, POPPER_INJECTION_KEY } from 'element-plus'
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
  pStrategy: 'absolute'
}

const popperInjection = {
  triggerRef: ref(),
  popperInstanceRef: ref(),
  contentRef: ref(),
  role: computed(() => 'test-role')
}

const createWrapper = () => mount(PPopperContent, {
  props: propsValue,
  global: {
    provide: {
      [POPPER_INJECTION_KEY as symbol]: popperInjection
    }
  }
})

describe('pPopperContent', () => {
  it('should render correctly', async () => {
    const wrapper: VueWrapper<any> = createWrapper()
    const componentVM = wrapper.findComponent(ElPopperContent).vm
    console.log(componentVM)
    expect(componentVM.boundariesPadding).toBe(propsValue.pBoundariesPadding)
    expect(componentVM.fallbackPlacements).toStrictEqual(propsValue.pFallbackPlacements)
    expect(componentVM.gpuAcceleration).toBe(propsValue.pGpuAcceleration)
    expect(componentVM.offset).toBe(propsValue.pOffset)
    expect(componentVM.placement).toBe(propsValue.pPlacement)
    expect(componentVM.popperOptions).toStrictEqual(propsValue.pPopperOptions)
    expect(componentVM.strategy).toBe(propsValue.pStrategy)
  })
})
