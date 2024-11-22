import { vi, describe, it, expect, beforeEach } from 'vitest'
import { flushPromises, mount, type VueWrapper } from '@vue/test-utils'
import { createI18n } from 'vue-i18n'
import { PAutocomplete } from '@pulse/styleguide/components'
import { nextTick } from 'vue'
import CollaboratorsSearchAutocomplete from '.'
import type { CollaboratorsSearchAutocompleteProps } from './CollaboratorsSearchAutocompleteTypes'
import { getMockedCollaborators } from '@entities/services/contact/contactMocks'

vi.mock('@entities/services/wallet', () => ({
  getCollaborators: vi.fn(() => Promise.resolve(mockedCollaborators)),
}))

const mockedCollaborators = getMockedCollaborators()

const defaultProps: CollaboratorsSearchAutocompleteProps = {
  selectedCollaborators: [mockedCollaborators[0], mockedCollaborators[1], mockedCollaborators[2]],
}

const i18n = createI18n({
  locale: 'fr-FR',
})

const mockSearchFetchSuggestions = vi.fn()

const createWrapper = (
  props: CollaboratorsSearchAutocompleteProps = defaultProps,
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
              item: mockedCollaborators[0],
            }
          },
          mounted() {
            this.pFetchSuggestions(this.modelValue, mockSearchFetchSuggestions)
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

const findAutocompleteWrapper = (wrapper: VueWrapper) => wrapper.findComponent(PAutocomplete)
let wrapper: VueWrapper
describe('addDelegatesStep', () => {
  beforeEach(() => {
    wrapper = createWrapper()
  })

  describe('props', () => {
    it('should call getCollaborators on model change', async () => {
      const autocompleteWrapper = findAutocompleteWrapper(wrapper)
      autocompleteWrapper.vm.$emit('update:modelValue', 'hi !')
      await flushPromises()
      await nextTick()
      // @ts-expect-error
      expect(autocompleteWrapper.props('modelValue')).toBe('hi !')
    })
  })

  describe('interactions', () => {
    it('should remove collaborator if already selected on select event', () => {
      const autocompleteWrapper = findAutocompleteWrapper(wrapper)
      const selectedContact = mockedCollaborators[1]
      autocompleteWrapper.vm.$emit('select', selectedContact)

      expect(wrapper.emitted('remove-collaborator')).toStrictEqual([
        [selectedContact.id],
      ])
    })

    it('should add collaborator if already selected on select event', () => {
      wrapper = createWrapper({ selectedCollaborators: [mockedCollaborators[1], mockedCollaborators[2]] })

      const autocompleteWrapper = findAutocompleteWrapper(wrapper)
      const selectedContact = mockedCollaborators[0]
      autocompleteWrapper.vm.$emit('select', selectedContact)

      expect(wrapper.emitted('add-collaborator')).toStrictEqual([
        [selectedContact],
      ])
    })
  })
})
