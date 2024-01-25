import { mount, VueWrapper } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import TableData from './'

const createWrapper = (): VueWrapper<any> =>
  mount(TableData, {
    props: {
      data: []
    },
    attachTo: document.body
  })

describe('tableData', () => {
  it('has a menu with 3 items', () => {
    createWrapper()

    const menu = document.querySelector('.el-popper')
    const menuItems = menu?.querySelectorAll('li')
    expect(menuItems).toHaveLength(3)
  })
})
