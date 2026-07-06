<template>
  <div
    class="
      prospect-conformity
      flex
      flex--direction-column
      padding-top--6
      padding-left--6
    "
  >
    <PEntityHeader
      v-if="currentEntity !== undefined"
      :pLegalName="currentEntity.legalName"
      :pAccountNumber="currentEntity.accountNumber"
      :pAccountType="currentEntity.accountType"
      class="prospect-conformity__header margin-bottom--4"
    />
    <div
      class="
        prospect-conformity__body
        flex
        flex--direction-row
      "
    >
      <aside class="prospect-conformity__tracker padding-bottom--6">
        <PCompletionTracker
          :pCurrent="completedCount"
          :pTotal="totalCount"
          :pTitle="title"
          :pDescription="description"
          class="bg--white"
        >
          <PCompletionTrackerList
            v-for="section in sections"
            :key="section.key"
            :pTitle="section.title"
          >
            <PCompletionTrackerListItem
              v-for="step in section.steps"
              :key="step.id"
              :pLabel="step.label"
              :pStatus="step.status"
              :pSelected="selectedId === step.slug"
              @select="onStepClick(step.slug)"
            />
          </PCompletionTrackerList>
        </PCompletionTracker>
      </aside>
      <div
        ref="contentRef"
        class="
          prospect-conformity__content
          flex
          flex--direction-column
          flex-gap--6
          padding-x--6
          padding-bottom--6
        "
      >
        <template
          v-for="step in steps"
          :key="step.id"
        >
          <!-- The conformity-documents parent renders its own supporting documents + complementary cards. -->
          <ConformityDocuments
            v-if="step.id === OnboardingStep.SupportingDocuments"
            :supportingStepStatus="stepStatusById.get(OnboardingStep.SupportingDocuments)"
            @refresh-steps="loadOnboardingSteps"
          />
          <ConformityStepCard
            v-else
            :pStepId="step.slug"
            :pTitle="t(step.labelKey)"
            :pHideTitle="step.id === OnboardingStep.PaymentMethod"
          >
            <Beneficiaries
              v-if="step.id === OnboardingStep.Beneficiary"
              :beneficiaryStepStatus="stepStatusById.get(OnboardingStep.Beneficiary)"
              @refresh-steps="loadOnboardingSteps"
            />
            <CommercialProposal
              v-else-if="step.id === OnboardingStep.CommercialProposal"
              :status="stepStatusById.get(OnboardingStep.CommercialProposal)"
              :isLoading="isLoadingSteps"
              @sent="loadOnboardingSteps"
            />
            <EngagementLetter
              v-else-if="step.id === OnboardingStep.EngagementLetter"
              :status="stepStatusById.get(OnboardingStep.EngagementLetter)"
              :isLoading="isLoadingSteps"
              @sent="loadOnboardingSteps"
            />
            <Payment
              v-else-if="step.id === OnboardingStep.PaymentMethod"
              :isCollaborator="isCollab"
              :fallbackTitle="t(step.labelKey)"
              :status="stepStatusById.get(OnboardingStep.PaymentMethod)"
              @payment-preference-changed="loadOnboardingSteps"
            />
            <p
              v-else
              class="
                prospect-conformity__step-description
                font-size--14
                margin--0
              "
            >
              {{ t('entities.prospect.conformity.stepPlaceholderTitle', { label: t(step.labelKey) }) }}<br>
              {{ t('entities.prospect.conformity.stepPlaceholderHint') }}
            </p>
          </ConformityStepCard>
        </template>
        <!-- Artificial trailing space so the last card can reach the top on click. -->
        <div
          class="prospect-conformity__spacer"
          :style="{ height: `${spacerHeight}px` }"
          aria-hidden="true"
        />
      </div>
    </div>

    <DocumentsConsultDrawer v-model="isConsultDrawerOpen" />
  </div>
</template>

<script setup lang="ts">
import { computed, useTemplateRef } from 'vue'
import { useI18n } from 'vue-i18n'
import { onBeforeRouteLeave } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useCurrentEntityStore, useUserStore } from '@pulse/common/stores'
import {
  PCompletionTracker,
  PCompletionTrackerList,
  PCompletionTrackerListItem,
  PEntityHeader,
} from '@pulse/styleguide/components'
import type { PCompletionTrackerListItemStatus } from '@pulse/styleguide/types'
import { OnboardingStep, OnboardingStepStatus } from './prospect-conformity.enums'
import CommercialProposal from './commercial-proposal/commercial-proposal.vue'
import EngagementLetter from './engagement-letter/engagement-letter.vue'
import ConformityDocuments from './conformity-documents/conformity-documents.vue'
import ConformityStepCard from './components/conformity-step-card/conformity-step-card.vue'
import { useProspectConformity } from './prospect-conformity.composable'
import { useOnboardingSteps } from './onboarding-steps.composable'
import Beneficiaries from './beneficiaries/beneficiaries.vue'
import Payment from './payment/payment.vue'
import DocumentsConsultDrawer from '../documents/documents-consult-drawer/documents-consult-drawer.vue'
import { useDocumentsConsultDrawerStore } from '../documents/documents-consult-drawer/documents-consult-drawer.store'
import {
  PROSPECT_CONFORMITY_SECTION_ORDER,
  PROSPECT_CONFORMITY_SECTION_TITLE_KEYS,
  PROSPECT_CONFORMITY_STEPS,
} from './prospect-conformity.consts'

const { t } = useI18n()

const { currentEntity } = storeToRefs(useCurrentEntityStore())
const { isCollab } = storeToRefs(useUserStore())
const documentsConsultDrawerStore = useDocumentsConsultDrawerStore()
const { isOpen: isConsultDrawerOpen } = storeToRefs(documentsConsultDrawerStore)

// The drawer's open state is shared/hoisted, so reset it when leaving conformity.
onBeforeRouteLeave(() => {
  documentsConsultDrawerStore.close()
})

const contentRef = useTemplateRef<HTMLElement>('contentRef')

const {
  stepStatusById,
  completedCount,
  totalCount,
  isLoadingSteps,
  reload: loadOnboardingSteps,
} = useOnboardingSteps(() => currentEntity.value?.prospectId)

const steps = PROSPECT_CONFORMITY_STEPS

// First step still to complete, in display order. Returns null while statuses
// are loading (nothing to focus yet) or once every step is completed.
const firstIncompleteStepId = computed(() => {
  if (isLoadingSteps.value === true) {
    return null
  }
  const firstIncomplete = steps.find(
    (step) => stepStatusById.value.get(step.id) !== OnboardingStepStatus.Completed,
  )
  return firstIncomplete?.slug ?? null
})

const { selectedId, onStepClick, spacerHeight } = useProspectConformity(
  contentRef,
  () => firstIncompleteStepId.value,
)

const toTrackerStatus = (
  status: OnboardingStepStatus | undefined,
): PCompletionTrackerListItemStatus =>
  status === OnboardingStepStatus.Completed ? 'completed' : 'incomplete'

const title = t('entities.prospect.conformity.title')
const description = t('entities.prospect.conformity.description')

const sections = computed(() =>
  PROSPECT_CONFORMITY_SECTION_ORDER.map((key) => ({
    key,
    title: t(PROSPECT_CONFORMITY_SECTION_TITLE_KEYS[key]),
    steps: steps
      .filter((step) => step.section === key)
      .map((step) => ({
        id: step.id,
        slug: step.slug,
        label: t(step.labelKey),
        status: toTrackerStatus(stepStatusById.value.get(step.id)),
      })),
  })),
)
</script>

<style scoped lang="scss">
.prospect-conformity {
  height: 100%;
  overflow: hidden;

  &__header {
    flex-shrink: 0;
  }

  &__body {
    flex: 1;
    min-height: 0;
  }

  &__tracker {
    width: 420px;
    flex-shrink: 0;
    overflow-y: auto;
  }

  &__content {
    flex: 1;
    overflow-y: auto;
  }

  &__step-description {
    color: var(--p-text-neutral);
    line-height: 1.6;
  }

  &__spacer {
    flex-shrink: 0;
  }
}
</style>
