import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { nextTick } from 'vue'
import { cguServiceMock , mockedAmplitudeServiceTrack, mockedAmplitudeServiceSetNewUserProperty, mockedAmplitudeService , setTokenMock, tokenServiceMock } from '@pulse/common/mocks'
import { envVarsMock } from '@pulse/core/mocks'
import { useInitUserAuthMock } from '@login/__mocks__/useInitUserAuth.composable.mocks'
import type { ComponentWrapper } from '@login/__mocks__/component.wrapper'
import { flushPromises, mount } from '@vue/test-utils'
import { getTermsByCurrentUser } from '@pulse/common/services/cgu'
import { LoginRouteName, BackEndErrors } from '@pulse/common/constants'

import Login from './'

const USER_ID = 'customUserId'
const GIGYA_USER_ID = 'customGigyaUserId'
const WEB_TOKEN = 'customToken'

declare let window: {
  gigya: {
    accounts: {
      login: () => void,
    }
  }
} & Window

const mockGigyaAccountsLogin = vi.fn()
const mockStorePatch = vi.fn()
const mockRouterPush = vi.fn()
const loginMock = vi.hoisted(() => vi.fn())

window.gigya = {
  accounts: {
    login: mockGigyaAccountsLogin,
  },
}

vi.mock('env-vars', () => envVarsMock)

vi.mock('vue-router', () => ({
  useRouter: () => ({
    push: mockRouterPush,
  }),
}))

vi.mock('@pulse/common', () => ({
  login: loginMock,
  commonStore: () => ({
    $patch: mockStorePatch,
  }),
  tokenService: tokenServiceMock.TokenService.getInstance(),
  amplitudeService: mockedAmplitudeService,
}))
const initAuthClientMocked = vi.hoisted(() => vi.fn(() => {
  mockStorePatch({
    user: {
      id: USER_ID,
      isCollab: false,
    },
  })
  return { id: USER_ID }
}))
const setStoreGigyaUserIdMocked = vi.hoisted(() => vi.fn(() => {
  mockStorePatch({
    user: {
      gigyaUserId: GIGYA_USER_ID,
    },
  })
}))

vi.mock('@login/composable/useInitUserAuth', () => ({
  default: () => ({
    ...useInitUserAuthMock,
    initAuthClient: initAuthClientMocked,
    setStoreGigyaUserId: setStoreGigyaUserIdMocked,
  }),
}))

vi.mock('@pulse/common/services/cgu', () => cguServiceMock)

const createWrapper = (): ComponentWrapper<InstanceType <typeof Login>> =>
  mount(Login, {
    global: {
      stubs: {
        'router-link': {
          template: '<div><slot /></div>',
        },
      },
    },
  })

let wrapper: ReturnType<typeof createWrapper>

const getInputEmail = () => wrapper.find('[data-testid="login-input-email"]')
const getInputPassword = () => wrapper.find('[data-testid="login-input-password"]')

const INPUT_EMAIL_VALUE = 'customEmail@aol.com'
const INPUT_PASSWORD_VALUE = 'customPassword'

describe('login', () => {
  beforeEach(() => {
    loginMock.mockResolvedValue({
      userId: USER_ID,
      webToken: WEB_TOKEN,
      email: 'email-mock',
    })
    wrapper = createWrapper()
  })

  afterEach(() => {
    wrapper.unmount()
  })

  it('fill the login page and has a redirection to the home page', async () => {
    await getInputEmail().setValue(INPUT_EMAIL_VALUE)
    await getInputPassword().setValue(INPUT_PASSWORD_VALUE)

    const submitButton = wrapper.find('[data-testid="login-submit-button"]')
    await submitButton.trigger('click')
    await flushPromises()
    const expectedPayload = {
      email: INPUT_EMAIL_VALUE,
      password: INPUT_PASSWORD_VALUE,
    }

    const loginErrorMessage = wrapper.find('[data-testid="login-error-message"]')
    expect(loginErrorMessage.exists()).toBeFalsy()

    expect(loginMock).toHaveBeenCalledTimes(1)
    expect(loginMock).toHaveBeenCalledWith(expectedPayload)

    expect(mockStorePatch).toHaveBeenCalledTimes(2)
    expect(mockStorePatch).toHaveBeenCalledWith({
      user: {
        id: USER_ID,
        isCollab: false,
      },
    })
    expect(mockGigyaAccountsLogin).toHaveBeenCalledOnce()
    expect(mockGigyaAccountsLogin).toHaveBeenCalledWith({
      loginID: INPUT_EMAIL_VALUE,
      password: INPUT_PASSWORD_VALUE,
    })
    expect(mockStorePatch).toHaveBeenCalledWith({
      user: {
        gigyaUserId: GIGYA_USER_ID,
      },
    })
    expect(mockedAmplitudeServiceSetNewUserProperty).toHaveBeenCalledOnce()
    expect(mockedAmplitudeServiceSetNewUserProperty).toHaveBeenCalledWith('user_type', 'Client')
    expect(mockedAmplitudeServiceTrack).toHaveBeenCalledOnce()
    expect(mockedAmplitudeServiceTrack).toHaveBeenCalledWith('Sign In Completed', {
      sign_in_method: 'email',
      sign_in_result: 'succeeded',
    })
    expect(setTokenMock).toHaveBeenNthCalledWith(1, WEB_TOKEN)
    expect(mockRouterPush).toHaveBeenCalledWith({ name: 'wallet-client' })
  })

  it('does not redirect to the home page if the api return a WRONG_LOGIN_PASSWORD error', async () => {
    loginMock.mockRejectedValueOnce({
      response: {
        data: {
          errorCode: BackEndErrors.WRONG_LOGIN_PASSWORD,
        },
      },
    })
    const expectedErrorMessage = 'The e-mail address and password combination is incorrect'

    await getInputEmail().setValue(INPUT_EMAIL_VALUE)
    await getInputPassword().setValue(INPUT_PASSWORD_VALUE)

    const submitButton = wrapper.find('[data-testid="login-submit-button"]')
    await submitButton.trigger('click')
    await flushPromises()
    await nextTick()

    const pFormItems = wrapper.findAllComponents({ name: 'PFormItem' })
    const firstFormItemProps = pFormItems.at(0)!.props()
    const secondFormItemProps = pFormItems.at(1)!.props()

    expect(firstFormItemProps['pError']).toBe(expectedErrorMessage)
    expect(firstFormItemProps['pShowMessage']).toBe(false)

    expect(secondFormItemProps['pError']).toBe(expectedErrorMessage)
    expect(secondFormItemProps['pShowMessage']).toBe(true)

    expect(mockedAmplitudeServiceSetNewUserProperty).toHaveBeenCalledOnce()
    expect(mockedAmplitudeServiceSetNewUserProperty).toHaveBeenCalledWith('user_type', 'Client')
    expect(mockedAmplitudeServiceTrack).toHaveBeenCalledOnce()
    expect(mockedAmplitudeServiceTrack).toHaveBeenCalledWith('Sign In Completed', {
      sign_in_method: 'email',
      sign_in_result: 'failed',
    })
    expect(mockRouterPush).not.toHaveBeenCalled()

    const pInput = wrapper.findComponent({ name: 'PInput' })
    pInput.vm.$emit('input')
    await nextTick()

    const loginErrorMessageAfter = wrapper.find('[data-testid="login-error-message"]')
    expect(loginErrorMessageAfter.exists()).toBeFalsy()
  })

  it('does not redirect to the home page if the api return empty response', async () => {
    loginMock.mockResolvedValueOnce({})
    await getInputEmail().setValue('error@aol.com')
    await getInputPassword().setValue('error')

    const submitButton = wrapper.find('[data-testid="login-submit-button"]')
    await submitButton.trigger('click')
    await flushPromises()

    const expectedErrorMessage = 'A technical error occurred.'

    const pFormItems = wrapper.findAllComponents({ name: 'PFormItem' })
    const firstFormItemProps = pFormItems.at(0)!.props()
    const secondFormItemProps = pFormItems.at(1)!.props()

    expect(firstFormItemProps['pError']).toBe(expectedErrorMessage)
    expect(firstFormItemProps['pShowMessage']).toBe(false)

    expect(secondFormItemProps['pError']).toBe(expectedErrorMessage)
    expect(secondFormItemProps['pShowMessage']).toBe(true)

    expect(mockedAmplitudeServiceSetNewUserProperty).toHaveBeenCalledOnce()
    expect(mockedAmplitudeServiceSetNewUserProperty).toHaveBeenCalledWith('user_type', 'Client')
    expect(mockedAmplitudeServiceTrack).toHaveBeenCalledOnce()
    expect(mockedAmplitudeServiceTrack).toHaveBeenCalledWith('Sign In Completed', {
      sign_in_method: 'email',
      sign_in_result: 'failed',
    })
    expect(mockRouterPush).not.toHaveBeenCalled()

    const pInput = wrapper.findComponent({ name: 'PInput' })
    pInput.vm.$emit('input')
    await nextTick()

    const loginErrorMessageAfter = wrapper.find('[data-testid="login-error-message"]')
    expect(loginErrorMessageAfter.exists()).toBeFalsy()
  })

  it('does display error message if the api return an unkown error', async () => {
    loginMock.mockRejectedValueOnce({
      response: {
        data: {
          errorCode: 'unkown',
        },
      },
    })
    const expectedErrorMessage = 'A technical error occurred.'

    await getInputEmail().setValue('error@aol.com')
    await getInputPassword().setValue('error')

    const submitButton = wrapper.find('[data-testid="login-submit-button"]')
    await submitButton.trigger('click')
    await flushPromises()

    const pFormItems = wrapper.findAllComponents({ name: 'PFormItem' })
    const firstFormItemProps = pFormItems.at(0)!.props()
    const secondFormItemProps = pFormItems.at(1)!.props()

    expect(firstFormItemProps['pError']).toBe(expectedErrorMessage)
    expect(firstFormItemProps['pShowMessage']).toBe(false)

    expect(secondFormItemProps['pError']).toBe(expectedErrorMessage)
    expect(secondFormItemProps['pShowMessage']).toBe(true)

    expect(mockedAmplitudeServiceSetNewUserProperty).toHaveBeenCalledOnce()
    expect(mockedAmplitudeServiceSetNewUserProperty).toHaveBeenCalledWith('user_type', 'Client')
    expect(mockedAmplitudeServiceTrack).toHaveBeenCalledOnce()
    expect(mockedAmplitudeServiceTrack).toHaveBeenCalledWith('Sign In Completed', {
      sign_in_method: 'email',
      sign_in_result: 'failed',
    })
    expect(mockRouterPush).not.toHaveBeenCalled()

    const pInput = wrapper.findComponent({ name: 'PInput' })
    pInput.vm.$emit('input')
    await nextTick()

    const loginErrorMessageAfter = wrapper.find('[data-testid="login-error-message"]')
    expect(loginErrorMessageAfter.exists()).toBeFalsy()
  })

  it('give empty values in form', async () => {
    const inputEmail = getInputEmail()
    const inputPassword = getInputPassword()

    inputEmail.setValue('')
    inputPassword.setValue('')

    await inputEmail.trigger('blur')
    await inputPassword.trigger('blur')

    const submitButton = wrapper.find('[data-testid="login-submit-button"]')
    await submitButton.trigger('click')
    await flushPromises()

    const loginErrorMessage = wrapper.find('[data-testid="login-error-message"]')
    const pSkewedButton = wrapper.findComponent({ name: 'PSkewedButton' })
    expect(pSkewedButton.props('pDisabled')).toBeTruthy()
    expect(loginErrorMessage.exists()).toBeFalsy()
    expect(mockedAmplitudeServiceSetNewUserProperty).not.toHaveBeenCalled()
    expect(mockedAmplitudeServiceTrack).not.toHaveBeenCalled()
    expect(mockRouterPush).not.toHaveBeenCalled()
  })

  it('give none valid email form', async () => {
    const inputEmail = getInputEmail()
    const inputPassword = getInputPassword()
    inputEmail.setValue('invalid-email')
    inputPassword.setValue(INPUT_PASSWORD_VALUE)

    const submitButton = wrapper.find('[data-testid="login-submit-button"]')
    await submitButton.trigger('click')
    await flushPromises()

    const loginErrorMessage = wrapper.find('[data-testid="login-error-message"]')
    const pSkewedButton = wrapper.findComponent({ name: 'PSkewedButton' })
    expect(pSkewedButton.props('pDisabled')).toBeTruthy()
    expect(loginErrorMessage.exists()).toBeFalsy()
    expect(mockedAmplitudeServiceSetNewUserProperty).not.toHaveBeenCalled()
    expect(mockedAmplitudeServiceTrack).not.toHaveBeenCalled()
    expect(mockRouterPush).not.toHaveBeenCalled()
  })

  it('has a link to resetPassword page', () => {
    const forgotPasswordBtn = wrapper.find('.forgot-password-btn')
    expect(forgotPasswordBtn.attributes('to')).toBe('/resetPassword')
  })

  it('should route to cgu validation page', async () => {
    vi.mocked(getTermsByCurrentUser).mockResolvedValueOnce({
      isCurrent: false,
      hasAcceptedBefore: false,
      terms: {
        termsId: 123456,
        linkFr: 'link-fr',
        linkEn: 'link-en',
        uploadDate: '2024-06-19T14:37:18',
      },
    })
    await getInputEmail().setValue(INPUT_EMAIL_VALUE)
    await getInputPassword().setValue(INPUT_PASSWORD_VALUE)

    const submitButton = wrapper.find('[data-testid="login-submit-button"]')
    await submitButton.trigger('click')
    await flushPromises()

    expect(mockRouterPush).toHaveBeenCalledWith({
      name: LoginRouteName.CGU_VALIDATION,
      params: { termsId: 123456 },
    })
  })

  it('does not call login() when handleSubmit is called without form', async () => {
    const submitButton = wrapper.find('[data-testid="login-submit-button"]')
    await submitButton.trigger('click')
    await flushPromises()
    expect(loginMock).not.toHaveBeenCalled()
  })

  it('does not call login() when form throws an exception', async () => {
    const pSkewedButton = wrapper.findComponent({ name: 'PSkewedButton' })
    pSkewedButton.vm.$emit('click')

    expect(loginMock).not.toHaveBeenCalled()
  })

  it('does not call login() when initAuthClient returns a 403042 error', async () => {
    const pSkewedButton = wrapper.findComponent({ name: 'PSkewedButton' })
    pSkewedButton.vm.$emit('click')

    expect(loginMock).not.toHaveBeenCalled()
  })

  it('does not call login() when initAuthClient returns an unknown error', async () => {
    loginMock.mockRejectedValueOnce({
      error: {
        code: 'unknown',
      },
    })
    const pSkewedButton = wrapper.findComponent({ name: 'PSkewedButton' })
    pSkewedButton.vm.$emit('click')

    expect(loginMock).not.toHaveBeenCalled()
  })

  it('does not call login() when not form given to handleSubmit', async () => {
    const pSkewedButton = wrapper.findComponent({ name: 'PSkewedButton' })
    pSkewedButton.vm.$emit('click')

    expect(loginMock).not.toHaveBeenCalled()
  })

  it('does not call login() when empty object given to handleSubmit', async () => {
    const pSkewedButton = wrapper.findComponent({ name: 'PSkewedButton' })
    pSkewedButton.vm.$emit('click')
    await nextTick()

    expect(loginMock).not.toHaveBeenCalledOnce()
  })
})
