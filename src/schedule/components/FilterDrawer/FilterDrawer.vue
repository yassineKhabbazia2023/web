<template>
  <PDrawer
    v-model="isDrawerOpened"
    :pTitle="t('title')"
    :pShowPreviousStep="false"
    pSize="33%"
    pDirection="rtl"
    @close-drawer-button="isDrawerOpened=false"
  />
</template>

<script setup lang="ts">
import { computed } from 'vue'
import {
  PDrawer,
} from '@kpmg/styleguide'
import { useI18n } from 'vue-i18n'
import type { FilterDrawerProps } from './FilterDrawerTypes'

const { t } = useI18n({
  inheritLocale: true,
  useScope: 'local',
})

const emit = defineEmits<{ 'update:model-value' : [value: boolean] }>()

const props = defineProps<FilterDrawerProps>()

const isDrawerOpened = computed({
  get() {
    return props.modelValue
  },
  set(value) {
    emit('update:model-value', value)
  },
})
</script>

<i18n lang="yaml">
  en-US:
    title: 'Filters'
  fr-FR:
    title: 'Filtres'
</i18n>
