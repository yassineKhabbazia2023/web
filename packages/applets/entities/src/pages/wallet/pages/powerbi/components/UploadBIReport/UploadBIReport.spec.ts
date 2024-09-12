import { expect, describe, it, beforeEach } from 'vitest'
import { mount, type VueWrapper } from '@vue/test-utils'
import UploadBIReport from '.'

// Mocks
const mockedBIReports = [
  new File(['PBX File for test 1'], 'my-report1.pbx'),
  new File(['PBX File for test 2'], 'my-report2.pbx'),
]

const createWrapper = () => mount(UploadBIReport)

describe('uploadBIReport', () => {
  let wrapper: VueWrapper
  beforeEach(() => {
    wrapper = createWrapper()
  })
  describe('display', () => {
    it('should ensure the BI report uploader displays correctly', () => {
      const reportUploader = wrapper.findComponent({ name: 'PUpload' })

      expect(reportUploader.exists()).toBeTruthy()
    })
  })
  describe('events', () => {
    it("should emit 'upload-report' when uploading a BI report", () => {
      const reportUploader = wrapper.findComponent({ name: 'PUpload' })
      reportUploader.vm.$emit('files-selected', mockedBIReports)

      expect(wrapper.emitted('upload-report')).toStrictEqual([
        [mockedBIReports[0]],
      ])
    })
    it("should emit 'delete-report' when removing the BI report", () => {
      const reportUploader = wrapper.findComponent({ name: 'PUpload' })
      reportUploader.vm.$emit('delete-file')

      expect(wrapper.emitted('delete-report')).toBeTruthy()
    })
  })
})
