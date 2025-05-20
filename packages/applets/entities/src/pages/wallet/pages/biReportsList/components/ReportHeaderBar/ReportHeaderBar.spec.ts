import { flushPromises, shallowMount, VueWrapper } from '@vue/test-utils'
import ReportHeaderBar from './ReportHeaderBar.vue'
import { getMockReportErrors } from '@entities/__mocks__/bi-report.mocks'

const mockErrors = getMockReportErrors()
const mockErrorResponse = {
  items: mockErrors,
  currentPage: 1,
  totalItem: 1,
}

const fetchReportErrorsMock = vi.hoisted(() => vi.fn(() => Promise.resolve(mockErrorResponse)))

vi.mock('@entities/services/reporting', () => ({
  fetchReportErrors: fetchReportErrorsMock,
}))

const createWrapper = () =>
  shallowMount(ReportHeaderBar, {
    global: {
      stubs: {
        PButton: {
          name: 'PButton',
          template: '<div class="p-button"><slot /><PPastille/></div>',
        },
        PPastille: {
          name: 'PPastille',
          template: '<div>' + mockErrorResponse.totalItem + '</div>',
        },
        ReportErrorDrawer: {
          name: 'ReportErrorDrawer',
          template: '<div></div>',
        },
      },
    },
  })

describe('ReportHeaderBar', () => {
  let wrapper: VueWrapper

  beforeEach(async () => {
    wrapper = createWrapper()
    await flushPromises()
  })

  describe('Rendering', () => {
    it('renders the button component correctly', () => {
      const button = wrapper.findComponent({ name: 'PButton' })

      expect(button.exists()).toBe(true)
      expect(button.text()).toContain('Show errors')
    })

    it('show pastille when have errors', () => {
      const pastille = wrapper.findComponent({ name: 'PPastille' })
      expect(pastille.exists()).toBe(true)
      expect(pastille.text()).toBe('1')
    })
  })

  describe('Error drawer', () => {
    it('should open drawer when click on button', async () => {
      const button = wrapper.findComponent({ name: 'PButton' })
      const drawer = wrapper.findComponent({ name: 'ReportErrorDrawer' })
      expect(drawer.attributes('modelvalue')).toBe('false')

      await button.trigger('click')

      expect(drawer.attributes('modelvalue')).toBe('true')
    })
  })
})
