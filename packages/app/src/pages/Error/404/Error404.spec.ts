import { it, describe, expect, vi } from 'vitest'
import { shallowMount, type VueWrapper } from '@vue/test-utils'
import { nextTick } from 'vue'
import { redirectToHomeMock, useRedirectionMock } from '@app/__mocks__/useRedirection.composable.mocks'

import Error404 from '.'

vi.mock('@app/composables/useRedirection', () => useRedirectionMock)

const createWrapper = (): VueWrapper =>
  shallowMount(Error404, {
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

describe('404', () => {
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
