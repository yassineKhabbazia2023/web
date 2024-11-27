<template>
  <PInput
    v-model="searchModel"
    :placeholder="t('search')"
    data-testid="mandate-search-bar"
    size="small"
  >
    <template #prefix>
      <PIcon class="el-button__icon--left" pName="search" />
    </template>
  </PInput>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { computed } from 'vue'
import { PInput, PIcon } from '@pulse/styleguide/components'

type SearchBarProps = {
  modelValue: string
}

const props = defineProps<SearchBarProps>()

const emit = defineEmits(['update:modelValue'])

const searchModel = computed({
  get() {
    return props.modelValue
  },
  set(value) {
    emit('update:modelValue', value)
  },
})

const { t } = useI18n({
  inheritLocale: true,
  useScope: 'local',
})
</script>

<i18n lang="yaml">
  en-US:
    search: 'Search'
  fr-FR:
    search: 'Rechercher'
</i18n>
