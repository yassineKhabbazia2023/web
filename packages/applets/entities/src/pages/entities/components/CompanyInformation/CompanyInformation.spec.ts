import { vi, expect, describe, it, beforeEach } from 'vitest'
import { flushPromises, mount, type VueWrapper } from '@vue/test-utils'
import { nextTick } from 'vue'
import type { CompanyInformationProps } from './CompanyInformationTypes'
import type { ComponentWrapper } from '@entities/common/types'
import MEGOffersFormStructure from '@entities/common/config/forms/MEGOffersFormStructure.json'
import * as referentialUtils from '@entities/common/utils/referential'
import {
  getMockedAccount,
  getMockedAccountReferential,
  getMockedReferentialHubs,
} from '@entities/services/account/accountMock'
import CompanyInformation from '.'
import { ProviderName } from '@entities/common/types/ProviderNameEnums'

const alertInstructionText =
  'If the immutable information is incorrect, you need to update it in the CRM'
const formInstructionText =
  'Please provide the following necessary information for activation :'

const mockedAccount = getMockedAccount()
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

vi.mock('@entities/services/account', () => ({
  fetchAccountReferential: vi.fn(() => getMockedAccountReferential()),
  fetchReferentialHubs: vi.fn(() => getMockedReferentialHubs()),
}))

vi.mock('@entities/common/utils/referential', () => ({
  getFormStructure: () => MEGOffersFormStructure,
}))

const createWrapper = (account: any, providerName: any) => {
  const props: CompanyInformationProps = {
    modelValue: account,
    providerName,
  }

  return mount(CompanyInformation, {
    props,
    global: {
      stubs: {
        PLoader: true,
      },
    },
  })
}

describe('companyInformation', () => {
  let wrapper: ComponentWrapper<InstanceType <typeof CompanyInformation>>
  beforeEach(async () => {
    wrapper = createWrapper(mockedAccount, ProviderName.MEG)
    await nextTick()
  })
  describe('display', () => {
    it('should correctly display the company information', () => {
      const formInstruction = wrapper.find('.company-information__note')
      const alertInstruction = wrapper.find('[data-testid="alert-instruction"]')
      const offerForm = wrapper.find('.company-information__form')

      expect(offerForm.exists()).toBeTruthy()
      expect(formInstruction.text()).toBe(formInstructionText)
      expect(alertInstruction.text()).toBe(alertInstructionText)
    })
    it('should display all form sections', () => {
      const formSections = wrapper.findAll('.company-information__form-section')

      expect(formSections).toHaveLength(MEGOffersFormStructure.length)
    })
  })
  describe('events', () => {
    it('should log a logger.error message when the request fails to retrieve form structure', async () => {
      const expectedErrorMessage = 'API Error: 503 Service Unavailable'

      vi.spyOn(referentialUtils, 'getFormStructure').mockRejectedValue(expectedErrorMessage)

      wrapper = createWrapper(undefined, ProviderName.MEG)
      await flushPromises()

      expect(loggerErrorSpy).toHaveBeenCalledOnce()
      expect(loggerErrorSpy).toHaveBeenCalledWith(expectedErrorMessage)
    })
    it("should not emit the 'input' event if internalAccount is undefined", async () => {
      const spyReferentialUtils = vi.spyOn(referentialUtils, 'getFormStructure')
      wrapper = createWrapper(undefined, ProviderName.MEG)
      await nextTick()

      wrapper.vm.handleUpdateAccountModel('commercialName', mockedAccount.commercialName)

      expect(wrapper.emitted('input')).toBeFalsy()
      expect(spyReferentialUtils).toHaveBeenCalledOnce()
      expect(spyReferentialUtils).toHaveBeenCalledWith(ProviderName.MEG)
    })
    it('should not send a request to retrieve the form structure if the provider name is a falsy value', async () => {
      const spyReferentialUtils = vi.spyOn(referentialUtils, 'getFormStructure')
      wrapper = createWrapper(mockedAccount, undefined)
      await nextTick()

      expect(spyReferentialUtils).not.toHaveBeenCalled()
    })
    it('should update the form model when any form item is updated', () => {
      const formField = wrapper
        .findAllComponents({ name: 'PField' })
        .at(2) as VueWrapper
      formField.vm.$emit('update:model-value', 'Test Value')

      expect(formField.emitted('update:model-value')).toStrictEqual([
        ['Test Value'],
      ])
    })
  })
})
