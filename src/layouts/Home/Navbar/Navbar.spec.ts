import { describe, expect, it } from 'vitest'
import { VueWrapper, mount } from '@vue/test-utils'
import Navbar from '.'
import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'home',
    redirect: ''
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
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
    const header = wrapper.find('.aside')

    expect(header.exists()).toBeTruthy()
  })
})
