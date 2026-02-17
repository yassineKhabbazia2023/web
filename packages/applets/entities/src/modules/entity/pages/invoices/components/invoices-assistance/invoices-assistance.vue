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
      :src="sanitizedIframeUrl"
      class="invoices-assistance__iframe"
    />
  </PDialog>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { PButton, PDialog } from '@pulse/styleguide/components'
import { sanitizeUrl } from '@pulse/toolbox/utils/url'
import { INVOICES_ASSISTANCE_FORM_URL } from '../../invoices.constants'
import { InvoicesTracking } from '@entities/services/invoices/invoices.tracking.service'
import type { InvoicesFormStep } from '@entities/modules/entity/enums'
import { useUserStore } from '@pulse/common/stores'

const props = defineProps<{
  step: InvoicesFormStep
}>()

const { t } = useI18n()

const isDialogOpen = ref(false)
const sanitizedIframeUrl = sanitizeUrl(INVOICES_ASSISTANCE_FORM_URL)

function handleOpenDialog() {
  if (isCollab.value === true) {
    return
  }

  InvoicesTracking.trackAssistanceButtonClick(props.step)
  isDialogOpen.value = true
}

const userStore = useUserStore()
const isCollab = computed(() => userStore.isCollab)

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
