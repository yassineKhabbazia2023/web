<template>
  <template v-if="isCompleted">
    <EngagementLetterBanner @open="openEngagementLetterDocument" />
    <PButton
      pType="primary"
      :pLoading="isDownloading"
      class="margin-top--4"
      @click="openEngagementLetterDocument"
    >
      {{ t(`${I18N_KEY}.consult`) }}
    </PButton>
  </template>
  <template v-else>
    <PUpload
      pDrag
      pShowFileList
      :pUploadType="PUploadType.FILE_LINE"
      :pLabel="t(`${I18N_KEY}.uploadLabel`)"
      :pPrefixLabelFileLine="t(`${I18N_KEY}.uploadPrefixLabel`)"
      :pSuffixLabelFileLine="t(`${I18N_KEY}.uploadSuffixLabel`)"
      :pAccept="ENGAGEMENT_LETTER_ACCEPTED_MIME_TYPE"
      pAuthorizedFileFormat="PDF"
      :pMaxFileSize="ENGAGEMENT_LETTER_MAX_FILE_SIZE_MO"
      :pTextLimitSize="t(`${I18N_KEY}.fileSizeLimit`)"
      :pRejectedFileMessage="t(`${I18N_KEY}.rejectedFileMessage`)"
      pColorFileLine="persian"
      :limit="1"
      @files-selected="onFilesSelected"
      @delete-file="onFileDeleted"
    />
    <PButton
      pType="primary"
      :pDisabled="hasSelectedFile === false"
      :pLoading="isSending"
      class="margin-top--4"
      @click="isConfirmationVisible = true"
    >
      {{ t(`${I18N_KEY}.sendToCustomer`) }}
    </PButton>
    <PConfirmationPopup
      v-model:pIsVisible="isConfirmationVisible"
      :pTitle="t(`${I18N_KEY}.confirmTitle`)"
      :pConfirmButtonContent="t(`${I18N_KEY}.confirmConfirm`)"
      :pCancelButtonContent="t(`${I18N_KEY}.confirmCancel`)"
      :pConfirmButtonIsLoading="isSending"
      :pConfirmButtonIsDisabled="isSignatureConfirmed === false"
      pAlignCenter
      @on-confirm-button-click="sendEngagementLetterToCustomer"
      @on-cancel-button-click="closeConfirmationPopup"
      @on-close-popup="closeConfirmationPopup"
    >
      <p class="margin--0">
        {{ t(`${I18N_KEY}.confirmDescription`) }}
      </p>
      <PCheckbox
        v-model="isSignatureConfirmed"
        class="margin-top--4"
      >
        {{ t(`${I18N_KEY}.confirmSignatureCheckboxLabel`) }}
      </PCheckbox>
    </PConfirmationPopup>
  </template>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { PButton, PCheckbox, PConfirmationPopup, PUpload } from '@pulse/styleguide/components'
import { PUploadType } from '@pulse/styleguide/types'
import EngagementLetterBanner from '../engagement-letter-banner/engagement-letter-banner.vue'
import { useEngagementLetter } from '../engagement-letter.composable'
import {
  ENGAGEMENT_LETTER_ACCEPTED_MIME_TYPE,
  ENGAGEMENT_LETTER_MAX_FILE_SIZE_MO,
} from '../engagement-letter.consts'
import type { EngagementLetterCollabEmits, EngagementLetterCollabProps } from './engagement-letter-collab.types'

const I18N_KEY = 'entities.prospect.conformity.engagementLetter'

const { t } = useI18n()

defineProps<EngagementLetterCollabProps>()

const emit = defineEmits<EngagementLetterCollabEmits>()

const isConfirmationVisible = ref(false)

const isSignatureConfirmed = ref(false)

const closeConfirmationPopup = (): void => {
  isConfirmationVisible.value = false
  isSignatureConfirmed.value = false
}

const {
  isDownloading,
  isSending,
  hasSelectedFile,
  openEngagementLetterDocument,
  onFilesSelected,
  onFileDeleted,
  sendEngagementLetterToCustomer,
} = useEngagementLetter(emit)
</script>
