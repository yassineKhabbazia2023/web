import { VueWrapper, flushPromises, mount } from '@vue/test-utils'
import { describe, expect, it, vi, beforeEach } from 'vitest'
import { createRouter, createWebHistory } from 'vue-router'
import CreatePassword from './'

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

const router = createRouter({
  history: createWebHistory(),
  routes
})
router.push({
  path: '/createPassword',
  name: 'createPassword',
  query: {
    email: 'email',
    accountId: 'accountId',
    token: 'token'
  }
})

const createWrapper = () => {
  return mount(CreatePassword, {
    global: {
      plugins: [router],
      stubs: [
        'PForm',
        'PFormItem',
        'PInput',
        'PCheckbox',
        'PButton'
      ]
    }
  })
}

vi.mock('@kpmg/common', () => ({
  commonApi: () => ({
    onboarding: {
      get: () => ({
        data: false
      })
    }
  })
}))

describe('page creation password', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })
  it('should redirect to page expired link when token is expired', async () => {
    const wrapper: VueWrapper<any> = createWrapper()
    const spy = vi.spyOn(wrapper.vm.router, 'push')
    await vi.dynamicImportSettled()
    await flushPromises()
    expect(spy).toHaveBeenCalledTimes(1)
    expect(spy).toHaveBeenCalledWith({
      name: 'expireToken',
      query: { accountId: 'accountId', email: 'email' }
    })
  })
})
