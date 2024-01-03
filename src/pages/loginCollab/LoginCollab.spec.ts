import { beforeEach, describe, expect, it, vi } from 'vitest'
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

vi.mock('@/composable/useInitUserAuth', () => ({
  default: () => {
    return {
      initAuthCollab: vi.fn(),
      isTokenRetrieve: {
        value: true
      }
    }
  }
}))

const navigateToEntitiesMock = vi.fn()
vi.mock('@/composable/useNavigation', () => ({
  default: () => {
    return {
      navigateToEntities: navigateToEntitiesMock
    }
  }
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

  it('render correctly', () => {
    expect(wrapper.exists()).toBeTruthy()
  })

  it('should redirect to entities when the authentication is done', () => {
    expect(navigateToEntitiesMock).toHaveBeenCalledTimes(1)
  })
})
