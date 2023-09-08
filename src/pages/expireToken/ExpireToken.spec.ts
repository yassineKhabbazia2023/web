import { describe, expect, it, vi } from 'vitest'
import { createRouter, createWebHistory } from 'vue-router'
import { VueWrapper, flushPromises, mount } from '@vue/test-utils'
import ExpireToken from './ExpireToken.vue'

const routes = [
  {
    path: '/expireToken',
    name: 'expireToken',
    component: {
      template: '<p class="page-title">ExpireToken</p>'
    }
  }]
const router = createRouter({
  history: createWebHistory(),
  routes
})
router.push({
  path: '/expireToken',
  query: {
    accountId: 'accountIdSample',
    contactId: 'contactIdSample'
  }
})
const createWrapper = () => {
  return mount(ExpireToken, {
    global: {
      plugins: [router],
      stubs: {
        PImage: { template: '<img />' },
        PButton: { template: '<button><slot /></button>' }
      }
    }
  })
}
const postMock = vi.fn(() => true)
vi.mock('@kpmg/common', async () => ({
  commonApi: () => ({
    onboarding: {
      post: postMock
    }
  })
}))
describe('page expirte token', () => {
  it('should call endpoint when click on button', async () => {
    const wrapper: VueWrapper<any> = createWrapper()
    const spyRouter = vi.spyOn(wrapper.vm.router, 'push')
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
    wrapper.find('.btn-link').trigger('click')
    expect(postMock).toHaveBeenCalledTimes(1)
    expect(postMock).toHaveBeenCalledWith('/Activation/Invite?accountId=accountIdSample&contactId=contactIdSample')
    await flushPromises()
    expect(spyRouter).toHaveBeenCalledTimes(1)
    expect(spyRouter).toHaveBeenCalledWith({ path: '/resendEmailSuccess' })
  })
})
