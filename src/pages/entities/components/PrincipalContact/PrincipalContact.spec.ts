import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import PrincipalContact from '.'
import { getMockedPrincipalContacts } from './PrincipalContactMocks'

const principalContact = getMockedPrincipalContacts()[0]
const contactDescription =
  'This signatory user will be the first client embarked on the file.'

function getWrapper() {
  const wrapper = mount(PrincipalContact, {
    props: {
      principalContact,
    },
  })

  return wrapper
}

describe('principalContact', () => {
  describe('props', () => {
    it('should display component with all information', () => {
      const wrapper = getWrapper()
      const fullName = `${
        principalContact.firstName
      } ${principalContact.lastName.toUpperCase()}`
      const principalContactElements = {
        fullName: wrapper.find('.p-user-card__title'),
        email: wrapper.find('.p-user-card__subtitle'),
        description: wrapper.find('.p-user-card__description'),
        notes: wrapper.find('[data-testid=principal-contact-notes]'),
      }

      expect(principalContactElements.fullName.text()).toBe(fullName)
      expect(principalContactElements.email.text()).toBe(principalContact.contactEmail)
      expect(principalContactElements.description.text()).toBe(
        contactDescription,
      )
    })
  })
})
