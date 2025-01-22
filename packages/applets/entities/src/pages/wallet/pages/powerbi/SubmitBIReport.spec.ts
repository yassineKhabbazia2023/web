import { it, describe, vi, expect, beforeEach, type MockInstance } from 'vitest'
import { flushPromises, mount, type VueWrapper } from '@vue/test-utils'
import * as ReportService from '@entities/services/reporting'
import * as helpers from '@entities/common/utils'
import {
  getMockedBIReportTypes,
  getMockedReportUploadInfo,
  getMockedPowerBIReport,
} from './SubmitBIReportMocks'
import { nextTick } from 'vue'
import SubmitBIReport from '.'

// Mocks
const mockedPowerBIReport = getMockedPowerBIReport()
const mockedBIReportTypes = getMockedBIReportTypes()
const mockedReportUploadInfo = getMockedReportUploadInfo()
const loggerDebugSpy = vi.hoisted(() => vi.fn())
const loggerWarnSpy = vi.hoisted(() => vi.fn())
const loggerErrorSpy = vi.hoisted(() => vi.fn())

vi.mock('@pulse/core', () => ({
  logger: {
    debug: loggerDebugSpy,
    warn: loggerWarnSpy,
    error: loggerErrorSpy,
  },
}))

const uploadBIreportMock = vi.hoisted(() => vi.fn())
vi.mock('@entities/services/reporting', () => ({
  fetchBIReportTypes: vi.fn(() => Promise.resolve(mockedBIReportTypes)),
  uploadBIreport: uploadBIreportMock,
}))

const createWrapper = () => mount(SubmitBIReport)

describe('submitBIReport', () => {
  let wrapper: VueWrapper<any>
  beforeEach(() => {
    vi.useFakeTimers()
    wrapper = createWrapper()
  })
  describe('display', () => {
    it('should display correctly the submit new report page', () => {
      const uploadBIReport = wrapper.findComponent({ name: 'UploadBIReport' })
      const biReportInformation = wrapper.findComponent({
        name: 'BIReportInformation',
      })

      expect(uploadBIReport.exists()).toBeTruthy()
      expect(biReportInformation.exists()).toBeTruthy()
    })
  })
  describe('events', () => {
    it('should delete the report when the user resets or deletes it', () => {
      const uploadBIReport = wrapper.findComponent({ name: 'UploadBIReport' })
      uploadBIReport.vm.$emit('delete-report')

      expect(wrapper.vm.reportFile).toBeUndefined()
    })
    it("should emit 'upload-report' when the user uploads a BI report", () => {
      const uploadBIReport = wrapper.findComponent({ name: 'UploadBIReport' })
      uploadBIReport.vm.$emit('upload-report', mockedPowerBIReport)

      expect(wrapper.vm.reportFile).toStrictEqual(mockedPowerBIReport)
    })
    it('should reset all entered data and remove any uploaded reports when the reset button is clicked', async () => {
      const resetButton = wrapper.findComponent(
        '[data-testid=powerbi-reset-button]',
      )
      await resetButton.trigger('click')

      expect(wrapper.vm.reportFile).toBeUndefined()
      expect(wrapper.vm.reportUploadInfo).toStrictEqual({})
    })
    it('should reset all filled data and any uploaded report when a new report is successfully uploaded', async () => {
      wrapper.vm.isUploaded = true
      await nextTick()

      const biReportSubmitted = wrapper.findComponent({
        name: 'BIReportSubmitted',
      })
      biReportSubmitted.vm.$emit('submit-new-report')
      await nextTick()

      expect(wrapper.vm.isUploaded).toBeFalsy()
      expect(wrapper.vm.reportFile).toBeUndefined()
      expect(wrapper.vm.reportUploadInfo).toStrictEqual({})
    })
    it("should emit 'update:reportUploadInfo' when BI report information is changed", () => {
      const biReportInformation = wrapper.findComponent({
        name: 'BIReportInformation',
      })
      biReportInformation.vm.$emit(
        'update:reportUploadInfo',
        mockedReportUploadInfo,
      )

      expect(wrapper.vm.reportUploadInfo).toStrictEqual(mockedReportUploadInfo)
    })
    it('should invoke the reporting API upon clicking the validate button to submit a new report', async () => {
      const spyUploadBIreport = vi.spyOn(ReportService, 'uploadBIreport')
      wrapper = createWrapper()
      await flushPromises()
      const biReportInformation = wrapper.findComponent({
        name: 'BIReportInformation',
      })
      biReportInformation.vm.$emit(
        'update:reportUploadInfo',
        mockedReportUploadInfo,
      )
      const uploadBIReport = wrapper.findComponent({ name: 'UploadBIReport' })
      uploadBIReport.vm.$emit('upload-report', mockedPowerBIReport)
      await nextTick()
      const validationButton = wrapper.findComponent(
        '[data-testid=powerbi-validation-button]',
      )
      await validationButton.trigger('click')
      const {
        accountId,
        reportTypeId,
        reportLabel: reportName,
        reportId,
      } = mockedReportUploadInfo
      await flushPromises()

      expect(spyUploadBIreport).toHaveBeenCalledOnce()
      expect(spyUploadBIreport).toHaveBeenCalledWith(
        accountId,
        reportTypeId,
        mockedPowerBIReport,
        reportName,
        reportId,
      )
    })
    it('should display a console error when the upload of a new report fails', async () => {
      uploadBIreportMock.mockReturnValueOnce('Error')
      const expectedErrorMessage = 'API Error: 503 Service Unavailable'
      vi.spyOn(ReportService, 'uploadBIreport').mockRejectedValue(
        expectedErrorMessage,
      )
      wrapper = createWrapper()
      await flushPromises()
      const biReportInformation = wrapper.findComponent({
        name: 'BIReportInformation',
      })
      biReportInformation.vm.$emit(
        'update:reportUploadInfo',
        mockedReportUploadInfo,
      )
      const uploadBIReport = wrapper.findComponent({ name: 'UploadBIReport' })
      uploadBIReport.vm.$emit('upload-report', mockedPowerBIReport)
      await nextTick()

      const validationButton = wrapper.findComponent(
        '[data-testid=powerbi-validation-button]',
      )
      await validationButton.trigger('click')
      await flushPromises()

      expect(loggerErrorSpy).toHaveBeenCalledOnce()
      expect(loggerErrorSpy).toHaveBeenCalledWith(
        'Unable to upload BI report: ',
        expectedErrorMessage,
      )
    })
    it('should display an error notification when the upload of a new report fails', async () => {
      const expectedErrorMessage = 'API Error: 503 Service Unavailable'
      vi.spyOn(ReportService, 'uploadBIreport').mockRejectedValue(
        expectedErrorMessage,
      )
      const displayNotificationSpy = vi.spyOn(helpers, 'displayNotification')
      wrapper = createWrapper()
      await flushPromises()
      const biReportInformation = wrapper.findComponent({
        name: 'BIReportInformation',
      })
      biReportInformation.vm.$emit(
        'update:reportUploadInfo',
        mockedReportUploadInfo,
      )
      const uploadBIReport = wrapper.findComponent({ name: 'UploadBIReport' })
      uploadBIReport.vm.$emit('upload-report', mockedPowerBIReport)
      await nextTick()

      const validationButton = wrapper.findComponent(
        '[data-testid=powerbi-validation-button]',
      )
      await validationButton.trigger('click')
      await flushPromises()

      expect(wrapper.vm.isReportSubmissionDisabled).toBeTruthy()
      vi.advanceTimersByTime(2000) // 2 seconds
      expect(wrapper.vm.isReportSubmissionDisabled).toBeFalsy()
      expect(displayNotificationSpy).toHaveBeenCalledOnce()
      expect(displayNotificationSpy).toHaveBeenCalledWith(
        'error',
        'A problem occurred when submitting your report. Please try again or contact the support',
      )
    })
    it('should invoke the reporting API to fetch report types', async () => {
      const spyFetchBIReportTypes = vi.spyOn(
        ReportService,
        'fetchBIReportTypes',
      )
      wrapper = createWrapper()
      await flushPromises()

      expect(spyFetchBIReportTypes).toHaveBeenCalledOnce()
    })
    it('should display a console error when failing to fetch report types', async () => {
      const expectedErrorMessage = 'API Error: 503 Service Unavailable'
      vi.spyOn(ReportService, 'fetchBIReportTypes').mockRejectedValue(
        expectedErrorMessage,
      )
      wrapper = createWrapper()
      await flushPromises()

      expect(loggerErrorSpy).toHaveBeenCalledOnce()
      expect(loggerErrorSpy).toHaveBeenCalledWith(
        'Unable to fetch report types: ',
        expectedErrorMessage,
      )
    })
  })
})
