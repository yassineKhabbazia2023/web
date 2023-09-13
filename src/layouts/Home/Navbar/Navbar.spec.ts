import { describe, expect, it } from 'vitest'
import { VueWrapper, mount } from '@vue/test-utils'
import Navbar from '.'
import { RouteRecordRaw, createRouter, createWebHistory } from 'vue-router'
import { menu } from '../../../routes'

const router = createRouter({
  history: createWebHistory(),
  routes: []
})

menu.forEach(route => {
  router.addRoute((route as unknown) as RouteRecordRaw)
})

const createWrapper = () => mount(Navbar, {
  shallow: true,
  global: {
    stubs: {
      PNavbar: {
        template: `<div class="el-menu">
          <slot name="title" />
          <slot />
        </div>`
      }
    },
    plugins: [router]
  }
})

describe('navbar', () => {
  it('should display navbar section', () => {
    const wrapper: VueWrapper<any> = createWrapper()
    const aside = wrapper.find('.aside')

    expect(aside.exists()).toBeTruthy()
  })
})
