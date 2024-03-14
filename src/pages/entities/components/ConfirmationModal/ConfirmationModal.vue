<template>
  <div>
    <PDialog
      v-model="internalValue"
      :pTitle="title"
      pWidth="480px"
    >
      <template #footer>
        <div class="p-dialog__footer">
          <PButton
            pType="primary"
            pSize="small"
            pPlain
            @click="handleCancel"
            data-testid="cancel-button"
          >
            {{ t('cancel') }}
          </PButton>
          <PButton
            pType="primary"
            pSize="small"
            @click="emit('confirm')"
            data-testid="confirm-button"
          >
            {{ t('confirm') }}
          </PButton>
        </div>
      </template>
      <p class="p-dialog__text">
        {{ content }}
      </p>
    </PDialog>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { PDialog, PButton } from '@kpmg/styleguide'
import type { ConfirmationModalProps } from './ConfirmationModalTypes'

const { t } = useI18n({
  inheritLocale: true,
  useScope: 'local'
})

const props = defineProps<ConfirmationModalProps>()
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

<i18n lang="yaml">
en-US:
  confirm: 'Confirm'
  cancel: 'Cancel'
fr-FR:
  confirm: 'Confirmer'
  cancel: 'Annuler'
</i18n>
