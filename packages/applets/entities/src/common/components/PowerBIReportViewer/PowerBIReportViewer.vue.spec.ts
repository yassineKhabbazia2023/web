import { nextTick } from 'vue'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { shallowMount } from '@vue/test-utils'
import { PowerBIReportViewerProps } from './power-bi-report-viewer.types'

import PowerBIReportViewer from '.'

const PIconStub = {
  name: 'PIcon',
  props: ['pName'],
  template: '<div />',
}

const PDocumentViewerStub = {
  name: 'PDocumentViewer',
  props: ['modelValue', 'pSize', 'pHasPagination', 'pTitleDocument', 'pActiveDocument', 'pTotalDocuments'],
  emits: ['update:modelValue', 'opened'],
  template: '<div><slot name="iconDocument" /><slot name="media" /></div>',
}

const defaultProps: PowerBIReportViewerProps = {
  modelValue: false,
  reportLabel: 'Test Report',
  powerBIConfig: {
    uniqueId: 'mocked-id',
    type: 'mocked-type',
    accessToken: 'mocked-token',
    embedUrl: 'mocked-url',
  },
}

function createWrapper(props: Partial<PowerBIReportViewerProps> = {}) {
  return shallowMount(PowerBIReportViewer, {
    props: {
      ...defaultProps,
      ...props,
    },
    global: {
      stubs: {
        PIcon: PIconStub,
        PDocumentViewer: PDocumentViewerStub,
      },
    },
  })
}

describe('PowerBIReportViewer', () => {
  let embedMock: ReturnType<typeof vi.fn>

  beforeEach(() => {
    embedMock = vi.fn()
    // @ts-ignore
    // To avoid mocking all properties since only 'embed' is needed
    window.powerbi = { embed: embedMock }
  })

  it('passes correct props to PDocumentViewer and renders slots', () => {
    const wrapper = createWrapper()
    const reportViewer = wrapper.findComponent({ name: 'PDocumentViewer' })
    const expectedProps = {
      modelValue: false,
      pSize: '100%',
      pHasPagination: false,
      pTitleDocument: defaultProps.reportLabel,
      pActiveDocument: 1,
      pTotalDocuments: 1,
    }

    expect(reportViewer.exists()).toBe(true)
    expect(reportViewer.props()).toStrictEqual(expectedProps)
  })

  it('updates isReportViewerVisible when modelValue changes', async () => {
    const wrapper = createWrapper()
    const reportViewer = wrapper.findComponent({ name: 'PDocumentViewer' })

    reportViewer.vm.$emit('update:modelValue', true)
    await nextTick()

    expect(reportViewer.props('modelValue')).toBe(true)
  })

  it('calls loadBIReportFullscreen on opened event and calls window.powerbi.embed with correct arguments', async () => {
    const wrapper = createWrapper()
    const fullscreenReportIframe = wrapper.find('[data-testid=fullscreen-report-iframe]')

    const reportViewer = wrapper.findComponent({ name: 'PDocumentViewer' })
    reportViewer.vm.$emit('opened')
    await nextTick()

    expect(embedMock).toHaveBeenCalledOnce()
    expect(embedMock).toHaveBeenCalledWith(fullscreenReportIframe.element, defaultProps.powerBIConfig)
  })
})
