import { nextTick } from 'vue'
import { shallowMount } from '@vue/test-utils'
import { PowerBIReportViewerProps } from './power-bi-report-viewer.types'

import PowerBIReportViewer from './PowerBIReportViewer.vue'

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
    // To avoid mocking all properties since only 'embed' is needed
    // @ts-ignore-next-line
    window.powerbi = { embed: embedMock }
  })

  it('calls loadBIReportFullscreen on opened event and calls window.powerbi.embed with correct arguments', async () => {
    const wrapper = createWrapper()
    const fullscreenReportIframe = wrapper.find('[data-testid=fullscreen-report-iframe]')

    const reportViewer = wrapper.findComponent({ name: 'PDocumentViewer' })
    reportViewer.vm.$emit('opened')
    await nextTick()

    expect(embedMock).toHaveBeenCalledExactlyOnceWith(fullscreenReportIframe.element, defaultProps.powerBIConfig)
  })
})
