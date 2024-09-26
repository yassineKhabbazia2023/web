import { expect, describe, it, beforeEach, vi } from 'vitest'
import { flushPromises, mount, type VueWrapper } from '@vue/test-utils'
import { nextTick } from 'vue'
import { setActivePinia } from 'pinia'
import { createTestingPinia } from '@pinia/testing'
import {
  getMockedAccount,
  getMockedAccountReferential,
  getMockedReferentialHubs,
} from '@entities/services/account/accountMock'
import { commonStore } from '@pulse/Common'
import * as accountServices from '@entities/services/account'
import InformationFormStructure from '@entities/common/config/forms/InformationFormStructure.json'
import Information from '.'

// Expected Display Results
const expectedAddressSection = 'Company billing address'
const expectedAlertInstruction =
  'If any information is incorrect, please update it in the CRM'

// Mocks
const mockedGetFormStructure = vi.hoisted(() => vi.fn(() => InformationFormStructure))
vi.mock('@entities/common/utils/referential', () => ({
  getFormStructure: mockedGetFormStructure,
}))

const mockedGetForceDisabled = vi.hoisted(() => vi.fn(() => true))
vi.mock('./InformationHelper', () => ({
  getForceDisabled: mockedGetForceDisabled,
}))

vi.mock('@entities/services/account', () => ({
  fetchAccount: vi.fn(() => Promise.resolve(getMockedAccount())),
  fetchAccountReferential: vi.fn(() => getMockedAccountReferential()),
  fetchReferentialHubs: vi.fn(() => getMockedReferentialHubs()),
}))

vi.mock('vue-router', () => ({
  useRoute: () => ({
    params: {
      id: 5,
    },
  }),
}))

// Unit Tests
describe('information', () => {
  beforeEach(() => {
    setActivePinia(createTestingPinia())
  })
  describe('display', () => {
    let wrapper: VueWrapper<any>
    beforeEach(async () => {
      wrapper = mount(Information)

      await flushPromises()
    })
    it('should correctly display the folder information', () => {
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
      const store = commonStore()
      // @ts-expect-error: Getter is read only
      store.isCollab = false
      await flushPromises()
      const alertInstruction = wrapper.find(
        '[data-testid="folder-information-alert"]',
      )

      expect(alertInstruction.exists()).toBeFalsy()
    })
    it('should display all form sections', () => {
      const formSections = wrapper.findAll('.folder-information__form-section')

      expect(formSections).toHaveLength(InformationFormStructure.length)
    })
    it('should display the form once the loader has finished', async () => {
      wrapper.vm.isLoading = true
      await nextTick()
      let loader = wrapper.find('[data-testid="folder-information-loader"]')
      let informationForm = wrapper.find(
        '[data-testid="folder-information-form"]',
      )

      expect(loader.exists()).toBeTruthy()
      expect(informationForm.exists()).toBeFalsy()

      wrapper.vm.isLoading = false
      await nextTick()
      informationForm = wrapper.find('[data-testid="folder-information-form"]')
      loader = wrapper.find('[data-testid="folder-information-loader"]')

      expect(loader.exists()).toBeFalsy()
      expect(informationForm.exists()).toBeTruthy()
    })
    it('should display the accurate type of address', () => {
      const folderFormAddress = wrapper.find(
        '[data-testid="folder-information-form-address-section"]',
      )

      expect(wrapper.vm.addressSectionTitle).toBe(expectedAddressSection)
      expect(folderFormAddress.text()).toBe(expectedAddressSection)
    })
    it('should log an error to the console if the API fails to fetch the information', async () => {
      const consoleSpy = vi.spyOn(console, 'error')
      const expectedErrorMessage = 'API Error: 503 Service Unavailable'

      vi.spyOn(accountServices, 'fetchAccount').mockRejectedValue(expectedErrorMessage)
      wrapper = mount(Information)
      await flushPromises()

      expect(consoleSpy).toHaveBeenCalledOnce()
      expect(consoleSpy).toHaveBeenCalledWith(
        'Error fetching information :',
        expectedErrorMessage,
      )
    })
  })

  describe('test onMounted', () => {
    const tests = [{
      isCollab: false,
      mockedForceDisabled: false,
    }, {
      isCollab: true,
      mockedForceDisabled: false,
    }, {
      isCollab: true,
      mockedForceDisabled: true,
    }]
    it.each(tests)('should call with proper argument when isCollab equals $isCollab', async ({
      isCollab,
      mockedForceDisabled,
    }) => {
      const store = commonStore()
      // @ts-expect-error: Getter is read only
      store.isCollab = isCollab

      mockedGetForceDisabled.mockReturnValue(mockedForceDisabled)

      mount(Information)

      await flushPromises()
      expect(mockedGetForceDisabled).toHaveBeenCalledOnce()
      expect(mockedGetForceDisabled).toHaveBeenCalledWith(isCollab)
      expect(mockedGetFormStructure).toHaveBeenCalledOnce()
      expect(mockedGetFormStructure).toHaveBeenCalledWith('CompanyProfile', mockedForceDisabled)
    })
  })
})
