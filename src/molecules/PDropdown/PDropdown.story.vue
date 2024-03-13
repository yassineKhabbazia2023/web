<template>
  <Story title="3. Molecules/Dropdown" icon="radix-icons:margin">
    <Variant title="Basic usage simple" :initState="initState">
      <template #default="{ state }">
        <PDropdown
          v-model="valueSimple"
          pPlaceholder="Dropdown"
          :pDisabled="state.disabled"
          :pClearable="state.clearable"
          :pOptions="dropdownOptions"
        />
      </template>
      <template #controls="{ state }">
        <HstText v-model="state.placeholder" title="Placeholder" />
        <HstCheckbox
          v-model="state.disabled"
          title="Disabled"
        />
        <HstCheckbox
          v-model="state.clearable"
          title="Clearable"
        />
      </template>
    </Variant>
    <Variant title="Multiple select" :initState="initState">
      <template #default="{ state }">
        <PDropdown
          v-model="state.value"
          pMultiple
          :pCollapseTags="state.collapseTags"
          :pCollapseTagsTooltip="state.collapseTagsTooltip"
          :pDisabled="state.disabled"
          :pFilterable="state.filterable"
          :pOptions="dropdownOptions"
        />
      </template>
      <template #controls="{ state }">
        <HstCheckbox
          v-model="state.disabled"
          title="Disabled"
        />
        <HstCheckbox
          v-model="state.collapseTags"
          title="CollapseTags"
        />
        <HstCheckbox
          v-model="state.collapseTagsTooltip"
          title="TagsTooltip"
        />
      </template>
    </Variant>
    <Variant title="Option filtering" :initState="initState">
      <template #default="{ state }">
        <PDropdown
          v-model="state.value"
          :pFilterable="state.filterable"
          :pAllowCreate="state.allowCreate"
          :pDisabled="state.disabled"
          :pOptions="dropdownOptions"
        />
      </template>
      <template #controls="{ state }">
        <HstCheckbox
          v-model="state.filterable"
          title="Filterable"
        />
        <HstCheckbox
          v-model="state.disabled"
          title="Disabled"
        />
        <HstCheckbox
          v-model="state.allowCreate"
          title="AllowCreate"
        />
      </template>
    </Variant>
    <Variant
      title="Grouping"
      :initState="initState"
    >
      <template #default="{ state }">
        <PDropdown
          v-model="state.value"
          pPlaceholder="Select"
          :pOptions="dropdownOptionsWithGroups"
        />
      </template>
    </Variant>
  </Story>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import PDropdown from '.'
import { getMockedDropdownOptions } from './PDropdownMocks'

const valueSimple = ref('')

const dropdownOptions = getMockedDropdownOptions(false)
const dropdownOptionsWithGroups = getMockedDropdownOptions(true)

const initState = () => {
  return {
    value: '' as string | string[],
    size: '',
    disabled: false,
    clearable: false,
    filterable: true,
    allowCreate: false,
    multiple: false,
    multipleLimit: 0,
    placeholder: 'Select',
    defaultFirstOption: false,
    popperClass: '',
    reserveKeyword: false,
    valueKey: '',
    collapseTags: false,
    collapseTagsTooltip: false,
    popperAppendToBody: true,
    automaticDropdown: true,
  }
}
</script>

<docs lang="md">
## element plus component link
https://element-plus.org/en-US/component/select.html#option-slots
<div class="responsive-figma-container">
  <iframe class="responsive-figma" src="https://www.figma.com/embed?embed_host=share&url=https%3A%2F%2Fwww.figma.com%2Ffile%2FhycpUsOrc1fFD7xcYY0ryN%2F%25F0%259F%25A6%2584-Librairie-de-composants%3Ftype%3Ddesign%26node-id%3D548%253A1136%26mode%3Ddev" allowfullscreen></iframe>
</div>
</docs>
