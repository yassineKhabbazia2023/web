<template>
  <PInput
    v-model="searchModel"
    data-testid="search-mandate-test"
    :placeholder="t('search')">
    <template #prefix>
      <PIcon class="el-button__icon--left">
        <PISearch />
      </PIcon>
    </template>
  </PInput>
</template>

<i18n lang="yaml">
  en-US:
    search: 'Search'
  fr-FR:
    search: 'Rechercher'
</i18n>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { computed } from 'vue'
import { PInput, PIcon, PISearch } from '@kpmg/styleguide'

const props = defineProps({
  modelValue: {
    type: String,
    default: null
  }
})

const emit = defineEmits(['update:modelValue'])

const searchModel = computed({
  get() {
    return props.modelValue
  },
  set(value) {
    emit('update:modelValue', value)
  }
})

const { t } = useI18n({
  inheritLocale: true,
  useScope: 'local'
})
</script>
