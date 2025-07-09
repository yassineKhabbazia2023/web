import { flushPromises, shallowMount } from '@vue/test-utils'
import { loggerErrorSpy, loggerMock } from '@pulse/core/mocks'
import { nextTick } from 'vue'
import type { CompanyInformationProps } from './CompanyInformationTypes'
import MEGOffersFormStructure from '@entities/common/config/forms/MEGOffersFormStructure.json'
import {
  getMockedAccount,
  getMockedAccountReferential,
  getMockedReferentialHubs,
} from '@entities/__mocks__/account-row.mocks'
import CompanyInformation from '.'
import { ProviderName } from '@entities/common/types/ProviderNameEnums'

const alertInstructionText =
  'If the immutable information is incorrect, you need to update it in the CRM'
const formInstructionText =
  'Please provide the following necessary information for activation :'

const mockedAccount = getMockedAccount()
vi.mock('@pulse/core', () => ({ logger: loggerMock }))

vi.mock('@entities/services/account', () => ({
  fetchAccountReferential: vi.fn(() => getMockedAccountReferential()),
  fetchReferentialHubs: vi.fn(() => getMockedReferentialHubs()),
}))

const getFormStructureMock = vi.hoisted(() => vi.fn())
const cleanRecordStructureMock = vi.hoisted(() => vi.fn())
vi.mock('@entities/common/utils/referential', () => ({
  getFormStructure: getFormStructureMock,
  cleanRecordStructure: cleanRecordStructureMock,
}))

const createWrapper = (account: any, providerName: any) => {
  const props: CompanyInformationProps = {
    modelValue: account,
    providerName,
  }

  return shallowMount(CompanyInformation, {
    props,
    global: {
      stubs: {
        PLoader: true,
        PFieldSetAccount: true,
        PAlert: {
          name: 'PAlert',
          template: '<div><slot /></div>',
        },
        PForm: {
          name: 'PForm',
          template: '<div><slot /></div>',
          props: ['pModel'],
        },
      },
    },
  })
}

describe('companyInformation', () => {
  let wrapper: ReturnType<typeof createWrapper>
  beforeEach(async () => {
    getFormStructureMock.mockResolvedValue(MEGOffersFormStructure)
  })
  describe('display', () => {
    beforeEach(async () => {
      wrapper = createWrapper(mockedAccount, ProviderName.MEG)
      await nextTick()
    })
    it('should correctly display the company information', () => {
      const formInstruction = wrapper.find('.company-information__note')
      const alertInstruction = wrapper.find('[data-testid="alert-instruction"]')
      const offerForm = wrapper.find('.company-information__form')

      expect(offerForm.exists()).toBeTruthy()
      expect(formInstruction.text()).toBe(formInstructionText)
      expect(alertInstruction.text()).toBe(alertInstructionText)

      expect(cleanRecordStructureMock).toHaveBeenCalledOnce()
      expect(cleanRecordStructureMock).toHaveBeenCalledWith(MEGOffersFormStructure, mockedAccount)
    })

    it('should display all form sections', () => {
      const formSections = wrapper.findAll('.company-information__form-section')

      expect(formSections).toHaveLength(MEGOffersFormStructure.length)
    })
  })


  describe('events', () => {
    it('should log a logger.error message when the request fails to retrieve form structure', async () => {
      const expectedErrorMessage = 'API Error: 503 Service Unavailable'
      getFormStructureMock.mockRejectedValue(expectedErrorMessage)

      createWrapper(undefined, ProviderName.MEG)
      await flushPromises()

      expect(loggerErrorSpy).toHaveBeenCalledOnce()
      expect(loggerErrorSpy).toHaveBeenCalledWith(expectedErrorMessage)
    })

    it('should update the form model when any form item is updated', async () => {
      const wrapper = createWrapper(mockedAccount, ProviderName.MEG)
      await flushPromises()

      const fieldKey = 'legal.siret'
      const newValue = 'Test Value'
      const pFieldSet = wrapper.findComponent({ name: 'PFieldSetAccount' })

      expect(pFieldSet.exists()).toBeTruthy()
      pFieldSet.vm.$emit('update:pModel', fieldKey, newValue)

      expect(wrapper.emitted('input')).toStrictEqual([
        [fieldKey, newValue],
      ])
    })
  })

  describe('when account is undefined', () => {
    it("should not emit the 'input' event if internalAccount is undefined", async () => {
      const wrapper = createWrapper(undefined, ProviderName.MEG)
      await nextTick()

      expect(wrapper.emitted('input')).toBeFalsy()
      expect(getFormStructureMock).toHaveBeenCalledOnce()
      expect(getFormStructureMock).toHaveBeenCalledWith(ProviderName.MEG)
    })
  })

  describe('when provider is undefined', () => {
    it('should not send a request to retrieve the form structure if the provider name is a falsy value', async () => {
      createWrapper(mockedAccount, undefined)
      await nextTick()

      expect(getFormStructureMock).not.toHaveBeenCalled()
    })
  })
})
