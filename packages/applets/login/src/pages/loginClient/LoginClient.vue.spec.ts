import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { nextTick } from 'vue'
import { loggerMock } from '@pulse/toolbox/mocks'
import { cguServiceMock, AmplitudeServiceMock } from '@pulse/common/mocks/vitest'
import type { ComponentWrapper } from '@pulse/toolbox/utils/test'
import { flushPromises, mount } from '@vue/test-utils'
import { getTermsByCurrentUser } from '@pulse/common/services/cgu'
import { BackEndErrors } from '@pulse/common/constants'
import { RouteName } from '@pulse/common/enums'

import LoginClient from './LoginClient.vue'

const mockRouterPush = vi.fn()
const authenticateCustomerMock = vi.hoisted(() => vi.fn())

vi.mock('@pulse/toolbox', () => ({ logger: loggerMock }))

vi.mock('vue-router', () => ({
  useRouter: () => ({
    push: mockRouterPush,
  }),
}))

vi.mock('@pulse/common/services/amplitude', () => ({
  AmplitudeService: AmplitudeServiceMock,
}))

vi.mock('@pulse/common/managers', () => ({
  LoginManager: {
    authenticateCustomer: authenticateCustomerMock,
  },
}))

vi.mock('@pulse/common/services/cgu', () => cguServiceMock)

const createWrapper = (): ComponentWrapper<InstanceType<typeof LoginClient>> =>
  mount(LoginClient, {
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
const getSubmitButton = (wrapper: ReturnType<typeof createWrapper>) => wrapper.find('[data-testid="login-submit-button"]')
const getSkewedButton = (wrapper: ReturnType<typeof createWrapper>) => wrapper.findComponent({ name: 'PSkewedButton' })

const INPUT_EMAIL_VALUE = 'customEmail@aol.com'
const INPUT_PASSWORD_VALUE = 'customPassword'

describe('LoginClient', () => {
  beforeEach(() => {
    wrapper = createWrapper()
  })

  afterEach(() => {
    wrapper.unmount()
  })

  it('fill the login page and has a redirection to the home page', async () => {
    await getInputEmail().setValue(INPUT_EMAIL_VALUE)
    await getInputPassword().setValue(INPUT_PASSWORD_VALUE)

    const submitButton = getSubmitButton(wrapper)
    await submitButton.trigger('click')
    await flushPromises()

    expect(authenticateCustomerMock).toHaveBeenCalledWith(INPUT_EMAIL_VALUE, INPUT_PASSWORD_VALUE)
    expect(mockRouterPush).toHaveBeenCalledWith({ name: RouteName.LANDING })
  })

  it('does not redirect to the home page if the api return a WRONG_LOGIN_PASSWORD error', async () => {
    authenticateCustomerMock.mockRejectedValueOnce({
      response: {
        data: {
          errorCode: BackEndErrors.WRONG_LOGIN_PASSWORD,
        },
      },
    })
    const expectedErrorMessage = 'The e-mail address and password combination is incorrect'

    await getInputEmail().setValue(INPUT_EMAIL_VALUE)
    await getInputPassword().setValue(INPUT_PASSWORD_VALUE)

    const submitButton = getSubmitButton(wrapper)
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

    expect(AmplitudeServiceMock.track).toHaveBeenCalledExactlyOnceWith('Sign In Completed', {
      sign_in_method: 'email',
      sign_in_result: 'failed',
    })
    expect(mockRouterPush).not.toHaveBeenCalled()
  })

  it('does not redirect to the home page if the api return a INVALID_LOGIN_CREDENTIALS error', async () => {
    authenticateCustomerMock.mockRejectedValueOnce({
      response: {
        data: {
          errorCode: BackEndErrors.INVALID_LOGIN_CREDENTIALS,
        },
      },
    })
    const expectedErrorMessage = 'The e-mail address and password combination is incorrect'

    await getInputEmail().setValue(INPUT_EMAIL_VALUE)
    await getInputPassword().setValue(INPUT_PASSWORD_VALUE)

    const submitButton = getSubmitButton(wrapper)
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

    expect(AmplitudeServiceMock.track).toHaveBeenCalledExactlyOnceWith('Sign In Completed', {
      sign_in_method: 'email',
      sign_in_result: 'failed',
    })
    expect(mockRouterPush).not.toHaveBeenCalled()
  })

  it('should clear errors and enable submit button when user types after incorrect credentials', async () => {
    // Setup: simulate a login error
    authenticateCustomerMock.mockRejectedValueOnce({
      response: {
        data: {
          errorCode: BackEndErrors.WRONG_LOGIN_PASSWORD,
        },
      },
    })

    await getInputEmail().setValue(INPUT_EMAIL_VALUE)
    await getInputPassword().setValue(INPUT_PASSWORD_VALUE)

    const submitButton = getSubmitButton(wrapper)
    await submitButton.trigger('click')
    await flushPromises()
    await nextTick()

    // Verify that button is disabled (errors are present)
    const pSkewedButton = getSkewedButton(wrapper)
    expect(pSkewedButton.props('pDisabled')).toBe(true)

    // Action: simulate a keydown in the email field
    await getInputEmail().trigger('keydown')
    await nextTick()

    // Assertions: errors should be cleared and button enabled
    const pFormItems = wrapper.findAllComponents({ name: 'PFormItem' })
    const firstFormItemProps = pFormItems.at(0)!.props()
    const secondFormItemProps = pFormItems.at(1)!.props()

    expect(firstFormItemProps['pError']).toBe('')
    expect(secondFormItemProps['pError']).toBe('')
    expect(pSkewedButton.props('pDisabled')).toBe(false)
  })

  it('should NOT clear validation errors when typing in a different field', async () => {
    // Setup: Enter an invalid email and trigger validation
    const inputEmail = getInputEmail()
    const inputPassword = getInputPassword()

    await inputEmail.setValue('invalid-email')
    await inputEmail.trigger('blur')
    await nextTick()

    // Verify that email validation error is present
    let pFormItems = wrapper.findAllComponents({ name: 'PFormItem' })
    let firstFormItemProps = pFormItems.at(0)!.props()
    expect(firstFormItemProps['pError']).toBe('Please enter a valid e-mail address')
    expect(firstFormItemProps['pShowMessage']).toBe(true)

    // Action: type in the password field
    await inputPassword.trigger('keydown')
    await nextTick()

    // Assertions: email validation error should still be present
    pFormItems = wrapper.findAllComponents({ name: 'PFormItem' })
    firstFormItemProps = pFormItems.at(0)!.props()
    expect(firstFormItemProps['pError']).toBe('Please enter a valid e-mail address')
    expect(firstFormItemProps['pShowMessage']).toBe(true)
  })

  it('does not redirect to the home page if the api return empty response', async () => {
    authenticateCustomerMock.mockRejectedValueOnce(new Error('No token received'))
    await getInputEmail().setValue('error@aol.com')
    await getInputPassword().setValue('error')

    const submitButton = getSubmitButton(wrapper)
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

    expect(AmplitudeServiceMock.track).toHaveBeenCalledExactlyOnceWith('Sign In Completed', {
      sign_in_method: 'email',
      sign_in_result: 'failed',
    })
    expect(mockRouterPush).not.toHaveBeenCalled()
  })

  it('does display error message if the api return an unknown error', async () => {
    authenticateCustomerMock.mockRejectedValueOnce({
      response: {
        data: {
          errorCode: 'unknown',
        },
      },
    })
    const expectedErrorMessage = 'A technical error occurred.'

    await getInputEmail().setValue('error@aol.com')
    await getInputPassword().setValue('error')

    const submitButton = getSubmitButton(wrapper)
    await submitButton.trigger('click')
    await flushPromises()

    const pFormItems = wrapper.findAllComponents({ name: 'PFormItem' })
    const firstFormItemProps = pFormItems.at(0)!.props()
    const secondFormItemProps = pFormItems.at(1)!.props()

    expect(firstFormItemProps['pError']).toBe(expectedErrorMessage)
    expect(firstFormItemProps['pShowMessage']).toBe(false)

    expect(secondFormItemProps['pError']).toBe(expectedErrorMessage)
    expect(secondFormItemProps['pShowMessage']).toBe(true)

    expect(AmplitudeServiceMock.track).toHaveBeenCalledExactlyOnceWith('Sign In Completed', {
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

    const submitButton = getSubmitButton(wrapper)
    await submitButton.trigger('click')
    await flushPromises()

    const pSkewedButton = getSkewedButton(wrapper)
    expect(pSkewedButton.props('pDisabled')).toBeTruthy()
    expect(AmplitudeServiceMock.track).not.toHaveBeenCalled()
    expect(mockRouterPush).not.toHaveBeenCalled()
    expect(authenticateCustomerMock).not.toHaveBeenCalled()
  })

  it('give none valid email form', async () => {
    const inputEmail = getInputEmail()
    const inputPassword = getInputPassword()
    inputEmail.setValue('invalid-email')
    inputPassword.setValue(INPUT_PASSWORD_VALUE)

    const submitButton = getSubmitButton(wrapper)
    await submitButton.trigger('click')
    await flushPromises()

    const pSkewedButton = getSkewedButton(wrapper)
    expect(pSkewedButton.props('pDisabled')).toBeTruthy()
    expect(AmplitudeServiceMock.track).not.toHaveBeenCalled()
    expect(mockRouterPush).not.toHaveBeenCalled()
    expect(authenticateCustomerMock).not.toHaveBeenCalled()
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

    const submitButton = getSubmitButton(wrapper)
    await submitButton.trigger('click')
    await flushPromises()

    expect(mockRouterPush).toHaveBeenCalledWith({
      name: RouteName.VALIDATION_CGU,
      params: { termsId: 123456 },
    })
    expect(authenticateCustomerMock).toHaveBeenCalledOnce()
  })

  it('does not call authenticateCustomer when form is invalid', async () => {
    const submitButton = getSubmitButton(wrapper)
    await submitButton.trigger('click')
    await flushPromises()
    expect(authenticateCustomerMock).not.toHaveBeenCalled()
  })

  it('does not call authenticateCustomer when clicking button without valid form', async () => {
    const pSkewedButton = getSkewedButton(wrapper)
    pSkewedButton.vm.$emit('click')

    expect(authenticateCustomerMock).not.toHaveBeenCalled()
  })
})
