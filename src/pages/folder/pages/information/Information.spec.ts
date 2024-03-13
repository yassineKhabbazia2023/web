import { expect, describe, it, beforeEach } from 'vitest'
import { VueWrapper, mount } from '@vue/test-utils'
import InformationFormStructure from './config/InformationFormStructure.json'
import Information from '.'

const alertInstructionText =
  'If any information is incorrect, please update it in the CRM'

describe('information', () => {
  let wrapper: VueWrapper
  beforeEach(() => {
    wrapper = mount(Information)
  })
  describe('display', () => {
    it('should correctly display the folder information', () => {
      const alertInstruction = wrapper.find('[data-testid="alert-instruction"]')
      const informationForm = wrapper.find(
        '[data-testid="folder-information-form"]'
      )

      expect(informationForm.exists()).toBeTruthy()
      expect(alertInstruction.text()).toBe(alertInstructionText)
    })
    it('should display all form sections', () => {
      const formSections = wrapper.findAll('.folder-information__form-section')

      expect(formSections).toHaveLength(InformationFormStructure.length)
    })
  })
})
