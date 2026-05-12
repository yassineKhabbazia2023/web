<template>
  <PDialog
    v-model="isModalOpen"
    pWidth="566px"
    destroyOnClose
    @cancel="handleCancel"
  >
    <div
      class="
        flex
        flex--direction-column
        flex--align-items-center
        margin-bottom--4
        padding-right--6
      "
    >
      <PIcon
        pName="personSlash"
        pSize="24"
        class="margin-bottom--4 margin-negative-top--2"
      />
      <h3 class="h3 font-bold">
        {{ t('entities.pennylaneActivationPrerequisiteModal.title') }}
      </h3>
    </div>

    <div class="text-center">
      {{ t('entities.pennylaneActivationPrerequisiteModal.description') }}
    </div>

    <template #footer>
      <div class="p-dialog__footer">
        <PButton
          pType="primary"
          pSize="small"
          data-testid="pennylane-activation-prerequisite-modal-confirm-button"
          @click="handleOpenHelpUrl"
        >
          {{ t('entities.pennylaneActivationPrerequisiteModal.button') }}
        </PButton>
      </div>
    </template>
  </PDialog>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { VITE_PENNYLANE_ATTACHMENT_HELP_URL } from 'env-vars'
import { PDialog, PButton, PIcon } from '@pulse/styleguide/components'
import type { PennylaneActivationPrerequisiteModal } from './pennylane-activation-prerequisite-modal.types'

const { t } = useI18n()

defineProps<PennylaneActivationPrerequisiteModal>()
const isModalOpen = defineModel<boolean>({ default: false })

const handleCancel = () => {
  isModalOpen.value = false
}

const handleOpenHelpUrl = () => {
  window.open(VITE_PENNYLANE_ATTACHMENT_HELP_URL, '_blank', 'noopener,noreferrer')
  isModalOpen.value = false
}
</script>
