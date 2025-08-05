<template>
  <div class="report-deletion-dialog">
    <PDialog
      v-model="isReportDeletionDialogVisible"
      :title="t('deleteDialogTitle')"
      pWidth="420px"
      pShowClose
      @close="handleCancelAction"
    >
      <p class="report-deletion-dialog__message margin-bottom--2">
        {{ t('deleteDialogMessage', { reportName }) }}
      </p>
      <PCheckboxGroup
        v-model="selectedDeleteOption"
        @change="handleDeleteOptionUpdate"
      >
        <ul class="list-style-none">
          <li
            v-for="deletionOption in REPORT_DELETE_OPTIONS"
            :key="deletionOption.value"
          >
            <PCheckbox
              :pLabel="deletionOption.value"
              pRounded
              class="report-deletion-dialog__deletion-destination-checkbox margin-y--2"
            >
              {{ t(deletionOption.label) }}
            </PCheckbox>
          </li>
        </ul>
      </PCheckboxGroup>
      <p class="font-small font-bold margin-top--2">
        {{ t('irreversibleWarning') }}
      </p>
      <template #footer>
        <div class="p-dialog__footer margin-y--2">
          <PButton
            class="report-deletion-dialog__cancel-button"
            pType="secondary"
            pSize="small"
            @click="handleCancelAction"
          >
            {{ t('cancel') }}
          </PButton>
          <PButton
            class="report-deletion-dialog__confirm-button"
            pType="primary"
            size="small"
            :pLoading="isDeletionInProgress"
            :pDisabled="selectedDeleteOption.length === 0"
            @click="handleDeleteConfirmation"
          >
            {{ t('confirm') }}
          </PButton>
        </div>
      </template>
    </PDialog>
  </div>
</template>
<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { PDialog, PButton, PCheckboxGroup, PCheckbox } from '@pulse/styleguide/components'
import type { ReportDeletionDialogProps } from './report-deletion-dialog.types'
import { ReportDeleteOption } from './report-deletion-dialog.enums'
import { REPORT_DELETE_OPTIONS } from './constants/report-deletion-dialog.const'

const { t } = useI18n({
  inheritLocale: true,
  useScope: 'local',
})

defineProps<ReportDeletionDialogProps>()

const emit = defineEmits<{
  'delete-report': [ReportDeleteOption],
}>()

// #region Manage report delete option
const selectedDeleteOption = ref<ReportDeleteOption[]>([ReportDeleteOption.PLATFORM_ONLY])

const handleDeleteOptionUpdate = (deleteOption: ReportDeleteOption[]) => {
  const lastDeleteOption = deleteOption[deleteOption.length - 1]
  if (deleteOption.length > 0) {
    selectedDeleteOption.value = [lastDeleteOption]
  } else {
    selectedDeleteOption.value = []
  }
}
// #endregion

// #region Dialog actions
const isDeletionInProgress = ref(false)
const isReportDeletionDialogVisible = defineModel<boolean>('isReportDeletionDialogVisible', { default: false })

const handleCancelAction = () => {
  isReportDeletionDialogVisible.value = false
}

const handleDeleteConfirmation = () => {
  isDeletionInProgress.value = true
  emit('delete-report', selectedDeleteOption.value[0])
}
// #endregion
</script>
<style lang="scss">
.report-deletion-dialog {
  &__deletion-destination-checkbox {
    height: auto;
  }

  &__message {
    word-wrap: break-word;
  }
}
</style>

<i18n lang="yaml">
  en-US:
    deleteDialogTitle: 'Delete BI Report'
    deleteDialogMessage: 'Where do you want to delete the report "{reportName}" :'
    cancel: 'Cancel'
    confirm: 'Confirm'
    irreversibleWarning: 'This action will be irreversible.'
    deleteOptions:
      all: 'Platform and Power BI Services Workspace'
      platformOnly: 'Platform (only)'
  fr-FR:
    deleteDialogTitle: "Suppression d'un rapport BI"
    deleteDialogMessage: 'D''où voulez-vous supprimer le rapport  "{reportName}" :'
    cancel: 'Annuler'
    confirm: 'Confirmer'
    irreversibleWarning: 'Cette action sera irréversible.'
    deleteOptions:
      all: 'Plateforme et Workspace Power BI Services'
      platformOnly: 'Plateforme (uniquement)'
</i18n>
