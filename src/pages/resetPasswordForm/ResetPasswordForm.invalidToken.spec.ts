import { VueWrapper, flushPromises, mount } from '@vue/test-utils'
import { describe, expect, it, vi, beforeEach } from 'vitest'
import { createRouter, createWebHistory } from 'vue-router'
import ResetPasswordForm from './'

const routes = [
  {
    path: '/expireToken',
    name: 'expireToken',
    component: {
      template: '<p class="page-title">ExpireToken</p>'
    }
  },
  {
    path: '/resetPasswordForm',
    name: 'resetPasswordForm',
    component: {
      template: '<p class="page-title">ResetPasswordForm</p>'
    }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})
router.push({
  path: '/resetPasswordForm',
  name: 'resetPasswordForm',
  query: {
    contactId: 'contactId',
    contactEmail: 'contactEmail',
    accountId: 'accountId',
    token: 'token'
  }
})

const createWrapper = () => {
  return mount(ResetPasswordForm, {
    global: {
      plugins: [router],
      stubs: [
        'PForm',
        'PFormItem',
        'PInput',
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

describe('page reset password form', () => {
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
      query: { contactEmail: 'contactEmail' }
    })
  })
})
