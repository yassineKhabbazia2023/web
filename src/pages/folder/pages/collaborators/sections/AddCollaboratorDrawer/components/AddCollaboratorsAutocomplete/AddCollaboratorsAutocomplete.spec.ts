import { vi, describe, it, expect, beforeEach } from 'vitest'
import { createI18n } from 'vue-i18n'
import type { VueWrapper } from '@vue/test-utils'
import { flushPromises, mount } from '@vue/test-utils'
import { PAutocomplete } from '@kpmg/styleguide'
import { nextTick } from 'vue'
import CollaboratorsSearchAutocomplete from '.'
import type { AddCollaboratorsAutocompleteProps } from './AddCollaboratorsAutocompleteTypes'
import { getMockedCollaborators } from '@/services/contact/contactMocks'

vi.mock('@/services/account', () => ({
  fetchContactsFromSameHub: vi.fn(() => Promise.resolve(mockedContacts)),
}))

const mockedContacts = getMockedCollaborators()

const defaultProps: AddCollaboratorsAutocompleteProps = {
  selectedCollaboratorsIds: [1, 2, 3],
}

const i18n = createI18n({
  locale: 'fr-FR',
})

const mockSearchFetchSuggestions = vi.fn()

const createWrapper = (
  props: AddCollaboratorsAutocompleteProps = defaultProps,
): VueWrapper => {
  return mount(CollaboratorsSearchAutocomplete, {
    props,
    global: {
      provide: {
        i18n,
      },
      stubs: {
        PAutocomplete: {
          name: 'PAutocomplete',
          props: {
            pFetchSuggestions: Function,
            modelValue: String,
          },
          methods: {
            mockSearchFetchSuggestions,
          },
          data() {
            return {
              item: mockedContacts[0],
            }
          },
          mounted() {
            this.pFetchSuggestions(this.modelValue, mockSearchFetchSuggestions)
          },
          template: `
            <div>
              <div data-testid="slot-prefix"><slot name="prefix" /></div>
              <div data-testid="slot-default"><slot :item="item" /></div>
            </div>`,
        },
      },
    },
  })
}

const findAutocomplete = (wrapper: VueWrapper) =>
  wrapper.findComponent(PAutocomplete)
let wrapper: VueWrapper
describe('add collaborator autocomplete', () => {
  beforeEach(() => {
    wrapper = createWrapper()
  })

  describe('props', () => {
    it('should call fetchContactsFromSameHub on model change', async () => {
      const autocompleteWrapper = findAutocomplete(wrapper)
      autocompleteWrapper.vm.$emit('update:modelValue', 'search value')
      await flushPromises()
      await nextTick()
      // @ts-expect-error
      expect(autocompleteWrapper.props('modelValue')).toBe('search value')
    })
  })

  describe('interactions', () => {
    it('should remove collaborator if it is already selected on select event', async () => {
      const autocompleteWrapper = findAutocomplete(wrapper)
      const selectedContact = mockedContacts[1]
      autocompleteWrapper.vm.$emit('select', selectedContact)
      await nextTick()

      expect(wrapper.emitted('remove-collaborator')).toStrictEqual([
        [selectedContact.id],
      ])
    })

    it('should add collaborator if not already selected on select event', async () => {
      wrapper = createWrapper({ selectedCollaboratorsIds: [2, 3] })

      const autocompleteWrapper = findAutocomplete(wrapper)
      const selectedContact = mockedContacts[0]
      autocompleteWrapper.vm.$emit('select', selectedContact)
      await nextTick()

      expect(wrapper.emitted('add-collaborator')).toStrictEqual([
        [selectedContact.id],
      ])
    })
  })
})
