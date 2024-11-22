<template>
  <div class="documents-check-all">
    <PCheckbox
      v-model="checked"
      :disabled="disabled"
      @change="handleSelectAll"
    >
      {{ t('selectAllLabel') }}
    </PCheckbox>
  </div>
</template>

<script setup lang="ts">
import type { DocumentsCheckAllProps } from './DocumentsCheckAllTypes'
import { PCheckbox } from '@pulse/styleguide/components'
import { ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n({
  inheritLocale: true,
  useScope: 'local',
})

const props = defineProps<DocumentsCheckAllProps>()

const emit = defineEmits(['check-all-documents'])

const checked = ref(props.checked)

const handleSelectAll = (value: boolean) => {
  emit('check-all-documents', value)
}

watch(
  () => props.checked,
  (newValue) => {
    checked.value = newValue
  }, {
    deep: true,
  },
)
</script>

<i18n lang="yaml">
en-US:
  selectAllLabel: Tout sélectionner

fr-FR:
  selectAllLabel: Tout sélectionner
</i18n>
