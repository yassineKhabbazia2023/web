import type { VueWrapper } from '@vue/test-utils'
import { mount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'
import { ElSteps } from 'element-plus'
import { PStepStatus } from './PSteps.enums'
import PICheck from '../../atoms/PIcon/components/PICheck.vue'
import PIX from '../../atoms/PIcon/components/PIX.vue'
import PSteps from '.'
import type { PStepsItem, PStepsProps } from './PStepsTypes'

const propsValue: PStepsProps = {
  pSpace: 'space',
  pDirection: 'horizontal',
  pActive: 0,
  pProcessStatus: PStepStatus.PROCESS,
  pFinishStatus: PStepStatus.SUCCESS,
  pAlignCenter: true,
  pSimple: true,
  pSteps: [],
}

const basicSteps: PStepsItem[] = [
  { pTitle: 'Step 1' },
  { pTitle: 'Step 2' },
  { pTitle: 'Step 3' },
]

const createWrapper = (props: PStepsProps = propsValue) => mount(PSteps, {
  props,
})

describe('pSteps', () => {
  it('should render correctly', () => {
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

  it('should use success as default finish status', () => {
    const wrapper: VueWrapper<any> = createWrapper({
      pActive: 1,
    })
    const componentVM = wrapper.findComponent(ElSteps).vm

    expect(componentVM.processStatus).toBe(PStepStatus.PROCESS)
    expect(componentVM.finishStatus).toBe(PStepStatus.SUCCESS)
  })

  it('should resolve steps statuses automatically', () => {
    const wrapper = createWrapper({
      pActive: 1,
      pSteps: basicSteps,
    })

    const stepComponents = wrapper.findAllComponents({ name: 'ElStep' })

    expect(stepComponents).toHaveLength(3)
    expect(stepComponents[0].props('status')).toBe(PStepStatus.SUCCESS)
    expect(stepComponents[0].props('icon')).toBe(PICheck)
    expect(stepComponents[1].props('status')).toBe(PStepStatus.PROCESS)
    expect(stepComponents[1].props('icon')).toBeUndefined()
    expect(stepComponents[2].props('status')).toBe(PStepStatus.WAIT)
    expect(stepComponents[2].props('icon')).toBeUndefined()
  })

  it('should keep explicit status and explicit icon from step items', () => {
    const wrapper = createWrapper({
      pActive: 0,
      pSteps: [
        { pTitle: 'Step 1', pStatus: PStepStatus.ERROR },
        { pTitle: 'Step 2', pStatus: PStepStatus.SUCCESS, pIcon: 'CustomIcon' },
      ],
    })

    const stepComponents = wrapper.findAllComponents({ name: 'ElStep' })

    expect(stepComponents).toHaveLength(2)
    expect(stepComponents[0].props('status')).toBe(PStepStatus.ERROR)
    expect(stepComponents[0].props('icon')).toBe(PIX)
    expect(stepComponents[1].props('status')).toBe(PStepStatus.SUCCESS)
    expect(stepComponents[1].props('icon')).toBe('CustomIcon')
  })
})
