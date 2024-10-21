<template>
  <ConfirmationModal
    v-model="isConfirmationModalVisible"
    :title="confirmationModalTitle"
    :confirmButtonLabel="confirmButtonLabel"
    :cancelButtonLabel="t('cancel')"
    :isConfirmButtonDisabled="isConfirmActionDisabled"
    :isConfirmButtonLoading="isOperationExecuting"
    @confirm="handleConfirm"
    data-testid="action-confirmation-modal"
  >
    <div v-if="isOperationPendingRefusal">
      <i18n-t keypath="refuseAccessDescription" tag="p">
        <template #fullName>
          <span class="font-semibold">
            {{
              getFullName(
                selectedOperation?.firstName,
                selectedOperation?.lastName,
                true,
              )
            }}
          </span>
        </template>
        <template #accountName>
          <span
            class="font-semibold"
            data-testid="legal-name-confirmation-modal"
          >
            {{ defaultEntity?.legalName }}
          </span>
        </template>
        <template #accountNumber>
          <span data-testid="account-number-confirmation-modal">
            {{ defaultEntity?.accountNumber }}
          </span>
        </template>
      </i18n-t>
      <PForm
        ref="formRef"
        pLabelPosition="top"
        pRequireAsteriskPosition="right"
        :pModel="reasonForRefusal"
        :pRules="rules"
        class="margin-top--4"
      >
        <PFormItem pProp="reason" :pLabel="t('reasonForRefusal')">
          <PInput
            pType="textarea"
            v-model="reasonForRefusal.reason"
            :value="reasonForRefusal.reason"
            data-testid="reason-for-refusal-input"
          />
        </PFormItem>
      </PForm>
    </div>
    <div v-else>
      <i18n-t keypath="validateAccessDescription" tag="p">
        <template #fullName>
          <span class="font-semibold">
            {{
              getFullName(
                selectedOperation?.firstName,
                selectedOperation?.lastName,
                true,
              )
            }}
          </span>
        </template>
        <template #accountName>
          <span class="font-semibold">
            {{ defaultEntity?.legalName }}
          </span>
        </template>
        <template #accountNumber>
          <span>
            {{ defaultEntity?.accountNumber }}
          </span>
        </template>
      </i18n-t>
      <PAlert pType="warning" class="margin-top--4">
        {{ t('operationEffectiveWithin24Hours') }}
      </PAlert>
    </div>
  </ConfirmationModal>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { storeToRefs } from 'pinia'
import {
  PForm,
  PInput,
  PAlert,
  PFormItem,
  type FormRules,
} from '@pulse/styleguide'
import { commonStore } from '@pulse/common'
import { getFullName } from '@entities/common/utils'
import type { ConfirmActionModalProps } from './ConfirmActionModalTypes'
import ConfirmationModal from '@entities/common/components/ConfirmationModal'

const { t } = useI18n({
  inheritLocale: true,
  useScope: 'local',
})

const props = defineProps<ConfirmActionModalProps>()
const emit = defineEmits<{
  'update:modelValue': [boolean]
  'confirm-action': [string?]
}>()

// #region confirmation modal
const { defaultEntity } = storeToRefs(commonStore())
const isOperationExecuting = ref(false)

const confirmationModalTitle = computed(() =>
  props.isOperationPendingRefusal ? t('refuseAccess') : t('validateAccess'),
)
const confirmButtonLabel = computed(() =>
  props.isOperationPendingRefusal ? t('refuse') : t('validate'),
)
const isConfirmationModalVisible = computed({
  get() {
    return props.modelValue
  },
  set(value: boolean) {
    emit('update:modelValue', value)
  },
})
// #endregion

// #region refuse action
const DEFAULT_REASON_FOR_REFUSAL = t('accessError')
const reasonForRefusal = ref({
  reason: DEFAULT_REASON_FOR_REFUSAL,
})
const rules = ref<FormRules<typeof reasonForRefusal>>({
  reason: [
    {
      required: true,
      message: t('reasonRequired'),
    },
  ],
})

const isConfirmActionDisabled = computed(
  () => props.isOperationPendingRefusal && !reasonForRefusal.value.reason,
)
// #endregion

const handleConfirm = () => {
  isOperationExecuting.value = true
  emit('confirm-action', reasonForRefusal.value.reason)
}
</script>

<i18n lang="yaml">
en-US:
  cancel: 'Cancel'
  refuse: 'Refuse'
  validate: 'Validate'
  refuseAccess: 'Refuse access'
  reasonRequired: 'This field is required. Please fill it out.'
  refuseAccessDescription: >
    If you refuse, the user {fullName} will not have access to the {accountName} ({accountNumber}) entity.
  validateAccess: 'Validate access'
  validateAccessDescription: >
    If you validate, the user {fullName} have access to
    the {accountName} ({accountNumber}) entity at its next connection.
  accessError: 'There was an error.This user should not have access to this entity'
  reasonForRefusal: 'Reason for Refusal'
  operationEffectiveWithin24Hours: 'The operation will be effective within 24 hours.'
fr-FR:
  cancel: 'Annuler'
  refuse: 'Refuser'
  validate: 'Valider'
  refuseAccess: "Refuser l'accès"
  reasonRequired: 'Ce champ est obligatoire. Veuillez le remplir'
  refuseAccessDescription: >
    Si vous refusez, l'utilisateur {fullName} n'aura pas accès à l'entité {accountName} ({accountNumber}).
  validateAccess: "Valider l'accès"
  validateAccessDescription: >
    Si vous validez, l'utilisateur {fullName} aura accès à
    l'entité {accountName} ({accountNumber}) à sa prochaine connexion.
  accessError: 'Il y a eu une erreur. Cet utilisateur ne devrait pas avoir accès à cette entité'
  reasonForRefusal: 'Motif du refus'
  operationEffectiveWithin24Hours: "L'opération sera effective dans les 24h suivantes."
</i18n>
