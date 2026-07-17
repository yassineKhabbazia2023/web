<template>
  <ConfirmationModal
    v-model="isConfirmationModalVisible"
    :title="confirmationModalTitle"
    :confirmButtonLabel="confirmButtonLabel"
    :cancelButtonLabel="t('cancel')"
    :isConfirmButtonDisabled="isConfirmActionDisabled"
    :isConfirmButtonLoading="isOperationExecuting"
    data-testid="action-confirmation-modal"
    @confirm="handleConfirm"
  >
    <div v-if="isOperationPendingRefusal">
      <i18n-t keypath="refuseAccessDescription" tag="p">
        <template #fullName>
          <span class="font-semibold">
            {{
              getFullNameWithUppercaseLastName(
                selectedOperation?.firstName,
                selectedOperation?.lastName,
              )
            }}
          </span>
        </template>
        <template #accountName>
          <span
            class="font-semibold"
            data-testid="legal-name-confirmation-modal"
          >
            {{ selectedOperation.legalName }}
          </span>
        </template>
        <template #accountNumber>
          <span data-testid="account-number-confirmation-modal">
            {{ selectedOperation.accountNumber }}
          </span>
        </template>
      </i18n-t>
      <PForm
        ref="formRef"
        pRequireAsteriskPosition="right"
        :pModel="reasonForRefusal"
        :pRules="rules"
        class="margin-top--4"
      >
        <PFormItem pProp="reason" :pLabel="t('reasonForRefusal')">
          <PInput
            v-model="reasonForRefusal.reason"
            pType="textarea"
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
              getFullNameWithUppercaseLastName(
                selectedOperation?.firstName,
                selectedOperation?.lastName,
              )
            }}
          </span>
        </template>
        <template #accountName>
          <span class="font-semibold">
            {{ selectedOperation.legalName }}
          </span>
        </template>
        <template #accountNumber>
          <span>
            {{ selectedOperation.accountNumber }}
          </span>
        </template>
      </i18n-t>
    </div>
  </ConfirmationModal>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import {
  PForm,
  PInput,
  PFormItem,
} from '@pulse/styleguide/components'
import type { FormRules } from '@pulse/styleguide/types'
import { getFullNameWithUppercaseLastName } from '@pulse/common/utils'
import type { ConfirmActionModalProps } from './ConfirmActionModalTypes'
import ConfirmationModal from '@entities/components/ConfirmationModal'

const { t } = useI18n({
  inheritLocale: true,
  useScope: 'local',
  messages: {
    'en-US': {
      cancel: 'Cancel',
      refuse: 'Refuse',
      validate: 'Validate',
      refuseAccess: 'Refuse access',
      reasonRequired: 'This field is required. Please fill it out.',
      refuseAccessDescription: 'If you refuse, the user {fullName} will not have access to the {accountName} ({accountNumber}) entity.\n',
      validateAccess: 'Validate access',
      validateAccessDescription: 'After validation, user {fullName} will be able to access the entity {accountName} ({accountNumber}).\n',
      accessError: 'There was an error.This user should not have access to this entity',
      reasonForRefusal: 'Reason for Refusal',
    },
    'fr-FR': {
      cancel: 'Annuler',
      refuse: 'Refuser',
      validate: 'Valider',
      refuseAccess: 'Refuser l\'accès',
      reasonRequired: 'Ce champ est obligatoire. Veuillez le remplir',
      refuseAccessDescription: 'Si vous refusez, l\'utilisateur {fullName} n\'aura pas accès à l\'entité {accountName} ({accountNumber}).\n',
      validateAccess: 'Valider l\'accès',
      validateAccessDescription: 'Après la validation, l’utilisateur {fullName} pourra accéder à l’entité {accountName} ({accountNumber}).\n',
      accessError: 'Il y a eu une erreur. Cet utilisateur ne devrait pas avoir accès à cette entité',
      reasonForRefusal: 'Motif du refus',
    },
  },
})

const props = defineProps<ConfirmActionModalProps>()
const emit = defineEmits<{
  'update:modelValue': [boolean]
  'confirm-action': [string?]
}>()

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

