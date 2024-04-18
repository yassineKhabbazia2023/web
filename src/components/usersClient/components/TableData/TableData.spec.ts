import type { VueWrapper } from '@vue/test-utils'
import { flushPromises, mount } from '@vue/test-utils'
import { beforeEach, describe, expect, it } from 'vitest'
import { getInitials } from '@/helper'
import mock from './../../mock.json'
import TableData from './'
import { nextTick } from 'vue'

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

  it('should emit click-view-information upon toolbox click event', async () => {
    const wrapper = createWrapper()
    const row = { contactId: 123 }

    wrapper.vm.handleToolboxItemClick('', row)
    await nextTick()
    await flushPromises()

    expect(wrapper.emitted('click-view-information')).toBeTruthy()
    expect(wrapper.emitted('click-view-information')).toStrictEqual([[row.contactId]])
  })
})
