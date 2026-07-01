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
              :pSelected="selectedId === step.id"
              :pSecondaryText="step.secondaryText"
              @select="onStepClick(step.id)"
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
            v-if="step.id === SUPPORTING_DOCS_STEP_ID"
            :supportingStepStatus="supportingDocumentsStep?.status"
            @refresh-steps="loadOnboardingSteps"
          />
          <ConformityStepCard
            v-else
            :pStepId="step.id"
            :pTitle="step.label"
            :pHideTitle="step.id === PAYMENT_STEP_ID"
          >
            <Beneficiaries
              v-if="step.id === PROSPECT_CONFORMITY_BENEFICIARIES_STEP_ID"
              :beneficiaryStepStatus="beneficiaryStep?.status"
              @refresh-steps="loadOnboardingSteps"
            />
            <CommercialProposal
              v-else-if="step.id === COMMERCIAL_PROPOSAL_STEP_ID"
              :status="commercialProposalStep?.status"
              :isLoading="isLoadingSteps"
              @sent="loadOnboardingSteps"
            />
            <EngagementLetter
              v-else-if="step.id === ENGAGEMENT_LETTER_STEP_ID"
              :status="engagementLetterStep?.status"
              :isLoading="isLoadingSteps"
              @sent="loadOnboardingSteps"
            />
            <Payment
              v-else-if="step.id === PAYMENT_STEP_ID"
              :isCollaborator="isCollab"
            />
            <p
              v-else
              class="
                prospect-conformity__step-description
                font-size--14
                margin--0
              "
            >
              {{ t('entities.prospect.conformity.stepPlaceholderTitle', { label: step.label }) }}<br>
              {{ t('entities.prospect.conformity.stepPlaceholderHint') }}
            </p>
          </ConformityStepCard>
        </template>
      </div>
    </div>

    <DocumentsConsultDrawer v-model="isConsultDrawerOpen" />
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, useTemplateRef } from 'vue'
import { useI18n } from 'vue-i18n'
import { onBeforeRouteLeave } from 'vue-router'
import { storeToRefs } from 'pinia'
import { logger } from '@pulse/toolbox'
import { useCurrentEntityStore, useUserStore } from '@pulse/common/stores'
import {
  PCompletionTracker,
  PCompletionTrackerList,
  PCompletionTrackerListItem,
  PEntityHeader,
} from '@pulse/styleguide/components'
import { ProspectsService } from '@entities/services/prospects/prospects.service'
import type { OnboardingStepResponse } from '@entities/services/prospects/prospects.types'
import { OnboardingStep } from './prospect-conformity.enums'
import CommercialProposal from './commercial-proposal/commercial-proposal.vue'
import EngagementLetter from './engagement-letter/engagement-letter.vue'
import ConformityDocuments from './conformity-documents/conformity-documents.vue'
import ConformityStepCard from './components/conformity-step-card/conformity-step-card.vue'
import { useProspectConformity } from './prospect-conformity.composable'
import Beneficiaries from './beneficiaries/beneficiaries.vue'
import Payment from './payment/payment.vue'
import DocumentsConsultDrawer from '../documents/documents-consult-drawer/documents-consult-drawer.vue'
import { useDocumentsConsultDrawerStore } from '../documents/documents-consult-drawer/documents-consult-drawer.store'
import {
  PAYMENT_STEP_ID,
  COMMERCIAL_PROPOSAL_STEP_ID,
  ENGAGEMENT_LETTER_STEP_ID,
  PROSPECT_CONFORMITY_BENEFICIARIES_STEP_ID,
  PROSPECT_CONFORMITY_DESCRIPTION,
  PROSPECT_CONFORMITY_SECTION_ORDER,
  PROSPECT_CONFORMITY_SECTION_TITLES,
  PROSPECT_CONFORMITY_STEPS,
  PROSPECT_CONFORMITY_TITLE,
  SUPPORTING_DOCS_STEP_ID,
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
const { selectedId, onStepClick } = useProspectConformity(contentRef)

const onboardingSteps = ref<OnboardingStepResponse[]>([])
const isLoadingSteps = ref(true)

const beneficiaryStep = computed(() =>
  onboardingSteps.value.find((s) => s.id === OnboardingStep.Beneficiary),
)

const commercialProposalStep = computed(() =>
  onboardingSteps.value.find((s) => s.id === OnboardingStep.CommercialProposal),
)

const engagementLetterStep = computed(() =>
  onboardingSteps.value.find((s) => s.id === OnboardingStep.EngagementLetter),
)

const supportingDocumentsStep = computed(() =>
  onboardingSteps.value.find((s) => s.id === OnboardingStep.SupportingDocuments),
)

const loadOnboardingSteps = async () => {
  if (currentEntity.value?.prospectId === undefined || currentEntity.value.prospectId === null) {
    isLoadingSteps.value = false
    return
  }
  try {
    const steps = await ProspectsService.fetchOnboardingSteps(currentEntity.value.prospectId)
    if (steps !== undefined) {
      onboardingSteps.value = steps
    }
  } catch (error) {
    logger.error('Failed to load onboarding steps', error)
  } finally {
    isLoadingSteps.value = false
  }
}

onMounted(loadOnboardingSteps)

const title = PROSPECT_CONFORMITY_TITLE
const description = PROSPECT_CONFORMITY_DESCRIPTION
const steps = PROSPECT_CONFORMITY_STEPS

const completedCount = computed(
  () => steps.filter((step) => step.status === 'completed').length,
)
const totalCount = steps.length

const sections = computed(() =>
  PROSPECT_CONFORMITY_SECTION_ORDER.map((key) => ({
    key,
    title: PROSPECT_CONFORMITY_SECTION_TITLES[key],
    steps: steps.filter((step) => step.section === key),
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
}
</style>
