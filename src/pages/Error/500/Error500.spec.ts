import { it, describe, expect, vi } from 'vitest'
import { shallowMount, type VueWrapper } from '@vue/test-utils'
import Error500 from '.'
import { nextTick } from 'vue'

const createWrapper = (): VueWrapper =>
  shallowMount(Error500, {
    global: {
      stubs: {
        PError: {
          name: 'PError',
          template:
            '<div><slot name="title"></slot></div><div><slot name="footer"></slot></div>',
          emits: ['handle-click'],
        },
      },
    },
  })
const mockRedirectToHome = vi.fn()

vi.mock('@/composables/useRedirection', () => ({
  useRedirection: () => ({
    redirectToHome: mockRedirectToHome,
  }),
}))

describe('500', () => {
  describe('events', () => {
    it('should redirect to home when click button', async () => {
      const wrapper = createWrapper()
      const pError = wrapper.findComponent({ name: 'PError' })
      await nextTick()
      pError.vm.$emit('handle-click')

      expect(mockRedirectToHome).toHaveBeenCalledOnce()
    })
  })
})
