import { describe, it, expect, beforeEach } from 'vitest'
import { VueWrapper, mount } from '@vue/test-utils'
import type { PAutocompleteProps } from './PAutocompleteTypes'
import PAutocomplete from '.'

const propsValue: PAutocompleteProps = {
  pPlaceholder: 'placeholder',
  pClearable: true,
  pDisabled: true,
  pValueKey: 'value',
  pDebounce: 200,
  pPlacement: 'bottom',
  pFetchSuggestions: undefined,
  pTriggerOnFocus: true,
  pSelectWhenUnmatched: true,
  pName: 'name',
  pLabel: 'label',
  pHideLoading: true,
  pPopperClass: 'test',
  pFitInputWidth: true,
  pTeleported: true,
  pHighlightFirstItem: true
}

const createWrapper = () =>
  mount(PAutocomplete, {
    props: propsValue,
    attachTo: document.body,
    slots: {
      default: 'autocomplete text',
      prefix: "<button data-testid='prefix-slot'>Prefix Test Button</button>",
      suffix: "<button data-testid='suffix-slot'>Suffix Test Button</button>"
    }
  })

describe('pAutoComplete', () => {
  let wrapper: VueWrapper
  beforeEach(() => {
    wrapper = createWrapper()
  })
  describe('display', () => {
    it('should render correctly', async () => {
      const component = wrapper.findComponent({ name: 'ElAutocomplete' })

      const expectedProps = {
        modelValue: '',
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
        selectWhenUnmatched: propsValue.pSelectWhenUnmatched
      }
      expect(component.props()).toMatchObject(expectedProps)

      const input = document.body.querySelector('.el-input__inner') as Element

      expect(input.getAttribute('placeholder')).toBe(propsValue.pPlaceholder)
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
