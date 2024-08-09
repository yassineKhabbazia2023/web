import { afterEach, beforeEach, describe, expect, it, vi, type SpyInstance } from 'vitest'
import type { ComponentWrapper } from '@/pages/testHelper/testHelperTypes'
import { flushPromises, mount } from '@vue/test-utils'
import Login from './'
import { amplitudeService, tokenService } from '@kpmg/common'
import { getTermsByCurrentUser } from '@/services/cgu'
import type { FormInstance } from 'element-plus'

const USER_ID = 'customUserId'
const GIGYA_USER_ID = 'customGigyaUserId'
const WEB_TOKEN = 'customToken'

const mockStorePatch = vi.fn()
const mockRouterPush = vi.fn()
const mockAuthPost = vi.fn((_url, { _email, password }) => {
  return password === 'error'
    // eslint-disable-next-line prefer-promise-reject-errors
    ? Promise.reject({
      response: {
        data: {
          errorCode: '403042',
        },
      },
    })
    : Promise.resolve({
      data: {
        userId: USER_ID,
        webToken: WEB_TOKEN,
        email: _email,
      },
    })
})

vi.mock('vue-router', () => ({
  useRouter: () => ({
    push: mockRouterPush,
  }),
}))

vi.mock('@kpmg/common', () => ({
  commonApi: () => ({
    gateway: {
      post: mockAuthPost,
    },
  }),
  commonStore: () => ({
    $patch: mockStorePatch,
  }),
  tokenService: {
    setToken: vi.fn(),
  },
  amplitudeService: {
    track: vi.fn(),
    reset: vi.fn(),
    setNewUserProperty: vi.fn(),
  },
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

vi.mock('@/composable/useInitUserAuth', () => ({
  default: () => ({
    initAuthClient: initAuthClientMocked,
    setStoreGigyaUserId: vi.fn(() => {
      mockStorePatch({
        user: {
          gigyaUserId: GIGYA_USER_ID,
        },
      })
    }),
  }),
}))

vi.mock('@/services/cgu', () => ({
  getTermsByCurrentUser: vi
    .fn(() => Promise.resolve({
      isCurrent: true,
      terms: {
        termsId: '123456',
      },
    })),
}))
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
  let spyTrackAmplitude: SpyInstance
  let spySetNewUserPropertyAmplitude: SpyInstance
  beforeEach(() => {
    spyTrackAmplitude = vi.spyOn(amplitudeService, 'track')
    spySetNewUserPropertyAmplitude = vi.spyOn(amplitudeService, 'setNewUserProperty')
    wrapper = createWrapper()
  })

  afterEach(() => {
    wrapper.unmount()
  })

  it('fill the login page and has a redirection to the home page', async () => {
    const setTokenSpy = vi.spyOn(tokenService, 'setToken')

    await getInputEmail().setValue(INPUT_EMAIL_VALUE)
    await getInputPassword().setValue(INPUT_PASSWORD_VALUE)

    const submitButton = wrapper.find('.buttonSubmit')
    await submitButton.trigger('click')
    await flushPromises()

    const loginErrorMessage = wrapper.find('[data-testid="login-error-message"]')
    expect(loginErrorMessage.exists()).toBeFalsy()

    expect(mockAuthPost).toHaveBeenCalledTimes(1)
    expect(mockAuthPost).toHaveBeenCalledWith('authentication/api/login', {
      email: INPUT_EMAIL_VALUE,
      password: INPUT_PASSWORD_VALUE,
    })

    expect(mockStorePatch).toHaveBeenCalledTimes(2)
    expect(mockStorePatch).toHaveBeenCalledWith({
      user: {
        id: USER_ID,
        isCollab: false,
      },
    })
    expect(mockStorePatch).toHaveBeenCalledWith({
      user: {
        gigyaUserId: GIGYA_USER_ID,
      },
    })
    expect(spySetNewUserPropertyAmplitude).toHaveBeenCalledOnce()
    expect(spySetNewUserPropertyAmplitude).toHaveBeenCalledWith('user_type', 'Client')
    expect(spyTrackAmplitude).toHaveBeenCalledOnce()
    expect(spyTrackAmplitude).toHaveBeenCalledWith('Sign In Completed', {
      sign_in_method: 'email',
      sign_in_result: 'succeeded',
    })
    expect(setTokenSpy).toHaveBeenNthCalledWith(1, WEB_TOKEN)
    expect(mockRouterPush).toHaveBeenCalledWith({ name: 'wallet-client' })
  })

  it('does not redirect to the home page if the api return an error', async () => {
    await getInputEmail().setValue('error@aol.com')
    await getInputPassword().setValue('error')

    const submitButton = wrapper.find('.buttonSubmit')
    await submitButton.trigger('click')
    await flushPromises()

    const loginErrorMessage = wrapper.find('[data-testid="login-error-message"]')
    const expectedErrorMessage = 'The email and password combination is incorrect.'
    expect(loginErrorMessage.text()).toBe(expectedErrorMessage)
    expect(spySetNewUserPropertyAmplitude).toHaveBeenCalledOnce()
    expect(spySetNewUserPropertyAmplitude).toHaveBeenCalledWith('user_type', 'Client')
    expect(spyTrackAmplitude).toHaveBeenCalledOnce()
    expect(spyTrackAmplitude).toHaveBeenCalledWith('Sign In Completed', {
      sign_in_method: 'email',
      sign_in_result: 'failed',
    })
    expect(mockRouterPush).not.toHaveBeenCalled()
  })

  it('give empty values in form', async () => {
    const inputEmail = getInputEmail()
    const inputPassword = getInputPassword()

    inputEmail.setValue('')
    inputPassword.setValue('')

    await inputEmail.trigger('blur')
    await inputPassword.trigger('blur')

    const submitButton = wrapper.find('.buttonSubmit')
    await submitButton.trigger('click')
    await flushPromises()

    const loginErrorMessage = wrapper.find('[data-testid="login-error-message"]')
    expect(submitButton.attributes('disabled')).toBeDefined()
    expect(loginErrorMessage.exists()).toBeFalsy()
    expect(spySetNewUserPropertyAmplitude).not.toHaveBeenCalled()
    expect(spyTrackAmplitude).not.toHaveBeenCalled()
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
    expect(submitButton.attributes('disabled')).toBeDefined()
    expect(loginErrorMessage.exists()).toBeFalsy()
    expect(spySetNewUserPropertyAmplitude).not.toHaveBeenCalled()
    expect(spyTrackAmplitude).not.toHaveBeenCalled()
    expect(mockRouterPush).not.toHaveBeenCalled()
  })

  it('has a link to resetPassword page', () => {
    const forgotPasswordBtn = wrapper.find('.forgot-password-btn')
    expect(forgotPasswordBtn.attributes('to')).toBe('/resetPassword')
  })

  it('should route to cgu validation page', async () => {
    vi.mocked(getTermsByCurrentUser).mockResolvedValueOnce({
      isCurrent: false,
      terms: {
        termsId: 123456,
      },
    })
    await getInputEmail().setValue(INPUT_EMAIL_VALUE)
    await getInputPassword().setValue(INPUT_PASSWORD_VALUE)

    const submitButton = wrapper.find('[data-testid="login-submit-button"]')
    await submitButton.trigger('click')
    await flushPromises()

    expect(mockRouterPush).toHaveBeenCalledWith({
      name: 'validationCGU',
      params: { termsId: 123456 },
    })
  })

  it('do not call mockAuthPost when handleSubmit is called without form', async () => {
    const submitButton = wrapper.find('[data-testid="login-submit-button"]')
    await submitButton.trigger('click')
    await flushPromises()
    expect(mockAuthPost).not.toHaveBeenCalled()
  })

  it('do not call mockAuthPost when form throws an exception', async () => {
    const mockedForm = {
      validate: () => {
        throw new Error('')
      },
    } as unknown as FormInstance
    await wrapper.vm.handleSubmit(mockedForm)
    expect(mockAuthPost).not.toHaveBeenCalled()
  })

  it('do not call mockAuthPost when initAuthClient returns an error', async () => {
    initAuthClientMocked.mockRejectedValueOnce({
      error: {
        code: '403042',
      },
    })
    const mockedForm = {
      validate: () => {
        throw new Error('')
      },
    } as unknown as FormInstance
    await wrapper.vm.handleSubmit(mockedForm)
    expect(mockAuthPost).not.toHaveBeenCalled()
  })

  it('do not call mockAuthPost when not form given to handleSubmit', async () => {
    await wrapper.vm.handleSubmit(undefined)
    expect(mockAuthPost).not.toHaveBeenCalled()
  })
})
