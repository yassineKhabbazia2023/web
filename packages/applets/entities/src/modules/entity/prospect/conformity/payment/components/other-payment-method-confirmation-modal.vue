<template>
  <PDialog
    v-model="isVisible"
    pWidth="500px"
    pAlignCenter
    pDestroyOnClose
    pAppendToBody
  >
    <div
      class="
        flex
        flex--direction-column
        flex--align-items-center
        flex-gap--4
        text-center
      "
    >
      <PIcon
        pName="infoCircle"
        pSize="24"
        pColor="var(--p-icon-action-default)"
      />
      <div class="h2">
        {{ t(`${I18N_KEY}.title`) }}
      </div>
      <p>{{ t(`${I18N_KEY}.description`) }}</p>
    </div>

    <template #footer>
      <PButton
        pType="secondary"
        @click="onCancel"
      >
        {{ t(`${I18N_KEY}.cancel`) }}
      </PButton>
      <PButton
        pType="primary"
        @click="onConfirm"
      >
        {{ t(`${I18N_KEY}.confirm`) }}
      </PButton>
    </template>
  </PDialog>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { PButton, PDialog, PIcon } from '@pulse/styleguide/components'
import { PAYMENT_I18N_BASE } from '../payment.consts'

const I18N_KEY = `${PAYMENT_I18N_BASE}.otherMethodConfirmation`

const isVisible = defineModel<boolean>({ required: true })

const emit = defineEmits<{
  confirm: []
  cancel: []
}>()

const { t } = useI18n()

const onCancel = (): void => {
  isVisible.value = false
  emit('cancel')
}

const onConfirm = (): void => {
  emit('confirm')
}
</script>
