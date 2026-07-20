<template>
  <div>
    <div
      class="
        flex
        flex-gap--2
        width--100
        margin-top--4
      "
    >
      <PButton
        pType="primary"
        class="
          flex--grow-1
          flex--basis-0
        "
        :pDisabled="canSave === false || isSaving"
        :pLoading="isSaving"
        @click="emit('save-documents')"
      >
        {{ t('entities.prospect.conformity.beneficiaries.saveDocumentsButton') }}
      </PButton>
    </div>

    <template v-if="isCollab">
      <PDivider class="margin-y--4" />
      <PButton
        pType="primary"
        class="width--100"
        :pDisabled="canValidate === false"
        :pLoading="isValidating"
        @click="emit('validate-all-beneficiaries')"
      >
        {{ t('entities.prospect.conformity.beneficiaries.validateAllBeneficiariesButton') }}
      </PButton>
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { PButton, PDivider } from '@pulse/styleguide/components'
import { useUserStore } from '@pulse/common/stores'
import { OnboardingStepStatus } from '../../../prospect-conformity.enums'
import type {
  BeneficiaryActionsProps,
  BeneficiaryActionsEmits,
} from './beneficiary-actions.types'

const { t } = useI18n()
const userStore = useUserStore()

const isCollab = computed(() => userStore.isCollab)

const props = defineProps<BeneficiaryActionsProps>()

const emit = defineEmits<BeneficiaryActionsEmits>()

// Validation button enabled only when step status is InReview
// Backend validates that all beneficiaries are complete before allowing validation
const canValidate = computed(() =>
  props.beneficiaryStepStatus === OnboardingStepStatus.InReview,
)
</script>
