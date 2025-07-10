import { nextTick } from 'vue'
import { loggerErrorSpy, loggerMock } from '@pulse/core/mocks'
import { flushPromises, shallowMount } from '@vue/test-utils'
import {
  getMockedAccount,
  getMockedAccountReferential,
  getMockedReferentialHubs,
} from '@entities/__mocks__/account-row.mocks'
import { useUserStore } from '@pulse/common/stores'
import * as accountServices from '@entities/services/account'
import InformationFormStructure from '@entities/common/config/forms/InformationFormStructure.json'
import * as CommonHelpers from '@entities/common/utils/helpers'
import { getStoreMock } from '@pulse/common/mocks'
import { RouteParam } from '@pulse/common/enums'

import Information from '.'

const userStoreMock = getStoreMock(useUserStore)

// Expected Display Results
const expectedAddressSection = 'Company billing address'
const expectedAlertInstruction =
  'If any information is incorrect, please update it in the CRM'

// Mocks
const getFormStructureMock = vi.hoisted(() => vi.fn(() => InformationFormStructure))
const cleanRecordStructureMock = vi.hoisted(() => vi.fn())
vi.mock('@pulse/core', () => ({ logger: loggerMock }))

vi.mock('@entities/common/utils/referential', () => ({
  getFormStructure: getFormStructureMock,
  cleanRecordStructure: cleanRecordStructureMock,
}))

const mockedGetCanEdit = vi.hoisted(() => vi.fn(() => true))
const savePatchedAccountMock = vi.hoisted(() => vi.fn())
vi.mock('./InformationHelper', () => ({
  getCanEdit: mockedGetCanEdit,
  savePatchedAccount: savePatchedAccountMock,
}))

const accountMock = getMockedAccount()
const fetchAccountMock = vi.hoisted(() => vi.fn())
vi.mock('@entities/services/account', () => ({
  fetchAccount: fetchAccountMock,
  fetchAccountReferential: vi.fn(() => getMockedAccountReferential()),
  fetchReferentialHubs: vi.fn(() => getMockedReferentialHubs()),
}))

const ACCOUNT_ID = 5

vi.mock('vue-router', () => ({
  useRoute: () => ({
    params: {
      [RouteParam.ENTITY_ID]: ACCOUNT_ID,
    },
  }),
}))

vi.mock('@entities/common/utils/helpers')

const getWrapper = () => shallowMount(Information, {
  global: {
    stubs: {
      PForm: {
        template: '<div><slot /></div>',
      },
      PAlert: {
        template: '<div><slot /></div>',
      },
      PFieldSet: true,
      PButton: {
        template: '<div><slot /></div>',
      },
    },
  },
})

// Unit Tests
describe('information', () => {
  let wrapper: ReturnType<typeof getWrapper>
  beforeEach(() => {
    fetchAccountMock.mockResolvedValue(accountMock)
    cleanRecordStructureMock.mockResolvedValue(accountMock)
  })

  describe('display', () => {
    beforeEach(() => {
      wrapper = getWrapper()
    })
    it('should correctly display the folder information', async () => {
      userStoreMock.isCollab = true
      await nextTick()
      const alertInstruction = wrapper.find(
        '[data-testid="folder-information-alert"]',
      )
      const informationForm = wrapper.find(
        '[data-testid="folder-information-form"]',
      )

      expect(informationForm.exists()).toBeTruthy()
      expect(alertInstruction.text()).toBe(expectedAlertInstruction)
    })
    it('should not display the alert if the user is a client', async () => {
      userStoreMock.isCollab = false
      await nextTick()
      const alertInstruction = wrapper.find(
        '[data-testid="folder-information-alert"]',
      )

      expect(alertInstruction.exists()).toBeFalsy()
    })
    it('should display all form sections', async () => {
      await nextTick()
      const formSections = wrapper.findAll('.folder-information__form-section')

      expect(formSections).toHaveLength(InformationFormStructure.length)
    })
    it('should display the form once the loader has finished', async () => {
      const wrapper = getWrapper()
      const loaderBefore = wrapper.find('[data-testid="folder-information-loader"]')
      const informationFormBefore = wrapper.find('[data-testid="folder-information-form"]')

      expect(loaderBefore.exists()).toBeTruthy()
      expect(informationFormBefore.exists()).toBeFalsy()

      await flushPromises()

      const loaderAfter = wrapper.find('[data-testid="folder-information-loader"]')
      const informationFormAfter = wrapper.find('[data-testid="folder-information-form"]')

      expect(loaderAfter.exists()).toBeFalsy()
      expect(informationFormAfter.exists()).toBeTruthy()
    })
    it('should display the accurate type of address', async () => {
      await nextTick()
      const folderFormAddress = wrapper.find(
        '[data-testid="folder-information-form-address-section"]',
      )

      const formAddressSection = wrapper.find('[data-testid="folder-information-form-address-section"]')
      expect(formAddressSection.text()).toBe(expectedAddressSection)
      expect(folderFormAddress.text()).toBe(expectedAddressSection)
    })
    it('should use logger.error if the API fails to fetch the information', async () => {
      const expectedErrorMessage = 'API Error: 503 Service Unavailable'

      vi.spyOn(accountServices, 'fetchAccount').mockRejectedValue(expectedErrorMessage)
      wrapper = getWrapper()
      await flushPromises()

      expect(loggerErrorSpy).toHaveBeenCalledOnce()
      expect(loggerErrorSpy).toHaveBeenCalledWith(
        'Error fetching information :',
        expectedErrorMessage,
      )
    })
  })

  describe('test onMounted', () => {
    const tests = [{
      isCollab: false,
      mockedCanEdit: true,
      expectedHasInformationSaveButton: true,
    }, {
      isCollab: true,
      mockedCanEdit: true,
      expectedHasInformationSaveButton: true,
    }, {
      isCollab: true,
      mockedCanEdit: false,
      expectedHasInformationSaveButton: false,
    }]
    it.each(tests)(
      'should call with proper argument when isCollab equals $isCollab and canEdit is $mockedCanEdit', async ({
        isCollab,
        mockedCanEdit,
        expectedHasInformationSaveButton,
      }) => {
        const expectedForceDisabled = !mockedCanEdit
        userStoreMock.isCollab = isCollab

        mockedGetCanEdit.mockReturnValue(mockedCanEdit)

        const wrapper = getWrapper()

        await flushPromises()

        const informationSaveButton = wrapper.find('[data-testid="information-save-button"]')

        expect(mockedGetCanEdit).toHaveBeenCalledOnce()
        expect(mockedGetCanEdit).toHaveBeenCalledWith(isCollab)

        expect(getFormStructureMock).toHaveBeenCalledOnce()
        expect(getFormStructureMock).toHaveBeenCalledWith('CompanyProfile', expectedForceDisabled)

        expect(cleanRecordStructureMock).toHaveBeenCalledOnce()
        expect(cleanRecordStructureMock).toHaveBeenCalledWith(InformationFormStructure, accountMock)

        expect(informationSaveButton.exists()).toBe(expectedHasInformationSaveButton)
      })
  })

  describe('test saving', () => {
    beforeEach(() => {
      const mockedCanEdit = true
      mockedGetCanEdit.mockReturnValue(mockedCanEdit)

      wrapper = getWrapper()
    })
    describe('click on save button', () => {
      it('should toggle loading state', async () => {
        const saveButton = wrapper.find('[data-testid="information-save-button"]')
        expect(saveButton.attributes('ploading')).toBe('false')

        saveButton.trigger('click')
        await nextTick()

        expect(saveButton.attributes('ploading')).toBe('true')

        await flushPromises()

        expect(saveButton.attributes('ploading')).toBe('false')
      })

      it('should call savePatchedAccount properly', async () => {
        const fieldKey = 'accounting.taxationSystem'
        const value = 'IS'
        const expectedPatchOperations = [{
          newValue: 'IS',
          originalValue: 'Impôt sur le revenu',
          path: '/accounting/taxationSystem',
        }]
        const pFieldSet = wrapper.findComponent({
          name: 'PFieldSet',
        })

        const saveButton = wrapper.find('[data-testid="information-save-button"]')
        pFieldSet.vm.$emit('update:pModel', fieldKey, value)

        saveButton.trigger('click')
        await nextTick()

        expect(savePatchedAccountMock).toHaveBeenCalledOnce()
        expect(savePatchedAccountMock).toHaveBeenCalledWith(ACCOUNT_ID, expectedPatchOperations)
      })

      it('should call displayNotification properly when savePatched succeeded', async () => {
        savePatchedAccountMock.mockResolvedValueOnce(true)
        const saveButton = wrapper.find('[data-testid="information-save-button"]')
        const displayNotificationSpy = vi.mocked(CommonHelpers).displayNotification

        saveButton.trigger('click')
        await nextTick()
        await flushPromises()

        expect(displayNotificationSpy).toHaveBeenCalledOnce()
        expect(displayNotificationSpy).toHaveBeenCalledWith('success', 'Save succeeded', 'top-right')
      })

      it('should call displayNotification properly when savePatched failed', async () => {
        const error = new Error('error message')

        savePatchedAccountMock.mockRejectedValueOnce(error)
        const saveButton = wrapper.find('[data-testid="information-save-button"]')
        const displayNotificationSpy = vi.mocked(CommonHelpers).displayNotification

        saveButton.trigger('click')
        await nextTick()
        await flushPromises()

        expect(displayNotificationSpy).toHaveBeenCalledOnce()
        expect(displayNotificationSpy).toHaveBeenCalledWith('error', 'Save failed')

        expect(loggerErrorSpy).toHaveBeenCalledOnce()
        expect(loggerErrorSpy).toHaveBeenNthCalledWith(1, error)
      })
    })
  })
})
