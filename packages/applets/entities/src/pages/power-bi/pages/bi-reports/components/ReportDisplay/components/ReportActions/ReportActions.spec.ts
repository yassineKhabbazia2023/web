import { expect, describe } from 'vitest'
import { nextTick } from 'vue'
import { shallowMount } from '@vue/test-utils'
import type { ComponentWrapper } from '@entities/common/types'
import ReportActions from '.'

const createWrapper = () => {
  return shallowMount(ReportActions, {
    props: {
      reportLabel: 'Test Report',
      powerBIConfig: {
        id: 'mocked-id',
        type: 'mocked-report',
        accessToken: 'mocked-access-token',
        embedUrl: 'mocked-embed-url',
      },
    },
    global: {
      stubs: {
        PDocumentViewer: {
          name: 'PDocumentViewer',
          template: '<div><slot name="media" /><slot name="iconDocument" /></div>',
          props: ['modelValue'],
        },
      },
    },
  })
}

describe('ReportActions component', () => {
  let wrapper: ComponentWrapper<InstanceType<typeof ReportActions>>

  beforeEach(() => {
    wrapper = createWrapper()
  })

  describe('display functionality', () => {
    it('should display the fullscreen button', () => {
      const fullscreenButton = wrapper.findComponent({ name: 'PButton' })

      expect(fullscreenButton.exists()).toBeTruthy()
    })

    it('should display the document viewer when the fullscreen button is clicked', async () => {
      const fullscreenButton = wrapper.findComponent({ name: 'PButton' })
      const reportIcon = wrapper.findComponent({ name: 'PIcon' })

      fullscreenButton.trigger('click')
      await nextTick()

      const powerbiIframe = wrapper.find('[data-testid="fullscreen-report-iframe"]')

      expect(reportIcon.exists()).toBeTruthy()
      expect(reportIcon.props('pName')).toBe('filetypePbx')
      expect(powerbiIframe.exists()).toBeTruthy()
    })
  })

  describe('event handling', () => {
    it('should display the document viewer when the fullscreen button is clicked', async () => {
      const fullscreenButton = wrapper.findComponent({ name: 'PButton' })

      await fullscreenButton.trigger('click')

      const reportViewer = wrapper.findComponent({ name: 'PDocumentViewer' })
      expect(reportViewer.props('modelValue')).toBeTruthy()
    })
  })
})
