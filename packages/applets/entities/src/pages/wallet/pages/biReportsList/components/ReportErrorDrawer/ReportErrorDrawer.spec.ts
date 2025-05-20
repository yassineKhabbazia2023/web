import { shallowMount, VueWrapper } from '@vue/test-utils'
import ErrorDrawer from '.'
import { ErrorReport } from '../../types/report-error.type'
import { nextTick } from 'vue'
import { getMockReportErrors } from '@entities/__mocks__/bi-report.mocks'

const sampleErrors = getMockReportErrors()

const createWrapper = (errors: ErrorReport[]): VueWrapper =>
  shallowMount(ErrorDrawer, {
    props: {
      errors: errors,
      modelValue: true,
    },
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

describe('ErrorDrawer.vue', () => {
  it('renders drawer with errors', () => {
    const wrapper = createWrapper(sampleErrors)
    const errorItems = wrapper.findAll('.error')
    expect(errorItems).toHaveLength(sampleErrors.length)
    expect(errorItems[0].text()).toContain(sampleErrors[0].reportName)
  })

  it('closes drawer when event is triggered', async () => {
    const wrapper = createWrapper([])
    const drawer = wrapper.findComponent({ name: 'PDrawer' })

    drawer.vm.$emit('close-drawer-button', false)
    await nextTick()

    expect(wrapper.emitted('update:modelValue')).toStrictEqual([[false]])
  })

  it("should emit the 'update:modelValue' event when the v-model is updated", async () => {
    const wrapper = createWrapper([])
    const drawer = wrapper.findComponent({ name: 'PDrawer' })
    drawer.vm.$emit('update:modelValue', false)
    await nextTick()

    expect(wrapper.emitted('update:modelValue')).toStrictEqual([[false]])
  })
})
