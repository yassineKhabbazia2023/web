<template>
  <Story title="3. Molecules/Select" icon="radix-icons:margin">
    <Variant title="Basic usage simple" :initState="initState">
      <template #default="{ state }">
        <PSelect
          v-model="valueSimple"
          pPlaceholder="Select"
          :pDisabled="state.disabled"
          :pClearable="state.clearable"
        >
          <POption
            v-for="item in selectOptions"
            :key="item.value"
            :pLabel="item.label"
            :pValue="item.value"
            :pDisabled="item.disabled"
          />
      </PSelect>
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
        <PSelect
          v-model="state.value"
          pMultiple
          :pCollapseTags="state.collapseTags"
          :pCollapseTagsTooltip="state.collapseTagsTooltip"
          :pDisabled="state.disabled"
          :pFilterable="state.filterable"
        >
          <POption
            v-for="item in selectOptions"
            :key="item.value"
            :pLabel="item.label"
            :pValue="item.value"
            :pDisabled="item.disabled"
          />
        </PSelect>
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

    <Variant title="Multiple select by toggle" :initState="initState">
      <template #default="{ state }">
        <PSelect
          v-model="valueMultiple"
          pMultiple
          :pCollapseTags="state.collapseTags"
          :pCollapseTagsTooltip="state.collapseTagsTooltip"
          :pDisabled="state.disabled"
          :pFilterable="state.filterable"
        >
          <template #header>
            <PCheckbox
              v-model="checkAll"
              @change="handleCheckAll"
            >
              Tout sélectionner
            </PCheckbox>
          </template>
          <POption
            v-for="item in selectOptions"
            :key="item.value"
            :pLabel="item.label"
            :pValue="item.value"
            :pDisabled="item.disabled"
          />
        </PSelect>
      </template>
      <template #controls="{ state }">
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
        <PSelect
          v-model="state.value"
          :pFilterable="state.filterable"
          :pAllowCreate="state.allowCreate"
          :pDisabled="state.disabled"
        >
          <POption
            v-for="item in selectOptions"
            :key="item.value"
            :pLabel="item.label"
            :pValue="item.value"
          />
        </PSelect>
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
        <PSelect v-model="state.value" pPlaceholder="Select">
          <POptionGroup
            v-for="group in groupOptions"
            :key="group.label"
            :pLabel="group.label"
          >
            <POption
              v-for="item in group.options"
              :key="item.value"
              :pLabel="item.label"
              :pValue="item.value"
            />
          </POptionGroup>
        </PSelect>
      </template>
    </Variant>
  </Story>
</template>

<script setup lang="ts">
import { groupOptions, selectOptions, templateSourceGroup } from '@/constants/dropdownOptions'
import { ref, watch } from 'vue'
import POption from '@/atoms/POption'
import POptionGroup from '@/molecules/POptionGroup'
import PCheckbox from '@/atoms/PCheckbox'

const valueSimple = ref('')
const checkAll = ref(false)
const valueMultiple = ref<string[]>([])

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

watch(valueMultiple, (val) => {
  checkAll.value = val.length === selectOptions.length
})

const handleCheckAll = (val:boolean) => {
  if (val) {
    valueMultiple.value = selectOptions.map(({ value }: { value: string }) => value)
  } else {
    valueMultiple.value = []
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
