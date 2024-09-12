import { flushPromises } from '@vue/test-utils'
import { describe, expect, it, vi, beforeEach } from 'vitest'
import CreatePassword from './'
import { getMockedRouter, getWrapper } from '@login/pages/testHelper'

const router = getMockedRouter(
  'createPassword',
  'CreatePassword',
  'email',
)

function createWrapper() {
  const stubs = [
    'PForm',
    'PFormItem',
    'PInput',
    'PCheckbox',
    'PButton',
  ]
  return getWrapper(CreatePassword, router, stubs)
}

vi.mock('@pulse/Common', () => ({
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
      name: 'expireToken',
      query: { accountId: 'accountId', contactId: 'contactId' },
    })
  })
})
