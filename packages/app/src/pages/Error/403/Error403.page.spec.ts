import { it, describe, expect, vi } from 'vitest'
import { shallowMount, type VueWrapper } from '@vue/test-utils'
import { redirectToHomeMock, useRedirectionMock } from '@app/__mocks__/useRedirection.composable.mocks'
import { nextTick } from 'vue'

import Error403 from './Error403.page.vue'

vi.mock('@app/composables/useRedirection', () => useRedirectionMock)

const createWrapper = (): VueWrapper =>
  shallowMount(Error403, {
    global: {
      stubs: {
        PError: {
          name: 'PError',
          template:
            '<div><slot name="title"></slot></div><div><slot name="footer"></slot></div>',
          props: [
            'pDescription',
            'pButtonText',
            'pErrorName',
            'pErrorText',
            'pIllustrationName',
            'pTitle',
          ],
          emits: ['handle-click'],
        },
      },
    },
  })

describe('403', () => {
  describe('events', () => {
    it('should redirect to home when click button', async () => {
      const wrapper = createWrapper()
      const pError = wrapper.findComponent({ name: 'PError' })
      await nextTick()
      pError.vm.$emit('handle-click')

      expect(redirectToHomeMock).toHaveBeenCalledOnce()
    })
  })
})
