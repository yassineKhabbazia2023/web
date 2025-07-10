import { describe, expect, it, vi } from 'vitest'
import { shallowMount } from '@vue/test-utils'
import { loggerErrorSpy, loggerMock } from '@pulse/core/mocks'
import { cguServiceMock, updateTermsByCurrentUserMock } from '@pulse/common/mocks'
import { APP_ROUTES } from '@pulse/common/constants'
import { CurrentUserManager } from '@pulse/common/managers'

import validationCGU from './ValidationCGU.vue'

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
vi.mock('@pulse/common/managers')

const createWrapper = () =>
  shallowMount(validationCGU, {
    props: {
      termsId: '123456789',
    },
    global: {
      stubs: {
        PFormItem: {
          name: 'PFormItem',
          template: '<div><slot /></div>',
          props: ['pLabel'],
        },
        PForm: {
          name: 'PForm',
          template: '<div><slot /></div>',
          props: ['pModel'],
          methods: {
            validate: vi.fn((cb: Function) => cb(true)),
          },
        },
      },
    },
  })

describe('cgu validation', () => {
  it('should redirect to home page after terms acceptation', async () => {
    const wrapper = createWrapper()

    const checkbox = wrapper.findComponent({ name: 'PCheckbox' })
    await checkbox.vm.$emit('update:modelValue', true)

    const confirmButton = wrapper.find('[data-testid="cgu-button-confirm"]')
    await confirmButton.trigger('click')
    expect(mockRouterPush).toHaveBeenCalledWith({ name: 'wallet-client' })
  })

  it('should back to login page and logout', async () => {
    const CurrentUserManagerLogoutMock = vi.mocked(CurrentUserManager.logout)
    const wrapper = createWrapper()
    const backButton = wrapper.find('[data-testid="cgu-button-back"]')
    await backButton.trigger('click')
    expect(mockRouterPush).toHaveBeenCalledWith({ name: APP_ROUTES.login.client.name })
    expect(CurrentUserManagerLogoutMock).toHaveBeenCalled()
  })

  it('should emit console error when updateTermsByCurrentUser throws an error', async () => {
    const errorMessage = 'error-message'
    updateTermsByCurrentUserMock.mockRejectedValueOnce(new Error(errorMessage))

    const wrapper = createWrapper()
    const checkbox = wrapper.findComponent({ name: 'PCheckbox' })
    await checkbox.vm.$emit('update:modelValue', true)

    const confirmButton = wrapper.find('[data-testid="cgu-button-confirm"]')
    await confirmButton.trigger('click')
    expect(loggerErrorSpy).toHaveBeenCalledOnce()
  })
})
