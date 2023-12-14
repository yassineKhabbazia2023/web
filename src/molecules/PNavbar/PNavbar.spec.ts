import { VueWrapper, mount } from '@vue/test-utils'
import { createRouter, createMemoryHistory } from 'vue-router'
import { describe, it, expect } from 'vitest'
import PNavbar from '.'

const routes = [
  { path: '/entity', component: { render: () => '<div>Entity</div>' } }
]
const router = createRouter({
  history: createMemoryHistory(),
  routes
})

const pEntities = [
  { pName: 'Restaurant Johnny s pizza', pIdAccount: 'idAccount', pIcon: 'PICupHot' },
  { pName: 'Jean Levage', pIdAccount: 'idAccount 2', pIcon: 'PIShop' }
]

const pMenuList = [
  { pName: 'My entities', pIcon: 'PIGrid', pPath: '/entity' },
  { pName: 'See customer view', pIcon: 'PIPersonVideo3', pPath: '/customer' }
]

const createWrapper = (props: any = {}) =>
  mount(PNavbar, {
    global: {
      plugins: [router],
      renderStubDefaultSlot: true
    },
    props: {
      ...props,
      pHandleClickEntity: () => {},
      pEntities,
      pMenuList
    }
  })

describe('display navbar', () => {
  it('displays a vertical navbar with entities list', () => {
    const wrapper: VueWrapper<any> = createWrapper()

    const elMenuItems = wrapper.findAll('.p-menu-item-entity')
    expect(elMenuItems).toHaveLength(pEntities.length)
    expect(elMenuItems[0].html()).contains(pEntities[0].pName)
    expect(elMenuItems[1].html()).contains(pEntities[1].pName)
  })

  it('navigates to /entity', async () => {
    const wrapper: VueWrapper<any> = createWrapper()

    const documentItem = wrapper.findAll('.el-menu-item')[1]
    await documentItem.trigger('click')
    expect(router.options.routes[0].path).toBe(routes[0].path)
  })

  it('can select by default an item', () => {
    const ACTIVE_CLASS = 'is-active'
    const wrapper: VueWrapper<any> = createWrapper({ pActiveIndex: '1' })

    const firstItem = wrapper.find('.el-menu-item:first-child')
    const lastItem = wrapper.find('.el-menu-item:last-child')
    expect(firstItem.attributes().class).not.toContain(ACTIVE_CLASS)
    expect(lastItem.attributes().class).toContain(ACTIVE_CLASS)
  })
})
