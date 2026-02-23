import { describe, it, expect, beforeEach } from 'vitest'
import type { VueWrapper } from '@vue/test-utils'
import { shallowMount } from '@vue/test-utils'
import type { PAutocompleteProps } from './PAutocompleteTypes'
import PAutocomplete from '.'

const suggestionsData = [
  { value: 'vue', link: 'test link' },
  { value: 'vuex', link: 'test link' },
]

const propsValue: PAutocompleteProps = {
  pPlaceholder: 'placeholder',
  pClearable: true,
  pDisabled: false,
  pValueKey: 'value',
  pPlacement: 'bottom',
  pFetchSuggestions: () => suggestionsData,
  pTriggerOnFocus: true,
  pSelectWhenUnmatched: true,
  pName: 'name',
  pLabel: 'label',
  pHideLoading: true,
  pPopperClass: 'test',
  pFitInputWidth: true,
  pTeleported: false,
  pHighlightFirstItem: true,
}

const defaultSlot = `
  <template #default="{ item }">
    <div class="value" data-testid="default-item">
      {{ item.value }}
    </div>
  </template>
  `

const createWrapper = () =>
  shallowMount(PAutocomplete, {
    props: propsValue,
    attachTo: document.body,
    slots: {
      default: defaultSlot,
      prefix: "<button data-testid='prefix-slot'>Prefix Test Button</button>",
      suffix: "<button data-testid='suffix-slot'>Suffix Test Button</button>",
    },
    global: {
      stubs: {
        ElAutocomplete: {
          name: 'ElAutocomplete',
          template: '<div><slot name="prefix" /><slot :item="item" /><slot name="suffix" /></div>',
          data() {
            const item = {}

            return {
              item,
            }
          },
          props: [
            'modelValue',
            'placement',
            'clearable',
            'disabled',
            'valueKey',
            'debounce',
            'triggerOnFocus',
            'fetchSuggestions',
            'name',
            'label',
            'hideLoading',
            'popperClass',
            'teleported',
            'highlightFirstItem',
            'fitInputWidth',
            'selectWhenUnmatched',
            'placeholder',
          ],
        },
      },
    },
  })

describe('pAutoComplete', () => {
  let wrapper: VueWrapper
  beforeEach(() => {
    wrapper = createWrapper()
  })
  describe('props', () => {
    it('should be props passed', () => {
      const component = wrapper.findComponent({ name: 'ElAutocomplete' })

      const expectedProps = {
        modelValue: undefined,
        placement: propsValue.pPlacement,
        clearable: propsValue.pClearable,
        disabled: propsValue.pDisabled,
        valueKey: propsValue.pValueKey,
        debounce: propsValue.pDebounce,
        triggerOnFocus: propsValue.pTriggerOnFocus,
        fetchSuggestions: propsValue.pFetchSuggestions,
        name: propsValue.pName,
        label: propsValue.pLabel,
        hideLoading: propsValue.pHideLoading,
        popperClass: propsValue.pPopperClass,
        teleported: propsValue.pTeleported,
        highlightFirstItem: propsValue.pHighlightFirstItem,
        fitInputWidth: propsValue.pFitInputWidth,
        selectWhenUnmatched: propsValue.pSelectWhenUnmatched,
        placeholder: propsValue.pPlaceholder,
      }
      expect(component.props()).toMatchObject(expectedProps)
    })
  })
  describe('display', () => {
    it('should render correctly', () => {
      const elAutocomplete = wrapper.findComponent({ name: 'ElAutocomplete' })

      expect(elAutocomplete.props('placeholder')).toBe(propsValue.pPlaceholder)
    })
  })
  describe('slots', () => {
    it("should display the content of the 'prefix' slot when it exists", () => {
      const prefixSlot = wrapper.find('[data-testid=prefix-slot]')

      expect(prefixSlot.exists()).toBeTruthy()
      expect(prefixSlot.text()).toBe('Prefix Test Button')
    })
    it("should display the content of the 'suffix' slot when it exists", () => {
      const suffixSlot = wrapper.find('[data-testid=suffix-slot]')

      expect(suffixSlot.exists()).toBeTruthy()
      expect(suffixSlot.text()).toBe('Suffix Test Button')
    })
  })
})
