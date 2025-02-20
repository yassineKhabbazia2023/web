import { flushPromises } from '@vue/test-utils'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { getMockedRouter, getWrapper } from '@login/tests/testHelper'
import ResetPasswordForm from './'
import { LoginRouteName } from '@pulse/common/constants'

const postMock = vi.fn(() => ({ data: { webToken: 'token' } }))

const loggerDebugSpy = vi.hoisted(() => vi.fn())
const loggerWarnSpy = vi.hoisted(() => vi.fn())
const loggerErrorSpy = vi.hoisted(() => vi.fn())

vi.mock('@pulse/core', () => ({
  logger: {
    debug: loggerDebugSpy,
    warn: loggerWarnSpy,
    error: loggerErrorSpy,
  },
}))

vi.mock('@pulse/common', () => ({
  commonApi: () => ({
    gateway: {
      post: postMock,
      get: () => ({
        data: true,
      }),
    },
  }),
}))

const router = getMockedRouter(
  'resetPasswordForm',
  'ResetPasswordForm',
  undefined,
  'contactEmail',
)

function createWrapper() {
  return getWrapper(ResetPasswordForm, router)
}

describe('page reset password form', () => {
  let wrapper: ReturnType<typeof createWrapper>
  beforeEach(() => {
    wrapper = createWrapper()
  })

  it(
    'should show error when user dont enter password and button submit is disabled',
    async () => {
      wrapper.findAll('.el-input__inner')[0].setValue('aaAA11@@')
      await flushPromises()
      expect(wrapper.findAll('.is-error')).toHaveLength(1)
      expect(wrapper.find('button').classes()).toContain('is-disabled')
    },
  )

  it('should show error when user enter a invalid password', async () => {
    wrapper.findAll('.el-input__inner')[0].setValue('aaAA11aa')
    wrapper.findAll('.el-input__inner')[1].setValue('aaAA11aa')
    await flushPromises()
    expect(wrapper.findAll('.is-error')).toHaveLength(1)
  })

  it('should show error when user enter an empty password', async () => {
    const firstInput = wrapper.find('[data-testid="reset-password-form-first-password"]')
    const secondInput = wrapper.find('[data-testid="reset-password-form-second-password"]')

    await firstInput.setValue('')
    await firstInput.trigger('blur')

    await secondInput.setValue('')
    await secondInput.trigger('blur')

    expect(wrapper.findAll('.is-error')).toHaveLength(2)
  })

  it('should show success when user enter 2 password', async () => {
    wrapper.findAll('.el-input__inner')[0].setValue('aaAA11@@')
    wrapper.findAll('.el-input__inner')[1].setValue('aaAA11@@')
    expect(wrapper.findAll('.is-error')).toHaveLength(0)
    await flushPromises()
    // FIXME : skipped while integrating SG in monorepo
    // expect(wrapper.find('button').classes()).not.toContain('is-disabled')
  })

  it('should show error when user enter password and confirm password differently', async () => {
    wrapper.findAll('.el-input__inner')[0].setValue('aaAA11@@')
    wrapper.findAll('.el-input__inner')[1].setValue('different password')
    await flushPromises()
    expect(wrapper.findAll('.is-error')).toHaveLength(1)
    expect(wrapper.find('button').classes()).toContain('is-disabled')
  })

  it('should call back end when click on button', async () => {
    const routerPushSpy = vi.spyOn(router, 'push')
    wrapper.findAll('.el-input__inner')[0].setValue('aaAA11@@')
    wrapper.findAll('.el-input__inner')[1].setValue('aaAA11@@')
    await flushPromises()
    wrapper.find('button').trigger('click')
    await flushPromises()

    const postLink = 'authentication/api/createNewPassword'
    const data = {
      contactId: 'contactId',
      newPassword: 'aaAA11@@',
      resetPasswordToken: 'token',
      isCreatePasswordAction: false,
    }
    expect(postMock).toHaveBeenCalledTimes(1)
    expect(postMock).toHaveBeenCalledWith(postLink, data)

    expect(routerPushSpy).toHaveBeenCalledTimes(1)
    expect(routerPushSpy).toHaveBeenLastCalledWith({ name: LoginRouteName.LOGIN_CLIENT })
  })

  it('displays an error if the password is already used', async () => {
    const getErrorPasswordAlreadyUsed = () => wrapper.find('[data-testid=error-password-already-used]')

    const BACK_ERROR = {
      response: {
        status: 400,
        data: '401030',
      },
    }
    postMock.mockRejectedValue(BACK_ERROR)

    expect(getErrorPasswordAlreadyUsed().exists()).toBeFalsy()

    wrapper.findAll('.el-input__inner')[0].setValue('aaAA11@@')
    wrapper.findAll('.el-input__inner')[1].setValue('aaAA11@@')
    await flushPromises()
    wrapper.find('button').trigger('click')
    await flushPromises()

    // FIXME : skipped while integrating SG in monorepo
    // expect(getErrorPasswordAlreadyUsed().exists()).toBeTruthy()
  })

  it('do not call mockAuthPost when not form given to submitForm', async () => {
    wrapper = createWrapper()
    await wrapper.vm.submitForm(undefined)
    expect(postMock).not.toHaveBeenCalled()
  })

  it('do not call mockAuthPost when form is not valid', async () => {
    wrapper = createWrapper()
    const mockedForm = {
      validate: (done: any) => {
        done(false)
      },
    }
    await wrapper.vm.submitForm(mockedForm)
    expect(postMock).not.toHaveBeenCalled()
  })
})
