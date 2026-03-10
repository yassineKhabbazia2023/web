import { nextTick } from 'vue'
import { mount, flushPromises } from '@vue/test-utils'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { loggerMock } from '@pulse/toolbox/mocks'
import { RouteName } from '@pulse/common/enums'

import ResetPasswordForm from './ResetPasswordForm.vue'

const emptyPasswordMock = ''
const validPasswordMock = 'aaAA11@@'

const createNewPasswordMock = vi.hoisted(() => vi.fn())

vi.mock('@pulse/toolbox', () => ({ logger: loggerMock }))

vi.mock('@pulse/common/services/authentication', () => ({
  createNewPassword: createNewPasswordMock,
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
    contactEmail: 'contactEmail',
    token: 'token',
  },
})))

vi.mock('vue-router', () => ({
  useRouter: useRouterMock,
  useRoute: useRouteMock,
}))

function createWrapper() {
  return mount(ResetPasswordForm)
}

describe('page reset password form', () => {
  let wrapper: ReturnType<typeof createWrapper>
  beforeEach(() => {
    wrapper = createWrapper()
  })

  it('should show error when user dont enter password and button submit is disabled', async () => {
    const pInputs = wrapper.findAllComponents({ name: 'PInput' })
    const pButton = wrapper.findComponent({ name: 'PButton' })
    const pFormItems = wrapper.findAllComponents({ name: 'PFormItem' })

    const firstInput = pInputs.at(0)
    const secondInput = pInputs.at(1)

    firstInput!.vm.$emit('update:model-value', validPasswordMock)
    secondInput!.vm.$emit('update:model-value', emptyPasswordMock)
    await nextTick()

    expect(pFormItems.at(0)?.props('pError')).toBe('')
    expect(pFormItems.at(1)?.props('pError')).toBe('Please confirm the password')
    expect(pButton.props('pDisabled')).toBe(true)
  })

  it('should show error when user enter a invalid password', async () => {
    wrapper.findAll('.el-input__inner')[0].setValue('aaAA11aa')
    wrapper.findAll('.el-input__inner')[1].setValue('aaAA11aa')
    await flushPromises()
    expect(wrapper.findAll('.is-error')).toHaveLength(1)
  })

  it('should show error when user enter an empty password', async () => {
    const pFormItems = wrapper.findAllComponents({ name: 'PFormItem' })
    const pInputs = wrapper.findAllComponents({ name: 'PInput' })
    const pButton = wrapper.findComponent({ name: 'PButton' })

    const firstInput = pInputs.at(0)
    const secondInput = pInputs.at(1)

    firstInput!.vm.$emit('update:model-value', emptyPasswordMock)
    secondInput!.vm.$emit('update:model-value', emptyPasswordMock)

    firstInput!.vm.$emit('blur')
    secondInput!.vm.$emit('blur')

    await nextTick()

    expect(pFormItems.at(0)?.props('pError')).toBe('Please enter the password')
    expect(pFormItems.at(1)?.props('pError')).toBe('Please confirm the password')
    expect(pButton.props('pDisabled')).toBe(true)
  })

  it('should show success when user enter 2 password', async () => {
    wrapper.findAll('.el-input__inner')[0].setValue('aaAA11@@')
    wrapper.findAll('.el-input__inner')[1].setValue('aaAA11@@')
    expect(wrapper.findAll('.is-error')).toHaveLength(0)
    await flushPromises()
    expect(wrapper.find('button').classes()).not.toContain('is-disabled')
  })

  it('should show error when user enter password and confirm password differently', async () => {
    wrapper.findAll('.el-input__inner')[0].setValue('aaAA11@@')
    wrapper.findAll('.el-input__inner')[1].setValue('different password')
    await flushPromises()
    expect(wrapper.findAll('.is-error')).toHaveLength(1)
    expect(wrapper.find('button').classes()).toContain('is-disabled')
  })

  it('should call back end when click on button', async () => {
    const pInputs = wrapper.findAllComponents({ name: 'PInput' })
    pInputs.at(0)?.vm.$emit('update:model-value', validPasswordMock)
    pInputs.at(1)?.vm.$emit('update:model-value', validPasswordMock)

    const pButton = wrapper.findComponent({ name: 'PButton' })
    pButton.vm.$emit('click')
    await flushPromises()

    const data = {
      token: 'token',
      newPassword: 'aaAA11@@',
      isCreatePasswordAction: false,
    }
    expect(createNewPasswordMock).toHaveBeenCalledExactlyOnceWith(data)

    expect(routerPushMock).toHaveBeenCalledTimes(1)
    expect(routerPushMock).toHaveBeenLastCalledWith({ name: RouteName.LOGIN_CLIENT })
  })
  it('do not call mockAuthPost when not form given to submitForm', async () => {
    wrapper = createWrapper()
    await wrapper.vm.submitForm()
    expect(createNewPasswordMock).not.toHaveBeenCalled()
  })

  it('do not call mockAuthPost when form is not valid', async () => {
    wrapper = createWrapper()
    await wrapper.vm.submitForm()
    expect(createNewPasswordMock).not.toHaveBeenCalled()
  })
})
