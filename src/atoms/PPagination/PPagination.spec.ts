import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import PPagination from './'
import { ElSelect, ElPagination } from 'element-plus'
import type { PaginationProps } from './PPaginationTypes'
import type { PaginationProps } from './PPaginationTypes'

const defaultProps: PaginationProps = {
  pPageSizes: [100, 200, 300],
  pPageSizeSelectorGroupLabel: 'Number of documents',
  pPageSizeSelectorSuffix: 'documents',
  pShowTotalPageCounter: true,
  pTotal: 100,
  pCurrentPage: 1,
  pPageSize: 100
}

const createWrapper = (props = defaultProps) =>
  mount(PPagination, {
    props,
    global: {
      stubs: {
        PDropdown: ElSelect
      }
    }
  })

describe('pPagination', () => {
  describe('props', () => {
    it('should show the total page counter when showTotalPageCounter is true', () => {
      const wrapper = createWrapper()
      expect(
        wrapper.find('.p-pagination__total-page-counter').exists()
      ).toBeTruthy()
    })
    it('should hide the total page counter when showTotalPageCounter is false', () => {
      const wrapper = createWrapper({
        ...defaultProps,
        pShowTotalPageCounter: false,
        pPageSizes: [100, 200, 300],
        pPageSizeSelectorSuffix: 'documents'
      })
      expect(
        wrapper.find('.p-pagination__total-page-counter').exists()
      ).toBeFalsy()
    })
    it('should set page range selector postion to "top"', () => {
      const wrapper = createWrapper()
      const select = wrapper.findComponent(ElSelect)
      expect(select.props('placement')).toBe('top')
      expect(select.props('modelValue')).toBe(100)
    })

    it('should have a fixed layout', () => {
      const wrapper = createWrapper()
      const pagination = wrapper
        .findComponent(PPagination)
        .findComponent(ElPagination)
      expect(pagination.props('layout')).toBe('prev, pager, next')
    })
  })

  describe('events', () => {
    it('should emit update:modelValue event', async () => {
      const wrapper = createWrapper()
      const dropdown = wrapper.findComponent(ElSelect)
      dropdown.setValue(300)
      await dropdown.trigger('change')
      expect(dropdown.emitted('update:modelValue')).toHaveLength(1)
    })
    it('should emit on-page-range-changed on page range selector change', async () => {
      const wrapper = createWrapper() as any
      wrapper.vm.selectedRange = 300
      await wrapper.vm.$nextTick()
      expect(wrapper.emitted('on-page-range-changed')).toHaveLength(1)
      expect(wrapper.emitted('on-page-range-changed')).toStrictEqual([[300]])
    })
  })
})
