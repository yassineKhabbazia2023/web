import { type VueWrapper, shallowMount } from '@vue/test-utils'
import { describe, expect, it, beforeEach } from 'vitest'
import PFilterGroup from '.'
import type { PFilterGroupProps, FilterOption } from './PFilterGroupTypes'
import { nextTick } from 'vue'

function getMockedFilter(code: string): FilterOption {
  return {
    pCode: code,
    pValue: `value ${code}`,
    pContent: `content ${code}`,
    pColor: 'success',
    pDisabled: code === 'B',
    pIcon: 'PIAdd',
  }
}

const mockedFilters = [
  getMockedFilter('A'),
  getMockedFilter('B'),
]
const mockedSelection = ['B']

function createWrapper(override: Partial<PFilterGroupProps> = {}) {
  const defaultProps: PFilterGroupProps = {
    pFilters: mockedFilters,
    modelValue: mockedSelection,
  }

  const props = {
    ...defaultProps,
    ...override,
  }
  return shallowMount(PFilterGroup, {
    props,
  })
}

describe('filterGroup', () => {
  let wrapper: VueWrapper
  let pFilterOptions: VueWrapper[]
  beforeEach(() => {
    wrapper = createWrapper()
    pFilterOptions = wrapper.findAllComponents({ name: 'PFilterOption' })
  })
  it('renders filterOption correctly', () => {
    const filters = wrapper.findAll('[data-testid="p-filter-group-item"]')

    const mockedFilterA = mockedFilters[0]
    const mockedFilterB = mockedFilters[1]

    const expectedPropsA = {
      pValue: mockedFilterA.pValue,
      pContent: mockedFilterA.pContent,
      pColor: mockedFilterA.pColor,
      pSelected: false,
      pDisabled: mockedFilterA.pDisabled,
      pIcon: mockedFilterA.pIcon,
    }
    const expectedPropsB = {
      pValue: mockedFilterB.pValue,
      pContent: mockedFilterB.pContent,
      pColor: mockedFilterB.pColor,
      pSelected: true,
      pDisabled: mockedFilterB.pDisabled,
      pIcon: mockedFilterB.pIcon,
    }
    const pFilterOptionA = pFilterOptions[0]
    const pFilterOptionB = pFilterOptions[1]

    expect(filters).toHaveLength(mockedFilters.length)
    expect(pFilterOptionA.props()).toStrictEqual(expectedPropsA)
    expect(pFilterOptionB.props()).toStrictEqual(expectedPropsB)
  })

  describe('interactions', () => {
    const testsA = [{
      index: 0,
      isSelected: true,
      expectedCodes: ['B', 'A'],
      reason: 'add A to selection',
    }, {
      index: 1,
      isSelected: false,
      expectedCodes: [],
      reason: 'remove B from selection',
    }]
    it.each(testsA)('should emit $expectedCodes when $reason', async ({
      index,
      isSelected,
      expectedCodes,
    }) => {
      const pFilterOption = pFilterOptions[index]
      pFilterOption.vm.$emit('update:p-selected', isSelected)
      await nextTick()
      expect(wrapper.emitted('update:model-value')).toStrictEqual([[expectedCodes]])
    })

    const testsB = [{
      index: 0,
      isSelected: false,
      reason: 'A is already unselected',
    }, {
      index: 1,
      isSelected: true,
      reason: 'B is already selected',
    }]
    it.each(testsB)('should not emit update:model-value when $reason', async ({
      index,
      isSelected,
    }) => {
      const pFilterOption = pFilterOptions[index]
      pFilterOption.vm.$emit('update:p-selected', isSelected)
      await nextTick()
      expect(wrapper.emitted('update:model-value')).toBeUndefined()
    })
  })

  const testsC = [{
    index: 0,
    isSelected: true,
    expectedParams: ['A', true],
    reason: 'add A to selection',
  }, {
    index: 1,
    isSelected: false,
    expectedParams: ['B', false],
    reason: 'remove B from selection',
  }]
  it.each(testsC)('should emit \'toggle\' with $expectedParams when $reason', async ({
    index,
    isSelected,
    expectedParams,
  }) => {
    const pFilterOption = pFilterOptions[index]
    pFilterOption.vm.$emit('update:p-selected', isSelected)
    await nextTick()
    expect(wrapper.emitted('toggle')).toStrictEqual([expectedParams])
  })

})
