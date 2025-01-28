import { describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import validationCGU from './'
import { createTestingPinia } from '@pinia/testing'
import { commonStore as useStore } from '@pulse/common'
import { LoginRouteName } from '@pulse/common/constants'

const pinia = createTestingPinia()
const store = useStore()
const mockRouterPush = vi.fn()

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

vi.mock('vue-router', () => ({
  useRouter: () => ({
    push: mockRouterPush,
  }),
}))

vi.mock('@pulse/common', async () => {
  const actual = await vi.importActual('@pulse/common')
  return {
    ...actual,
    fetchUrlTerms: vi.fn(),
  }
})

const updateTermsByCurrentUserMocked = vi.hoisted(() => vi.fn())
vi.mock('@login/services/cgu', () => ({
  updateTermsByCurrentUser: updateTermsByCurrentUserMocked,
}))

const createWrapper = () =>
  mount(validationCGU, {
    props: {
      termsId: '123456789',
    },
    global: {
      plugins: [pinia],
    },
  })

describe('cgu validation', () => {
  it('should redirect to home page after terms acceptation', async () => {
    const wrapper = createWrapper()
    const getCheckbox = () => wrapper.find('input')
    await getCheckbox().setValue(true)

    const confirmButton = wrapper.find('[data-testid="cgu-button-confirm"]')
    await confirmButton.trigger('click')
    expect(mockRouterPush).toHaveBeenCalledWith({ name: 'wallet-client' })
  })

  it('should back to login page and logout', async () => {
    const spyStoreLogoutAction = vi.spyOn(store, 'logout')
    const wrapper = createWrapper()
    const backButton = wrapper.find('[data-testid="cgu-button-back"]')
    await backButton.trigger('click')
    expect(mockRouterPush).toHaveBeenCalledWith({ name: LoginRouteName.LOGIN_CLIENT })
    expect(spyStoreLogoutAction).toHaveBeenCalled()
  })

  it('should emit console error when updateTermsByCurrentUser throws an error', async () => {
    const errorMessage = 'error-message'
    updateTermsByCurrentUserMocked.mockRejectedValueOnce(new Error(errorMessage))


    const wrapper = createWrapper()
    const getCheckbox = () => wrapper.find('input')
    await getCheckbox().setValue(true)

    const confirmButton = wrapper.find('[data-testid="cgu-button-confirm"]')
    await confirmButton.trigger('click')
    expect(loggerErrorSpy).toHaveBeenCalledOnce()
  })
})
