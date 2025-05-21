import { nextTick } from 'vue'
import { shallowMount } from '@vue/test-utils'
import { getMockReportErrors } from '@entities/__mocks__/bi-report.mocks'
import type { ReportErrorDrawerProps } from './report-error-drawer.type'

import ReportErrorDrawer from '.'

const mockReportErrors = getMockReportErrors()
const defaultProps: ReportErrorDrawerProps = {
  modelValue: true,
  reportErrors: mockReportErrors,
}

const createWrapper = (override: Partial<ReportErrorDrawerProps > = {}) => {
  const props = { ...defaultProps, ...override }
  return shallowMount(ReportErrorDrawer, {
    props,
    global: {
      stubs: {
        PDrawer: {
          name: 'PDrawer',
          events: ['close-drawer-button'],
          template: '<div><slot/></div>',
        },
        ReportErrorCard: {
          props: ['reportName', 'embedReportId', 'message', 'detectionDate', 'reportType'],
          template: '<div class="error">{{ reportName }}</div>',
        },
      },
    },
  })
}

describe('ReportErrorDrawer.vue', () => {
  describe('Rendering', () => {
    it('should render the error drawer with the correct number of error items based on the provided reports', () => {
      // Arrange
      const wrapper = createWrapper()

      // Act
      const errorItems = wrapper.findAll('.error')

      // Assert
      expect(errorItems).toHaveLength(mockReportErrors.length)
      expect(errorItems[0].text()).toContain(mockReportErrors[0].reportName)
    })
  })
  describe('Events', () => {
    it('should close the drawer when the close-drawer-button event is emitted from the PDrawer component', async () => {
      // Arrange
      const wrapper = createWrapper()

      // Act
      const drawer = wrapper.findComponent({ name: 'PDrawer' })
      drawer.vm.$emit('close-drawer-button', false)
      await nextTick()

      // Assert
      expect(wrapper.emitted('update:modelValue')).toStrictEqual([[false]])
    })

    it("should emit 'update:modelValue' when the v-model is updated", async () => {
      // Arrange
      const wrapper = createWrapper()

      // Act
      const drawer = wrapper.findComponent({ name: 'PDrawer' })
      drawer.vm.$emit('update:modelValue', false)
      await nextTick()

      // Assert
      expect(wrapper.emitted('update:modelValue')).toStrictEqual([[false]])
    })
  })
})
