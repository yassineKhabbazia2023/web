import type { VueWrapper } from '@vue/test-utils'
import { flushPromises, mount } from '@vue/test-utils'
import { type SpyInstance, describe, expect, it, vi, beforeEach } from 'vitest'
import { createRouter, createWebHistory } from 'vue-router'
import { amplitudeService, tokenService } from '@kpmg/common'
import CreatePassword from './'
import { getLatestTerms, updateTermsByCurrentUser } from '@/services/cgu'

const mockToken = 'token'
const routes = [
  {
    path: '/expireToken',
    name: 'expireToken',
    component: {
      template: '<p class="page-title">ExpireToken</p>',
    },
  },
  {
    path: '/createPassword',
    name: 'createPassword',
    component: {
      template: '<p class="page-title">CreatePassword</p>',
    },
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})
router.push({
  name: 'createPassword',
  path: '/createPassword',
  query: {
    contactId: 'contactId',
    accountId: 'accountId',
    token: mockToken,
    email: 'email',
  },
})

const patchMock = vi.fn()
const postMock = vi.fn(() => ({ data: { webToken: mockToken } }))
const CGU_URL = 'https://custom-CGU.com'

vi.mock('@/services/cgu', () => ({
  updateTermsByCurrentUser: vi.fn(),
  getLatestTerms: vi.fn(),
}))

vi.mock('@kpmg/common', () => ({
  fetchUrlTerms: vi.fn(() => CGU_URL),
  commonApi: () => ({
    onboarding: {
      patch: patchMock,
    },
    gateway: {
      get: () => ({
        data: true,
      }),
      post: postMock,
    },
  }),
  tokenService: {
    getToken: vi.fn(),
    setToken: vi.fn(),
  },
  amplitudeService: {
    track: vi.fn(),
    reset: vi.fn(),
  },
}))

const createWrapper = () =>
  mount(CreatePassword, {
    global: {
      plugins: [router],
    },
  })

describe('page creation password', () => {
  let wrapper: VueWrapper<any>
  let spyTrackAmplitude: SpyInstance
  beforeEach(() => {
    spyTrackAmplitude = vi.spyOn(amplitudeService, 'track')
    wrapper = createWrapper()
  })
  it(
    'should track amplitude event when create password page displayed', () => {
      expect(spyTrackAmplitude).toHaveBeenCalledOnce()
      expect(spyTrackAmplitude).toHaveBeenCalledWith('Onboarding Email Accepted', {
        onboarding_email_click: '',
      })
    },
  )
  it(
    'should show error when user dont enter password and button submit is disabled',
    async () => {
      wrapper.findAll('.el-input__inner')[0].setValue('aaAA11@@')
      wrapper.find('.el-checkbox__original').setValue('true')
      await flushPromises()
      expect(wrapper.findAll('.is-error')).toHaveLength(1)
      expect(wrapper.find('button').classes()).toContain('is-disabled')
    },
  )

  it('should show error when user enter a invalid password', async () => {
    wrapper.findAll('.el-input__inner')[0].setValue('aaAA11aa')
    wrapper.findAll('.el-input__inner')[1].setValue('aaAA11aa')
    wrapper.find('.el-checkbox__original').setValue('true')
    await flushPromises()
    expect(wrapper.findAll('.is-error')).toHaveLength(1)
  })

  it('should show success when user enter password and valid cgu', async () => {
    wrapper.findAll('.el-input__inner')[0].setValue('aaAA11@@')
    wrapper.findAll('.el-input__inner')[1].setValue('aaAA11@@')
    wrapper.find('.el-checkbox__original').setValue('true')
    expect(wrapper.findAll('.is-error')).toHaveLength(0)
    await flushPromises()
    expect(wrapper.find('button').classes()).not.toContain('is-disabled')
  })

  it('should show error when user enter password and confirm password differently', async () => {
    wrapper.findAll('.el-input__inner')[0].setValue('aaAA11@@')
    wrapper.findAll('.el-input__inner')[1].setValue('different password')
    wrapper.find('.el-checkbox__original').setValue('true')
    await flushPromises()
    expect(wrapper.findAll('.is-error')).toHaveLength(1)
    expect(wrapper.find('button').classes()).toContain('is-disabled')
  })

  it('should call the API when the button is clicked and track an Amplitude event if the login fails', async () => {
    postMock.mockRejectedValue('API Error: 503 Service Unavailable')
    wrapper = createWrapper()
    await flushPromises()
    wrapper.findAll('.el-input__inner')[0].setValue('aaAA11@@')
    wrapper.findAll('.el-input__inner')[1].setValue('aaAA11@@')
    wrapper.find('.el-checkbox__original').setValue('true')
    await flushPromises()
    wrapper.find('button').trigger('click')
    await flushPromises()
    expect(spyTrackAmplitude).toHaveBeenCalledWith('Onboarding Completed', {
      onboarding_result: 'failed',
    })
  })

  it('should call API when the button is clicked and track an Amplitude event when the login succeeds', async () => {
    wrapper.findAll('.el-input__inner')[0].setValue('aaAA11@@')
    wrapper.findAll('.el-input__inner')[1].setValue('aaAA11@@')
    wrapper.find('.el-checkbox__original').setValue('true')
    await flushPromises()
    wrapper.find('button').trigger('click')
    const setTokenSpy = vi.spyOn(tokenService, 'setToken')
    vi.spyOn(tokenService, 'getToken').mockReturnValue(mockToken)
    await flushPromises()
    const postLink = 'authentication/api/createNewPassword'
    const loginLink = 'authentication/api/login'
    const data = {
      contactId: 'contactId',
      newPassword: 'aaAA11@@',
      resetPasswordToken: 'token',
    }
    const dataLogin = {
      email: 'email',
      password: 'aaAA11@@',
    }
    expect(spyTrackAmplitude).toHaveBeenNthCalledWith(2, 'Onboarding Completed', {
      onboarding_result: 'succeeded',
    })
    expect(updateTermsByCurrentUser).toHaveBeenCalledTimes(1)
    expect(postMock).toHaveBeenCalledTimes(2)
    expect(postMock).toHaveBeenNthCalledWith(1, postLink, data)
    expect(postMock).toHaveBeenNthCalledWith(2, loginLink, dataLogin)
    expect(setTokenSpy).toHaveBeenCalledWith(mockToken)
  })

  it('should throw error', async () => {
    vi.mocked(getLatestTerms).mockRejectedValue('Async error')
    wrapper = createWrapper()
    wrapper.findAll('.el-input__inner')[0].setValue('aaAA11@@')
    await flushPromises()
    await expect(getLatestTerms).rejects.toThrow('Async error')
  })

  it('should call last terms', async () => {
    wrapper = createWrapper()
    await flushPromises()
    expect(getLatestTerms).toHaveBeenCalled()
  })
})
