import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { mount, VueWrapper } from '@vue/test-utils'
import { waitForAsyncImports } from '@kpmg/common/src/testing-helpers'
import LoginCollab from './'

vi.mock('env-vars', () => {
  const VITE_API_PORTAL = ''
  const VITE_VARIABLE_1 = ''
  const VITE_API_MSAL_CLIENT_ID = ''
  const VITE_API_MSAL_TENANT = ''
  const VITE_API_MSAL_AUTHORITY = ''
  const VITE_API_MSAL_REDIRECT_URI = ''
  const VITE_API_MSAL_POST_LOGOUT_REDIRECT_URI = ''
  const VITE_API_MSAL_SCOPE = ''
  return {
    VITE_API_PORTAL,
    VITE_VARIABLE_1,
    VITE_API_MSAL_CLIENT_ID,
    VITE_API_MSAL_TENANT,
    VITE_API_MSAL_AUTHORITY,
    VITE_API_MSAL_REDIRECT_URI,
    VITE_API_MSAL_POST_LOGOUT_REDIRECT_URI,
    VITE_API_MSAL_SCOPE
  }
})

vi.mock('@/services/msal', () => {
  return {
    msalInstance: vi.fn()
  }
})
let wrapper: VueWrapper<any>
const createWrapper = () =>
  mount(LoginCollab)

describe('loginCollab', () => {
  beforeEach(async () => {
    wrapper = createWrapper()
    await waitForAsyncImports(40)
  })

  afterEach(() => {
    wrapper.unmount()
  })

  it('render correctly', async () => {
    expect(wrapper.exists()).toBeTruthy()
  })
})
