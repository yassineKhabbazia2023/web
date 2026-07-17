import type { Mock } from 'vitest'

import { shallowMount } from '@vue/test-utils'
import { useRouter } from 'vue-router'
import { loggerErrorSpy } from '@pulse/toolbox/mocks'
import { updateTermsByCurrentUserMock } from '@pulse/common/mocks/vitest'
import { RouteName } from '@pulse/common/enums'
import { CurrentUserManager } from '@pulse/common/managers'

import validationCGU from './ValidationCGU.vue'

let mockRouterPush: Mock

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
  beforeEach(() => {
    // Shared vue-router spies are armed per test (doctrine: shared-hubs).
    mockRouterPush = vi.fn()
    vi.mocked(useRouter).mockReturnValue({ push: mockRouterPush } as unknown as ReturnType<typeof useRouter>)
  })

  it('should redirect to home page after terms acceptation', async () => {
    const wrapper = createWrapper()

    const checkbox = wrapper.findComponent({ name: 'PCheckbox' })
    await checkbox.vm.$emit('update:modelValue', true)

    const confirmButton = wrapper.find('[data-testid="cgu-button-confirm"]')
    await confirmButton.trigger('click')
    expect(mockRouterPush).toHaveBeenCalledWith({ name: RouteName.LANDING })
  })

  it('should back to login page and logout', async () => {
    const CurrentUserManagerLogoutMock = vi.spyOn(CurrentUserManager, 'logout').mockResolvedValue()
    const wrapper = createWrapper()
    const backButton = wrapper.find('[data-testid="cgu-button-back"]')
    await backButton.trigger('click')
    expect(mockRouterPush).toHaveBeenCalledWith({ name: RouteName.LOGIN_CLIENT })
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
