import { nextTick } from 'vue'

import { shallowMount, type VueWrapper } from '@vue/test-utils'
import type { PEmailInputFieldProps } from './p-email-input-field.types'
import PEmailInputField from '.'

const defaultDomain = 'test.com'

const props: PEmailInputFieldProps = {
  modelValue: '',
  pDefaultDomainPart: defaultDomain,
  pLocalPartPlaceholder: 'Local Part Placeholder',
  pDomainPartPlaceholder: 'Domain Part Placeholder',
}
const createWrapper = () =>
  shallowMount(PEmailInputField, {
    props,
  })

describe('PEmailInputField', () => {
  describe('display', () => {
    it('should render PEmailInputField correctly', () => {
      const wrapper: VueWrapper = createWrapper()
      const localPartInput = wrapper.findComponent('[data-testid=local-part-email-input')
      const atSignSpan = wrapper.find('[data-testid="at-sign-email-span"')
      const domainPartInput = wrapper.findComponent('[data-testid=domain-part-email-input')

      expect(localPartInput.exists()).toBeTruthy()
      expect(atSignSpan.exists()).toBeTruthy()
      expect(domainPartInput.exists()).toBeTruthy()
    })
  })
  describe('events', () => {
    it("should emit 'update:model-value' with defaultDomainPart when domainPart is empty", async () => {
      // Arrange
      const wrapper: VueWrapper = createWrapper()
      const mockLocalPart = 'alice'
      const expectedFullEmail = `${mockLocalPart}@${defaultDomain}`
      const localPartInput = wrapper.findComponent('[data-testid=local-part-email-input')

      // Act
      localPartInput.setValue(mockLocalPart)
      await nextTick()

      // Assert
      expect(wrapper.emitted('update:model-value')).toStrictEqual([[expectedFullEmail]])
    })

    it("should emit 'update:model-value' with domainPart when domainPart is filled", async () => {
      // Arrange
      const wrapper: VueWrapper = createWrapper()
      const mockLocalPart = 'alice'
      const mockDomainPart = 'bob.com'
      const expectedFullEmail = `${mockLocalPart}@${mockDomainPart}`
      const localPartInput = wrapper.findComponent('[data-testid=local-part-email-input')
      const domainPartInput = wrapper.findComponent('[data-testid=domain-part-email-input')

      // Act
      localPartInput.setValue(mockLocalPart)
      domainPartInput.setValue(mockDomainPart)
      await nextTick()

      // Assert
      expect(wrapper.emitted('update:model-value')).toStrictEqual([[expectedFullEmail]])
    })
  })
})
