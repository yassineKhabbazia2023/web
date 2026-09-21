import { flushPromises, shallowMount } from '@vue/test-utils'
import { getMockedAccount } from '@entities/__mocks__/account-row.mocks'
import { useUserStore } from '@pulse/common/stores'
import InformationFormStructure from '@entities/config/forms/InformationFormStructure.json'
import { getStoreMock } from '@pulse/common/mocks/vitest'
import { RouteParam } from '@pulse/common/enums'
import { FeatureFlagManager } from '@pulse/common/managers'
import { useRoute } from 'vue-router'
import type { RouteLocationNormalizedLoaded } from 'vue-router'
import { cleanRecordStructure, getFormStructure } from '@entities/utils/referential'
import { fetchAccount } from '@entities/services/account'
import type { Account } from '@entities/services/account'
import type { FormSection } from '@entities/types'
import { getCanEdit } from './InformationHelper'

import Information from './Information.vue'

const userStoreMock = getStoreMock(useUserStore)

const informationFormStructureMock = InformationFormStructure as FormSection[]
const accountMock = getMockedAccount()

const ACCOUNT_ID = 5

beforeEach(() => {
  vi.mocked(useRoute).mockReturnValue({
    params: {
      [RouteParam.ENTITY_ID]: ACCOUNT_ID,
    },
  } as unknown as RouteLocationNormalizedLoaded)
  vi.mocked(getFormStructure).mockResolvedValue(informationFormStructureMock)
  vi.mocked(cleanRecordStructure).mockImplementation(() => undefined)
  vi.mocked(fetchAccount).mockResolvedValue(accountMock)
  vi.mocked(getCanEdit).mockReturnValue(true)
  vi.spyOn(FeatureFlagManager, 'isElectronicAddressAvailable').mockReturnValue(false)
})

const getWrapper = () => shallowMount(Information, {
  global: {
    stubs: {
      PForm: {
        template: '<div><slot /></div>',
      },
      PAlert: {
        template: '<div><slot /></div>',
      },
      PDynamicFields: true,
      PButton: {
        template: '<div><slot /></div>',
      },
    },
  },
})

describe('information', () => {
  describe('display', () => {
    it('should not display the alert if the user is a client', async () => {
      userStoreMock.isCollab = false

      const wrapper = getWrapper()
      await flushPromises()

      const alertInstruction = wrapper.find(
        '[data-testid="folder-information-alert"]',
      )

      expect(alertInstruction.exists()).toBe(false)
    })

    it.each([{ isElectronicAddressAvailable: false }, { isElectronicAddressAvailable: true }])(
      'should display the addressing identification section according to the feature flag when it is $isElectronicAddressAvailable',
      async ({ isElectronicAddressAvailable }) => {
        vi.mocked(FeatureFlagManager.isElectronicAddressAvailable).mockReturnValue(isElectronicAddressAvailable)

        const wrapper = getWrapper()
        await flushPromises()

        const addressingIdentificationSection = wrapper.find(
          '[data-testid="folder-information-form-addressing-identification-section"]',
        )

        expect(FeatureFlagManager.isElectronicAddressAvailable).toHaveBeenCalledOnce()
        expect(addressingIdentificationSection.exists()).toBe(isElectronicAddressAvailable)
        expect(wrapper.find('[data-testid="folder-information-form"]').exists()).toBe(true)
        expect(wrapper.text()).toContain('Facture électronique')
        expect(fetchAccount).toHaveBeenCalledExactlyOnceWith(ACCOUNT_ID)
      },
    )
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
        const expectedForceDisabled = mockedCanEdit === false
        userStoreMock.isCollab = isCollab
        vi.mocked(getCanEdit).mockReturnValue(mockedCanEdit)

        const wrapper = getWrapper()
        await flushPromises()

        const informationSaveButton = wrapper.find('[data-testid="information-save-button"]')

        expect(vi.mocked(getCanEdit)).toHaveBeenCalledExactlyOnceWith(isCollab)
        expect(vi.mocked(getFormStructure)).toHaveBeenCalledExactlyOnceWith('CompanyProfile', expectedForceDisabled)
        expect(vi.mocked(cleanRecordStructure)).toHaveBeenCalledExactlyOnceWith(informationFormStructureMock, accountMock)
        expect(informationSaveButton.exists()).toBe(expectedHasInformationSaveButton)
      })
  })

  describe('phone number normalization', () => {
    it.each([
      { phoneNumber: null, expectedPhoneNumber: '' },
      { phoneNumber: undefined, expectedPhoneNumber: undefined },
      { phoneNumber: 'null', expectedPhoneNumber: '' },
      { phoneNumber: ' Null ', expectedPhoneNumber: '' },
      { phoneNumber: '+33 Null', expectedPhoneNumber: '' },
    ])('should normalize phone number $phoneNumber to $expectedPhoneNumber', async ({ phoneNumber, expectedPhoneNumber }) => {
      vi.mocked(fetchAccount).mockResolvedValueOnce({
        ...accountMock,
        phone: [{
          phoneNumber,
        }],
      } as Account)

      const wrapper = getWrapper()
      await flushPromises()
      const informationViewModel = wrapper.vm as unknown as { currentAccount: Account }

      expect(informationViewModel.currentAccount.phone?.[0]?.phoneNumber).toBe(expectedPhoneNumber)
    })

    it('should keep a valid phone number', async () => {
      vi.mocked(fetchAccount).mockResolvedValueOnce({
        ...accountMock,
        phone: [{
          phoneNumber: '0612345678',
        }],
      } as Account)

      const wrapper = getWrapper()
      await flushPromises()
      const informationViewModel = wrapper.vm as unknown as { currentAccount: Account }

      expect(informationViewModel.currentAccount.phone?.[0]?.phoneNumber).toBe('0612345678')
    })
  })
})
