import { VueWrapper, flushPromises } from '@vue/test-utils'
import wrapperFactory from '../../../tests/utils/wrapperFactory'
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

const createWrapper = (props: any = {}) =>
  wrapperFactory(PNavbar, {
    global: {
      plugins: [router]
    },
    props
  })

describe('display navbar', () => {
  const entities = [
    { name: 'Restaurant Johnny s pizza', idAccount: 'idAccount', icon: 'PICupHot' },
    { name: 'Jean Levage', idAccount: 'idAccount 2', icon: 'PIShop' }
  ]

  const menuList = [
    { name: 'My entities', icon: 'PIGrid', path: '/entity' },
    { name: 'See customer view', icon: 'PIPersonVideo3', path: '/customer' }
  ]

  it('should display vertical navbar with entities list', () => {
    const wrapper: VueWrapper<any> = createWrapper({ entities })
    const elMenu = wrapper.find('.el-menu-vertical')
    const elMenuItems = elMenu.findAll('el-menu-item:not(.title)')

    expect(elMenu.exists()).toBeTruthy()
    expect(elMenuItems).toHaveLength(2)
    expect(elMenuItems[0].find('span').html()).contains(entities[0].name)
    expect(elMenuItems[1].find('span').html()).contains(entities[1].name)
  })

  it('should navigate to /entity', async () => {
    const wrapper: VueWrapper<any> = createWrapper({ entities, menuList })
    const documentItem = wrapper.findAll('el-menu-item')[1]
    documentItem.trigger('click')
    await flushPromises()
    expect(router.options.routes[0].path).toBe(routes[0].path)
  })
})

