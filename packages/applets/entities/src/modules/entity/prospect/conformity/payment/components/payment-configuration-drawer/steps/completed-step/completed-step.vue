<template>
  <div
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
        pHasIcon
        pHasButton
        pHideTechnicalDetails
        class="shadow--2"
      >
        <template #icon>
          <PIcon pName="filetypePdf" />
        </template>
        <template #buttons>
          <PButton
            pIconOnly
            pType="tertiary"
            :pLoading="isLoadingSignedMandate"
            @click="openSignedMandate"
          >
            <PIcon pName="download" />
          </PButton>
        </template>
      </PFileCard>
    </section>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { PButton, PFileCard, PIcon } from '@pulse/styleguide/components'
import { PAYMENT_I18N_BASE, SIGNED_MANDATE_FILE_NAME } from '@entities/modules/entity/prospect/conformity/payment/payment.consts'
import { useCompletedStep } from './completed-step.composable'

const I18N = `${PAYMENT_I18N_BASE}.configurationDrawer.completed`

const { t } = useI18n()

const props = defineProps<{ accountId: number }>()

// Self-contained: fetching and opening the signed mandate concerns only this step.
const { isLoadingSignedMandate, openSignedMandate } = useCompletedStep({
  accountId: props.accountId,
  downloadErrorMessage: t(`${PAYMENT_I18N_BASE}.configurationDrawer.downloadError`),
})
</script>
