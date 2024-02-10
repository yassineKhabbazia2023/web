<template>
  <div>
    <PDialog
      v-model="internalValue"
      :pTitle="title"
      pWidth="480px"
    >
      <template #footer>
        <div class="padding-bottom--2">
          <PButton
            pType="primary"
            pPlain
            class="margin-right--1"
            @click="handleCancel"
            data-testid="cancel-button"
          >
            {{ t('cancel') }}
          </PButton>
          <PButton
            pType="primary"
            @click="emit('confirm')"
            data-testid="confirm-button"
          >
            {{ t('confirm') }}
          </PButton>
        </div>
      </template>
      <p class="margin-y--2">
        {{ content }}
      </p>
    </PDialog>
  </div>
</template>

<i18n lang="yaml">
en-US:
  confirm: 'Confirm'
  cancel: 'Cancel'
fr-FR:
  confirm: 'Confirmer'
  cancel: 'Annuler'
</i18n>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { PDialog, PButton } from '@kpmg/styleguide'
import type { ModalConfirmationProps } from './ModalConfirmationTypes'

const { t } = useI18n({
  inheritLocale: true,
  useScope: 'local'
})

const props = defineProps<ModalConfirmationProps>()
const emit = defineEmits<{
  'update:modelValue': [boolean]
  confirm: []
}>()

const internalValue = computed({
  get() {
    return props.modelValue
  },
  set(value: boolean) {
    emit('update:modelValue', value)
  }
})

const handleCancel = () => {
  internalValue.value = false
}
</script>
