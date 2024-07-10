import { describe, expect, it, vi } from 'vitest'
import { createRouter, createWebHistory } from 'vue-router'
import type { VueWrapper } from '@vue/test-utils'
import { flushPromises, mount } from '@vue/test-utils'
import ExpireToken from './ExpireToken.vue'

const routes = [
  {
    path: '/expireToken',
    name: 'expireToken',
    component: {
      template: '<p class="page-title">ExpireToken</p>',
    },
  },
  {
    path: '/resendEmailSuccess',
    name: 'resendEmailSuccess',
    component: {
      template: '<p class="page-title">Resend email</p>',
    },
  },
]
const router = createRouter({
  history: createWebHistory(),
  routes,
})
router.push({
  path: '/expireToken',
  query: {
    accountId: 'accountIdSample',
    contactId: 'contactId',
  },
})
const createWrapper = () => {
  return mount(ExpireToken, {
    global: {
      plugins: [router],
    },
  })
}
const postMock = vi.fn(() => true)
vi.mock('@kpmg/common', () => ({
  commonApi: () => ({
    gateway: {
      post: postMock,
    },
  }),
}))
describe('page expire token', () => {
  it('should call endpoint when click on button', async () => {
    const wrapper: VueWrapper<any> = createWrapper()
    const spyRouter = vi.spyOn(wrapper.vm.router, 'push')
    const link = 'account/api/customers/contactId'
    wrapper.find('.btn-link').trigger('click')
    expect(postMock).toHaveBeenCalledTimes(1)
    expect(postMock).toHaveBeenCalledWith(link)
    await flushPromises()
    expect(spyRouter).toHaveBeenCalledTimes(1)
    expect(spyRouter).toHaveBeenCalledWith({ path: '/resendEmailSuccess' })
  })
})
