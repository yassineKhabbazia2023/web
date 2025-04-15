import { flushPromises } from '@vue/test-utils'
import { describe, expect, it, vi, beforeEach } from 'vitest'
import { getMockedRouter, getWrapper } from '@login/__mocks__/component.wrapper'
import { LoginRouteName } from '@pulse/common/constants'

import ResetPasswordForm from './'

const router = getMockedRouter(
  'resetPasswordForm',
  'ResetPasswordForm',
  undefined,
  'contactEmail',
)

function createWrapper() {
  const stubs = {
    PForm: true,
    PFormItem: true,
    PInput: true,
    PButton: true,
    PopoverPasswordStrength: true,
  }
  return getWrapper(ResetPasswordForm, router, stubs)
}

vi.mock('@pulse/common', () => ({
  createNewPassword: vi.fn(),
  isInvitationTokenValid: vi.fn(),
}))

describe('page reset password form', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  it('displays the token loader before navigating to the next page', async () => {
    const wrapper = createWrapper()

    const loader = wrapper.findComponent({ name: 'TokenValidationLoader' })
    expect(loader.exists()).toBe(true)

    await flushPromises()

    expect(loader.exists()).toBe(false)
  })

  it('should redirect to page expired link when token is expired', async () => {
    createWrapper()
    const spy = vi.spyOn(router, 'push')
    await vi.dynamicImportSettled()
    await flushPromises()
    expect(spy).toHaveBeenCalledTimes(1)
    expect(spy).toHaveBeenCalledWith({
      name: LoginRouteName.EXPIRE_TOKEN,
      query: { contactEmail: 'contactEmail' },
    })
  })
})
