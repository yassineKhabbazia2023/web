<template>
  <div
    class="
      prospect-conformity
      flex
      flex--direction-column
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
      <aside class="prospect-conformity__tracker">
        <PCompletionTracker
          :pCurrent="completedCount"
          :pTotal="totalCount"
          :pTitle="title"
          :pDescription="description"
          class="margin-top--6 bg--white padding--6"
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
          padding--6
        "
      >
        <section
          v-for="step in steps"
          :id="`step-${step.id}`"
          :key="step.id"
          class="
            prospect-conformity__step
            flex
            flex--direction-column
            padding--6
            shadow--6-bottom
          "
        >
          <h2
            v-if="step.id !== PAYMENT_STEP_ID"
            class="
              prospect-conformity__step-title
              flex
              flex--align-items-center
              font-size--16
              font-semibold
              margin--0
              margin-bottom--1
            "
          >
            <PIcon
              pName="pulse"
              :pColor="AppColors.JUNGLE_400"
              pSize="16"
            />
            <span class="margin-left--1">{{ step.label }}</span>
          </h2>
          <ConformityDocuments v-if="step.id === SUPPORTING_DOCS_STEP_ID" />
          <Beneficiaries
            v-else-if="step.id === PROSPECT_CONFORMITY_BENEFICIARIES_STEP_ID"
            :beneficiaryStepStatus="beneficiaryStep?.status"
            @documents-saved="loadOnboardingSteps"
          />
          <CommercialProposal
            v-else-if="step.id === COMMERCIAL_PROPOSAL_STEP_ID"
            :status="commercialProposalStep?.status"
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
        </section>
      </div>
    </div>
    <div
      class="
        prospect-conformity__mock-banner
        flex
        flex--justify-content-center
        flex--align-items-center
        padding-y--3
        padding-x--4
        font-size--14
        font-semibold
      "
      data-testid="prospect-conformity-mock-banner"
    >
      {{ t('entities.prospect.conformity.mockBanner') }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, useTemplateRef } from 'vue'
import { useI18n } from 'vue-i18n'
import { storeToRefs } from 'pinia'
import { logger } from '@pulse/toolbox'
import { useCurrentEntityStore, useUserStore } from '@pulse/common/stores'
import { AppColors } from '@pulse/styleguide'
import {
  PCompletionTracker,
  PCompletionTrackerList,
  PCompletionTrackerListItem,
  PEntityHeader,
  PIcon,
} from '@pulse/styleguide/components'
import { ProspectsService } from '@entities/services/prospects/prospects.service'
import type { OnboardingStepResponse } from '@entities/services/prospects/prospects.types'
import { OnboardingStep } from './prospect-conformity.enums'
import CommercialProposal from './commercial-proposal/commercial-proposal.vue'
import ConformityDocuments from './conformity-documents/conformity-documents.vue'
import { useProspectConformity } from './prospect-conformity.composable'
import Beneficiaries from './beneficiaries/beneficiaries.vue'
import Payment from './payment/payment.vue'
import {
  PAYMENT_STEP_ID,
  COMMERCIAL_PROPOSAL_STEP_ID,
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
$mock-banner-clearance: 60px;

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
    padding-bottom: $mock-banner-clearance;
  }

  &__content {
    flex: 1;
    overflow-y: auto;
    padding-bottom: $mock-banner-clearance;
  }

  &__step {
    background-color: var(--p-surface-primary);
  }

  &__step-description {
    color: var(--p-text-neutral);
    line-height: 1.6;
  }

  &__mock-banner {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 1000;
    background-color: var(--p-surface-warning);
    color: var(--p-text-warning);
    border-top: 1px solid var(--p-stroke-warning, var(--p-stroke-secondary));
    text-align: center;
  }
}
</style>
