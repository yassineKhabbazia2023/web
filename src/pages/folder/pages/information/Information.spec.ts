import { expect, describe, it, beforeEach, vi } from 'vitest'
import { flushPromises, mount, type VueWrapper } from '@vue/test-utils'
import { nextTick } from 'vue'
import { setActivePinia } from 'pinia'
import { createTestingPinia } from '@pinia/testing'
import {
  getMockedAccount,
  getMockedAccountReferential,
  getMockedReferentialHubs,
} from '@/services/account/accountMock'
import { commonStore } from '@kpmg/common'
import * as accountServices from '@/services/account'
import InformationFormStructure from '@/common/config/forms/InformationFormStructure.json'
import Information from '.'

// Expected Display Results
const expectedAddressSection = 'Company billing address'
const expectedAlertInstruction =
  'If any information is incorrect, please update it in the CRM'

// Mocks
vi.mock('@/common/config/referential', () => ({
  getFormStructure: () => InformationFormStructure,
}))

vi.mock('@/services/account', () => ({
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
  let wrapper: VueWrapper<any>
  beforeEach(async () => {
    setActivePinia(createTestingPinia())
    wrapper = mount(Information)

    await flushPromises()
  })
  describe('display', () => {
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
})
