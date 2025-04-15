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

const pNotificationMock = vi.hoisted(() => vi.fn())
vi.mock('@pulse/styleguide', () => ({
  PNotification: pNotificationMock,
}))
const postMock = vi.fn(() => true)
vi.mock('@pulse/common', () => ({
  commonApi: () => ({
    gateway: {
      post: postMock,
    },
  }),
}))
describe('page expire token', () => {
  it('should call endpoint when click on button', async () => {
    const contactId = 'contact id'
    const accountNumber = '3590284870'
    mockUseRoute.mockReturnValue({
      query: {
        contactId,
        accountNumber,
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
    expect(postMock).toHaveBeenCalledWith(expectedUrl, null, { params: { accountNumber } })
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

  it('should catch API error and display a technical error notification', async () => {
    // Arrange
    const contactEmail = 'contact email'
    const expectedError = 'API Error: 403 Forbidden'

    postMock.mockRejectedValue(expectedError)
    mockUseRoute.mockReturnValue({
      query: { contactEmail },
    })

    const wrapper = createWrapper()

    const expectedUrl = 'authentication/api/sendResetPasswordLink'
    const expectedPayload = {
      email: 'contact+email',
    }

    const expectedNotification = {
      message: 'A technical error has occurred. Please try again in a few moments.',
      iconName: 'x',
      showClose: true,
      customClass: 'error',
      position: 'bottom-right',
    }

    // Act
    await wrapper.find('.btn-link').trigger('click')
    await flushPromises()

    // Assert
    expect(postMock).toHaveBeenCalledTimes(1)
    expect(postMock).toHaveBeenCalledWith(expectedUrl, expectedPayload)
    expect(pNotificationMock).toHaveBeenCalledTimes(1)
    expect(pNotificationMock).toHaveBeenCalledWith(expectedNotification)
  })

})
