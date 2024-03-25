import type { VueWrapper } from '@vue/test-utils'
import { mount } from '@vue/test-utils'
import { describe, it, expect, vi } from 'vitest'
import PSelect from '.'
import type { PSelectProps } from './PSelectTypes'

const props: PSelectProps = {
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
  pAriaLabel: 'ariaLabel',
}
const createWrapper = () => mount(PSelect, {
  props,
})

describe('pSelect', () => {
  it('should contain el-select with proper props', () => {
    const wrapper: VueWrapper<any> = createWrapper()
    const component = wrapper.findComponent({ name: 'ElSelect' })
    const expectedProps = {
      id: undefined,
      modelValue: undefined,
      multiple: props.pMultiple,
      disabled: props.pDisabled,
      valueKey: props.pValueKey,
      size: props.pSize,
      clearable: props.pClearable,
      collapseTags: props.pCollapseTags,
      collapseTagsTooltip: props.pCollapseTagsTooltip,
      multipleLimit: props.pMultipleLimit,
      name: props.pName,
      effect: props.pEffect,
      autocomplete: props.pAutocomplete,
      placeholder: props.pPlaceholder,
      filterable: props.pFilterable,
      allowCreate: props.pAllowCreate,
      filterMethod: props.pFilterMethod,
      remote: props.pRemote,
      remoteMethod: props.pRemoteMethod,
      remoteShowSuffix: props.pRemoteShowSuffix,
      loading: props.pLoading,
      loadingText: props.pLoadingText,
      noMatchText: props.pNoMatchText,
      noDataText: props.pNoDataText,
      popperClass: props.pPoppperClass,
      reserveKeyword: props.pReserveKeyword,
      defaultFirstOption: props.pDefaultFirstOption,
      teleported: props.pTeleported,
      persistent: props.pPersistent,
      automaticDropdown: props.pAutomaticDropdown,
      clearIcon: props.pClearIcon,
      fitInputWidth: props.pFitInputWidth,
      suffixIcon: props.pSuffixIcon,
      suffixTransition: props.pSuffixTransition,
      tagType: props.pTagType,
      validateEvent: props.pValidateEvent,
      placement: props.pPlacement,
      maxCollapseTags: props.pMaxCollapseTags,
      popperOptions: props.pPopperOptions,
      ariaLabel: props.pAriaLabel,
    }
    expect(component.props()).toStrictEqual(expectedProps)
  })
})
