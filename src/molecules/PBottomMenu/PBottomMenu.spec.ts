import { beforeEach, describe, expect, it } from 'vitest'
import { createRouter, createMemoryHistory } from 'vue-router'
import { flushPromises, mount, VueWrapper } from '@vue/test-utils'
import { ElMenuItem, ElMenu } from 'element-plus'
import { menu } from '@/constants/routesSamples'
import PBottomMenu from '.'
import type { PItem } from './PBottomMenuTypes'

const router = createRouter({
  history: createMemoryHistory(),
  routes: [{ path: '/', name: 'home', component: { render: () => null } }]
})
menu.forEach(route => router.addRoute(route))

let wrapper: VueWrapper<any>

describe('pBottomMenu', () => {
  beforeEach(() => {
    wrapper = mount(PBottomMenu, {
      global: {
        plugins: [router],
        components: {
          ElMenuItem,
          ElMenu
        }
      },
      props: {
        pItems: menu.map((m): PItem => {
          return {
            pPath: m.path,
            pName: m.name,
            pComponent: m.component,
            pIcon: m.meta.icon
          }
        })
      }
    })
  })

  it('has 2 items in the menu', async () => {
    router.push({ name: 'Dashboard' })
    await flushPromises()

    const items = wrapper.findAll('.el-menu > .el-menu-item')
    expect(items).toHaveLength(menu.length)

    expect(items[0].text()).toContain(menu[0].name)
    expect(items[1].text()).toContain(menu[1].name)
  })

  it('can navigate', async () => {
    const getCurrentLocation = () => router.options.history.location

    router.push({ name: 'Dashboard' })
    await flushPromises()

    expect(getCurrentLocation()).toBe(menu[0].path)

    const documentItem = wrapper.findAllComponents(ElMenuItem)[1]
    documentItem.trigger('click')
    await flushPromises()

    expect(getCurrentLocation()).toBe(menu[1].path)
    expect(documentItem.attributes('class')).toContain('is-active')
  })
})
