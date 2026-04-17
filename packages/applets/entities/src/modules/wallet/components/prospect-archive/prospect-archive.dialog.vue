<template>
  <PDialog v-model="dialogModel">
    <PTitle :pTitle="t(`${I18N_KEY}.title`)" />
    <p class="margin-top--4">
      {{ t(`${I18N_KEY}.message`) }}
    </p>

    <PUserCard
      class="margin-top--4"
      pColor="gray"
      pImageName="building-duotone"
      :pTitle="props.prospect.name"
      :pSubtitle="props.prospect.accountNumber"
      :pTag="{
        pContent: 'Prospect',
        pColor: 'gray',
        pIconLeftName: 'building'
      }"
    />
    <template #footer>
      <div class="p-dialog__footer">
        <PButton
          pType="secondary"
          pSize="small"
          :pDisabled="isArchiving"
          data-testid="prospect-archive-cancel-button"
          @click="onCancel"
        >
          {{ t(`${I18N_KEY}.cancel`) }}
        </PButton>
        <PButton
          pType="primary"
          pSize="small"
          :pLoading="isArchiving"
          data-testid="prospect-archive-confirm-button"
          @click="onConfirm"
        >
          {{ t(`${I18N_KEY}.confirm`) }}
        </PButton>
      </div>
    </template>
  </PDialog>
</template>

<script setup lang="ts">
import { PUserCard, PButton, PDialog, PTitle } from '@pulse/styleguide/components'
import { useI18n } from 'vue-i18n'
import { useProspectArchiveDialog } from './prospect-archive.dialog.composable'
import type { ProspectArchiveDialogEmit, ProspectArchiveDialogProps } from './prospect-archive.dialog.types'

const { t } = useI18n()
const I18N_KEY = 'entities.wallet.prospectDelete'

const props = defineProps<ProspectArchiveDialogProps>()
const emit = defineEmits<ProspectArchiveDialogEmit>()
const dialogModel = defineModel<boolean>({ required: true })

const {
  isArchiving,
  onCancel,
  onConfirm,
} = useProspectArchiveDialog(props, dialogModel, emit)
</script>
