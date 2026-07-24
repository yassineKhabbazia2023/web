import { shallowMount } from '@vue/test-utils'
import type { VueWrapper } from '@vue/test-utils'
import PListToolbar from './PListToolbar.vue'
import type { PListToolbarProps } from './PListToolbar.types'

const defaultProps: PListToolbarProps = {
  pFilterLabel: 'Filter',
  pResetLabel: 'Reset',
  pDeselectLabel: 'Deselect',
}

const createWrapper = (
  props: Partial<PListToolbarProps> = {},
  slots: Record<string, string> = {},
): VueWrapper =>
  shallowMount(PListToolbar, {
    props: { ...defaultProps, ...props },
    slots: {
      search: '<div data-testid="slot-search" />',
      ...slots,
    },
    global: {
      stubs: {
        PButton: {
          name: 'PButton',
          template: '<button v-bind="$attrs"><slot /></button>',
        },
        PPastille: {
          name: 'PPastille',
          template: '<span v-bind="$attrs"><slot /></span>',
        },
        PIcon: { name: 'PIcon', template: '<i />' },
        PDivider: { name: 'PDivider', template: '<hr />' },
      },
    },
  })

describe('PListToolbar', () => {
  it('renders the search slot', () => {
    const wrapper = createWrapper()
    expect(wrapper.find('[data-testid="slot-search"]').exists()).toBe(true)
  })

  it('renders the actions slot with a leading divider only when provided', () => {
    const withoutActions = createWrapper()
    const withActions = createWrapper({}, { actions: '<div data-testid="slot-actions" />' })

    expect(withoutActions.find('[data-testid="slot-actions"]').exists()).toBe(false)
    expect(withActions.find('[data-testid="slot-actions"]').exists()).toBe(true)
    // Header divider only added alongside the actions slot.
    expect(withActions.findAllComponents({ name: 'PDivider' }).length)
      .toBeGreaterThan(withoutActions.findAllComponents({ name: 'PDivider' }).length)
  })

  it('renders the results bar by default and hides it when pHasResultsBar is false', () => {
    expect(createWrapper().find('.p-list-toolbar__results').exists()).toBe(true)
    expect(createWrapper({ pHasResultsBar: false }).find('.p-list-toolbar__results').exists()).toBe(false)
  })

  it('always displays the filter button and emits open-filters on click', async () => {
    const wrapper = createWrapper()
    const filterButton = wrapper.find('[data-testid="p-list-toolbar__filter-button"]')

    expect(filterButton.exists()).toBe(true)
    await filterButton.trigger('click')
    expect(wrapper.emitted('open-filters')).toHaveLength(1)
  })

  it('shows the filter count and the reset button only when filters are active', () => {
    const inactive = createWrapper({ pFilterCount: 0 })
    const active = createWrapper({ pFilterCount: 3 })

    expect(inactive.find('[data-testid="p-list-toolbar__filter-count"]').exists()).toBe(false)
    expect(inactive.find('[data-testid="p-list-toolbar__reset-button"]').exists()).toBe(false)

    expect(active.find('[data-testid="p-list-toolbar__filter-count"]').text()).toBe('3')
    expect(active.find('[data-testid="p-list-toolbar__reset-button"]').exists()).toBe(true)
  })

  it('emits clear-filters when the reset button is clicked', async () => {
    const wrapper = createWrapper({ pFilterCount: 2 })
    await wrapper.find('[data-testid="p-list-toolbar__reset-button"]').trigger('click')
    expect(wrapper.emitted('clear-filters')).toHaveLength(1)
  })

  it('renders the selection group with a green background only when items are selected', async () => {
    const withoutSelection = createWrapper({ pSelectedCount: 0 }, { selection: '<div data-testid="slot-selection" />' })
    const withSelection = createWrapper({ pSelectedCount: 2 }, { selection: '<div data-testid="slot-selection" />' })

    expect(withoutSelection.find('[data-testid="slot-selection"]').exists()).toBe(false)
    expect(withoutSelection.find('.p-list-toolbar__results').classes()).not.toContain('bg--jungle-75')

    expect(withSelection.find('[data-testid="slot-selection"]').exists()).toBe(true)
    expect(withSelection.find('.p-list-toolbar__results').classes()).toContain('bg--jungle-75')

    await withSelection.find('[data-testid="p-list-toolbar__deselect-button"]').trigger('click')
    expect(withSelection.emitted('clear-selection')).toHaveLength(1)
  })

  it('renders the summary slot inside the results bar', () => {
    const wrapper = createWrapper({}, { summary: '<div data-testid="slot-summary" />' })
    expect(wrapper.find('[data-testid="slot-summary"]').exists()).toBe(true)
  })
})
