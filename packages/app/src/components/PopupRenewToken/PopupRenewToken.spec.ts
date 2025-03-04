import { beforeEach, describe, expect, it } from 'vitest'
import { shallowMount } from '@vue/test-utils'
import PopupRenewToken from '.'
import type { PopupRenewTokenProps } from './PopupRenewToken.types'

const defaultProps: PopupRenewTokenProps = {
  isVisible: true,
  isTokenExpired: false,
  isCollab: false,
}
const createWrapper = (overrittenProps: Partial<PopupRenewTokenProps> = {}) => {
  const props = {
    ...defaultProps,
    ...overrittenProps,
  }

  return shallowMount(PopupRenewToken, {
    props,
    global: {
      stubs: {
        PDialog: {
          name: 'PDialog',
          template: '<div v-if="modelValue"><slot name="footer" /><slot /></div>',
          props: ['modelValue', 'beforeClose'],
        },
        PImage: true,
        PButton: true,
      },
    },
  })
}

describe('popup renew token', () => {
  let wrapper: ReturnType<typeof createWrapper>
  beforeEach(() => {
    wrapper = createWrapper()
  })

  it("should emit the 'update:modelValue' event when the v-model is updated", () => {
    const dialog = wrapper.findComponent({ name: 'PDialog' })
    dialog.vm.$emit('update:modelValue', false)

    expect(dialog.emitted('update:modelValue')).toStrictEqual([[false]])
  })

  it('close modal and logout when CLIENT clicks on logout button', () => {
    const tokenRenewalDialog = wrapper.findComponent({ name: 'PDialog' })
    const logoutButton = tokenRenewalDialog.find('[data-testid="logout-button"]')
    logoutButton.trigger('click')

    expect(wrapper.emitted('logout')).toStrictEqual([[]])
    expect(wrapper.emitted('close')).toBeUndefined()
  })

  it('close modal when COLLAB clicks on logout button', () => {
    const wrapper = createWrapper({
      isCollab: true,
    })
    const tokenRenewalDialog = wrapper.findComponent({ name: 'PDialog' })
    const logoutButton = tokenRenewalDialog.find('[data-testid="logout-button"]')
    logoutButton.trigger('click')

    expect(wrapper.emitted('logout')).toBeUndefined()
    expect(wrapper.emitted('close')).toStrictEqual([[]])
  })

  const tests = [{
    isTokenExpired: false,
    isCollab: false,
    expectedLogoutEmit: undefined,
    expectedRenewTokenEmit: [[]],
  }, {
    isTokenExpired: true,
    isCollab: false,
    expectedLogoutEmit: [[]],
    expectedRenewTokenEmit: undefined,
  }, {
    isTokenExpired: false,
    isCollab: true,
    expectedLogoutEmit: [[]],
    expectedRenewTokenEmit: undefined,
  }, {
    isTokenExpired: true,
    isCollab: true,
    expectedLogoutEmit: [[]],
    expectedRenewTokenEmit: undefined,
  }]
  it.each(tests)('should display properly when isTokenExpired is $isTokenExpired and isCollab is $isCollab', ({
    isTokenExpired,
    isCollab,
  }) => {
    const wrapper = createWrapper({
      isTokenExpired,
      isCollab,
    })

    expect(wrapper.html()).toMatchFileSnapshot(
      `__snap__/PopupRenewToken/wrapper.${isTokenExpired ? 'isTokenExpired' : 'tokenIsNotExpired'}.${isCollab ? 'isCollab' : 'isNotCollab'}.snap`,
    )
  })

  it.each(tests)('should emit properly when click on renew-token-button isTokenExpired is $isTokenExpired and isCollab is $isCollab', ({
    isTokenExpired,
    isCollab,
    expectedLogoutEmit,
    expectedRenewTokenEmit,
  }) => {
    const wrapper = createWrapper({
      isTokenExpired,
      isCollab,
    })

    const tokenRenewalDialog = wrapper.findComponent({ name: 'PDialog' })
    const renewTokenButton = tokenRenewalDialog.find('[data-testid="renew-token-button"]')
    renewTokenButton.trigger('click')

    expect(wrapper.emitted('logout')).toStrictEqual(expectedLogoutEmit)
    expect(wrapper.emitted('renew-token')).toStrictEqual(expectedRenewTokenEmit)
  })
})
