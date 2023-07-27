import { beforeEach, describe, expect, it } from 'vitest'
import { createRouter, createWebHistory } from 'vue-router'
import { flushPromises, mount, VueWrapper } from '@vue/test-utils'
import { ElMenuItem, ElMenu } from 'element-plus'
import PBottomMenu from '.'

const routes = [
  {
    path: '/',
    name: 'dashboard',
    component: {
      template: '<p class="pageTitle">Dashboard</p>'
    }
  },
  {
    path: '/document',
    name: 'document',
    component: {
      template: '<p class="pageTitle">Document</p>'
    }
  }
]

const ITEMS = [
  {
    icon: 'PIDashboard',
    text: 'Dashboard',
    path: '/'
  },
  {
    icon: 'PIFiles',
    text: 'Document',
    path: '/document'
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

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
        items: ITEMS
      }
    })
  })

  it('it has 2 items in the menu', async () => {
    router.push({ name: 'dashboard' })
    await flushPromises()

    const items = wrapper.findAll('.el-menu > .el-menu-item')
    expect(items).toHaveLength(ITEMS.length)

    expect(items[0].text()).toContain(ITEMS[0].text)
    expect(items[1].text()).toContain(ITEMS[1].text)
  })

  it('can navigate', async () => {
    const getCurrentLocation = () => router.options.history.location

    router.push({ name: 'dashboard' })
    await flushPromises()

    expect(getCurrentLocation()).toBe(ITEMS[0].path)

    const documentItem = wrapper.findAllComponents(ElMenuItem)[1]
    documentItem.trigger('click')
    await flushPromises()

    expect(getCurrentLocation()).toBe(ITEMS[1].path)
    expect(documentItem.attributes('class')).toContain('is-active')
  })
})
