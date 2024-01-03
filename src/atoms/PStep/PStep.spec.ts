import { VueWrapper, mount } from '@vue/test-utils'
import { describe, it, expect, vi } from 'vitest'
import { ElStep } from 'element-plus'
import { PICheck } from '@/atoms/PIcon/components'
import PStep from '.'
import { ref } from 'vue'
import type { PStepProps } from './PStepTypes'

const propsValue: PStepProps = {
  pTitle: 'title',
  pDescription: 'description',
  pIcon: 'icon',
  pStatus: 'wait'
}

const slotsContent = {
  title: '<p data-ut="title-slot">Title slot</p>',
  description: '<p data-ut="description-slot">Description Slot</p>',
  icon: PICheck
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
    },
    slots: slotsContent
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
  describe('slots', () => {
    it('should render all available slots', () => {
      const wrapper = createWrapper()
      const titleSlot = wrapper.find('[data-ut=title-slot]')
      const descriptionSlot = wrapper.find('[data-ut=description-slot]')
      const iconSlot = wrapper.findComponent(PICheck)

      expect(titleSlot.exists()).toBeTruthy()
      expect(descriptionSlot.exists()).toBeTruthy()
      expect(iconSlot.exists()).toBeTruthy()
    })
  })
})
