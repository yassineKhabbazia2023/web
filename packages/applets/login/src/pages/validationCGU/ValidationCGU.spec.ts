import { describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { loggerErrorSpy, loggerMock } from '@pulse/core/mocks'
import { cguServiceMock, updateTermsByCurrentUserMock } from '@login/__mocks__/cgu.service.mocks'
import { createTestingPinia } from '@pinia/testing'
import { commonStore as useStore } from '@pulse/common'
import { LoginRouteName } from '@pulse/common/constants'

import validationCGU from './'

const pinia = createTestingPinia()
const store = useStore()
const mockRouterPush = vi.fn()

vi.mock('@pulse/core', () => ({ logger: loggerMock }))

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

vi.mock('@pulse/common/services/cgu', () => cguServiceMock)

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
    updateTermsByCurrentUserMock.mockRejectedValueOnce(new Error(errorMessage))


    const wrapper = createWrapper()
    const getCheckbox = () => wrapper.find('input')
    await getCheckbox().setValue(true)

    const confirmButton = wrapper.find('[data-testid="cgu-button-confirm"]')
    await confirmButton.trigger('click')
    expect(loggerErrorSpy).toHaveBeenCalledOnce()
  })
})
