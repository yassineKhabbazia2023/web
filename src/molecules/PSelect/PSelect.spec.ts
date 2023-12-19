import { VueWrapper, mount } from '@vue/test-utils'
import { describe, it, expect, vi } from 'vitest'
import { ElSelect } from 'element-plus'
import PSelect from '.'
import type { PSelectProps } from './PSelectTypes'

const propsValue: PSelectProps = {
  pMultiple: false,
  pDisabled: false,
  pValueKey: 'value',
  pSize: 'small',
  pClearable: false,
  pCollapseTags: false,
  pCollapseTagsTooltip: false,
  pMultipleLimit: 0,
  pName: 'name',
  pEffect: 'light',
  pAutocomplete: 'off',
  pPlaceholder: 'placeholder',
  pFilterable: false,
  pAllowCreate: false,
  pFilterMethod: vi.fn(),
  pRemote: false,
  pRemoteMethod: vi.fn(),
  pRemoteShowSuffix: false,
  pLoading: false,
  pLoadingText: 'loading text',
  pNoMatchText: 'no match text',
  pNoDataText: 'no data text',
  pPoppperClass: 'popper class',
  pReserveKeyword: true,
  pDefaultFirstOption: false,
  pTeleported: true,
  pPersistent: true,
  pAutomaticDropdown: false,
  pClearIcon: 'clearicon',
  pFitInputWidth: false,
  pSuffixIcon: 'suffixicon',
  pSuffixTransition: true,
  pTagType: 'info',
  pValidateEvent: true,
  pPlacement: 'bottom-start',
  pMaxCollapseTags: 1,
  pPopperOptions: {},
  pAriaLabel: 'ariaLabel'
}
const createWrapper = () => mount(PSelect, {
  props: propsValue
})

describe('pSelect', () => {
  it('should render correctly', async () => {
    const wrapper: VueWrapper<any> = createWrapper()
    const componentVM = wrapper.findComponent(ElSelect).vm
    expect(componentVM.multiple).toBe(propsValue.pMultiple)
    expect(componentVM.disabled).toBe(propsValue.pDisabled)
    expect(componentVM.valueKey).toBe(propsValue.pValueKey)
    expect(componentVM.size).toBe(propsValue.pSize)
    expect(componentVM.clearable).toBe(propsValue.pClearable)
    expect(componentVM.collapseTags).toBe(propsValue.pCollapseTags)
    expect(componentVM.collapseTagsTooltip).toBe(propsValue.pCollapseTagsTooltip)
    expect(componentVM.multipleLimit).toBe(propsValue.pMultipleLimit)
    expect(componentVM.name).toBe(propsValue.pName)
    expect(componentVM.effect).toBe(propsValue.pEffect)
    expect(componentVM.autocomplete).toBe(propsValue.pAutocomplete)
    expect(componentVM.placeholder).toBe(propsValue.pPlaceholder)
    expect(componentVM.filterable).toBe(propsValue.pFilterable)
    expect(componentVM.allowCreate).toBe(propsValue.pAllowCreate)
    expect(componentVM.filterMethod).toBe(propsValue.pFilterMethod)
    expect(componentVM.remote).toBe(propsValue.pRemote)
    expect(componentVM.remoteMethod).toBe(propsValue.pRemoteMethod)
    expect(componentVM.remoteShowSuffix).toBe(propsValue.pRemoteShowSuffix)
    expect(componentVM.loading).toBe(propsValue.pLoading)
    expect(componentVM.loadingText).toBe(propsValue.pLoadingText)
    expect(componentVM.noMatchText).toBe(propsValue.pNoMatchText)
    expect(componentVM.noDataText).toBe(propsValue.pNoDataText)
    expect(componentVM.popperClass).toBe(propsValue.pPoppperClass)
    expect(componentVM.reserveKeyword).toBe(propsValue.pReserveKeyword)
    expect(componentVM.defaultFirstOption).toBe(propsValue.pDefaultFirstOption)
    expect(componentVM.teleported).toBe(propsValue.pTeleported)
    expect(componentVM.persistent).toBe(propsValue.pPersistent)
    expect(componentVM.automaticDropdown).toBe(propsValue.pAutomaticDropdown)
    expect(componentVM.clearIcon).toBe(propsValue.pClearIcon)
    expect(componentVM.fitInputWidth).toBe(propsValue.pFitInputWidth)
    expect(componentVM.suffixIcon).toBe(propsValue.pSuffixIcon)
    expect(componentVM.suffixTransition).toBe(propsValue.pSuffixTransition)
    expect(componentVM.tagType).toBe(propsValue.pTagType)
    expect(componentVM.validateEvent).toBe(propsValue.pValidateEvent)
    expect(componentVM.placement).toBe(propsValue.pPlacement)
    expect(componentVM.maxCollapseTags).toBe(propsValue.pMaxCollapseTags)
    expect(componentVM.popperOptions).toStrictEqual(propsValue.pPopperOptions)
    expect(wrapper.find('.el-input__inner').attributes('aria-label')).toBe(propsValue.pAriaLabel)
  })
})
