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
  query: {
    email: 'email',
    accountId: 'accountId',
    pwrt: 'token'
  }
})

const patchMock = vi.fn()
const postMock = vi.fn(() => ({ data: { webToken: 'token' } }))
vi.mock('@kpmg/common', () => ({
  commonApi: () => ({
    onboarding: {
      get: () => ({
        data: true
      }),
      patch: patchMock
    },
    auth: {
      post: postMock
    }
  })
}))

const createWrapper = () => {
  return mount(CreatePassword, {
    global: {
      plugins: [router]
    }
  })
}

describe('page creation password', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })
  it(
    'should show error when user dont enter password and button submit is disabled',
    async () => {
      const wrapper: VueWrapper<any> = createWrapper()
      await vi.dynamicImportSettled()
      vi.advanceTimersByTime(1000)
      await flushPromises()
      expect(wrapper.findAll('.is-error')).toHaveLength(3)
      expect(wrapper.find('button').classes()).toContain('is-disabled')
    }
  )
  it('should show success when user enter password and valid cgu', async () => {
    const wrapper: VueWrapper<any> = createWrapper()
    await vi.dynamicImportSettled()
    await flushPromises()
    wrapper.findAll('.el-input__inner')[0].setValue('password')
    wrapper.findAll('.el-input__inner')[1].setValue('password')
    wrapper.find('.el-checkbox__original').setValue('true')
    expect(wrapper.findAll('.is-error')).toHaveLength(0)
    await flushPromises()
    expect(wrapper.find('button').classes()).not.toContain('is-disabled')
  })
  it('should show error when user enter password and confirm password differently', async () => {
    const wrapper: VueWrapper<any> = createWrapper()
    await vi.dynamicImportSettled()
    await flushPromises()
    wrapper.findAll('.el-input__inner')[0].setValue('password')
    wrapper.findAll('.el-input__inner')[1].setValue('different password')
    wrapper.find('.el-checkbox__original').setValue('true')
    await flushPromises()
    expect(wrapper.findAll('.is-error')).toHaveLength(1)
    expect(wrapper.find('button').classes()).toContain('is-disabled')
  })
  it('should call back end when click on button', async () => {
    const wrapper: VueWrapper<any> = createWrapper()
    await vi.dynamicImportSettled()
    wrapper.findAll('.el-input__inner')[0].setValue('password')
    wrapper.findAll('.el-input__inner')[1].setValue('password')
    wrapper.find('.el-checkbox__original').setValue('true')
    await flushPromises()
    wrapper.find('button').trigger('click')
    await flushPromises()
    const patchLink = '/Activation/AcceptTerms?email=' + 'email'
    const postLink = '/api/createPassword'
    const data = {
      email: 'email',
      password: 'password'
    }
    expect(patchMock).toHaveBeenCalledTimes(1)
    expect(patchMock).toHaveBeenCalledWith(patchLink)
    expect(postMock).toHaveBeenCalledTimes(1)
    expect(postMock).toHaveBeenCalledWith(postLink, data)
  })
})
