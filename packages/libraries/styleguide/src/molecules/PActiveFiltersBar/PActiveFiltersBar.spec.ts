import { shallowMount } from '@vue/test-utils'
import type { VueWrapper } from '@vue/test-utils'
import PActiveFiltersBar from '.'
import type { ActiveFilterItem, PActiveFiltersBarProps } from './PActiveFiltersBarTypes'

const getMockedFilter = (code: string): ActiveFilterItem => ({
  pCode: code,
  pContent: `content ${code}`,
  pColor: 'default',
})

const createWrapper = (override: Partial<PActiveFiltersBarProps> = {}): VueWrapper => {
  const defaultProps: PActiveFiltersBarProps = { pFilters: [] }
  const props = { ...defaultProps, ...override }
  return shallowMount(PActiveFiltersBar, { props })
}

describe('pActiveFiltersBar', () => {
  it('renders one PFilterOption per filter when there is no overflow', () => {
    const pFilters = [getMockedFilter('A'), getMockedFilter('B')]
    const wrapper = createWrapper({ pFilters })

    const items = wrapper.findAll('[data-testid="p-active-filters-bar__item"]')
    expect(items).toHaveLength(2)
    expect(wrapper.find('[data-testid="p-active-filters-bar__overflow"]').exists()).toBe(false)
  })

  it('renders at most pMaxVisible filters and an overflow chip with the remaining count', () => {
    const pFilters = Array.from({ length: 9 }, (_, index) => getMockedFilter(`${index}`))
    const wrapper = createWrapper({ pFilters })

    const items = wrapper.findAll('[data-testid="p-active-filters-bar__item"]')
    expect(items).toHaveLength(4)
    expect(wrapper.find('[data-testid="p-active-filters-bar__overflow"]').attributes('pcontent')).toBe('+5')
  })

  it('does not show an overflow chip when the filters count equals pMaxVisible exactly', () => {
    const pFilters = Array.from({ length: 4 }, (_, index) => getMockedFilter(`${index}`))
    const wrapper = createWrapper({ pFilters })

    expect(wrapper.findAll('[data-testid="p-active-filters-bar__item"]')).toHaveLength(4)
    expect(wrapper.find('[data-testid="p-active-filters-bar__overflow"]').exists()).toBe(false)
  })

  it('keeps each remaining chip bound to its own filter after one is removed from the middle', async () => {
    const pFilters = [getMockedFilter('A'), getMockedFilter('B'), getMockedFilter('C')]
    const wrapper = createWrapper({ pFilters })

    await wrapper.setProps({ pFilters: [getMockedFilter('A'), getMockedFilter('C')] })

    const filterOptions = wrapper.findAllComponents({ name: 'PFilterOption' })
    expect(filterOptions.map((option) => option.props('pContent'))).toStrictEqual(['content A', 'content C'])
  })

  it('respects a custom pMaxVisible', () => {
    const pFilters = Array.from({ length: 3 }, (_, index) => getMockedFilter(`${index}`))
    const wrapper = createWrapper({ pFilters, pMaxVisible: 2 })

    const items = wrapper.findAll('[data-testid="p-active-filters-bar__item"]')
    expect(items).toHaveLength(2)
    expect(wrapper.find('[data-testid="p-active-filters-bar__overflow"]').attributes('pcontent')).toBe('+1')
  })

  it('emits remove with the filter code when a visible filter is closed', async () => {
    const pFilters = [getMockedFilter('A'), getMockedFilter('B')]
    const wrapper = createWrapper({ pFilters })

    const filterOptions = wrapper.findAllComponents({ name: 'PFilterOption' })
    await filterOptions[1].vm.$emit('update:p-selected', false)

    expect(wrapper.emitted('remove')).toStrictEqual([['B']])
  })

  it('renders the overflow chip as a non-interactive PTag', () => {
    const pFilters = Array.from({ length: 5 }, (_, index) => getMockedFilter(`${index}`))
    const wrapper = createWrapper({ pFilters })

    expect(wrapper.findAllComponents({ name: 'PFilterOption' })).toHaveLength(4)
    expect(wrapper.findComponent({ name: 'PTag' }).props('pContent')).toBe('+1')
  })
})
