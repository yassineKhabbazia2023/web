<template>
  <PSelect
    pFilterable
    pMultiple
    v-model="recipientsModel"
    pCollapseTags
    pCollapseTagsTooltip
    :pPlaceholder="placeholder"
    :pNoMatchText="t('no-match')"
    :pNoDataText="t('no-data')"
  >
    <template #header>
      <PCheckbox
        v-model="hasCheckAll"
        @change="handleCheckAll"
      >
        {{ toggleAllCheckboxLabel }}
      </PCheckbox>
    </template>
    <POption
      v-for="schedule in optionsCollection"
      :key="schedule.label"
      :pLabel="schedule.label"
      :pValue="schedule.value"
    />
  </PSelect>
</template>

<script setup lang='ts'>
import { computed, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import {
  PSelect,
  POption,
  PCheckbox,
} from '@pulse/styleguide'
import type { DropdownMultiSelectWithToggleAllProps } from './DropdownMultiSelectWithToggleAllTypes'

const { t } = useI18n({
  inheritLocale: true,
  useScope: 'local',
})

const hasCheckAll = ref(false)

const props = withDefaults(defineProps<DropdownMultiSelectWithToggleAllProps>(), {
  placeholder: 'Choisir un ou plusieurs dossiers',
  toggleAllCheckboxLabel: 'Tout le portefeuille',
})

const emit = defineEmits<{
  'update:modelValue': [value: number[]]
}>()

const recipientsModel = computed({
  get() {
    return props.modelValue
  },
  set(value) {
    emit('update:modelValue', value)
  },
})

watch(recipientsModel, (value) => {
  hasCheckAll.value = value.length === props.optionsCollection.length
})

const handleCheckAll = (value:boolean) => {
  if (value) {
    recipientsModel.value = props.optionsCollection.map(
      (option: { value: number, label: string }) => option.value)
  } else {
    recipientsModel.value = []
  }
}
</script>

<i18n lang="yaml">
  en-US:
    no-data: 'No data'
    no-match: 'No matching data'
  fr-FR:
    no-data: 'Aucune données'
    no-match: 'Aucune correspondance'
</i18n>
