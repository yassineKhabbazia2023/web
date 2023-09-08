import { VueWrapper, mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import { createRouter, createWebHistory } from 'vue-router'
import CreatePassword from './CreatePassword.vue'

const routes = [
  {
    path: '/expireToken',
    name: 'expireToken',
    component: {
      template: '<p class="page-title">ExpireToken</p>'
    }
  },
  {
    path: '/createPassword',
    name: 'createPassword',
    component: {
      template: '<p class="page-title">CreatePassword</p>'
    }
  }
]
vi.mock('@kpmg/common', async () => ({
  commonApi: () => ({
    onboarding: {
      get: () => ({
        data: false
      })
    }
  })
}))

const router = createRouter({
  history: createWebHistory(),
  routes
})
router.push({
  path: '/createPassword',
  query: {
    contactId: 'contactId',
    accountid: 'accountId',
    pwrt: 'token'
  }
})

const createWrapper = () => {
  return mount(CreatePassword, {
    global: {
      plugins: [router]
    }
  })
}

describe('page creation password', () => {
  it('should redirect to page expired link when token is expired', async () => {
    const wrapper: VueWrapper<any> = createWrapper()
    const spy = vi.spyOn(wrapper.vm.router, 'push')
    await vi.dynamicImportSettled()
    expect(spy).toHaveBeenCalledTimes(1)
    expect(spy).toHaveBeenCalledWith({
      path: '/expireToken',
      query: { accountId: 'accountId', contactId: 'contactId' }
    })
  })
})
