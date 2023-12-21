import Pagination from '.'
import wrapperFactory from '../../../../tests/utils/wrapperFactory'
import { expect, describe, it } from 'vitest'
import { PSelect } from '@kpmg/styleguide'

const defaultProps = {
  pagesCount: 32,
  pagesRanges: [10, 20, 30],
  showTotalPageCounter: true
}

const createWrapper = (props: any = {}) =>
  wrapperFactory(Pagination, {
    props: Object.assign(defaultProps, props)
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
    expect(pageSelectedEvent[0]).toStrictEqual([{ currentPage: 2, itemsByPage: 10 }])
  })

  it('emits page-selected event when dropdown are clicked', async () => {
    const wrapper = createWrapper()
    const selector = wrapper.findComponent(PSelect)
    selector.setValue('20')
    await selector.trigger('change')
    const pageSelectedEvent: any = wrapper.emitted('page-selected')
    expect(pageSelectedEvent[0]).toStrictEqual([{ currentPage: 1, itemsByPage: '20' }])
  })
})
