import { mount, flushPromises, type VueWrapper } from '@vue/test-utils'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mockUser } from '@entities/__mocks__/users-client.mocks'
import DrawerUserDetails from './DrawerUserDetails.vue'
import type { Contact, PatchContactPayload } from '@entities/services/contact/contactTypes'

vi.mock('@entities/services/contact', () => ({
  getContactById: vi.fn((_: number) => Promise.resolve(mockUser)),
  patchContact: vi.fn((_id: number, _accountId: number, contact: PatchContactPayload) => Promise.resolve(contact)),
}))

const mockEntityId = 42

const createWrapper = async (editMode: boolean = false): Promise<VueWrapper<any>> => {
  const wrapper = mount(DrawerUserDetails, {
    props: {
      hasDrawerOpened: true,
      userId: mockUser.id,
      entityId: mockEntityId,
      editMode,
    },
    global: {
      stubs: {
        PFormItem: { template: '<div><slot /></div>' },
        PButton: true,
      },
    },
  })
  await flushPromises()
  return wrapper
}
let wrapper: VueWrapper<any>
const inputs = [
  { name: 'firstName', value: mockUser.firstName },
  { name: 'lastName', value: mockUser.lastName },
  { name: 'landPhone', value: mockUser.landPhone },
  { name: 'mobilePhone', value: mockUser.mobilePhone },
]

const getInputs = () => wrapper.findAll('input')
const getCancelBtn = () => wrapper.find('[data-testid=cancel-btn]')

describe('drawerUserDetails', () => {
  describe('show user information as readonly state', () => {
    beforeEach(async () => {
      wrapper = await createWrapper()
    })

    it('should display correctly the component in readonly state when editMode is false', () => {
      const title = wrapper.find('.p-user-card__title')
      const expectedFullName = `${mockUser.firstName} ${mockUser.lastName}`
      const userCard = wrapper.find('.p-user-card__subtitle')
      const personaTag = wrapper.find('[data-testid=persona]')
      expect(title.text()).toContain(expectedFullName)
      expect(userCard.text()).toContain(mockUser.email)
      expect(personaTag.text()).toBe(mockUser.persona?.name)
    })

    it.each(inputs)('should prefill the input $name with $value', (input) => {
      expect((getInputs()[inputs.indexOf(input)].element as HTMLInputElement).value).toBe(input.value)
    })
    it.each(inputs)('should mark the input $name as readonly', (input) => {
      expect(getInputs()[inputs.indexOf(input)].attributes().readonly).toBeDefined()
    })
  })

  describe('show user information as edit state', () => {
    beforeEach(async () => {
      wrapper = await createWrapper(true)
    })
    it.each(inputs)('input $name should not be mark as readonly', (input) => {
      const inputElement = getInputs()[inputs.indexOf(input)]
      expect(inputElement.attributes().readonly).toBeUndefined()
    })
    it('should display the submit and cancel button', () => {
      const submit = wrapper.find('[data-testid=submit-btn]')
      expect(getCancelBtn().exists()).toBeTruthy()
      expect(submit.exists()).toBeTruthy()
    })
    it('contact-patch', async () => {
      const expectedPatchedContact = {
        firstName: 'newFirstName',
        lastName: 'newLastName',
        mobilePhone: 'newMobilePhone',
        landPhone: 'newLandPhone',
      } as Contact
      await wrapper.find('[name="firstName"]').setValue(expectedPatchedContact.firstName)
      await wrapper.find('[name="lastName"]').setValue(expectedPatchedContact.lastName)
      await wrapper.find('[name="mobilePhone"]').setValue(expectedPatchedContact.mobilePhone)
      await wrapper.find('[name="landPhone"]').setValue(expectedPatchedContact.landPhone)
      // Simulate form submission
      await wrapper.find('[data-testid=submit-btn]').trigger('click')
      await flushPromises()
      const contactPatchEvent = wrapper.emitted('contact-patched')
      expect(wrapper.emitted()).toHaveProperty('contact-patched')
      expect(contactPatchEvent).toBeDefined()
      expect(contactPatchEvent?.at(0)?.at(0)).toEqual(expectedPatchedContact)
    })
  })
})
