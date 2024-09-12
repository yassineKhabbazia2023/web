import { describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import validationCGU from './'

const mockRouterPush = vi.fn()
const mockRouterBack = vi.fn()

vi.mock('vue-router', () => ({
  useRouter: () => ({
    push: mockRouterPush,
    back: mockRouterBack,
  }),
}))

vi.mock('@kpmg/common', () => ({
  fetchUrlTerms: vi.fn(),
}))

const updateTermsByCurrentUserMocked = vi.hoisted(() => vi.fn())
vi.mock('@/services/cgu', () => ({
  updateTermsByCurrentUser: updateTermsByCurrentUserMocked,
}))

const createWrapper = () =>
  mount(validationCGU, {
    props: {
      termsId: '123456789',
    },
  })

describe('cgu validation', () => {
  it('should redirect to home page after terms acceptation', async () => {
    const wrapper = createWrapper()
    const getCheckbox = () => wrapper.find('input')
    await getCheckbox().setValue(true)

    const confirmButton = wrapper.find('[data-testid="cgu-button-confirm"]')
    await confirmButton.trigger('click')
    expect(mockRouterPush).toHaveBeenCalledWith({ name: 'wallet-client' })
  })

  it('should back to previous page', async () => {
    const wrapper = createWrapper()
    const backButton = wrapper.find('[data-testid="cgu-button-back"]')
    await backButton.trigger('click')
    expect(mockRouterBack).toHaveBeenCalledWith()
  })

  it('should emit console error when updateTermsByCurrentUser throws an error', async () => {
    const errorMessage = 'error-message'
    updateTermsByCurrentUserMocked.mockRejectedValueOnce(new Error(errorMessage))
    const consoleErrorSpy = vi.spyOn(console, 'error')

    const wrapper = createWrapper()
    const getCheckbox = () => wrapper.find('input')
    await getCheckbox().setValue(true)

    const confirmButton = wrapper.find('[data-testid="cgu-button-confirm"]')
    await confirmButton.trigger('click')
    expect(consoleErrorSpy).toHaveBeenCalledOnce()
  })
})
