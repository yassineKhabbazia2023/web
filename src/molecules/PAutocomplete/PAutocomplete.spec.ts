import { VueWrapper, mount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'
import PAutocomplete from '.'
import type { PAutocompleteProps } from './PAutocompleteTypes'

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

const createWrapper = () => mount(PAutocomplete, {
  props: propsValue,
  attachTo: document.body,
  slots: {
    default: 'autocomplete text'
  }
})

describe('pAutoComplete', () => {
  it('should render correctly', async () => {
    const wrapper: VueWrapper<any> = createWrapper()
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

