import type { VueWrapper } from '@vue/test-utils'
import { flushPromises } from '@vue/test-utils'
import { describe, expect, it, vi, beforeEach } from 'vitest'
import { getMockedRouter, getWrapper } from '../testHelper'
import ResetPasswordForm from './'

const router = getMockedRouter(
  'resetPasswordForm',
  'ResetPasswordForm',
  undefined,
  'contactEmail',
)

function createWrapper() {
  const stubs = [
    'PForm',
    'PFormItem',
    'PInput',
    'PButton',
  ]
  return getWrapper(ResetPasswordForm, router, stubs)
}

vi.mock('@kpmg/common', () => ({
  commonApi: () => ({
    gateway: {
      get: () => ({
        data: false,
      }),
    },
  }),
}))

describe('page reset password form', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })
  it('should redirect to page expired link when token is expired', async () => {
    const wrapper: VueWrapper<any> = createWrapper()
    const spy = vi.spyOn(wrapper.vm.router, 'push')
    await vi.dynamicImportSettled()
    await flushPromises()
    expect(spy).toHaveBeenCalledTimes(1)
    expect(spy).toHaveBeenCalledWith({
      name: 'expireToken',
      query: { contactEmail: 'contactEmail' },
    })
  })
})
