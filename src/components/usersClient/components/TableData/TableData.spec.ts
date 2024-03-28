import type { VueWrapper } from '@vue/test-utils'
import { mount } from '@vue/test-utils'
import { beforeEach, describe, expect, it } from 'vitest'
import { getInitials } from '@/helper'
import mock from './../../mock.json'
import TableData from './'
import { PTable } from '@kpmg/styleguide'

const createWrapper = (): VueWrapper<any> =>
  mount(TableData, {
    props: {
      data: mock.data.items.map(({
        firstName,
        lastName,
        ...rest
      }) => ({
        initials: getInitials(
          firstName,
          lastName,
        ),
        fullName: `${firstName} ${lastName}`,
        firstName,
        lastName,
        isOwner: false,
        isLoggedUser: () => false,
        ...rest,
      })),
    },
  })

const getMenu = () => document.querySelector('.el-popper') as HTMLElement

describe('tableData', () => {
  beforeEach(() => {
    createWrapper()
  })

  it('has a menu with 3 items', () => {
    const menuItems = getMenu().querySelectorAll('li')
    expect(menuItems).toHaveLength(3)
  })

  it('should emit on-sort-change upon sort change event', async () => {
    const wrapper = createWrapper()
    const sortPayload =
            // eslint-disable-next-line max-len
            '{"column":{"order":"ascending","id":"el-table_18_column_100","type":"default","property":"email","align":"is-left","headerAlign":"is-left","showOverflowTooltip":true,"filteredValue":[],"filterPlacement":"","isColumnGroup":false,"isSubColumn":false,"filterOpened":false,"sortable":true,"rawColumnKey":null,"label":"E-Mail","resizable":true,"sortOrders":["ascending","descending",null],"reserveSelection":false,"filterMultiple":true,"minWidth":80,"realWidth":423,"no":1,"level":1,"colSpan":1,"rowSpan":1},"prop":"email","order":"ascending"}'
    const table = await wrapper.findComponent(PTable)

    table.vm.$emit('sort-change', JSON.parse(sortPayload))

    expect(wrapper.emitted('on-sort-change')).toBeTruthy()
    expect(wrapper.emitted('on-sort-change')).toStrictEqual([['+email']])
  })
})
