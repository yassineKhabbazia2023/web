import { flushPromises } from '@vue/test-utils'
import { describe, expect, it, vi, beforeEach } from 'vitest'
import { getMockedRouter, getWrapper } from '@login/__mocks__/component.wrapper'
import { LoginRouteName } from '@pulse/common/constants'
import { loggerMock } from '@pulse/core/mocks'

import CreatePassword from './'

vi.mock('@pulse/core', () => ({
  logger: loggerMock,
}))

const router = getMockedRouter(
  'createPassword',
  'CreatePassword',
  'email',
)

function createWrapper() {
  const stubs = {
    PForm: true,
    PFormItem: true,
    PInput: true,
    PButton: true,
    PopoverPasswordStrength: true,
  }
  return getWrapper(CreatePassword, router, stubs)
}

vi.mock('@pulse/common', () => ({
  commonApi: () => ({
    gateway: {
      get: () => ({
        data: false,
      }),
    },
  }),
  fetchUrlTerms: vi.fn(),
  amplitudeService: {
    track: vi.fn(),
    reset: vi.fn(),
  },
}))

describe('page creation password', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })
  it('should redirect to page expired link when token is expired', async () => {
    createWrapper()
    const spy = vi.spyOn(router, 'push')
    await vi.dynamicImportSettled()
    await flushPromises()
    expect(spy).toHaveBeenCalledTimes(1)
    expect(spy).toHaveBeenCalledWith({
      name: LoginRouteName.EXPIRE_TOKEN,
      query: { accountNumber: 'accountNumber', contactId: 'contactId' },
    })
  })
})
