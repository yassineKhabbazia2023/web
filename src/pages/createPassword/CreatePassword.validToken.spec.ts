import { VueWrapper, flushPromises, mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
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
  name: 'createPassword',
  path: '/createPassword',
  query: {
    contactId: 'contactId',
    accountId: 'accountId',
    token: 'token',
    email: 'email'
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

const createWrapper = () =>
  mount(CreatePassword, {
    global: {
      plugins: [router]
    }
  })

describe('page creation password', () => {
  it(
    'should show error when user dont enter password and button submit is disabled',
    async () => {
      const wrapper: VueWrapper<any> = createWrapper()
      wrapper.findAll('.el-input__inner')[0].setValue('aaAA11@@')
      wrapper.find('.el-checkbox__original').setValue('true')
      await flushPromises()
      expect(wrapper.findAll('.is-error')).toHaveLength(1)
      expect(wrapper.find('button').classes()).toContain('is-disabled')
    }
  )

  it('should show error when user enter a invalid password', async () => {
    const wrapper: VueWrapper<any> = createWrapper()
    wrapper.findAll('.el-input__inner')[0].setValue('aaAA11aa')
    wrapper.findAll('.el-input__inner')[1].setValue('aaAA11aa')
    wrapper.find('.el-checkbox__original').setValue('true')
    await flushPromises()
    expect(wrapper.findAll('.is-error')).toHaveLength(1)
  })

  it('should show success when user enter password and valid cgu', async () => {
    const wrapper: VueWrapper<any> = createWrapper()
    wrapper.findAll('.el-input__inner')[0].setValue('aaAA11@@')
    wrapper.findAll('.el-input__inner')[1].setValue('aaAA11@@')
    wrapper.find('.el-checkbox__original').setValue('true')
    expect(wrapper.findAll('.is-error')).toHaveLength(0)
    await flushPromises()
    expect(wrapper.find('button').classes()).not.toContain('is-disabled')
  })

  it('should show error when user enter password and confirm password differently', async () => {
    const wrapper: VueWrapper<any> = createWrapper()
    wrapper.findAll('.el-input__inner')[0].setValue('aaAA11@@')
    wrapper.findAll('.el-input__inner')[1].setValue('different password')
    wrapper.find('.el-checkbox__original').setValue('true')
    await flushPromises()
    expect(wrapper.findAll('.is-error')).toHaveLength(1)
    expect(wrapper.find('button').classes()).toContain('is-disabled')
  })

  it('should call back end when click on button', async () => {
    const wrapper: VueWrapper<any> = createWrapper()
    wrapper.findAll('.el-input__inner')[0].setValue('aaAA11@@')
    wrapper.findAll('.el-input__inner')[1].setValue('aaAA11@@')
    wrapper.find('.el-checkbox__original').setValue('true')
    await flushPromises()
    wrapper.find('button').trigger('click')
    await flushPromises()
    const patchLink = '/Activation/AcceptTerms?contactId=contactId'
    const postLink = '/createResetPassword'
    const loginLink = '/login'
    const data = {
      contactId: 'contactId',
      password: 'aaAA11@@',
      resetPasswordToken: 'token'
    }
    const dataLogin = {
      email: 'email',
      password: 'aaAA11@@'
    }
    expect(patchMock).toHaveBeenCalledTimes(1)
    expect(patchMock).toHaveBeenCalledWith(patchLink)
    expect(postMock).toHaveBeenCalledTimes(2)
    expect(postMock).toHaveBeenNthCalledWith(1, postLink, data)
    expect(postMock).toHaveBeenNthCalledWith(2, loginLink, dataLogin)
  })
})
