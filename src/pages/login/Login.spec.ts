import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import type { VueWrapper } from '@vue/test-utils'
import { mount } from '@vue/test-utils'
import Login from './'
import { tokenService } from '@kpmg/common'
import { getTermsByContactId } from '@/services/cgu'

const USER_ID = 'customUserId'
const GIGYA_USER_ID = 'customGigyaUserId'
const WEB_TOKEN = 'customToken'

const mockStorePatch = vi.fn()
const mockRouterPush = vi.fn()
const mockAuthPost = vi.fn((_url, { _email, password }) => {
  return password === 'error'
    ? Promise.reject(new Error('Invalid password'))
    : Promise.resolve({
      data: {
        userId: USER_ID,
        webToken: WEB_TOKEN,
        email: _email,
      },
    })
})

vi.mock('vue-router', () => ({
  useRouter: () => ({
    push: mockRouterPush,
  }),
}))

vi.mock('@kpmg/common', () => ({
  commonApi: () => ({
    gateway: {
      post: mockAuthPost,
    },
  }),
  commonStore: () => ({
    $patch: mockStorePatch,
  }),
  tokenService: {
    setToken: vi.fn(),
  },
}))
vi.mock('@/composable/useInitUserAuth', () => ({
  default: () => ({
    initAuthClient: vi.fn(() => {
      mockStorePatch({
        user: {
          id: USER_ID,
          isCollab: false,
        },
      })
      return { id: USER_ID }
    }),
    setStoreGigyaUserId: vi.fn(() => {
      mockStorePatch({
        user: {
          gigyaUserId: GIGYA_USER_ID,
        },
      })
    }),
  }),
}))

vi.mock('@/services/cgu', () => ({
  getTermsByContactId: vi
    .fn(() => Promise.resolve({
      isCurrent: true,
      terms: {
        termsId: '123456',
      },
    })),
}))
let wrapper: VueWrapper<any>

const createWrapper = () =>
  mount(Login, {
    global: {
      stubs: ['router-link'],
    },
  })

const getForm = () => wrapper.find('form')
const getInputEmail = () => wrapper.findAll('input')[0]
const getInputPassword = () => wrapper.findAll('input')[1]

const INPUT_EMAIL_VALUE = 'customEmail@aol.com'
const INPUT_PASSWORD_VALUE = 'customPassword'

describe('login', () => {
  beforeEach(() => {
    wrapper = createWrapper()
  })

  afterEach(() => {
    wrapper.unmount()
  })

  it('fill the login page and has a redirection to the home page', async () => {
    const setTokenSpy = vi.spyOn(tokenService, 'setToken')

    await getInputEmail().setValue(INPUT_EMAIL_VALUE)
    await getInputPassword().setValue(INPUT_PASSWORD_VALUE)

    await wrapper.vm.handleSubmit(getForm())

    expect(mockAuthPost).toHaveBeenCalledTimes(1)
    expect(mockAuthPost).toHaveBeenCalledWith('authentication/api/login', {
      email: INPUT_EMAIL_VALUE,
      password: INPUT_PASSWORD_VALUE,
    })

    expect(mockStorePatch).toHaveBeenCalledTimes(2)
    expect(mockStorePatch).toHaveBeenCalledWith({
      user: {
        id: USER_ID,
        isCollab: false,
      },
    })
    expect(mockStorePatch).toHaveBeenCalledWith({
      user: {
        gigyaUserId: GIGYA_USER_ID,
      },
    })

    expect(setTokenSpy).toHaveBeenNthCalledWith(1, WEB_TOKEN)
    expect(mockRouterPush).toHaveBeenCalledWith({ name: 'wallet-client' })
  })

  it('does not redirect to the home page if the api return an error', async () => {
    await getInputEmail().setValue('error@aol.com')
    await getInputPassword().setValue('error')

    await wrapper.vm.handleSubmit(getForm())

    expect(mockRouterPush).not.toHaveBeenCalled()
  })

  it('has a link to resetPassword page', () => {
    const forgotPasswordBtn = wrapper.find('.forgot-password-btn')
    expect(forgotPasswordBtn.attributes('to')).toBe('/resetPassword')
  })

  it('should route to cgu validation page', async () => {
    vi.mocked(getTermsByContactId).mockResolvedValueOnce({
      isCurrent: false,
      terms: {
        termsId: 123456,
      },
    })
    wrapper = createWrapper()
    await getInputEmail().setValue(INPUT_EMAIL_VALUE)
    await getInputPassword().setValue(INPUT_PASSWORD_VALUE)

    await wrapper.vm.handleSubmit(getForm())
    expect(mockRouterPush).toHaveBeenCalledWith({
      name: 'validationCGU',
      params: { termsId: 123456, userId: USER_ID },
    })
  })
})
