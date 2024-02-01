import { mount, VueWrapper } from '@vue/test-utils'
import { beforeEach, describe, expect, it } from 'vitest'
import { nextTick } from 'vue'
import mock from './../../mock.json'
import TableData from './'

let wrapper: VueWrapper<any>

const createWrapper = (): VueWrapper<any> =>
  mount(TableData, {
    props: {
      data: mock.data.items
    },
    attachTo: document.body
  })

const getMenu = () => document.querySelector('.el-popper') as HTMLElement

describe('tableData', () => {
  beforeEach(() => {
    wrapper = createWrapper()
  })

  it('has a menu with 3 items', () => {
    const menuItems = getMenu().querySelectorAll('li')
    expect(menuItems).toHaveLength(3)
  })

  it('can display the collaborator details drawer', async () => {
    const getDrawer = () => wrapper.find('.p-drawer')

    expect(getDrawer().exists()).toBeFalsy()
    wrapper.vm.handleToolboxItemClick('informationsAboutCollaborator', mock.data.items[0])
    await nextTick()

    expect(getDrawer().exists()).toBeTruthy()
  })
})
