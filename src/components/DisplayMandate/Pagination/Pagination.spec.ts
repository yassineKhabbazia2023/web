import Pagination from '.'
import wrapperFactory from '../../../../tests/utils/wrapperFactory'
import { expect, describe, it } from 'vitest'
import {
  waitForAsyncImports
} from '@kpmg/common/src/testing-helpers'
import { PDropdown } from '@kpmg/styleguide'

const defaultProps = {
  pagesCount: 32,
  pagesRanges: [10, 20, 30],
  showTotalPageCounter: true
}

const createWrapper = (props: any = {}) =>
  wrapperFactory(Pagination, {
    props: Object.assign(defaultProps, props)
    /* global: {
      stubs: {
        ElSelect: PDropdown
      }
    } */
  })

describe('pagination component', () => {
  it('renders the component when step value is 1', async () => {
    const wrapper = createWrapper()
    await waitForAsyncImports(60)
    expect(wrapper.text()).toContain('1 - 10 on 32')
  })

  it('emits page-selected event when next button and previous are clicked', async () => {
    const wrapper = createWrapper()
    await waitForAsyncImports(50)
    await wrapper.find('.btn-next').trigger('click')
    const pageSelectedEvent: any = wrapper.emitted('page-selected')
    expect(pageSelectedEvent[0]).toStrictEqual([{ currentPage: 2, itemsByPage: 10 }])
    await wrapper.find('.btn-prev').trigger('click')
    expect(pageSelectedEvent[1]).toStrictEqual([{ currentPage: 1, itemsByPage: 10 }])
  })

  // This step is skipped cuz the select button is not rendered, and the
  // Pdropdown isn't found in the current styleguide packgae
  // it'll updated when the
  // new styleguide loading approach will be finalize
  it.skip('validateIBS when ibs length is equal to 10', async () => {
    const wrapper = createWrapper()
    await waitForAsyncImports(260)
    const selector = wrapper.findComponent(PDropdown)
    await selector.setValue('20')
    await selector.trigger('change')
    const pageSelectedEvent: any = wrapper.emitted('page-selected')
    expect(pageSelectedEvent[0]).toStrictEqual([{ currentPage: 1, itemsByPage: 20 }])
  })
})
