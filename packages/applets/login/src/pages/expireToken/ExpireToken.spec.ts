import { describe, expect, it, vi } from 'vitest'
import { flushPromises, mount } from '@vue/test-utils'
import ExpireToken from './ExpireToken.vue'

const mockRouterPush = vi.hoisted(() => vi.fn())
const mockUseRoute = vi.hoisted(() => vi.fn())

vi.mock('vue-router', () => ({
  useRouter: () => ({
    push: mockRouterPush,
  }),
  useRoute: mockUseRoute,
}))

const createWrapper = () => mount(ExpireToken)

const postMock = vi.fn(() => true)

vi.mock('@kpmg/common', () => ({
  commonApi: () => ({
    gateway: {
      post: postMock,
    },
  }),
}))
describe('page expire token', () => {
  it('should call endpoint when click on button', async () => {
    const contactId = 'contact id'
    mockUseRoute.mockReturnValue({
      query: {
        contactId,
      },
    })
    const wrapper = createWrapper()
    const expectedUrl = `account/api/customers/invite/${contactId}`
    const expectedRoute = {
      path: '/resendEmailSuccess',
    }

    wrapper.find('.btn-link').trigger('click')
    await flushPromises()

    expect(postMock).toHaveBeenCalledOnce()
    expect(postMock).toHaveBeenCalledWith(expectedUrl)
    expect(mockRouterPush).toHaveBeenCalledOnce()
    expect(mockRouterPush).toHaveBeenCalledWith(expectedRoute)
  })

  it('should call endpoint when click on button and contactEmail is given', async () => {
    const contactEmail = 'contact email'
    mockUseRoute.mockReturnValue({
      query: {
        contactEmail,
      },
    })
    const wrapper = createWrapper()
    const expectedUrl = 'authentication/api/sendResetPasswordLink'
    const expectedPayload = {
      email: 'contact+email',
    }
    const expectedRoute = {
      path: '/resendEmailSuccess',
    }

    wrapper.find('.btn-link').trigger('click')
    await flushPromises()

    expect(postMock).toHaveBeenCalledOnce()
    expect(postMock).toHaveBeenCalledWith(expectedUrl, expectedPayload)
    expect(mockRouterPush).toHaveBeenCalledOnce()
    expect(mockRouterPush).toHaveBeenCalledWith(expectedRoute)
  })
})
