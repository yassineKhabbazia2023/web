import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { mount, VueWrapper } from '@vue/test-utils'
import LoginCollab from './'

vi.mock('env-vars', () => ({
  VITE_API_PORTAL: '',
  VITE_API_MSAL_CLIENT_ID: '',
  VITE_API_MSAL_TENANT: '',
  VITE_API_MSAL_AUTHORITY: '',
  VITE_API_MSAL_REDIRECT_URI: '',
  VITE_API_MSAL_POST_LOGOUT_REDIRECT_URI: '',
  VITE_API_MSAL_SCOPE: ''
}))

vi.mock('@/services/msal', () => ({
  msalInstance: vi.fn(),
  getToken: vi.fn()
}))
let wrapper: VueWrapper<any>
const createWrapper = () =>
  mount(LoginCollab)

describe('loginCollab', () => {
  beforeEach(async () => {
    wrapper = createWrapper()
  })

  afterEach(() => {
    wrapper.unmount()
  })

  it('render correctly', () => {
    expect(wrapper.exists()).toBeTruthy()
  })
})
