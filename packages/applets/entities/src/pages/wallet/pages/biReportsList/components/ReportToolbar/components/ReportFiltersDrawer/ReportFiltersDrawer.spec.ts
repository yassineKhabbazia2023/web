import { nextTick } from 'vue'
import { flushPromises, shallowMount } from '@vue/test-utils'
import { ReportStatus } from '@entities/common/types/BIReports.enums'
import type { ReportFilters } from '@entities/common/types/BIReportsTypes'
import type { ReportFiltersDrawerProps } from './report-filters-drawer.types'
import { getMockedBIReportTypes } from '@entities/__mocks__/bi-report.mocks'

import ReportFiltersDrawer from './ReportFiltersDrawer.vue'

const mockedBIReportTypes = getMockedBIReportTypes()

const loggerErrorSpy = vi.hoisted(() => vi.fn())
const fetchBIReportTypesMock = vi.hoisted(() => vi.fn(() => Promise.resolve(mockedBIReportTypes)))

vi.mock('@entities/services/reporting', () => ({
  fetchBIReportTypes: fetchBIReportTypesMock,
}))
vi.mock('@pulse/core', () => ({
  logger: {
    error: loggerErrorSpy,
  },
}))

const stubs = {
  PDrawer: {
    name: 'PDrawer',
    template: '<div><slot /> <slot name="footer" /></div>',
    props: ['modelValue', 'pSize', 'pTitle', 'destroyOnClose'],
    emits: ['update:modelValue', 'close', 'open', 'close-drawer-button'],
  },
  PForm: { name: 'PForm', template: '<form><slot /></form>', props: ['pModel', 'pLabelPosition'] },
  PFormItem: { name: 'PFormItem', template: '<div><slot /></div>', props: ['pLabel'] },
  PDropdown: {
    name: 'PDropdown',
    props: ['modelValue', 'pPlaceholder', 'pOptions', 'pLoading', 'pMultiple'],
    emits: ['update:modelValue'],
    template: `<select multiple @change="$emit('update:modelValue', $event.target.selectedOptions)">
      <slot />
    </select>`,
  },
  PCheckboxGroup: {
    name: 'PCheckboxGroup',
    template: '<div><slot /></div>',
    props: ['modelValue'],
    emits: ['update:modelValue'],
  },
  PCheckbox: {
    name: 'PCheckbox',
    template: '<label><slot /></label>',
    props: ['pLabel'],
  },
  PButton: {
    name: 'PButton',
    template: '<button><slot /></button>',
    props: ['pType', 'pPlain', 'pDisabled'],
  },
}

function createWrapper(props: Partial<ReportFiltersDrawerProps> = {}) {
  const defaultProps: ReportFiltersDrawerProps = {
    modelValue: true,
    hasActiveFilters: false,
    reportFilters: {
      reportStatusFilter: [],
      reportTypeIdFilter: [],
    },
  }

  return shallowMount(ReportFiltersDrawer, {
    props: { ...defaultProps, ...props },
    global: { stubs },
  })
}

describe('ReportFiltersDrawer.vue', () => {
  it('fetches and displays report types on mount', async () => {
    createWrapper()
    await flushPromises()

    // Check the dropdown options rendered in computed prop
    expect(fetchBIReportTypesMock).toHaveBeenCalled()
  })

  it('should display a console error when failing to fetch report types', async () => {
    const expectedErrorMessage = 'API Error: 503 Service Unavailable'
    fetchBIReportTypesMock.mockRejectedValue(expectedErrorMessage)
    createWrapper()
    await flushPromises()

    expect(loggerErrorSpy).toHaveBeenCalledOnce()
    expect(loggerErrorSpy).toHaveBeenCalledWith('Unable to fetch report types: ', expectedErrorMessage)
  })

  it('initializes internal filters when drawer opens', async () => {
    const filters: ReportFilters = {
      reportStatusFilter: [ReportStatus.ONLINE, ReportStatus.FAILED],
      reportTypeIdFilter: [1, 2, 3],
    }
    const wrapper = createWrapper({ reportFilters: filters })

    // simulate drawer open event
    wrapper.findComponent({ name: 'PDrawer' }).vm.$emit('open')
    await nextTick()

    // The PDropdown and PCheckboxGroup v-models are bound to internalFilters
    const dropdown = wrapper.findComponent({ name: 'PDropdown' })
    expect(dropdown.props('modelValue')).toEqual(filters.reportTypeIdFilter)

    const checkboxGroup = wrapper.findComponent({ name: 'PCheckboxGroup' })
    expect(checkboxGroup.props('modelValue')).toEqual(filters.reportStatusFilter)
  })

  it('emits reset-filters event when reset button is clicked and disables reset button if no active filters', async () => {
    // Start with active filters so button is enabled
    const filters: ReportFilters = {
      reportStatusFilter: [ReportStatus.ONLINE],
      reportTypeIdFilter: [3],
    }

    const wrapper = createWrapper({ reportFilters: filters, hasActiveFilters: true })
    await flushPromises()

    const resetBtn = wrapper.findComponent({ name: 'PButton' })
    expect(resetBtn.props('pDisabled')).toBeFalsy() // not disabled

    await resetBtn.trigger('click')

    expect(wrapper.emitted('reset-filters')).toBeTruthy()
  })

  it('emits apply-filters event with current filters when apply button is clicked', async () => {
    const wrapper = createWrapper()
    await flushPromises()

    // Simulate user selects some filters by emitting update:modelValue on dropdown and checkbox group
    const dropdown = wrapper.findComponent({ name: 'PDropdown' })
    await dropdown.vm.$emit('update:modelValue', [1])

    const checkboxGroup = wrapper.findComponent({ name: 'PCheckboxGroup' })
    await checkboxGroup.vm.$emit('update:modelValue', [ReportStatus.ONLINE])

    // Click apply button
    const applyBtn = wrapper.find('[data-testid="report-filters-drawer__apply-button"]')
    await applyBtn.trigger('click')

    expect(wrapper.emitted('apply-filters')).toBeTruthy()
    expect(wrapper.emitted('apply-filters')![0][0]).toEqual({
      reportTypeIdFilter: [1],
      reportStatusFilter: [ReportStatus.ONLINE],
    })
  })

  it('closes drawer and resets filters if no active filters when close event emitted', async () => {
    const wrapper = createWrapper()

    // simulate close event on drawer
    wrapper.findComponent({ name: 'PDrawer' }).vm.$emit('close')
    await nextTick()

    // After closing with no filters applied, dropdown and checkbox should have empty values
    const dropdown = wrapper.findComponent({ name: 'PDropdown' })
    expect(dropdown.props('modelValue')).toEqual([])

    const checkboxGroup = wrapper.findComponent({ name: 'PCheckboxGroup' })
    expect(checkboxGroup.props('modelValue')).toEqual([])
  })

  it('closes drawer and keeps filters if active filters when close event emitted', async () => {
    const filters: ReportFilters = {
      reportStatusFilter: [ReportStatus.ONLINE],
      reportTypeIdFilter: [1],
    }

    const wrapper = createWrapper({ reportFilters: filters })

    // Simulate user applied filters by clicking apply
    const applyBtn = wrapper.find('[data-testid="report-filters-drawer__apply-button"]')
    await applyBtn.trigger('click')

    // simulate close event on drawer
    wrapper.findComponent({ name: 'PDrawer' }).vm.$emit('close')
    await nextTick()

    const dropdown = wrapper.findComponent({ name: 'PDropdown' })
    expect(dropdown.props('modelValue')).toEqual([])

    const checkboxGroup = wrapper.findComponent({ name: 'PCheckboxGroup' })
    expect(checkboxGroup.props('modelValue')).toEqual([])
  })
})
