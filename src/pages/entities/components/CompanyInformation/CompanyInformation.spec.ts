import { expect, describe, it, beforeEach } from 'vitest'
import type { VueWrapper } from '@vue/test-utils'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import MEGOffersFormStructure from './config/MEGOffersFormStructure.json'
import type { CompanyInformationProps } from './CompanyInformationTypes'
import CompanyInformation from '.'
import { getMockedAccount } from '@/services/account/accountMock'

const alertInstructionText = 'If the immutable information is incorrect, you need to update it in the CRM'
const formInstructionText = 'Please provide the following necessary information for activation :'

const createWrapper = () => {
  const account = getMockedAccount()
  const props: CompanyInformationProps = {
    modelValue: account,
    providerName: 'MEG',
  }

  return mount(CompanyInformation, {
    props,
  })
}

describe('companyInformation', () => {
  let wrapper: VueWrapper
  beforeEach(async () => {
    wrapper = createWrapper()
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
