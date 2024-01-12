import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import PrincipalContact from '.'
import { getMockedPrincipalContact } from './PrincipalContactMocks'
import type { PrincipalContactProps } from './PrincipalContactTypes'

const principalContact = getMockedPrincipalContact()
const contactDescription =
  'This signatory user will be the first client embarked on the file.'

async function getWrapper() {
  const wrapper = await mount(PrincipalContact, {
    props: {
      principalContact
    } satisfies PrincipalContactProps as PrincipalContactProps
  })

  return wrapper
}

describe('principalContact', () => {
  describe('props', () => {
    it('should display component with all information', async () => {
      const wrapper = await getWrapper()
      const fullName = `${
        principalContact.firstName
      } ${principalContact.lastName.toUpperCase()}`
      const principalContactElements = {
        component: wrapper.find('[data-testid=principal-contact]'),
        fullName: wrapper.find('.p-user-card__title'),
        email: wrapper.find('.p-user-card__subtitle'),
        description: wrapper.find('.p-user-card__description'),
        notes: wrapper.find('[data-testid=principal-contact-notes]')
      }

      expect(principalContactElements.component.exists()).toBeTruthy()
      expect(principalContactElements.fullName.text()).toBe(fullName)
      expect(principalContactElements.email.text()).toBe(principalContact.email)
      expect(principalContactElements.description.text()).toBe(
        contactDescription
      )
      expect(principalContactElements.notes.exists()).toBeTruthy()
    })
  })
})
