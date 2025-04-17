import { flushPromises } from '@vue/test-utils'
import { getMockedRouter, getWrapper } from '@login/__mocks__/component.wrapper'
import { LoginRouteName } from '@pulse/common/constants'
import { loggerMock } from '@pulse/core/mocks'
import { getStoreMock } from '@pulse/common/mocks'
import { useUserStore } from '@pulse/common/stores'

import CreatePassword from './'

getStoreMock(useUserStore)

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

const createNewPasswordMock = vi.hoisted(() => vi.fn())
const isInvitationTokenValidMock = vi.hoisted(() => vi.fn())

vi.mock('@pulse/common', () => ({
  createNewPassword: createNewPasswordMock,
  isInvitationTokenValid: isInvitationTokenValidMock,
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
      query: { accountNumber: 'accountNumber', contactId: 'contactId' },
    })
  })
})
