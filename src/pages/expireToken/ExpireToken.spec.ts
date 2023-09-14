import { describe, expect, it, vi } from 'vitest'
import { createRouter, createWebHistory } from 'vue-router'
import { VueWrapper, flushPromises, mount } from '@vue/test-utils'
import ExpireToken from './ExpireToken.vue'
import { waitForAsyncImports } from '@kpmg/common/src/testing-helpers'

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
      plugins: [router]
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
    const link = '/Activation/Invite?accountId=accountIdSample&contactId=contactIdSample'
    await waitForAsyncImports(30)
    wrapper.find('.btn-link').trigger('click')
    expect(postMock).toHaveBeenCalledTimes(1)
    expect(postMock).toHaveBeenCalledWith(link)
    await flushPromises()
    expect(spyRouter).toHaveBeenCalledTimes(1)
    expect(spyRouter).toHaveBeenCalledWith({ path: '/resendEmailSuccess' })
  })
})
