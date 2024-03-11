import { mount, VueWrapper } from '@vue/test-utils'
import { beforeEach, describe, expect, it } from 'vitest'
import mock from './../../mock.json'
import TableData from './'

const createWrapper = (): VueWrapper<any> =>
  mount(TableData, {
    props: {
      data: mock.data.items.map(({
        firstName,
        lastName,
        ...rest
      }) => ({
        initials: `${firstName[0].toUpperCase()}${lastName[0].toUpperCase()}`,
        fullName: `${firstName} ${lastName}`,
        firstName,
        lastName,
        isOwner: false,
        isLoggedUser: () => false,
        ...rest
      }))
    }
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
})
