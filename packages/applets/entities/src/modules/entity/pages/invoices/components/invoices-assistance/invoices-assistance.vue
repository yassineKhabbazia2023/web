<template>
  <PButton
    pType="secondary"
    :pDisabled="isCollab"
    @click="handleOpenDialog"
  >
    {{ t('entities.invoices.assistanceButton') }}
  </PButton>

  <PDialog
    v-model="isDialogOpen"
    pWidth="50%"
    :pDestroyOnClose="true"
  >
    <iframe
      :src="iframeUrl"
      class="invoices-assistance__iframe"
    />
  </PDialog>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { PButton, PDialog } from '@pulse/styleguide/components'
import type { InvoicesFormStep } from '@entities/modules/entity/enums'
import { useInvoicesAssistance } from './invoices-assistance.composable'

const props = defineProps<{
  step: InvoicesFormStep
}>()

const { t } = useI18n()

const { isCollab, iframeUrl, isDialogOpen, handleOpenDialog } = useInvoicesAssistance(props.step)
</script>

<style lang="scss" scoped>
.invoices-assistance {
  &__iframe {
    width: 100%;
    height: 70vh;
    border: none;
  }
}
</style>
