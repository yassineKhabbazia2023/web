import { expect, it, describe, beforeEach } from 'vitest'
import { mount, type VueWrapper } from '@vue/test-utils'
import ReportCard from '.'

// Mocks
const mockedFileName = 'Test Report'

// Expectations
const expectedFileUpdatedOn = 'Updated on 5/30/2024'

const createWrapper = (): VueWrapper<any> => {
  return mount(ReportCard, {
    props: {
      name: mockedFileName,
      updatedDate: '2024-05-30T09:53:43.68',
    },
  })
}

describe('reportCard', () => {
  let wrapper: VueWrapper<any>
  beforeEach(() => {
    wrapper = createWrapper()
  })
  describe('display', () => {
    it('should display correctly', () => {
      const fileIcon = wrapper.find('[data-testid=report-card-icon]')
      const fileName = wrapper.find('[data-testid=report-card-name]')
      const fileUpdatedOn = wrapper.find('[data-testid=report-card-updated-on]')

      expect(fileIcon.exists()).toBeTruthy()
      expect(fileName.text()).toBe(mockedFileName)
      expect(fileUpdatedOn.text()).toBe(expectedFileUpdatedOn)
    })
  })
  describe('events', () => {
    it("should emit 'select-report' when clicking on card", async () => {
      await wrapper.trigger('click')

      expect(wrapper.emitted()).toHaveProperty('select-report')
    })
  })
})
