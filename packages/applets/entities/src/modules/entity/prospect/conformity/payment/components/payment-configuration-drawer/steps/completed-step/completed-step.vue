<template>
  <div
    v-if="isLoadingSignedMandate"
    class="
      flex
      flex--justify-content-center
      padding--6
    "
  >
    <PLoader pSize="32px" />
  </div>
  <div
    v-else
    class="
      flex
      flex--direction-column
      flex-gap--6
    "
  >
    <!-- Success hero -->
    <div
      class="
        bg--surface-success
        border-radius--4
        flex
        flex--direction-column
        flex--align-items-center
        flex-gap--2
        padding--6
        text-center
      "
    >
      <PIcon
        pName="circleCheckDuotone"
        pSize="48"
        pColor="var(--p-icon-success)"
      />
      <span
        class="
          font-size--18
          font-bold
          text-color--text-heading
        "
      >
        {{ t(`${I18N}.successTitle`) }}
      </span>
      <p class="margin--0">
        {{ t(`${I18N}.successSubtitle`) }}
      </p>
    </div>

    <!-- Signed mandate download -->
    <section
      class="
        flex
        flex--direction-column
        flex-gap--2
      "
    >
      <span class="font-size--14 font-semibold">{{ t(`${I18N}.signedMandateLabel`) }}</span>
      <PFileCard
        :pName="SIGNED_MANDATE_FILE_NAME"
        pFormat="PDF"
        :pSize="signedMandateSize"
        pHasIcon
        pHasButton
        class="shadow--2"
      >
        <template #icon>
          <PIcon pName="filetypePdf" />
        </template>
        <template #buttons>
          <PButton
            pIconOnly
            pType="tertiary"
            :pDisabled="signedMandateBlob === null"
            @click="onDownload"
          >
            <PIcon pName="download" />
          </PButton>
        </template>
      </PFileCard>
    </section>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { downloadFile } from '@pulse/common/helpers'
import { PButton, PFileCard, PIcon, PLoader } from '@pulse/styleguide/components'
import { PAYMENT_I18N_BASE, SIGNED_MANDATE_FILE_NAME } from '@entities/modules/entity/prospect/conformity/payment/payment.consts'
import { useCompletedStep } from './completed-step.composable'

const I18N = `${PAYMENT_I18N_BASE}.configurationDrawer.completed`

const { t } = useI18n()

const props = defineProps<{ prospectId: number }>()

// Self-contained: fetching and downloading the signed mandate concerns only this step.
const { isLoadingSignedMandate, signedMandateBlob, fetchSignedMandate } = useCompletedStep({
  prospectId: props.prospectId,
  downloadErrorMessage: t(`${PAYMENT_I18N_BASE}.configurationDrawer.downloadError`),
})

// File size shown on the card, derived from the downloaded mandate (empty while it loads).
const signedMandateSize = computed(() => {
  const blob = signedMandateBlob.value
  if (blob === null) {
    return ''
  }
  return `${Math.round(blob.size / 1024)} KB`
})

// Reaching this step fetches the signed mandate so it can be downloaded.
onMounted(() => {
  fetchSignedMandate()
})

const onDownload = (): void => {
  if (signedMandateBlob.value !== null) {
    downloadFile(signedMandateBlob.value, SIGNED_MANDATE_FILE_NAME)
  }
}
</script>
