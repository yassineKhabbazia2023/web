import { shallowMount } from '@vue/test-utils'
import { describe, it, expect, beforeEach } from 'vitest'
import { ReportActionsProps } from './report-actions.type'

import ReportActions from '.'

const props: ReportActionsProps = {
  reportLabel: 'Test Report',
  powerBIConfig: {
    uniqueId: 'mocked-id',
    type: 'mocked-type',
    accessToken: 'mocked-token',
    embedUrl: 'mocked-url',
  },
}

const createWrapper = () => {
  return shallowMount(ReportActions, {
    props,
    global: {
      stubs: {
        PButton: {
          name: 'PButton',
          template: '<button><slot /></button>',
        },
        PIcon: true,
        PowerBIReportViewer: {
          name: 'PowerBIReportViewer',
          template: '<div data-testid="powerbi-viewer" />',
          props: ['modelValue', 'reportLabel', 'powerBIConfig'],
          emits: ['update:modelValue'],
        },
      },
    },
  })
}

describe('ReportActions component', () => {
  let wrapper: ReturnType<typeof createWrapper>

  beforeEach(() => {
    wrapper = createWrapper()
  })

  it('renders the fullscreen button with the correct icon', () => {
    const fullscreenButton = wrapper.findComponent({ name: 'PButton' })
    expect(fullscreenButton.exists()).toBe(true)

    const pIcon = wrapper.findComponent({ name: 'PIcon' })
    expect(pIcon.exists()).toBe(true)
  })

  it('opens the PowerBIReportViewer on fullscreen button click', async () => {
    const fullscreenButton = wrapper.findComponent({ name: 'PButton' })
    const reportViewer = wrapper.findComponent({ name: 'PowerBIReportViewer' })
    const expectedProps = {
      modelValue: true,
      reportLabel: props.reportLabel,
      powerBIConfig: props.powerBIConfig,
    }
    await fullscreenButton.trigger('click')

    expect(reportViewer.props()).toStrictEqual(expectedProps)
  })
})
