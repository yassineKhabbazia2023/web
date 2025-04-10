import { mount, flushPromises } from '@vue/test-utils'
import { type MockInstance, describe, expect, it, vi, beforeEach } from 'vitest'
import { cguServiceMock } from '@pulse/common/mocks'
import { loggerMock } from '@pulse/core/mocks'
import { navigateToCustomerWalletMock, useNavigationMock } from '@login/__mocks__/useNavigation.composable.mocks'
import { amplitudeService, tokenService } from '@pulse/common'
import { getLatestTerms, updateTermsByCurrentUser } from '@pulse/common/services/cgu'
import type { FormInstance } from 'element-plus'

import CreatePassword from './'

const mockToken = 'token'
const VALID_PASSWORD = 'aaAA11@@'

const postMock = vi.fn(() => ({ data: { webToken: mockToken } }))
const CGU_URL = 'https://custom-CGU.com'


vi.mock('@pulse/core', () => ({ logger: loggerMock }))
vi.mock('@pulse/common/services/cgu', () => cguServiceMock)
vi.mock('@login/composable/useNavigation', () => ({
  default: () => useNavigationMock,
}))

const mockStorePatch = vi.fn()
const createNewPasswordMock = vi.hoisted(() => vi.fn())
const loginMock = vi.hoisted(() => vi.fn())
const isInvitationTokenValidMock = vi.hoisted(() => vi.fn())

vi.mock('@pulse/common', () => ({
  createNewPassword: createNewPasswordMock,
  login: loginMock,
  isInvitationTokenValid: isInvitationTokenValidMock,
  fetchUrlTerms: vi.fn(() => CGU_URL),
  tokenService: {
    getToken: vi.fn(),
    setToken: vi.fn(),
  },
  amplitudeService: {
    track: vi.fn(),
    reset: vi.fn(),
  },
  commonStore: () => ({
    $patch: mockStorePatch,
  }),
}))

const routerPushMock = vi.hoisted(() => vi.fn())
const useRouterMock = vi.hoisted(() => vi.fn(() => ({
  push: routerPushMock,
})))

const useRouteMock = vi.hoisted(() => vi.fn(() => ({
  name: 'route-name',
  meta: {},
  query: {
    contactId: 'contactId' ,
    accountNumber: 'accountNumber' ,
    email: 'email',
    token: 'token',
  },
})))

vi.mock('vue-router', () => ({
  useRouter: useRouterMock,
  useRoute: useRouteMock,
}))

function createWrapper() {
  return mount(CreatePassword)
}

describe('page creation password', () => {
  let wrapper: ReturnType<typeof createWrapper>
  let spyTrackAmplitude: MockInstance
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
      wrapper.findAll('.el-input__inner')[0].setValue(VALID_PASSWORD)
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


  it('should show error when user enter an empty password', async () => {
    const firstInput = wrapper.find('[data-testid="create-password-first-password"]')
    const secondInput = wrapper.find('[data-testid="create-password-second-password"]')
    await firstInput.setValue('')
    await firstInput.trigger('blur')
    await secondInput.setValue('')
    await secondInput.trigger('blur')
    expect(wrapper.findAll('.is-error')).toHaveLength(2)
  })


  it('should disable submitButton when terms checkbox is not checked', async () => {
    const firstInput = wrapper.find('[data-testid="create-password-first-password"]')
    const secondInput = wrapper.find('[data-testid="create-password-second-password"]')
    await firstInput.setValue(VALID_PASSWORD)
    await secondInput.setValue(VALID_PASSWORD)

    const termsCheckbox = wrapper.find('[data-testid="create-password-terms-checkbox"] .el-checkbox__original')
    const submitButton = wrapper.find('[data-testid="create-password-submit-button"]')

    await termsCheckbox.setValue(true)
    expect(submitButton.attributes('disabled')).toBeUndefined()

    await termsCheckbox.setValue(false)
    expect(submitButton.attributes('disabled')).toBeDefined()
  })


  it('should show success when user enter password and valid cgu', async () => {
    wrapper.findAll('.el-input__inner')[0].setValue(VALID_PASSWORD)
    wrapper.findAll('.el-input__inner')[1].setValue(VALID_PASSWORD)
    wrapper.find('.el-checkbox__original').setValue('true')
    expect(wrapper.findAll('.is-error')).toHaveLength(0)
    await flushPromises()
    expect(wrapper.find('button').classes()).not.toContain('is-disabled')
  })


  it('should show error when user enter password and confirm password differently', async () => {
    wrapper.findAll('.el-input__inner')[0].setValue(VALID_PASSWORD)
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
    wrapper.findAll('.el-input__inner')[0].setValue(VALID_PASSWORD)
    wrapper.findAll('.el-input__inner')[1].setValue(VALID_PASSWORD)
    wrapper.find('.el-checkbox__original').setValue('true')
    await flushPromises()
    wrapper.find('button').trigger('click')
    await flushPromises()
    expect(spyTrackAmplitude).toHaveBeenCalledWith('Onboarding Completed', {
      onboarding_result: 'failed',
    })
  })


  it('should call API when the button is clicked and track an Amplitude when the login succeeds', async () => {
    const loginDataMock = {
      userId: 'user-id',
      webToken: mockToken,
    }
    loginMock.mockResolvedValue(loginDataMock)
    wrapper.findAll('.el-input__inner')[0].setValue(VALID_PASSWORD)
    wrapper.findAll('.el-input__inner')[1].setValue(VALID_PASSWORD)
    wrapper.find('.el-checkbox__original').setValue('true')
    await flushPromises()
    wrapper.find('button').trigger('click')
    const setTokenSpy = vi.spyOn(tokenService, 'setToken')
    vi.spyOn(tokenService, 'getToken').mockReturnValue(mockToken)
    await flushPromises()
    const data = {
      contactId: 'contactId',
      newPassword: VALID_PASSWORD,
    }
    const dataLogin = {
      email: 'email',
      password: VALID_PASSWORD,
    }
    expect(spyTrackAmplitude).toHaveBeenNthCalledWith(2, 'Onboarding Completed', {
      onboarding_result: 'succeeded',
    })
    expect(updateTermsByCurrentUser).toHaveBeenCalledTimes(1)
    expect(createNewPasswordMock).toHaveBeenCalledOnce()
    expect(createNewPasswordMock).toHaveBeenCalledWith(data)

    expect(loginMock).toHaveBeenCalledOnce()
    expect(loginMock).toHaveBeenCalledWith(dataLogin)

    expect(setTokenSpy).toHaveBeenCalledWith(mockToken)
    expect(navigateToCustomerWalletMock).toHaveBeenCalledOnce()
  })

  it('should throw error', async () => {
    vi.mocked(getLatestTerms).mockRejectedValue('Async error')
    wrapper = createWrapper()
    wrapper.findAll('.el-input__inner')[0].setValue(VALID_PASSWORD)
    await flushPromises()
    await expect(getLatestTerms).rejects.toThrow('Async error')
  })

  it('should call last terms', async () => {
    wrapper = createWrapper()
    await flushPromises()
    expect(getLatestTerms).toHaveBeenCalledWith()
  })

  it('do not call mockAuthPost when not form given to submitForm', async () => {
    wrapper = createWrapper()
    await wrapper.vm.submitForm(undefined)
    expect(postMock).not.toHaveBeenCalled()
  })

  it('do not call postMock when form is not valid', async () => {
    wrapper = createWrapper()
    const mockedForm = {
      validate: (done: any) => {
        done(false)
      },
    } as unknown as FormInstance
    await wrapper.vm.submitForm(mockedForm)
    expect(postMock).not.toHaveBeenCalled()
  })
})
