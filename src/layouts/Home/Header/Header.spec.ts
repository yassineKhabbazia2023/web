import { describe, expect, it, vi } from 'vitest'
import { VueWrapper, flushPromises, mount } from '@vue/test-utils'
import Header from './'
import { RouteRecordRaw, createRouter, createWebHistory } from 'vue-router'
import { menu } from '../../../routes'

const router = createRouter({
  history: createWebHistory(),
  routes: []
})

menu.forEach(route => {
  router.addRoute((route as unknown) as RouteRecordRaw)
})

const createWrapper = () => mount(Header, {
  global: {
    stubs: {
      PHeader: {
        template: `<div class="el-menu--header">
          <slot name="logo" />
          <slot name="menu" />
          <slot name="header-right" />
        </div>`
      },
      PHeaderTabs: { template: '<div class="el-menu"><slot /></div>' },
      PImage: { template: '<div class="menu-item--logo"><slot /></div>' },
      PAvatar: { template: '<div class="el-avatar"><slot /></div>' },
      PToolbox: { template: '<div><slot /></div>' }
    },
    plugins: [router]
  }
})

describe('header', () => {
  it('should display header section', async () => {
    const wrapper: VueWrapper<any> = createWrapper()
    await wrapper.vm.$nextTick()
    await wrapper.vm.$nextTick()
    await wrapper.vm.$nextTick()
    await flushPromises()
    await flushPromises()
    await flushPromises()
    await vi.dynamicImportSettled()
    await vi.dynamicImportSettled()
    await vi.dynamicImportSettled()
    await vi.dynamicImportSettled()
    await vi.dynamicImportSettled()
    await vi.dynamicImportSettled()
    await vi.dynamicImportSettled()
    await vi.dynamicImportSettled()
    await vi.dynamicImportSettled()
    await vi.dynamicImportSettled()
    await vi.dynamicImportSettled()
    await vi.dynamicImportSettled()
    await vi.dynamicImportSettled()
    await vi.dynamicImportSettled()
    await vi.dynamicImportSettled()
    await vi.dynamicImportSettled()
    await vi.dynamicImportSettled()
    await vi.dynamicImportSettled()
    await wrapper.vm.$nextTick()
    await wrapper.vm.$nextTick()
    await flushPromises()
    await flushPromises()
    await vi.dynamicImportSettled()
    await vi.dynamicImportSettled()
    await vi.dynamicImportSettled()
    await vi.dynamicImportSettled()
    await vi.dynamicImportSettled()
    await vi.dynamicImportSettled()
    await vi.dynamicImportSettled()
    await vi.dynamicImportSettled()
    await vi.dynamicImportSettled()
    await vi.dynamicImportSettled()
    await vi.dynamicImportSettled()
    await vi.dynamicImportSettled()
    await vi.dynamicImportSettled()
    await vi.dynamicImportSettled()
    await vi.dynamicImportSettled()
    await vi.dynamicImportSettled()
    await vi.dynamicImportSettled()
    await vi.dynamicImportSettled()
    await vi.dynamicImportSettled()
    await vi.dynamicImportSettled()
    await vi.dynamicImportSettled()
    await vi.dynamicImportSettled()
    const header = wrapper.find('.el-menu--header')
    const logo = wrapper.find('.menu-item--logo')
    const avatar = wrapper.find('.el-avatar')

    expect(header.exists()).toBeTruthy()
    expect(logo.exists()).toBeTruthy()
    expect(avatar.exists()).toBeTruthy()
  })
})
