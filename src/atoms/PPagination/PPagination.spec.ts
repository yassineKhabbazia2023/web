import { describe, it, expect } from 'vitest'
import wrapperFactory from 'tests/utils/wrapperFactory'
import PPagination from './'
import PDropdown from '@/atoms/PDropdown'
import { ElSelect, ElPagination } from 'element-plus'

type PaginationProps = {
  showTotalPageCounter: boolean
  pagesRanges: Array<number>
  pageRangeSelectorGroupLabel: string
  pageRangeSelectorSuffix: string
}

const defaultProps: PaginationProps = {
  showTotalPageCounter: true,
  pagesRanges: [100, 200, 300],
  pageRangeSelectorGroupLabel: 'this is the group name',
  pageRangeSelectorSuffix: 'documents'
}

const createWrapper = (props = defaultProps) =>
  wrapperFactory(PPagination, {
    props,
    global: {
      stubs: {
        PDropdown,
        ElSelect,
        ElPagination
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
        showTotalPageCounter: false,
        pagesRanges: [100, 200, 300],
        pageRangeSelectorGroupLabel: 'this is the group name',
        pageRangeSelectorSuffix: 'documents'
      })
      expect(
        wrapper.find('.p-pagination__total-page-counter').exists()
      ).toBeFalsy()
    })
    it('should set page range selector postion to "top"', () => {
      const wrapper = createWrapper()
      const dropdown = wrapper.findComponent(PDropdown)
      const select = dropdown.findComponent(ElSelect)
      expect(select.props('placement')).toBe('top')
      expect(select.props('modelValue')).toBe(100)
    })
    it('should combine suffix and value in side page range selector content', () => {
      const wrapper = createWrapper()
      const expectedValue =
        defaultProps.pagesRanges[0] + ' ' + defaultProps.pageRangeSelectorSuffix
      expect(wrapper.vm.pageRangeSelectorContent).toStrictEqual(expectedValue)
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
      const dropdown = wrapper.findComponent(PDropdown).findComponent(ElSelect)
      dropdown.setValue(300)
      await dropdown.trigger('change')
      expect(dropdown.emitted('update:modelValue')).toHaveLength(1)
    })
    it('should emit on-page-range-changed on page range selector change', async () => {
      const wrapper = createWrapper()
      wrapper.vm.selectedRange = 300
      await wrapper.vm.$nextTick()
      expect(wrapper.emitted('on-page-range-changed')).toHaveLength(1)
    })
  })
})
