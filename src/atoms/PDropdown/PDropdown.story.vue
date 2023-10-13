<template>
  <Story title="2. Atoms/Dropdown" icon="radix-icons:margin">
    <Variant title="Basic usage simple" :initState="initState">
      <template #default="{ state }">
        <PDropdown
          v-model="valueSimple"
          placeholder="Select"
          :disabled="state.disabled">
          <el-option
            v-for="item in selectOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
            :disabled="item.disabled" />
        </PDropdown>
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
    <Variant title="multiple select" :initState="initState">
      <template #default="{ state }">
        <PDropdown
          v-model="state.value"
          multiple
          :collapseTags="state.collapseTags"
          :collapseTagsTooltip="state.collapseTagsTooltip"
          :disabled="state.disabled"
          :filterable="state.filterable"
        >
          <el-option
            v-for="item in selectOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
            :disabled="item.disabled"
          />
        </PDropdown>
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
          :filterable="state.filterable"
          :allowCreate="state.allowCreate"
          :disabled="state.disabled"
        >
          <el-option
            v-for="item in selectOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </PDropdown>
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
      :source="templateSourceGroup">
      <template #default="{ state }">
        <PDropdown v-model="state.value" placeholder="Select">
          <POptionGroup
            v-for="group in groupOptions"
            :key="group.label"
            :label="group.label"
          >
            <POption
              v-for="item in group.options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </POptionGroup>
        </PDropdown>
      </template>
    </Variant>
  </Story>
</template>

<script setup lang="ts">
import { groupOptions, selectOptions, templateSourceGroup } from '@/constants/dropdownOptions'
import { ref } from 'vue'

const valueSimple = ref('')

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
    automaticDropdown: true
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
