import { it, vi, expect, describe, beforeEach } from 'vitest'
import { flushPromises, mount, type VueWrapper } from '@vue/test-utils'
import * as ReportingService from '@entities/services/reporting'
import { getMockedBIReports } from '@entities/pages/power-bi/pages/bi-reports/BIReportsMocks'
import { getMockedReportTypesDropdown } from '../../SubmitBIReportMocks'
import { entitiesMock } from '@entities/../tests/mocks/EntitiesMocks'
import BIReportInformation from '.'

// Mocks
const mockedReportTypeId = 5
const mockedAccounts = entitiesMock
const mockedCallbackFunction = vi.fn()
const selectedAccount = mockedAccounts[0]
const mockedBIReports = getMockedBIReports()
const mockedReportTypesDropdown = getMockedReportTypesDropdown()
vi.mock('@entities/services/reporting', () => ({
  fetchBIReports: vi.fn(() => Promise.resolve({ items: mockedBIReports })),
  fetchReportAccounts: vi.fn(() => Promise.resolve(mockedAccounts)),
}))

// Expectations
const expectedAccountAutocompleteRow = `${selectedAccount.legalName} (${selectedAccount.accountNumber})`
const expectedReportUploadInfo =
  'You can either create a new report or update an existing one'

const createWrapper = () => {
  return mount(BIReportInformation, {
    props: {
      reportTypes: mockedReportTypesDropdown,
      reportUploadInfo: {},
    },
    global: {
      stubs: {
        PDropdown: {
          name: 'PDropdown',
          template: '<div />',
          emits: [
            'update:modelValue',
            'change',
          ],
        },
        PAutocomplete: {
          name: 'PAutocomplete',
          methods: {
            mockedCallbackFunction,
          },
          props: {
            modelValue: String,
            pFetchSuggestions: Function,
          },
          mounted() {
            this.pFetchSuggestions(this.modelValue, mockedCallbackFunction)
          },
          data() {
            return {
              item: mockedAccounts[0],
            }
          },
          template: `
          <div>
            <div data-testid="slot-prefix"><slot name="prefix" /></div>
            <div data-testid="slot-default"><slot :item="item" /></div>
          </div>`,
        },
      },
    },
  })
}

describe('biReportInformation', () => {
  let wrapper: VueWrapper<any>
  beforeEach(() => {
    wrapper = createWrapper()
  })
  describe('display', () => {
    it('should correctly display the form to fill the uploaded report information', () => {
      const reportNameSelect = wrapper.find(
        '[data-testid=powerbi-report-name-select]',
      )
      const reportTypesDropdown = wrapper.find(
        '[data-testid=powerbi-report-types-dropdown]',
      )
      const accountSearchAutocomplete = wrapper.find(
        '[data-testid=powerbi-account-search-autocomplete]',
      )
      const reportUploadInfo = wrapper.find('[data-testid=powerbi-upload-info]')

      expect(reportNameSelect.exists()).toBeTruthy()
      expect(reportTypesDropdown.exists()).toBeTruthy()
      expect(accountSearchAutocomplete.exists()).toBeTruthy()
      expect(reportUploadInfo.text()).toBe(expectedReportUploadInfo)
    })
    it('should correctly display the account autocomplete row', () => {
      const autocompleteAccountItem = wrapper.find(
        '[data-testid=powerbi-account-item]',
      )

      expect(autocompleteAccountItem.text()).toBe(
        expectedAccountAutocompleteRow,
      )
    })
  })
  describe('events', () => {
    it('should call the reporting API to fetch reports when a report type is selected', () => {
      const spyFetchBIReports = vi.spyOn(ReportingService, 'fetchBIReports')
      wrapper = createWrapper()

      const reportTypesDropdown = wrapper.findComponent({ name: 'PDropdown' })
      reportTypesDropdown.vm.$emit('update:modelValue', mockedReportTypeId)

      const accountSearchAutocomplete = wrapper.findComponent({
        name: 'PAutocomplete',
      })
      accountSearchAutocomplete.vm.$emit('select', selectedAccount)

      expect(spyFetchBIReports).toHaveBeenCalledOnce()
      expect(spyFetchBIReports).toHaveBeenCalledWith(
        selectedAccount.accountId,
        mockedReportTypeId,
      )
    })
    it('should reset the report name when changing the report type', async () => {
      const reportTypesDropdown = wrapper.findComponent({ name: 'PDropdown' })
      reportTypesDropdown.vm.$emit('update:modelValue', mockedReportTypeId)
      const accountSearchAutocomplete = wrapper.findComponent({
        name: 'PAutocomplete',
      })
      accountSearchAutocomplete.vm.$emit('select', selectedAccount)
      await flushPromises()

      wrapper.vm.handleSelectReportName(mockedBIReports[0].reportId)
      reportTypesDropdown.vm.$emit('change')

      expect(wrapper.emitted('update:reportUploadInfo')).toBeTruthy()
      expect(wrapper.emitted('update:reportUploadInfo')).toStrictEqual([
        [
          {
            accountId: mockedAccounts[0].accountId,
            accountLabel: expectedAccountAutocompleteRow,
            reportTypeId: mockedReportTypeId,
          },
        ],
      ])
    })
    it('should enable users to enter the report name after selecting the report type and account', async () => {
      const reportTypesDropdown = wrapper.findComponent({ name: 'PDropdown' })
      reportTypesDropdown.vm.$emit('update:modelValue', mockedReportTypeId)
      const accountSearchAutocomplete = wrapper.findComponent({
        name: 'PAutocomplete',
      })
      accountSearchAutocomplete.vm.$emit('select', selectedAccount)

      expect(wrapper.vm.internalReportUploadInfo.accountId).toStrictEqual(
        selectedAccount.accountId,
      )
      expect(wrapper.vm.internalReportUploadInfo.accountLabel).toStrictEqual(
        expectedAccountAutocompleteRow,
      )

      await flushPromises()

      wrapper.vm.handleSelectReportName(mockedBIReports[0].reportId)

      expect(wrapper.vm.internalReportUploadInfo.reportId).toStrictEqual(
        mockedBIReports[0].reportId,
      )
      expect(wrapper.vm.internalReportUploadInfo.reportLabel).toStrictEqual(
        mockedBIReports[0].reportLabel,
      )
    })
  })
})
