import { flushPromises, shallowMount, VueWrapper } from '@vue/test-utils'
import { getMockReportErrors } from '@entities/__mocks__/bi-report.mocks'

import ReportToolbar from '.'

const mockReportErrors = getMockReportErrors()[0]
const mockReportErrorResponse = {
  items: mockReportErrors,
  currentPage: 1,
  totalItem: 1,
}

const fetchReportErrorsMock = vi.hoisted(() => vi.fn(() => Promise.resolve(mockReportErrorResponse)))

vi.mock('@entities/services/reporting', () => ({
  fetchReportErrors: fetchReportErrorsMock,
}))

// Utility function to create the component wrapper
const createWrapper = () =>
  shallowMount(ReportToolbar, {
    global: {
      stubs: {
        PButton: {
          name: 'PButton',
          template: '<div class="p-button"><slot /><PPastille/></div>',
        },
        PPastille: {
          name: 'PPastille',
          template: `<div>${mockReportErrorResponse.totalItem}</div>`,
        },
        ReportErrorDrawer: {
          name: 'ReportErrorDrawer',
          template: '<div />',
          props: ['modelValue'],
        },
      },
    },
  })

describe('ReportToolbar', () => {
  let wrapper: VueWrapper

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

    it('displays the pastille when there are errors', () => {
      // Arrange
      const pastille = wrapper.findComponent({ name: 'PPastille' })

      // Act
      const pastilleExists = pastille.exists()
      const pastilleText = pastille.text()

      // Assert
      expect(pastilleExists).toBe(true)
      expect(pastilleText).toBe(String(mockReportErrorResponse.totalItem))
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
})
