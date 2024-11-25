import { describe, it, expect } from 'vitest'
import { nextTick } from 'vue'
import { shallowMount } from '@vue/test-utils'
import PPagination from './'
import type { PaginationProps } from './PPaginationTypes'

const defaultProps: PaginationProps = {
  pPageSizes: [100, 200, 300],
  pPageSizeSelectorGroupLabel: 'Number of documents',
  pPageSizeSelectorSuffix: 'documents',
  pShowTotalPageCounter: true,
  pTotal: 100,
  pCurrentPage: 1,
  pPageSize: 100,
}

const paginationSelectId = 'pagination-select'
const paginationPagesId = 'pagination-pages'
const paginationCounterId = 'pagination-counter'

const createWrapper = (props = defaultProps) =>
  shallowMount(PPagination, {
    props,
    global: {
      stubs: {
        ElSelect: {
          name: 'ElSelect',
          template: '<div class="el-select"><slot /></div>',
          props: [
            'placement',
            'modelValue',
          ],
        },
        ElOptionGroup: {
          name: 'ElOptionGroup',
          template: '<div><slot /></div>',
        },
        ElOption: {
          name: 'ElOption',
          template: '<div><slot /></div>',
        },
        ElPagination: {
          name: 'ElPagination',
          template: '<div class="el-pagination"></div>',
          props: [
            'current-page',
            'page-size',
            'pageSizes',
            'total',
            'layout',
          ],
        },
      },
    },
  })

describe('pPagination', () => {
  describe('props', () => {
    it('should show the total page counter when showTotalPageCounter is true', () => {
      const wrapper = createWrapper()
      expect(
        wrapper.find('.p-pagination__total-page-counter').exists(),
      ).toBeTruthy()
    })
    it('should hide the total page counter when showTotalPageCounter is false', () => {
      const wrapper = createWrapper({
        ...defaultProps,
        pShowTotalPageCounter: false,
        pPageSizes: [100, 200, 300],
        pPageSizeSelectorSuffix: 'documents',
      })
      expect(
        wrapper.find('.p-pagination__total-page-counter').exists(),
      ).toBeFalsy()
    })
    it('should set page range selector postion to "top"', () => {
      const wrapper = createWrapper()
      const select = wrapper.findComponent({ name: 'ElSelect' })
      expect(select.props('placement')).toBe('top')
      expect(select.props('modelValue')).toBe(100)
    })

    it('should have a fixed layout', () => {
      const wrapper = createWrapper()
      const pagination = wrapper
        .findComponent({ name: 'PPagination' })
        .findComponent({ name: 'ElPagination' })
      expect(pagination.props('layout')).toBe('prev, pager, next')
    })
  })

  describe('events', () => {
    it('should emit update:modelValue event', async () => {
      const wrapper = createWrapper()
      const dropdown = wrapper.findComponent({ name: 'ElSelect' })
      dropdown.setValue(300)
      await dropdown.trigger('change')
      expect(dropdown.emitted('update:modelValue')).toHaveLength(1)
    })

    it('should emit on-page-range-changed on page range selector change', async () => {
      const wrapper = createWrapper()
      const dropdown = wrapper.findComponent({ name: 'ElSelect' })
      dropdown.vm.$emit('update:model-value', 300)
      await nextTick()
      expect(wrapper.emitted('on-page-range-changed')).toHaveLength(1)
      expect(wrapper.emitted('on-page-range-changed')).toStrictEqual([[300]])
    })
    it('should have root name in attribute data-testid', () => {
      const wrapper = createWrapper({
        ...defaultProps,
        pTestIdRoot: 'wallet',
      })
      expect(wrapper.html()).toMatchFileSnapshot('wrapper.snap')
      const select = wrapper.find('.p-pagination__select .el-select')
      const pagination = wrapper.find('.p-pagination .el-pagination')
      const counter = wrapper.find('.p-pagination__total-page-counter')

      expect(select.attributes('data-testid')).toBe(`wallet-${paginationSelectId}`)
      expect(pagination.attributes('data-testid')).toBe(`wallet-${paginationPagesId}`)
      expect(counter.attributes('data-testid')).toBe(`wallet-${paginationCounterId}`)
    })
    it('should have default identifier in attribute data-testid', () => {
      const wrapper = createWrapper()

      const select = wrapper.find('.p-pagination__select .el-select')
      const pagination = wrapper.find('.p-pagination .el-pagination')
      const counter = wrapper.find('.p-pagination__total-page-counter')

      expect(select.attributes('data-testid')).toBe(`ppagination-${paginationSelectId}`)
      expect(pagination.attributes('data-testid')).toBe(`ppagination-${paginationPagesId}`)
      expect(counter.attributes('data-testid')).toBe(`ppagination-${paginationCounterId}`)
    })
  })
})
