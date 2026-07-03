<template>
  <div
    class="
      conformity-payment
      text-color--text-body
      flex
      flex--direction-column
      flex-gap--6
    "
  >
    <div
      v-if="isLoading"
      class="
        flex
        flex--justify-content-center
        padding--6
      "
    >
      <PLoader pSize="32px" />
    </div>
    <template v-else>
      <div
        class="
          flex
          flex--direction-column
          flex-gap--2
        "
      >
        <h2
          class="
            flex
            flex--align-items-center
            font-size--16
            font-semibold
            margin--0
          "
        >
          <PIcon
            pName="pulse"
            :pColor="AppColors.JUNGLE_400"
            pSize="16"
          />
          <span class="margin-left--1">{{ title }}</span>
        </h2>
        <p
          v-if="bodyKind === PaymentBodyKind.Benefits"
          class="margin--0"
        >
          {{ t(`${PAYMENT_I18N_BASE}.description`) }}
        </p>
      </div>

      <div
        v-if="bodyKind === PaymentBodyKind.Benefits"
        class="
          flex
          flex--direction-column
          flex-gap--2
        "
      >
        <div
          v-for="benefit in PAYMENT_BENEFITS"
          :key="benefit.labelKey"
          class="
            flex
            flex--align-items-center
            flex-gap--2
          "
        >
          <PIcon
            :pName="benefit.iconName"
            pSize="16px"
            pColor="var(--p-icon-action-default)"
          />
          <span class="font-size--14 font-semibold">
            {{ t(`${PAYMENT_I18N_BASE}.${benefit.labelKey}`) }}
          </span>
          <span class="font-size--14">
            {{ t(`${PAYMENT_I18N_BASE}.${benefit.textKey}`) }}
          </span>
        </div>
      </div>

      <PAlert
        v-else-if="bodyKind === PaymentBodyKind.Alert"
        pType="information"
      >
        <template v-if="bodyLead.length > 0">
          <span class="font-bold">{{ bodyLead }}</span>{{ ' ' }}
        </template>{{ bodyText }}
      </PAlert>

      <template v-else-if="bodyKind === PaymentBodyKind.Bullets">
        <p class="font-size--14 margin--0">
          {{ bodyText }}
        </p>
        <ul
          class="
            padding-left--5
            font-size--14
            margin--0
          "
        >
          <li
            v-for="bulletKey in PAYMENT_COMPLETED_BULLET_KEYS"
            :key="bulletKey"
          >
            {{ t(`${PAYMENT_I18N_BASE}.${bulletKey}`) }}
          </li>
        </ul>
      </template>

      <!-- Submitted box (SEPA mandate only) -->
      <div
        v-if="hasDoneBox"
        class="
          bg--surface-information-primary
          padding--4
          flex
          flex--align-items-center
          flex--justify-content-space-between
          flex-gap--4
        "
      >
        <span
          class="
            text-color--text-heading
            font-size--16
            font-bold
          "
        >
          {{ t(`${PAYMENT_I18N_BASE}.transmittedBoxTitle`) }}
        </span>
        <PTag
          pColor="success"
          pIconLeftName="arrowUpCircle"
          :pContent="t(`${PAYMENT_I18N_BASE}.transmittedTag`)"
        />
      </div>

      <footer
        v-if="footerButtons.length > 0"
        :class="[footerContainerClass, { 'conformity-payment__footer': isMultiButtonFooter }]"
      >
        <PButton
          v-for="button in footerButtons"
          :key="button.action"
          :pType="button.type"
          :pDisabled="isSaving"
          :class="[footerButtonClass, { 'conformity-payment__footer-button': isMultiButtonFooter }]"
          @click="onFooterButtonClick(button)"
        >
          {{ button.label }}
          <PIcon
            v-if="button.trailingIcon !== undefined"
            class="margin-left--2"
            :pName="button.trailingIcon"
            pSize="14px"
          />
        </PButton>
      </footer>
    </template>
  </div>

  <OtherPaymentMethodConfirmationModal
    v-model="isOtherMethodConfirmationVisible"
    @confirm="onConfirmOtherMethod"
  />

  <PaymentConfigurationDrawer
    v-model="isConfigurationDrawerOpen"
    @completed="refreshPaymentPreference"
  />
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { storeToRefs } from 'pinia'
import { PAlert, PButton, PIcon, PLoader, PTag } from '@pulse/styleguide/components'
import { AppColors } from '@pulse/styleguide'
import { useCurrentEntityStore } from '@pulse/common/stores'
import { ConformityPaymentType } from '@entities/enums'
import OtherPaymentMethodConfirmationModal from './components/other-payment-method-confirmation-modal.vue'
import PaymentConfigurationDrawer from './components/payment-configuration-drawer/payment-configuration-drawer.vue'
import { usePayment } from './payment.composable'
import {
  PAYMENT_BENEFITS,
  PAYMENT_COMPLETED_BULLET_KEYS,
  PAYMENT_I18N_BASE,
} from './payment.consts'
import { PaymentBodyKind, PaymentFooterAction } from './payment.enums'
import type {
  PaymentEmits,
  PaymentFooterButton,
  PaymentProps,
} from './payment.types'

const props = withDefaults(defineProps<PaymentProps>(), {
  isCollaborator: false,
})

const emit = defineEmits<PaymentEmits>()

const { t } = useI18n()
const { currentEntity } = storeToRefs(useCurrentEntityStore())

// This card is only rendered within the prospect conformity flow, where the prospect id is always defined.
const prospectId = currentEntity.value?.prospectId as number

const {
  paymentType,
  isLoading,
  isSaving,
  selectOtherMethod,
  returnToSepa,
  refreshPaymentPreference,
  downloadMandate,
} = usePayment(prospectId, {
  updateErrorMessage: t(`${PAYMENT_I18N_BASE}.updateError`),
  downloadErrorMessage: t(`${PAYMENT_I18N_BASE}.downloadError`),
  onPaymentPreferenceChanged: () => emit('payment-preference-changed'),
})

const isNotSelected = computed(() => paymentType.value === null)
const isSepaMandate = computed(() => paymentType.value === ConformityPaymentType.MandateSepa)
const isClient = computed(() => props.isCollaborator === false)
const isSignatory = computed(() => currentEntity.value?.isSignatory === true)
// Only a client who is the prospect's signatory may choose or configure the payment method.
// Non-signatory clients (like collaborators) get a read-only "pending" alert instead of the action buttons.
const canManagePayment = computed(() => isClient.value && isSignatory.value)

const title = computed(() => {
  if (isNotSelected.value) {
    return t(`${PAYMENT_I18N_BASE}.title`)
  }
  if (isSepaMandate.value) {
    return t(`${PAYMENT_I18N_BASE}.titleCompleted`)
  }
  return t(`${PAYMENT_I18N_BASE}.otherTitleCompleted`)
})

const bodyKind = computed<PaymentBodyKind>(() => {
  if (isNotSelected.value) {
    return canManagePayment.value === true ? PaymentBodyKind.Benefits : PaymentBodyKind.Alert
  }
  if (isSepaMandate.value) {
    return isClient.value ? PaymentBodyKind.Bullets : PaymentBodyKind.None
  }
  // The OTHER payment type is a simple information alert for both audiences.
  return PaymentBodyKind.Alert
})

// Primary body text, interpreted per kind (alert message or bullets intro).
const bodyText = computed(() => {
  if (isNotSelected.value) {
    if (canManagePayment.value === true) {
      return ''
    }
    return isClient.value
      ? t(`${PAYMENT_I18N_BASE}.nonSignatoryPendingAlert`)
      : t(`${PAYMENT_I18N_BASE}.collaboratorPendingAlert`)
  }
  if (isSepaMandate.value) {
    return isClient.value ? t(`${PAYMENT_I18N_BASE}.completedIntro`) : ''
  }
  // In the OTHER state, only a client who can manage the payment is told they may revert to SEPA;
  // a non-signatory client gets a read-only message without that promise.
  if (canManagePayment.value === true) {
    return t(`${PAYMENT_I18N_BASE}.otherClientAlert`)
  }
  return isClient.value
    ? t(`${PAYMENT_I18N_BASE}.otherNonSignatoryAlert`)
    : t(`${PAYMENT_I18N_BASE}.otherCollaboratorAlert`)
})

// Bold lead rendered before the alert text — shown on the "pending" alert (collaborator and non-signatory client).
const bodyLead = computed(() => {
  if (isNotSelected.value && canManagePayment.value === false) {
    return t(`${PAYMENT_I18N_BASE}.collaboratorPendingLabel`)
  }
  return ''
})

// Only the submitted SEPA mandate still shows the success box.
const hasDoneBox = computed(() => isSepaMandate.value)

const footerButtons = computed<PaymentFooterButton[]>(() => {
  if (isNotSelected.value) {
    return canManagePayment.value === true
      ? [
        { label: t(`${PAYMENT_I18N_BASE}.selectOtherMethod`), action: PaymentFooterAction.SelectOtherMethod, type: 'secondary', requiresConfirmation: true },
        { label: t(`${PAYMENT_I18N_BASE}.startConfiguration`), action: PaymentFooterAction.StartConfiguration, type: 'primary' },
      ]
      : []
  }
  if (isSepaMandate.value) {
    return [
      { label: t(`${PAYMENT_I18N_BASE}.downloadMandate`), action: PaymentFooterAction.DownloadMandate, type: 'primary', trailingIcon: 'download' },
    ]
  }
  // The OTHER state lets the user revert their choice: the signatory client (who manages the payment)
  // and the collaborator (acting on the client's behalf). A non-signatory client cannot revert.
  return canManagePayment.value === true || isClient.value === false
    ? [{ label: t(`${PAYMENT_I18N_BASE}.returnToSepa`), action: PaymentFooterAction.ReturnToSepa, type: 'primary' }]
    : []
})

// Footers with several buttons opt into the responsive stacking handled in the scoped style.
const isMultiButtonFooter = computed(() => footerButtons.value.length > 1)

// The download button is right-aligned; every other footer stretches its buttons full width.
const footerAlignEnd = computed(() => isSepaMandate.value)

const footerContainerClass = computed(() =>
  footerAlignEnd.value ? 'flex flex--justify-content-flex-end' : 'flex flex-gap--3',
)

const footerButtonClass = computed(() =>
  footerAlignEnd.value ? '' : 'flex--grow-1 flex--basis-0',
)

// Confirmation popup shown before switching to another payment method (client side only).
const isOtherMethodConfirmationVisible = ref(false)

// SEPA configuration drawer, opened from the "start configuration" action (client side only).
const isConfigurationDrawerOpen = ref(false)

const runFooterAction = (action: PaymentFooterAction): void => {
  switch (action) {
    case PaymentFooterAction.SelectOtherMethod:
      selectOtherMethod()
      break
    case PaymentFooterAction.ReturnToSepa:
      returnToSepa()
      break
    case PaymentFooterAction.StartConfiguration:
      isConfigurationDrawerOpen.value = true
      break
    case PaymentFooterAction.DownloadMandate:
      downloadMandate()
      break
  }
}

const onFooterButtonClick = (button: PaymentFooterButton): void => {
  if (button.requiresConfirmation === true) {
    isOtherMethodConfirmationVisible.value = true
    return
  }
  runFooterAction(button.action)
}

const onConfirmOtherMethod = (): void => {
  isOtherMethodConfirmationVisible.value = false
  selectOtherMethod()
}
</script>

<style lang="scss" scoped>
@use '@pulse/styleguide/scss/breakpoints' as breakpoints;

/* Below the `md` breakpoint the conformity column is too tight for two side-by-side
   buttons, so stack the multi-button footer right-aligned, one button under the other. */
@include breakpoints.media(md) {
  .conformity-payment__footer {
    flex-direction: column;
    align-items: flex-end;
  }

  .conformity-payment__footer-button {
    flex-grow: 0;
    flex-basis: auto;
  }
}
</style>
