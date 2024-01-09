import { VueWrapper, mount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'
import PAutocomplete from '.'
import { ElAutocomplete } from 'element-plus'
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
    const componentVM = wrapper.findComponent(ElAutocomplete).vm
    const input = document.body.querySelector('.el-input__inner') as Element

    expect(input.getAttribute('placeholder')).toBe(propsValue.pPlaceholder)
    expect(componentVM.clearable).toBe(propsValue.pClearable)
    expect(componentVM.disabled).toBe(propsValue.pDisabled)
    expect(componentVM.debounce).toBe(propsValue.pDebounce)
    expect(componentVM.fetchSuggestions).toBe(propsValue.pFetchSuggestions)
    expect(componentVM.hideLoading).toBe(propsValue.pHideLoading)
    expect(componentVM.label).toBe(propsValue.pLabel)
    expect(componentVM.highlightFirstItem).toBe(propsValue.pHighlightFirstItem)
    expect(componentVM.selectWhenUnmatched).toBe(propsValue.pSelectWhenUnmatched)
    expect(componentVM.teleported).toBe(propsValue.pTeleported)
    expect(componentVM.valueKey).toBe(propsValue.pValueKey)
    expect(componentVM.placement).toBe(propsValue.pPlacement)
    expect(componentVM.popperClass).toBe(propsValue.pPopperClass)
    expect(componentVM.triggerOnFocus).toBe(propsValue.pTriggerOnFocus)
    expect(componentVM.name).toBe(propsValue.pName)
  })
})

