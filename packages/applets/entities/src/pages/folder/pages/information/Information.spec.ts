import { expect, describe, it, beforeEach, vi } from 'vitest'
import { flushPromises, shallowMount } from '@vue/test-utils'
import { setActivePinia } from 'pinia'
import { createTestingPinia } from '@pinia/testing'
import {
  getMockedAccount,
  getMockedAccountReferential,
  getMockedReferentialHubs,
} from '@entities/services/account/accountMock'
import { commonStore } from '@pulse/common'
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

const mockedGetCanEdit = vi.hoisted(() => vi.fn(() => true))
vi.mock('./InformationHelper', () => ({
  getCanEdit: mockedGetCanEdit,
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
    },
  },
})

// Unit Tests
describe('information', () => {
  beforeEach(() => {
    setActivePinia(createTestingPinia())
  })
  describe('display', () => {
    let wrapper: ReturnType<typeof getWrapper>
    beforeEach(() => {
      wrapper = getWrapper()
    })
    it('should correctly display the folder information', async () => {
      await flushPromises()
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
      await flushPromises()
      const store = commonStore()
      // @ts-expect-error: Getter is read only
      store.isCollab = false
      await flushPromises()
      const alertInstruction = wrapper.find(
        '[data-testid="folder-information-alert"]',
      )

      expect(alertInstruction.exists()).toBeFalsy()
    })
    it('should display all form sections', async () => {
      await flushPromises()
      const formSections = wrapper.findAll('.folder-information__form-section')

      expect(formSections).toHaveLength(InformationFormStructure.length)
    })
    // FIXME fix the test and unskip or delete it
    it.skip('should display the form once the loader has finished', async () => {
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
      await flushPromises()
      const folderFormAddress = wrapper.find(
        '[data-testid="folder-information-form-address-section"]',
      )

      const formAddressSection = wrapper.find('[data-testid="folder-information-form-address-section"]')
      expect(formAddressSection.text()).toBe(expectedAddressSection)
      expect(folderFormAddress.text()).toBe(expectedAddressSection)
    })
    it('should log an error to the console if the API fails to fetch the information', async () => {
      await flushPromises()
      const consoleSpy = vi.spyOn(console, 'error')
      const expectedErrorMessage = 'API Error: 503 Service Unavailable'

      vi.spyOn(accountServices, 'fetchAccount').mockRejectedValue(expectedErrorMessage)
      wrapper = getWrapper()
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
      mockedCanEdit: true,
    }, {
      isCollab: true,
      mockedCanEdit: true,
    }, {
      isCollab: true,
      mockedCanEdit: false,
    }]
    it.each(tests)(
      'should call with proper argument when isCollab equals $isCollab and canEdit is $mockedCanEdit', async ({
        isCollab,
        mockedCanEdit,
      }) => {
        const expectedForceDisabled = !mockedCanEdit
        const store = commonStore()
        // @ts-expect-error: Getter is read only
        store.isCollab = isCollab

        mockedGetCanEdit.mockReturnValue(mockedCanEdit)

        getWrapper()
        await flushPromises()

        expect(mockedGetCanEdit).toHaveBeenCalledOnce()
        expect(mockedGetCanEdit).toHaveBeenCalledWith(isCollab)
        expect(mockedGetFormStructure).toHaveBeenCalledOnce()
        expect(mockedGetFormStructure).toHaveBeenCalledWith('CompanyProfile', expectedForceDisabled)
      })
  })
})
