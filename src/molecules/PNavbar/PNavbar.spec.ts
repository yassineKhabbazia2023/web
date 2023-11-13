import { VueWrapper, flushPromises } from '@vue/test-utils'
import wrapperFactory from '../../../tests/utils/wrapperFactory'
import { createRouter, createMemoryHistory } from 'vue-router'
import { describe, it, expect } from 'vitest'
import PNavbar from '.'
import { nextTick } from 'vue'

const routes = [
  { path: '/entity', component: { render: () => '<div>Entity</div>' } }
]
const router = createRouter({
  history: createMemoryHistory(),
  routes
})

const createWrapper = (props: any = {}) =>
  wrapperFactory(PNavbar, {
    global: {
      plugins: [router],
      renderStubDefaultSlot: true
    },
    props
  })

describe('display navbar', () => {
  const pEntities = [
    { pName: 'Restaurant Johnny s pizza', pIdAccount: 'idAccount', pIcon: 'PICupHot' },
    { pName: 'Jean Levage', pIdAccount: 'idAccount 2', pIcon: 'PIShop' }
  ]

  const pMenuList = [
    { pName: 'My entities', pIcon: 'PIGrid', pPath: '/entity' },
    { pName: 'See customer view', pIcon: 'PIPersonVideo3', pPath: '/customer' }
  ]

  it('should display vertical navbar with entities list', async () => {
    const wrapper: VueWrapper<any> = createWrapper({ pEntities })
    await nextTick()
    const elMenu = wrapper.find('.el-menu--navbar')
    const elMenuItems = elMenu.findAll('el-menu-item-stub:not(.el-menu-item--title)')

    expect(elMenu.exists()).toBeTruthy()
    expect(elMenuItems).toHaveLength(2)
    expect(elMenuItems[0].html()).contains(pEntities[0].pName)
    expect(elMenuItems[1].html()).contains(pEntities[1].pName)
  })

  it('should navigate to /entity', async () => {
    const wrapper: VueWrapper<any> = createWrapper({ pEntities, pMenuList })
    const documentItem = wrapper.findAll('el-menu-item-stub')[1]
    documentItem.trigger('click')
    await flushPromises()
    expect(router.options.routes[0].path).toBe(routes[0].path)
  })
})

