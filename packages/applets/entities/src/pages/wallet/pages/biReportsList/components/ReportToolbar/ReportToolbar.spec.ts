import { nextTick } from 'vue'
import { flushPromises, shallowMount } from '@vue/test-utils'
import { getMockReportErrors } from '@entities/__mocks__/bi-report.mocks'
import { ReportStatus } from '@entities/common/types/BIReports.enums'

import ReportToolbar from '.'

const mockReportErrors = getMockReportErrors()
const mockReportErrorResponse = {
  items: mockReportErrors,
  currentPage: 1,
  totalItems: mockReportErrors.length,
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
          template: '<button class="p-button"><slot /></button>',
          props: ['pDisabled'],
        },
        PPastille: {
          name: 'PPastille',
          template: '<div><slot /></div>',
        },
        ReportErrorDrawer: {
          name: 'ReportErrorDrawer',
          template: '<div />',
          props: ['modelValue'],
        },
        ReportFiltersDrawer: {
          name: 'ReportFiltersDrawer',
          template: '<div />',
          props: ['modelValue', 'hasActiveFilters', 'reportFilters'],
          emits: ['apply-filters', 'reset-filters'],
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
      const filterButton = wrapper.findComponent('[data-testid="report-toolbar__filter-button"]')
      const showErrorButton = wrapper.findComponent('[data-testid="report-toolbar__show-errors-button"]')

      // Act
      const filterButtonText = filterButton.text()
      const filterButtonExists = filterButton.exists()
      const showErrorButtonText = showErrorButton.text()
      const showErrorButtonExists = showErrorButton.exists()

      // Assert
      expect(filterButtonExists).toBeTruthy()
      expect(showErrorButtonExists).toBeTruthy()
      expect(filterButtonText).toContain('Filter')
      expect(showErrorButtonText).toContain('Show errors')
    })

    it('disables the show errors button when there are no report errors', async () => {
      // Arrange
      fetchReportErrorsMock.mockResolvedValue({
        items: [],
        currentPage: 1,
        totalItems: 0,
      })
      wrapper = createWrapper()

      wrapper = createWrapper()
      await flushPromises()

      const buttons = wrapper.findAllComponents({ name: 'PButton' })
      const showErrorButton = buttons[1]

      // Assert
      expect(showErrorButton.exists()).toBe(true)
      expect(showErrorButton.props('pDisabled')).toBe(true)
    })

    it('displays the pastille when there are errors', async () => {
      // Arrange
      const errorCountPastille = wrapper.findComponent('[data-testid="report-toolbar__error-count"]')

      // Act
      const pastilleExists = errorCountPastille.exists()
      const pastilleText = errorCountPastille.text()

      // Assert
      expect(pastilleExists).toBe(true)
      expect(pastilleText).toBe(String(mockReportErrorResponse.totalItems))
    })

    it('displays the filter count pastille when filters are applied', async () => {
      // Arrange: Simulate applying filters via the drawer
      const reportFiltersDrawer = wrapper.findComponent({ name: 'ReportFiltersDrawer' })
      reportFiltersDrawer.vm.$emit('apply-filters', {
        reportStatusFilter: [ReportStatus.ONLINE],
        reportTypeIdFilter: [2],
      })
      await nextTick()

      // Act: Find the filter count pastille
      const filterCountPastille = wrapper.find('[data-testid="report-toolbar__filter-count"]')

      // Assert: The pastille exists and shows the correct count
      expect(filterCountPastille.exists()).toBe(true)
      expect(filterCountPastille.text()).toBe('2')
    })

    it('displays the "Clear all" action when filters are applied', async () => {
      // Arrange: Simulate applying filters via the drawer
      const reportFiltersDrawer = wrapper.findComponent({ name: 'ReportFiltersDrawer' })
      reportFiltersDrawer.vm.$emit('apply-filters', {
        reportStatusFilter: [ReportStatus.ONLINE],
        reportTypeIdFilter: [2],
      })
      await nextTick()

      // Act: Find the "Clear all" button
      const clearAllButton = wrapper.find('[data-testid="report-toolbar__clear-filters-button"]')

      // Assert: The button exists and displays the correct label
      expect(clearAllButton.exists()).toBe(true)
      expect(clearAllButton.text().trim()).toBe('Clear all')
    })
  })

  describe('Error drawer', () => {
    it('opens the drawer when the button is clicked', async () => {
      // Arrange
      const showErrorButton = wrapper.findComponent('[data-testid="report-toolbar__show-errors-button"]')
      const drawer = wrapper.findComponent({ name: 'ReportErrorDrawer' })
      const drawerInitialState = drawer.props('modelValue')

      // Act
      await showErrorButton.trigger('click')
      const drawerStateAfterClick = drawer.props('modelValue')

      // Assert
      expect(drawerInitialState).toBe(false)
      expect(drawerStateAfterClick).toBe(true)
    })
  })

  describe('Filter drawer', () => {
    it('opens the filter drawer when the filter button is clicked', async () => {
      // Arrange: Find the filter button and drawer components
      const filterButton = wrapper.find('[data-testid="report-toolbar__filter-button"]')
      const filterDrawer = wrapper.findComponent({ name: 'ReportFiltersDrawer' })

      // Ensure the drawer is initially closed
      const initialDrawerState = filterDrawer.props('modelValue')
      expect(initialDrawerState).toBe(false)

      // Act: Trigger a click on the filter button
      await filterButton.trigger('click')

      // Assert: The drawer should now be open
      const updatedDrawerState = filterDrawer.props('modelValue')
      expect(updatedDrawerState).toBe(true)
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

  describe('Filter report', () => {
    it('emits "clear-filters" when the "Clear All" button is clicked after applying filters', async () => {
      // Arrange: Apply some filters to activate the "Clear All" button
      const reportFiltersDrawer = wrapper.findComponent({ name: 'ReportFiltersDrawer' })
      reportFiltersDrawer.vm.$emit('apply-filters', {
        reportStatusFilter: [ReportStatus.ONLINE],
        reportTypeIdFilter: [2],
      })
      await nextTick()

      // Act: Click the "Clear All" button
      const clearAllButton = wrapper.find('[data-testid="report-toolbar__clear-filters-button"]')
      await clearAllButton.trigger('click')

      // Assert: "clear-filters" event should be emitted once
      const clearEvent = wrapper.emitted('clear-filters')
      expect(clearEvent).toBeTruthy()
      expect(clearEvent).toHaveLength(1)
    })
  })
})
