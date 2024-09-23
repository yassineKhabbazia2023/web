import Pagination from '.'
import wrapperFactory from '@mandate/../tests/utils/wrapperFactory'
import { expect, describe, it } from 'vitest'

const defaultProps = {
  pagesCount: 32,
  pagesRanges: [10, 20, 30],
  showTotalPageCounter: true,
}

const createWrapper = (props: any = {}) =>
  wrapperFactory(Pagination, {
    props: Object.assign(defaultProps, props),
  })

describe('pagination component', () => {
  it('renders the component when step value is 1', () => {
    const wrapper = createWrapper()
    expect(wrapper.text()).toContain('1 - 10 on 32')
    expect(wrapper.find('li[aria-label="page 4"]')).toBeTruthy()
  })

  it('emits page-selected event when next button are clicked', async () => {
    const wrapper = createWrapper()
    await wrapper.find('.btn-next').trigger('click')
    const pageSelectedEvent: any = wrapper.emitted('page-selected')
    expect(pageSelectedEvent[0]).toStrictEqual([{ currentPage: 2, limit: 10 }])
  })

  it('emits page-selected event when dropdown are clicked', () => {
    const wrapper = createWrapper()
    const PPaginationComponent = wrapper.findComponent({ name: 'PPagination' })
    const limit = 20
    PPaginationComponent.vm.$emit('on-page-range-changed', limit)
    const pageSelectedEvent: any = wrapper.emitted('page-selected')
    expect(pageSelectedEvent[0]).toStrictEqual([{ currentPage: 1, limit }])
  })
})
