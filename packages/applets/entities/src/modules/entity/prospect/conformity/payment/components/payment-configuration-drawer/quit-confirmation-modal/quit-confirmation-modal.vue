<template>
  <PDialog
    v-model="isVisible"
    pWidth="500px"
    pAlignCenter
    pDestroyOnClose
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
        @click="onQuit"
      >
        {{ t(`${I18N_KEY}.quit`) }}
      </PButton>
      <PButton
        pType="primary"
        @click="onContinue"
      >
        {{ t(`${I18N_KEY}.continue`) }}
      </PButton>
    </template>
  </PDialog>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { PButton, PDialog, PIcon } from '@pulse/styleguide/components'
import { PAYMENT_I18N_BASE } from '../../../payment.consts'

const I18N_KEY = `${PAYMENT_I18N_BASE}.configurationDrawer.quitConfirmation`

const isVisible = defineModel<boolean>({ required: true })

const emit = defineEmits<{
  quit: []
}>()

const { t } = useI18n()

const onQuit = (): void => {
  emit('quit')
}

const onContinue = (): void => {
  isVisible.value = false
}
</script>
