<template>
  <PDialog
    v-model="dialogModel"
    :pTitle="t(`${I18N_KEY}.title`)"
  >
    <p class="margin-bottom--6">
      {{ t(`${I18N_KEY}.confirmation`, { fileName: props.pFileName }) }}
    </p>
    <template #footer>
      <div class="p-dialog__footer">
        <PButton
          pType="secondary"
          pSize="small"
          :pDisabled="isDeleting"
          @click="onCancel"
        >
          {{ t(`${I18N_KEY}.cancel`) }}
        </PButton>
        <PButton
          pType="primary"
          pSize="small"
          :pLoading="isDeleting"
          @click="onConfirm"
        >
          {{ t(`${I18N_KEY}.confirm`) }}
        </PButton>
      </div>
    </template>
  </PDialog>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { PButton, PDialog } from '@pulse/styleguide/components'
import { useDeleteDocumentDialog } from './delete-document-dialog.composable'
import type { DeleteDocumentDialogEmits, DeleteDocumentDialogProps } from './delete-document-dialog.types'

const { t } = useI18n()
const I18N_KEY = 'entities.prospect.deleteDocumentDialog'

const props = defineProps<DeleteDocumentDialogProps>()
const emit = defineEmits<DeleteDocumentDialogEmits>()
const dialogModel = defineModel<boolean>({ required: true })

const {
  isDeleting,
  onCancel,
  onConfirm,
} = useDeleteDocumentDialog(props, dialogModel, emit)
</script>
