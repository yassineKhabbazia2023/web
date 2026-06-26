<template>
  <template v-if="isCompleted">
    <p
      class="
        font-size--14
        margin--0
        margin-bottom--6
      "
    >
      {{ t(`${I18N_KEY}.collabSentSubtitle`) }}
    </p>
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
      :pUploadType="PUploadType.DRAGGER"
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
      pAlignCenter
      @on-confirm-button-click="sendEngagementLetterToCustomer"
      @on-cancel-button-click="isConfirmationVisible = false"
      @on-close-popup="isConfirmationVisible = false"
    >
      {{ t(`${I18N_KEY}.confirmDescription`) }}
    </PConfirmationPopup>
  </template>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { PButton, PConfirmationPopup, PUpload } from '@pulse/styleguide/components'
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
