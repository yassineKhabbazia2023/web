import { shallowMount } from '@vue/test-utils'
import PopupRenewToken from '.'
import type { PopupRenewTokenProps } from './PopupRenewToken.types'

const defaultProps: PopupRenewTokenProps = {
  isVisible: true,
  isTokenExpired: false,
  isCollab: false,
}
const createWrapper = (overriddenProps: Partial<PopupRenewTokenProps> = {}) => {
  const props = {
    ...defaultProps,
    ...overriddenProps,
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
  it.each(tests)('should display properly when isTokenExpired is $isTokenExpired and isCollab is $isCollab', async ({
    isTokenExpired,
    isCollab,
  }) => {
    const wrapper = createWrapper({
      isTokenExpired,
      isCollab,
    })

    await expect(wrapper.html()).toMatchFileSnapshot(
      `__snap__/PopupRenewToken/wrapper.${isTokenExpired ? 'isTokenExpired' : 'tokenIsNotExpired'}.${isCollab ? 'isCollab' : 'isNotCollab'}.snap`,
    )
  })
})
