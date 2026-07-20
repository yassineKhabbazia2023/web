<template>
  <StepperSkeleton v-if="isLoading" />
  <PCompletionTracker
    v-else
    :pCurrent="completedCount"
    :pTotal="totalCount"
    :pTitle="t('entities.prospect.conformity.title')"
    :pDescription="t('entities.prospect.conformity.description')"
    class="bg--white"
  >
    <template #pre-header>
      <PAlert
        v-if="areAllStepsCompleted === true"
        pType="success"
      >
        <template #bold-text>
          {{ t('entities.prospect.conformity.completedAlert.title') }} :
        </template>
        {{ t('entities.prospect.conformity.completedAlert.description') }}
      </PAlert>
    </template>
    <PCompletionTrackerList
      v-for="section in sections"
      :key="section.key"
      :pTitle="section.title"
    >
      <template
        v-if="section.key === ProspectConformitySection.Documents"
        #title-action
      >
        <PButton
          pType="tertiary"
          pIsUnderlined
          data-testid="conformity-view-documents-button"
          @click="$emit('view-documents')"
        >
          {{ t('entities.prospect.conformity.viewDocumentsLink') }}
        </PButton>
      </template>
      <PCompletionTrackerListItem
        v-for="step in section.steps"
        :key="step.id"
        :pLabel="step.label"
        :pStatus="step.status"
        :pSelected="selectedId === step.slug"
        @select="$emit('select', step.slug)"
      />
    </PCompletionTrackerList>
  </PCompletionTracker>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import {
  PAlert,
  PButton,
  PCompletionTracker,
  PCompletionTrackerList,
  PCompletionTrackerListItem,
} from '@pulse/styleguide/components'
import type { PCompletionTrackerListItemStatus } from '@pulse/styleguide/types'
import { OnboardingStepStatus, ProspectConformitySection } from '../../prospect-conformity.enums'
import {
  PROSPECT_CONFORMITY_SECTION_ORDER,
  PROSPECT_CONFORMITY_SECTION_TITLE_KEYS,
} from '../../prospect-conformity.consts'
import StepperSkeleton from '../stepper-skeleton/stepper.skeleton.vue'
import type { ConformityStepperProps } from './conformity-stepper.types'

const props = defineProps<ConformityStepperProps>()

defineEmits<{
  select: [stepSlug: string]
  'view-documents': []
}>()

const { t } = useI18n()

const toTrackerStatus = (
  status: OnboardingStepStatus | undefined,
): PCompletionTrackerListItemStatus =>
  status === OnboardingStepStatus.Completed ? 'completed' : 'incomplete'

const sections = computed(() =>
  PROSPECT_CONFORMITY_SECTION_ORDER.map((key) => ({
    key,
    title: t(PROSPECT_CONFORMITY_SECTION_TITLE_KEYS[key]),
    steps: props.steps
      .filter((step) => step.section === key)
      .map((step) => ({
        id: step.id,
        slug: step.slug,
        label: t(step.labelKey),
        status: toTrackerStatus(props.stepStatusById.get(step.id)),
      })),
  })).filter((section) => section.steps.length > 0),
)
</script>
