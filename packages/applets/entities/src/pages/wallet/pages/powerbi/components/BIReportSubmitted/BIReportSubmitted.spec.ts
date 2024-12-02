import { describe, expect, it, beforeEach } from 'vitest'
import { mount, type VueWrapper } from '@vue/test-utils'
import BIReportSubmitted from '.'

// Mocks
const mockedAccountLabel = 'Boulangerie Bel Epi'

// Expectations
const expectedUploadSuccessMessage = `The BI report has been successfully submitted to  ${mockedAccountLabel}`

const createWrapper = () => {
  return mount(BIReportSubmitted, {
    props: {
      accountLabel: mockedAccountLabel,
    },
  })
}

describe('biReportSubmitted', () => {
  let wrapper: VueWrapper
  beforeEach(() => {
    wrapper = createWrapper()
  })
  describe('display', () => {
    it('should correctly display the upload report success page', () => {
      const uploadReportSuccessMessage = wrapper.find(
        '[data-testid=powerbi-upload-successful-text]',
      )
      const submitNewReportButton = wrapper.find(
        '[data-testid=powerbi-submit-new-report-button]',
      )

      expect(submitNewReportButton.exists()).toBeTruthy()
      expect(uploadReportSuccessMessage.text()).toBe(
        expectedUploadSuccessMessage,
      )
    })
  })
  describe('events', () => {
    it("should emit 'submit-new-report' when clicking on 'Upload New Report'", async () => {
      const submitNewReportButton = wrapper.find(
        '[data-testid=powerbi-submit-new-report-button]',
      )
      await submitNewReportButton.trigger('click')

      expect(wrapper.emitted('submit-new-report')).toBeTruthy()
    })
  })
})
