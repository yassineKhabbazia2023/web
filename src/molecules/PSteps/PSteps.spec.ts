import { VueWrapper, mount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'
import { ElSteps } from 'element-plus'
import PSteps from '.'
import type { PStepsProps } from './PStepsTypes'

const propsValue: PStepsProps = {
  pSpace: 'space',
  pDirection: 'horizontal',
  pActive: 0,
  pProcessStatus: 'process',
  pFinishStatus: 'finish',
  pAlignCenter: true,
  pSimple: true
}
const createWrapper = () => mount(PSteps, {
  props: propsValue
})

describe('pSteps', () => {
  it('should render correctly', async () => {
    const wrapper: VueWrapper<any> = createWrapper()
    const componentVM = wrapper.findComponent(ElSteps).vm
    expect(componentVM.space).toBe(propsValue.pSpace)
    expect(componentVM.direction).toBe(propsValue.pDirection)
    expect(componentVM.active).toBe(propsValue.pActive)
    expect(componentVM.processStatus).toBe(propsValue.pProcessStatus)
    expect(componentVM.finishStatus).toBe(propsValue.pFinishStatus)
    expect(componentVM.alignCenter).toBe(propsValue.pAlignCenter)
    expect(componentVM.simple).toBe(propsValue.pSimple)
  })
})
