import { flushPromises } from '@vue/test-utils'
import { withSetup } from '@pulse/toolbox/utils/test'
import { loggerMock } from '@pulse/toolbox/mocks'
import { cguServiceMock, AmplitudeServiceMock } from '@pulse/common/mocks/vitest'
import { getTermsByCurrentUser } from '@pulse/common/services/cgu'
import { BackEndErrors } from '@pulse/common/constants'
import { RouteName } from '@pulse/common/enums'

import { useLoginClient } from './login-client.composable'

const mockRouterPush = vi.hoisted(() => vi.fn())
const authenticateCustomerMock = vi.hoisted(() => vi.fn())

vi.mock('@pulse/toolbox', () => ({ logger: loggerMock }))
vi.mock('@pulse/common/services/amplitude', () => ({
  AmplitudeService: AmplitudeServiceMock,
}))
vi.mock('@pulse/common/services/login', () => ({
  LoginService: {
    authenticate: authenticateCustomerMock,
  },
}))
vi.mock('@pulse/common/services/cgu', () => cguServiceMock)
vi.mock('vue-router', () => ({
  useRouter: () => ({ push: mockRouterPush }),
}))

const INPUT_EMAIL_VALUE = 'customEmail@aol.com'
const INPUT_PASSWORD_VALUE = 'customPassword'

describe('useLoginClient', () => {
  it('authenticates and redirects to LANDING when terms are current', async () => {
    const [result] = withSetup(() => useLoginClient())
    result.email.value = INPUT_EMAIL_VALUE
    result.password.value = INPUT_PASSWORD_VALUE

    await result.onSubmit()
    await flushPromises()

    expect(authenticateCustomerMock).toHaveBeenCalledExactlyOnceWith(INPUT_EMAIL_VALUE, INPUT_PASSWORD_VALUE)
    expect(mockRouterPush).toHaveBeenCalledWith({ name: RouteName.LANDING })
  })

  it('redirects to VALIDATION_CGU when terms are not current', async () => {
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

    const [result] = withSetup(() => useLoginClient())
    result.email.value = INPUT_EMAIL_VALUE
    result.password.value = INPUT_PASSWORD_VALUE

    await result.onSubmit()
    await flushPromises()

    expect(authenticateCustomerMock).toHaveBeenCalledOnce()
    expect(mockRouterPush).toHaveBeenCalledWith({
      name: RouteName.VALIDATION_CGU,
      params: { termsId: 123456 },
    })
  })

  it('sets credentials error on WRONG_LOGIN_PASSWORD and tracks failed sign-in', async () => {
    authenticateCustomerMock.mockRejectedValueOnce({
      response: { data: { errorCode: BackEndErrors.WRONG_LOGIN_PASSWORD } },
    })

    const [result] = withSetup(() => useLoginClient())
    result.email.value = INPUT_EMAIL_VALUE
    result.password.value = INPUT_PASSWORD_VALUE

    await result.onSubmit()
    await flushPromises()

    expect(result.emailErrorKey.value).toBe('emailOrPasswordError')
    expect(result.isEmailMessageVisible.value).toBe(false)
    expect(result.passwordErrorKey.value).toBe('emailOrPasswordError')
    expect(result.isPasswordMessageVisible.value).toBe(true)
    expect(AmplitudeServiceMock.track).toHaveBeenCalledExactlyOnceWith('Sign In Completed', {
      sign_in_method: 'email',
      sign_in_result: 'failed',
    })
    expect(mockRouterPush).not.toHaveBeenCalled()
  })

  it('sets credentials error on INVALID_LOGIN_CREDENTIALS', async () => {
    authenticateCustomerMock.mockRejectedValueOnce({
      response: { data: { errorCode: BackEndErrors.INVALID_LOGIN_CREDENTIALS } },
    })

    const [result] = withSetup(() => useLoginClient())
    result.email.value = INPUT_EMAIL_VALUE
    result.password.value = INPUT_PASSWORD_VALUE

    await result.onSubmit()
    await flushPromises()

    expect(result.emailErrorKey.value).toBe('emailOrPasswordError')
    expect(result.passwordErrorKey.value).toBe('emailOrPasswordError')
    expect(mockRouterPush).not.toHaveBeenCalled()
  })

  it('sets technical error when the response has no errorCode', async () => {
    authenticateCustomerMock.mockRejectedValueOnce(new Error('No token received'))

    const [result] = withSetup(() => useLoginClient())
    result.email.value = INPUT_EMAIL_VALUE
    result.password.value = INPUT_PASSWORD_VALUE

    await result.onSubmit()
    await flushPromises()

    expect(result.emailErrorKey.value).toBe('technicalError')
    expect(result.passwordErrorKey.value).toBe('technicalError')
    expect(AmplitudeServiceMock.track).toHaveBeenCalledExactlyOnceWith('Sign In Completed', {
      sign_in_method: 'email',
      sign_in_result: 'failed',
    })
  })

  it('sets technical error on unknown errorCode', async () => {
    authenticateCustomerMock.mockRejectedValueOnce({
      response: { data: { errorCode: 'unknown' } },
    })

    const [result] = withSetup(() => useLoginClient())
    result.email.value = INPUT_EMAIL_VALUE
    result.password.value = INPUT_PASSWORD_VALUE

    await result.onSubmit()
    await flushPromises()

    expect(result.emailErrorKey.value).toBe('technicalError')
    expect(result.passwordErrorKey.value).toBe('technicalError')
  })

  it('clears credentials errors when typing after a failed login', async () => {
    authenticateCustomerMock.mockRejectedValueOnce({
      response: { data: { errorCode: BackEndErrors.WRONG_LOGIN_PASSWORD } },
    })

    const [result] = withSetup(() => useLoginClient())
    result.email.value = INPUT_EMAIL_VALUE
    result.password.value = INPUT_PASSWORD_VALUE
    await result.onSubmit()
    await flushPromises()

    expect(result.isSubmitButtonEnabled.value).toBe(false)

    result.handleKeypressAfterIncorrectCredentials()

    expect(result.emailErrorKey.value).toBe('')
    expect(result.passwordErrorKey.value).toBe('')
    expect(result.isSubmitButtonEnabled.value).toBe(true)
  })

  it('does not clear validation errors when typing after a field-level validation failure', () => {
    const [result] = withSetup(() => useLoginClient())
    result.email.value = 'invalid-email'
    result.checkEmail()

    expect(result.emailErrorKey.value).toBe('alertMailInvalid')
    expect(result.isEmailMessageVisible.value).toBe(true)

    result.handleKeypressAfterIncorrectCredentials()

    expect(result.emailErrorKey.value).toBe('alertMailInvalid')
    expect(result.isEmailMessageVisible.value).toBe(true)
  })

  it('does not authenticate when the form is empty', async () => {
    const [result] = withSetup(() => useLoginClient())

    const submitted = await result.onSubmit()
    await flushPromises()

    expect(submitted).toBe(false)
    expect(authenticateCustomerMock).not.toHaveBeenCalled()
    expect(mockRouterPush).not.toHaveBeenCalled()
    expect(result.isSubmitButtonEnabled.value).toBe(false)
  })

  it('does not authenticate when the email is invalid', async () => {
    const [result] = withSetup(() => useLoginClient())
    result.email.value = 'invalid-email'
    result.password.value = INPUT_PASSWORD_VALUE

    const submitted = await result.onSubmit()
    await flushPromises()

    expect(submitted).toBe(false)
    expect(authenticateCustomerMock).not.toHaveBeenCalled()
    expect(result.isSubmitButtonEnabled.value).toBe(false)
  })

  it('logs the error when authentication fails', async () => {
    const errorMock = { response: { data: { errorCode: BackEndErrors.WRONG_LOGIN_PASSWORD } } }
    authenticateCustomerMock.mockRejectedValueOnce(errorMock)

    const [result] = withSetup(() => useLoginClient())
    result.email.value = INPUT_EMAIL_VALUE
    result.password.value = INPUT_PASSWORD_VALUE

    await result.onSubmit()
    await flushPromises()

    expect(loggerMock.error).toHaveBeenCalledWith('Error during login attempt: ', errorMock)
  })
})
