import type { VueWrapper } from '@vue/test-utils'
import { mount } from '@vue/test-utils'
import { beforeEach, describe, it, expect, vi } from 'vitest'
import PDropdown from '.'
import type { PDropdownProps, PDropdownOption } from './PDropdownTypes'
import { getMockedDropdownOptions } from './PDropdownMocks'
import { nextTick } from 'vue'

function getPropsValue(pOptions: PDropdownOption[], pCheckAllLabel = '') {
  const propsValue: PDropdownProps = {
    pOptions,
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
    pPopperClass: 'popper class',
    pReserveKeyword: true,
    pDefaultFirstOption: false,
    pTeleported: false,
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
    pCheckAllLabel,
    pIsCheckAll: false,
  }

  return propsValue
}

function createWrapper(props: PDropdownProps) {
  return mount(PDropdown, { props })
}

describe('test PDropdown', () => {
  describe('without groups', () => {
    const hasGroup = false
    const pOptions = getMockedDropdownOptions(hasGroup)
    const propsValue = getPropsValue(pOptions)
    let wrapper: VueWrapper
    beforeEach(() => {
      wrapper = createWrapper(propsValue)
    })
    it('should NOT contain groups', () => {
      const optionGroup = wrapper.findComponent({ name: 'ElOptionGroup' })
      expect(optionGroup.exists()).toBeFalsy()
    })
    it('should display options correctly', () => {
      const options = wrapper.findAllComponents({ name: 'ElOption' })
      expect(options).toHaveLength(pOptions.length)
      expect(options?.at(0)?.text()).toBe(pOptions.at(0)?.pLabel)
    })
    it('should render correctly', () => {
      const component = wrapper.findComponent({ name: 'ElSelect' })
      const expectedProps = {
        multiple: propsValue.pMultiple,
        disabled: propsValue.pDisabled,
        valueKey: propsValue.pValueKey,
        size: propsValue.pSize,
        clearable: propsValue.pClearable,
        collapseTags: propsValue.pCollapseTags,
        collapseTagsTooltip: propsValue.pCollapseTagsTooltip,
        multipleLimit: propsValue.pMultipleLimit,
        name: propsValue.pName,
        effect: propsValue.pEffect,
        autocomplete: propsValue.pAutocomplete,
        placeholder: propsValue.pPlaceholder,
        filterable: propsValue.pFilterable,
        allowCreate: propsValue.pAllowCreate,
        filterMethod: propsValue.pFilterMethod,
        remote: propsValue.pRemote,
        remoteMethod: propsValue.pRemoteMethod,
        remoteShowSuffix: propsValue.pRemoteShowSuffix,
        loading: propsValue.pLoading,
        loadingText: propsValue.pLoadingText,
        noMatchText: propsValue.pNoMatchText,
        noDataText: propsValue.pNoDataText,
        popperClass: propsValue.pPopperClass,
        reserveKeyword: propsValue.pReserveKeyword,
        defaultFirstOption: propsValue.pDefaultFirstOption,
        teleported: propsValue.pTeleported,
        persistent: propsValue.pPersistent,
        automaticDropdown: propsValue.pAutomaticDropdown,
        clearIcon: propsValue.pClearIcon,
        fitInputWidth: propsValue.pFitInputWidth,
        suffixIcon: propsValue.pSuffixIcon,
        suffixTransition: propsValue.pSuffixTransition,
        tagType: propsValue.pTagType,
        validateEvent: propsValue.pValidateEvent,
        placement: propsValue.pPlacement,
        maxCollapseTags: propsValue.pMaxCollapseTags,
        popperOptions: propsValue.pPopperOptions,
        ariaLabel: propsValue.pAriaLabel,
      }
      const pCheckbox = component.findComponent({ name: 'PCheckbox' })

      expect(component.props()).toMatchObject(expectedProps)
      expect(pCheckbox.exists()).toBeFalsy()
      expect(wrapper.find('.el-input__inner').attributes('aria-label')).toBe(propsValue.pAriaLabel)
    })
  })
  describe('with groups', () => {
    const hasGroup = true
    const pOptions = getMockedDropdownOptions(hasGroup)
    const propsValue = getPropsValue(pOptions)
    let wrapper: VueWrapper
    beforeEach(() => {
      wrapper = createWrapper(propsValue)
    })
    it('should contain groups', () => {
      const optionGroup = wrapper.findComponent({ name: 'ElOptionGroup' })
      expect(optionGroup.exists()).toBeTruthy()
    })
    it('should display options correctly', () => {
      const options = wrapper.findAllComponents({ name: 'ElOption' })
      expect(options).toHaveLength(pOptions.length)
      expect(options?.at(0)?.text()).toBe(pOptions.at(0)?.pLabel)
    })
    it('should render correctly', () => {
      const componentVM = wrapper.findComponent({ name: 'ElSelect' }).vm
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
      expect(componentVM.popperClass).toBe(propsValue.pPopperClass)
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

  describe('with checkAll', () => {
    const hasGroup = false
    const pOptions = getMockedDropdownOptions(hasGroup)
    const propsValue = getPropsValue(pOptions, 'Check all')
    let wrapper: VueWrapper
    beforeEach(() => {
      wrapper = createWrapper(propsValue)
    })
    it('should emit update:p-is-check-all when click on PCheckbox', async () => {
      const component = wrapper.findComponent({ name: 'ElSelect' })
      const pCheckbox = component.findComponent({ name: 'PCheckbox' })

      pCheckbox.vm.$emit('update:model-value', true)
      await nextTick()

      expect(wrapper.emitted('update:p-is-check-all')).toStrictEqual([[true]])
    })
  })
})
