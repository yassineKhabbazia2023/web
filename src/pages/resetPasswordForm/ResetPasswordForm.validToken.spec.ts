import type { VueWrapper } from '@vue/test-utils'
import { flushPromises, mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import { createRouter, createWebHistory } from 'vue-router'
import ResetPasswordForm from './'

const routes = [
  {
    path: '/expireToken',
    name: 'expireToken',
    component: {
      template: '<p class="page-title">ExpireToken</p>',
    },
  },
  {
    path: '/resetPasswordForm',
    name: 'resetPasswordForm',
    component: {
      template: '<p class="page-title">ResetPasswordForm</p>',
    },
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})
router.push({
  name: 'resetPasswordForm',
  path: '/resetPasswordForm',
  query: {
    contactId: 'contactId',
    contactEmail: 'contactEmail',
    accountId: 'accountId',
    token: 'token',
  },
})

const postMock = vi.fn(() => ({ data: { webToken: 'token' } }))
vi.mock('@kpmg/common', () => ({
  commonApi: () => ({
    gateway: {
      post: postMock,
      get: () => ({
        data: true,
      }),
    },
  }),
}))

const createWrapper = () =>
  mount(ResetPasswordForm, {
    global: {
      plugins: [router],
    },
  })

describe('page reset password form', () => {
  it(
    'should show error when user dont enter password and button submit is disabled',
    async () => {
      const wrapper: VueWrapper<any> = createWrapper()
      wrapper.findAll('.el-input__inner')[0].setValue('aaAA11@@')
      await flushPromises()
      expect(wrapper.findAll('.is-error')).toHaveLength(1)
      expect(wrapper.find('button').classes()).toContain('is-disabled')
    },
  )

  it('should show error when user enter a invalid password', async () => {
    const wrapper: VueWrapper<any> = createWrapper()
    wrapper.findAll('.el-input__inner')[0].setValue('aaAA11aa')
    wrapper.findAll('.el-input__inner')[1].setValue('aaAA11aa')
    await flushPromises()
    expect(wrapper.findAll('.is-error')).toHaveLength(1)
  })

  it('should show success when user enter 2 password', async () => {
    const wrapper: VueWrapper<any> = createWrapper()
    wrapper.findAll('.el-input__inner')[0].setValue('aaAA11@@')
    wrapper.findAll('.el-input__inner')[1].setValue('aaAA11@@')
    expect(wrapper.findAll('.is-error')).toHaveLength(0)
    await flushPromises()
    expect(wrapper.find('button').classes()).not.toContain('is-disabled')
  })

  it('should show error when user enter password and confirm password differently', async () => {
    const wrapper: VueWrapper<any> = createWrapper()
    wrapper.findAll('.el-input__inner')[0].setValue('aaAA11@@')
    wrapper.findAll('.el-input__inner')[1].setValue('different password')
    await flushPromises()
    expect(wrapper.findAll('.is-error')).toHaveLength(1)
    expect(wrapper.find('button').classes()).toContain('is-disabled')
  })

  it('should call back end when click on button', async () => {
    const wrapper: VueWrapper<any> = createWrapper()
    const routerPushSpy = vi.spyOn(router, 'push')
    wrapper.findAll('.el-input__inner')[0].setValue('aaAA11@@')
    wrapper.findAll('.el-input__inner')[1].setValue('aaAA11@@')
    await flushPromises()
    wrapper.find('button').trigger('click')
    await flushPromises()

    const postLink = 'authentication/api/createNewPassword'
    const data = {
      contactId: 'contactId',
      password: 'aaAA11@@',
      resetPasswordToken: 'token',
      isCreatePasswordAction: false,
    }
    expect(postMock).toHaveBeenCalledTimes(1)
    expect(postMock).toHaveBeenCalledWith(postLink, data)

    expect(routerPushSpy).toHaveBeenCalledTimes(1)
    expect(routerPushSpy).toHaveBeenLastCalledWith({ name: 'loginClient' })
  })
})
