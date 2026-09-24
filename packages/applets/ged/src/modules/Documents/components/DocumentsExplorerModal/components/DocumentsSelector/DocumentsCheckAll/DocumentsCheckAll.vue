<template>
  <div class="documents-check-all">
    <PCheckbox
      v-model="checked"
      :disabled="disabled"
      @update:model-value="handleSelectAll"
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
  messages: {
    'en-US': {
      selectAllLabel: 'Tout sélectionner',
    },
    'fr-FR': {
      selectAllLabel: 'Tout sélectionner',
    },
  },
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

