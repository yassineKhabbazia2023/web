import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { mount, VueWrapper } from '@vue/test-utils'
import { waitForAsyncImports } from '@kpmg/common/src/testing-helpers'
import Login from './'

const USER_ID = 'customUserId'
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
        email: _email
      }
    })
})

vi.mock('vue-router', () => ({
  useRouter: () => ({
    push: mockRouterPush
  })
}))

vi.mock('@kpmg/common', async () => ({
  commonApi: () => ({
    auth: {
      post: mockAuthPost
    }
  }),
  commonStore: () => ({
    $patch: mockStorePatch
  })
}))

let wrapper: VueWrapper<any>

const createWrapper = () =>
  mount(Login, {
    global: {
      stubs: ['router-link']
    }
  })

const getForm = () => wrapper.find('form')
const getInputEmail = () => wrapper.findAll('input')[0]
const getInputPassword = () => wrapper.findAll('input')[1]

describe('login', () => {
  beforeEach(async () => {
    wrapper = createWrapper()
    await waitForAsyncImports(40)
  })

  afterEach(() => {
    wrapper.unmount()
  })

  it('fill the login page and has a redirection to the home page', async () => {
    const INPUT_EMAIL_VALUE = 'customEmail@aol.com'
    const INPUT_PASSWORD_VALUE = 'customPassword'

    await getInputEmail().setValue(INPUT_EMAIL_VALUE)
    await getInputPassword().setValue(INPUT_PASSWORD_VALUE)

    await wrapper.vm.handleSubmit(getForm())

    expect(mockAuthPost).toHaveBeenCalledTimes(1)
    expect(mockAuthPost).toHaveBeenCalledWith('login', {
      email: INPUT_EMAIL_VALUE,
      password: INPUT_PASSWORD_VALUE
    })

    expect(mockStorePatch).toHaveBeenCalledTimes(1)
    expect(mockStorePatch).toHaveBeenCalledWith({
      user: {
        id: USER_ID,
        token: WEB_TOKEN,
        isCollab: false
      }
    })

    expect(mockRouterPush).toHaveBeenCalledTimes(1)
    expect(mockRouterPush).toHaveBeenCalledWith('/entities')
  })

  it('does not redirect to the home page if the api return an error', async () => {
    wrapper = createWrapper()
    await waitForAsyncImports(40)

    await getInputEmail().setValue('error@aol.com')
    await getInputPassword().setValue('error')

    await wrapper.vm.handleSubmit(getForm())

    expect(mockRouterPush).not.toHaveBeenCalled()
  })

  it('has a link to resetPassword page', async () => {
    wrapper = createWrapper()
    const forgotPasswordBtn = wrapper.find('.forgot-password-btn')
    expect(forgotPasswordBtn.attributes('to')).toBe('/resetPassword')
  })
})
