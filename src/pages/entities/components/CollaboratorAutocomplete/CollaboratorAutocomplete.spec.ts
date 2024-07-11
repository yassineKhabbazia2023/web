import { expect, describe, it, vi, beforeEach } from 'vitest'
import type { VueWrapper } from '@vue/test-utils'
import { mount } from '@vue/test-utils'
import CollaboratorAutocomplete, { type CollaboratorAutocompleteProps } from '.'
import { getMockedCollaborators } from '@/services/contact/contactMocks'

const mockedCollaborators = getMockedCollaborators()

const mockedCallbackFunction = vi.fn()
vi.mock('./CollaboratorAutocompleteUtils', () => ({
  getAutocompleteContacts: vi.fn(() => Promise.resolve(mockedCollaborators)),
}))

const createWrapper = () => {
  const props: CollaboratorAutocompleteProps = {
    selectedCollaborators: [],
  }

  return mount(CollaboratorAutocomplete, {
    props,
    global: {
      stubs: {
        PAutocomplete: {
          name: 'PAutocomplete',
          methods: {
            mockedCallbackFunction,
          },
          props: {
            pFetchSuggestions: Function,
            modelValue: String,
          },
          mounted() {
            this.pFetchSuggestions(this.modelValue, mockedCallbackFunction)
          },
          data() {
            return {
              item: mockedCollaborators[0],
            }
          },
          template: `<div>
  <div data-testid="slot-prefix"><slot name="prefix" /></div>
  <div data-testid="slot-default"><slot :item="item" /></div>
</div>`,
        },
      },
    },
  })
}

describe('test CollaboratorAutocomplete', () => {
  let wrapper: VueWrapper
  beforeEach(() => {
    wrapper = createWrapper()
  })
  describe('display', () => {
    it('should correctly display autocomplete row', () => {
      const autocompleteRow = wrapper.find('[data-testid=autocomplete-row]')
      const firstItem = mockedCollaborators[0]
      const expectedText = [
        firstItem.firstName,
        firstItem.lastName,
        '-',
        firstItem.email,
        firstItem.persona?.name,
        '-',
        firstItem.office,
      ].join(' ')

      expect(autocompleteRow.text()).toBe(expectedText)
    })
  })
  describe('events', () => {
    it('should call callback function with result', () => {
      expect(mockedCallbackFunction).toHaveBeenCalledWith(mockedCollaborators)
    })

    it('should display search result', () => {
      const pAutocomplete = wrapper.findComponent({ name: 'PAutocomplete' })
      const selectedContact = mockedCollaborators[2]

      pAutocomplete.vm.$emit('select', selectedContact)

      expect(wrapper.emitted('add-contact')).toStrictEqual([[selectedContact]])
    })
  })
})
