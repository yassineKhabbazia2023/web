import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  vi
} from 'vitest'
import { flushPromises, mount, VueWrapper } from '@vue/test-utils'
import ResetPassword from './'
import ElementPlus, {
  ElForm as PForm,
  ElFormItem as PFormItem,
  ElInput as PInput,
  ElButton as PButton,
  ElImage as PImage
} from 'element-plus'

vi.mock('vue-router', () => ({
  useRouter: () => ({
    push: mockRouterPush
  })
}))

const mockRouterPush = vi.fn()
const mockAuthPost = vi.fn((_url, { email }) => {
  return email === ''
    ? Promise.reject(new Error('Email required'))
    : Promise.resolve()
})
vi.mock('@kpmg/common', async () => ({
  commonApi: () => ({
    auth: {
      post: mockAuthPost
    }
  })
}))

let wrapper: VueWrapper<any>
const createWrapper = () =>
  mount(ResetPassword, {
    global: {
      plugins: [ElementPlus],
      components: {
        PForm,
        PFormItem,
        PInput,
        PButton,
        PImage
      }
    }
  })

const getForm = () => wrapper.find('form')
const getInputEmail = () => wrapper.findAll('input')[0]

describe('reset password', () => {
  beforeEach(() => {
    wrapper = createWrapper()
  })

  afterEach(() => {
    wrapper.unmount()
  })

  it('validate the reset password form and has a redirection to the success page', async () => {
    const INPUT_EMAIL_VALUE = 'customEmail@aol.com'
    await vi.dynamicImportSettled()
    await wrapper.vm.$nextTick()
    await flushPromises()
    const elForm = wrapper.find('form')
    expect(elForm.exists()).toBeTruthy()

    await getInputEmail().setValue(INPUT_EMAIL_VALUE)
    await wrapper.vm.handleSubmit(getForm())

    expect(mockAuthPost).toHaveBeenCalledTimes(1)
    expect(mockAuthPost).toHaveBeenCalledWith('sendResetPasswordLink', {
      email: INPUT_EMAIL_VALUE
    })

    expect(mockRouterPush).toHaveBeenCalledWith({
      path: '/resetpasswordsuccess',
      query: {
        email: 'customEmail@aol.com'
      }
    })
  })
})
