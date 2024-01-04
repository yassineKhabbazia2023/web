import { VueWrapper, mount } from '@vue/test-utils'
import { describe, it, expect, vi } from 'vitest'
import { ElStep } from 'element-plus'
import PStep from '.'
import { ref } from 'vue'
import type { PStepProps } from './PStepTypes'

const propsValue: PStepProps = {
  pTitle: 'title',
  pDescription: 'description',
  pIcon: 'icon',
  pStatus: 'wait'
}

const injectSteps = {
  props: {},
  steps: ref([]),
  addStep: vi.fn(),
  removeStep: vi.fn()
}
const createWrapper = () =>
  mount(PStep, {
    props: propsValue,
    global: {
      provide: {
        ElSteps: injectSteps
      }
    }
  })

describe('pStep', () => {
  describe('props', () => {
    it('should render correctly', async () => {
      const wrapper: VueWrapper<any> = createWrapper()
      const componentVM = wrapper.findComponent(ElStep).vm
      expect(componentVM.title).toBe(propsValue.pTitle)
      expect(componentVM.description).toBe(propsValue.pDescription)
      expect(componentVM.icon).toBe(propsValue.pIcon)
      expect(componentVM.status).toBe(propsValue.pStatus)
    })
  })
})
