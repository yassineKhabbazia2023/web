import { shallowMount, VueWrapper } from '@vue/test-utils'
import { describe, it, expect, beforeEach } from 'vitest'
import { nextTick } from 'vue'

import BiReportsList from '.'

const createWrapper = (options = {}) => {
  return shallowMount(BiReportsList, {
    global: {
      stubs: {
        ReportTable: true,
        PPagination: {
          name: 'PPagination',
          template: '<div class="p-pagination"><slot /></div>',
          props: ['pCurrentPage', 'pTotal', 'pPageSizes', 'pShowTotalPageCounter'],
        },
      },
    },
    ...options,
  })
}

describe('BiReportsList', () => {
  let wrapper: VueWrapper

  beforeEach(async () => {
    wrapper = createWrapper()
    await nextTick()
  })

  it('should render the ReportTable component', () => {
    const table = wrapper.findComponent({ name: 'ReportTable' })
    expect(table.exists()).toBe(true)
  })

  it('should render the PPagination component with correct props', () => {
    const pagination = wrapper.findComponent({ name: 'PPagination' })
    expect(pagination.exists()).toBe(true)
    expect(pagination.props('pCurrentPage')).toBe(1)
    expect(pagination.props('pTotal')).toBe(1)
  })

  it('should display the pagination label', () => {
    expect(wrapper.text()).toContain('on')
  })
})
