import type { VueWrapper } from '@vue/test-utils'
import { shallowMount } from '@vue/test-utils'
import { describe, it, expect, vi } from 'vitest'
import PStep from '.'
import { ref } from 'vue'
import type { PStepProps } from './PStepTypes'

const propsValue: PStepProps = {
  pTitle: 'title',
  pDescription: 'description',
  pIcon: 'icon',
  pStatus: 'wait',
}

const injectSteps = {
  props: {},
  steps: ref([]),
  addStep: vi.fn(),
  removeStep: vi.fn(),
}
const createWrapper = () =>
  shallowMount(PStep, {
    props: propsValue,
    global: {
      provide: {
        ElSteps: injectSteps,
      },
    },
  })

describe('pStep', () => {
  describe('props', () => {
    it('should render correctly', () => {
      const wrapper: VueWrapper<any> = createWrapper()
      const component = wrapper.findComponent({ name: 'ElStep' })

      const expectedProps = {
        title: propsValue.pTitle,
        description: propsValue.pDescription,
        icon: propsValue.pIcon,
        status: propsValue.pStatus,
      }
      expect(component.props()).toMatchObject(expectedProps)
    })
  })
})
