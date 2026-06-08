import { mount, flushPromises } from '@vue/test-utils'
import { cguServiceMock, AmplitudeServiceMock } from '@pulse/common/mocks/vitest'
import { loggerMock } from '@pulse/toolbox/mocks'
import { getLatestTerms, updateTermsByCurrentUser } from '@pulse/common/services/cgu'
import { BackEndErrors } from '@pulse/common/constants'
import { RouteName } from '@pulse/common/enums'
import type { FormInstance } from 'element-plus'

import CreatePassword from './CreatePassword.vue'

const createNewPasswordMock = vi.hoisted(() => vi.fn())
const authenticateCustomerMock = vi.hoisted(() => vi.fn())

const VALID_PASSWORD = 'aaAA11@@'


vi.mock('@pulse/toolbox', () => ({ logger: loggerMock }))
vi.mock('@pulse/common/services/cgu', () => cguServiceMock)

vi.mock('@pulse/common/services/authentication', () => ({
  createNewPassword: createNewPasswordMock,
}))

vi.mock('@pulse/common/services/login', () => ({
  LoginService: {
    authenticate: authenticateCustomerMock,
  },
}))

vi.mock('@pulse/common/services/amplitude', () => ({
  AmplitudeService: AmplitudeServiceMock,
}))

const routerPushMock = vi.hoisted(() => vi.fn())
const useRouterMock = vi.hoisted(() => vi.fn(() => ({
  push: routerPushMock,
})))

const useRouteMock = vi.hoisted(() => vi.fn(() => ({
  name: 'route-name',
  meta: {},
  query: {
    contactId: 'contactId',
    accountNumber: 'accountNumber',
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
  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(getLatestTerms).mockResolvedValue({ termsId: 1 } as any)
    wrapper = createWrapper()
  })

  it(
    'should track amplitude event when create password page displayed', () => {
      expect(AmplitudeServiceMock.track).toHaveBeenCalledExactlyOnceWith('Onboarding Email Accepted', {
        onboarding_email_click: '',
      })
    },
  )

  it(
    'should show error when user dont enter password and button submit is disabled',
    async () => {
      const inputs = wrapper.findAll('.el-input__inner')
      await inputs[0].setValue(VALID_PASSWORD)
      await inputs[0].trigger('blur')
      await inputs[1].trigger('blur')
      wrapper.find('.el-checkbox__original').setValue('true')
      await flushPromises()
      expect(wrapper.findAll('.is-error')).toHaveLength(1)
      expect(wrapper.find('[data-testid="create-password-submit-button"]').attributes('disabled')).toBeDefined()
    },
  )


  it('should show error when user enter a invalid password', async () => {
    const inputs = wrapper.findAll('.el-input__inner')
    await inputs[0].setValue('aaAA11aa')
    await inputs[0].trigger('blur')
    await inputs[1].setValue('aaAA11aa')
    await inputs[1].trigger('blur')
    wrapper.find('.el-checkbox__original').setValue('true')
    await flushPromises()
    expect(wrapper.findAll('.is-error')).toHaveLength(1)
  })


  it('should show error when user enter an empty password', async () => {
    const inputs = wrapper.findAll('.el-input__inner')
    await inputs[0].setValue('')
    await inputs[0].trigger('blur')
    await inputs[1].setValue('')
    await inputs[1].trigger('blur')
    await flushPromises()
    expect(wrapper.findAll('.is-error')).toHaveLength(2)
  })


  it('should disable submitButton when terms checkbox is not checked', async () => {
    const inputs = wrapper.findAll('.el-input__inner')
    await inputs[0].setValue(VALID_PASSWORD)
    await inputs[1].setValue(VALID_PASSWORD)

    const termsCheckbox = wrapper.find('[data-testid="create-password-terms-checkbox"] .el-checkbox__original')
    const submitButton = wrapper.find('[data-testid="create-password-submit-button"]')

    await termsCheckbox.setValue(true)
    await flushPromises()
    expect(submitButton.attributes('disabled')).toBeUndefined()

    await termsCheckbox.setValue(false)
    await flushPromises()
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
    const inputs = wrapper.findAll('.el-input__inner')
    await inputs[0].setValue(VALID_PASSWORD)
    await inputs[0].trigger('blur')
    await inputs[1].setValue('different password')
    await inputs[1].trigger('blur')
    await flushPromises()
    expect(wrapper.findAll('.is-error')).toHaveLength(1)
  })


  it('redirects to expired token page and tracks Amplitude event when password reset fails due to expired token', async () => {
    createNewPasswordMock.mockRejectedValueOnce({
      status: 500,
      response: { data: { errorCode: BackEndErrors.TOKEN_EXPIRED } },
    })

    wrapper = createWrapper()
    await flushPromises()

    const inputs = wrapper.findAll('.el-input__inner')
    inputs[0].setValue(VALID_PASSWORD)
    inputs[1].setValue(VALID_PASSWORD)
    wrapper.find('.el-checkbox__original').setValue(true)

    await flushPromises()

    await wrapper.find('button').trigger('click')
    await vi.dynamicImportSettled()
    await flushPromises()

    // Check redirection to expired token page
    expect(routerPushMock).toHaveBeenCalledTimes(1)
    expect(routerPushMock).toHaveBeenCalledWith({
      name: RouteName.EXPIRE_TOKEN,
      query: { accountNumber: 'accountNumber', contactId: 'contactId' },
    })

    // Check Amplitude tracking
    expect(AmplitudeServiceMock.track).toHaveBeenCalledWith('Onboarding Completed', {
      onboarding_result: 'failed',
    })
  })

  it('should call API when the button is clicked and track an Amplitude when the login succeeds', async () => {
    wrapper.findAll('.el-input__inner')[0].setValue(VALID_PASSWORD)
    wrapper.findAll('.el-input__inner')[1].setValue(VALID_PASSWORD)
    wrapper.find('.el-checkbox__original').setValue('true')
    await flushPromises()
    wrapper.find('button').trigger('click')
    await flushPromises()
    const data = {
      token: 'token',
      newPassword: VALID_PASSWORD,
      contactId: 'contactId',
    }
    const dataLogin = {
      email: 'email',
      password: VALID_PASSWORD,
    }
    expect(AmplitudeServiceMock.track).toHaveBeenNthCalledWith(2, 'Onboarding Completed', {
      onboarding_result: 'succeeded',
    })
    expect(updateTermsByCurrentUser).toHaveBeenCalledTimes(1)
    expect(createNewPasswordMock).toHaveBeenCalledExactlyOnceWith(data)

    expect(authenticateCustomerMock).toHaveBeenCalledExactlyOnceWith(dataLogin.email, dataLogin.password)
    expect(routerPushMock).toHaveBeenCalledOnce()
  })

  it('should throw error', async () => {
    vi.mocked(getLatestTerms).mockRejectedValue('Async error')
    wrapper = createWrapper()
    await flushPromises()
    wrapper.findAll('.el-input__inner')[0].setValue(VALID_PASSWORD)
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
    expect(createNewPasswordMock).not.toHaveBeenCalled()
  })

  it('do not call postMock when form is not valid', async () => {
    wrapper = createWrapper()
    const mockedForm = {
      validate: vi.fn().mockRejectedValue(new Error('invalid form')),
    } as unknown as FormInstance
    await wrapper.vm.submitForm(mockedForm)
    expect(createNewPasswordMock).not.toHaveBeenCalled()
  })
})
