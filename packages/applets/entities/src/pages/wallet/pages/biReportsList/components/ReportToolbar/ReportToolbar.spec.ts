import { flushPromises, shallowMount } from '@vue/test-utils'
import { getMockReportErrors } from '@entities/__mocks__/bi-report.mocks'

import ReportToolbar from '.'

const mockReportErrors = getMockReportErrors()
const mockReportErrorResponse = {
  items: mockReportErrors,
  currentPage: 1,
  totalItems: 1,
}

const fetchReportErrorsMock = vi.hoisted(() => vi.fn(() => Promise.resolve(mockReportErrorResponse)))

vi.mock('@entities/services/reporting/reportingServices', () => ({
  fetchReportErrors: fetchReportErrorsMock,
}))

// Utility function to create the component wrapper
const createWrapper = () =>
  shallowMount(ReportToolbar, {
    global: {
      stubs: {
        PButton: {
          name: 'PButton',
          template: '<button class="p-button"><slot /><PPastille/></button>',
          props: ['pDisabled'],
        },
        PPastille: {
          name: 'PPastille',
          template: `<div>${mockReportErrorResponse.totalItems}</div>`,
        },
        ReportErrorDrawer: {
          name: 'ReportErrorDrawer',
          template: '<div />',
          props: ['modelValue'],
        },
        FormSearch: {
          name: 'FormSearch',
          template: '<div><slot /></div>',
          emits: ['search-value-submitted'],
        },
      },
    },
  })

describe('ReportToolbar', () => {
  let wrapper: ReturnType<typeof createWrapper>

  beforeEach(async () => {
    wrapper = createWrapper()
    await flushPromises()
  })

  describe('Rendering', () => {
    it('renders the button component correctly', () => {
      // Arrange
      const button = wrapper.findComponent({ name: 'PButton' })

      // Act
      const buttonExists = button.exists()
      const buttonText = button.text()

      // Assert
      expect(buttonExists).toBe(true)
      expect(buttonText).toContain('Show errors')
    })

    it('disables the show errors button when there are no report errors', () => {
      // Arrange
      fetchReportErrorsMock.mockResolvedValue({
        items: [],
        currentPage: 1,
        totalItems: 0,
      })
      wrapper = createWrapper()

      const button = wrapper.findComponent({ name: 'PButton' })

      // Assert
      expect(button.exists()).toBe(true)
      expect(button.props('pDisabled')).toBe(true)
    })

    it('displays the pastille when there are errors', () => {
      // Arrange
      const pastille = wrapper.findComponent({ name: 'PPastille' })

      // Act
      const pastilleExists = pastille.exists()
      const pastilleText = pastille.text()

      // Assert
      expect(pastilleExists).toBe(true)
      expect(pastilleText).toBe(String(mockReportErrorResponse.totalItems))
    })
  })

  describe('Error drawer', () => {
    it('opens the drawer when the button is clicked', async () => {
      // Arrange
      const button = wrapper.findComponent({ name: 'PButton' })
      const drawer = wrapper.findComponent({ name: 'ReportErrorDrawer' })
      const drawerInitialState = drawer.props('modelValue')

      // Act
      await button.trigger('click')
      const drawerStateAfterClick = drawer.props('modelValue')

      // Assert
      expect(drawerInitialState).toBe(false)
      expect(drawerStateAfterClick).toBe(true)
    })
  })

  describe('Search report', () => {
    it("emits 'search-report' with correct payload when search is submitted", async () => {
      // Arrange
      const searchedReport = 'Test Report'
      const searchBar = wrapper.findComponent({ name: 'FormSearch' })

      // Act
      searchBar.vm.$emit('search-value-submitted', searchedReport)
      await flushPromises()

      // Assert
      const emittedEvents = wrapper.emitted('search-report')
      expect(emittedEvents).toStrictEqual([[searchedReport]])
    })
  })
})
