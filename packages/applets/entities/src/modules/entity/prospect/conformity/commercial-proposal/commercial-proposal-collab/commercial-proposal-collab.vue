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
    <CommercialProposalBanner @open="emit('open')" />
    <PButton
      pType="primary"
      :pLoading="isDownloading"
      class="margin-top--4"
      @click="emit('open')"
    >
      {{ t(`${I18N_KEY}.consult`) }}
    </PButton>
  </template>
  <template v-else>
    <PUpload
      v-model="selectedFile"
      :pLabel="t(`${I18N_KEY}.uploadLabel`)"
      :pPrefixLabelFileLine="t(`${I18N_KEY}.uploadPrefixLabel`)"
      :pSuffixLabelFileLine="t(`${I18N_KEY}.uploadSuffixLabel`)"
      :pAccept="COMMERCIAL_PROPOSAL_ACCEPTED_MIME_TYPE"
      :pMaxFileSize="COMMERCIAL_PROPOSAL_MAX_FILE_SIZE_MO"
      pAuthorizedFileFormat="PDF"
      :pTextLimitSize="t(`${I18N_KEY}.fileSizeLimit`)"
    />
    <PButton
      pType="primary"
      :pDisabled="selectedFile === null"
      :pLoading="isSending"
      class="margin-top--4"
      @click="emit('send')"
    >
      {{ t(`${I18N_KEY}.sendToCustomer`) }}
    </PButton>
  </template>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { PButton, PUpload } from '@pulse/styleguide/components'
import CommercialProposalBanner from '../commercial-proposal-banner/commercial-proposal-banner.vue'
import {
  COMMERCIAL_PROPOSAL_ACCEPTED_MIME_TYPE,
  COMMERCIAL_PROPOSAL_MAX_FILE_SIZE_MO,
} from '../commercial-proposal.consts'
import type { CommercialProposalCollabEmits, CommercialProposalCollabProps } from './commercial-proposal-collab.types'

const I18N_KEY = 'entities.prospect.conformity.proposal'

const { t } = useI18n()

defineProps<CommercialProposalCollabProps>()

const emit = defineEmits<CommercialProposalCollabEmits>()

const selectedFile = defineModel<File | null>({ default: null })
</script>
