<template>
  <div
    class="
      conformity-documents
      flex
      flex--direction-column
      flex-gap--6
    "
  >
    <ConformityStepCard
      v-if="shouldDisplaySupportingDocuments"
      :pStepId="PROSPECT_CONFORMITY_STEP_SLUGS[OnboardingStep.SupportingDocuments]"
      :pTitle="t('entities.prospect.conformity.conformityDocuments.title')"
    >
      <PAlert
        v-if="hasError"
        class="margin-top--4"
        pType="danger"
        :pClosable="false"
      >
        {{ t('entities.prospect.conformity.loadError') }}
      </PAlert>
      <SupportingDocuments
        v-else
        :items="predefinedItems"
        :isLoading="isLoading"
        :isCompleted="isCompleted"
        @saved="onSupportingDocumentsChanged"
        @deleted="onSupportingDocumentsChanged"
      />
    </ConformityStepCard>

    <ConformityStepCard
      v-if="shouldDisplayComplementaryDocuments"
      :pTitle="t('entities.prospect.conformity.complementaryDocuments.title')"
    >
      <PAlert
        v-if="hasError"
        class="margin-top--4"
        pType="danger"
        :pClosable="false"
      >
        {{ t('entities.prospect.conformity.loadError') }}
      </PAlert>
      <ComplementaryDocuments
        v-else
        :documents="complementaryDocuments"
        :maxFiles="complementaryMaxFiles"
        :isLoading="isLoading"
        @saved="reload"
      />
    </ConformityStepCard>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { PAlert } from '@pulse/styleguide/components'
import ConformityStepCard from '../components/conformity-step-card/conformity-step-card.vue'
import { OnboardingStep } from '../prospect-conformity.enums'
import { PROSPECT_CONFORMITY_STEP_SLUGS } from '../prospect-conformity.consts'
import SupportingDocuments from './components/supporting-documents/supporting-documents.vue'
import ComplementaryDocuments from './components/complementary-documents/complementary-documents.vue'
import { useConformityDocuments } from './conformity-documents.composable'
import type { ConformityDocumentsEmits } from './conformity-documents.types'

const { t } = useI18n()

const emit = defineEmits<ConformityDocumentsEmits>()

const {
  isLoading,
  isCompleted,
  hasError,
  predefinedItems,
  complementaryDocuments,
  complementaryMaxFiles,
  shouldDisplaySupportingDocuments,
  shouldDisplayComplementaryDocuments,
  reload,
  onSupportingDocumentsChanged,
} = useConformityDocuments(emit)
</script>
