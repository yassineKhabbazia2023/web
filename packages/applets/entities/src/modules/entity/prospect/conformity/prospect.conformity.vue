<template>
  <div
    class="
      prospect-conformity
      flex
      flex--direction-column
    "
  >
    <PEntityHeader
      v-if="currentEntity"
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
        <template
          v-for="step in steps"
          :key="step.id"
        >
          <ConformityDocuments v-if="step.id === SUPPORTING_DOCS_STEP_ID" />
          <section
            v-else
            :id="`step-${step.id}`"
            class="
              prospect-conformity__step
              flex
              flex--direction-column
              padding--8
            "
          >
            <h2
              class="
                prospect-conformity__step-title
                font-size--21
                font-semibold
                margin--0
                margin-bottom--3
              "
            >
              {{ step.label }}
            </h2>
            <p
              class="
                prospect-conformity__step-description
                font-size--14
                margin--0
              "
            >
              Ceci est l'écran de l'étape « {{ step.label }} ».<br>
              Cliquez sur une étape dans le tracker à gauche pour naviguer ici.
            </p>
          </section>
        </template>
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
      Écran mocké pour présenter le concept de mise en conformité — rendu non contractuel
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, useTemplateRef } from 'vue'
import { storeToRefs } from 'pinia'
import { useCurrentEntityStore } from '@pulse/common/stores'
import {
  PCompletionTracker,
  PCompletionTrackerList,
  PCompletionTrackerListItem,
  PEntityHeader,
} from '@pulse/styleguide/components'
import ConformityDocuments from './conformity-documents/conformity-documents.vue'
import { useProspectConformity } from './prospect-conformity.composable'
import {
  PROSPECT_CONFORMITY_DESCRIPTION,
  PROSPECT_CONFORMITY_SECTION_ORDER,
  PROSPECT_CONFORMITY_SECTION_TITLES,
  PROSPECT_CONFORMITY_STEPS,
  PROSPECT_CONFORMITY_TITLE,
  SUPPORTING_DOCS_STEP_ID,
} from './prospect-conformity.consts'

const { currentEntity } = storeToRefs(useCurrentEntityStore())

const contentRef = useTemplateRef<HTMLElement>('contentRef')
const { selectedId, onStepClick } = useProspectConformity(contentRef)

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
    width: 340px;
    flex-shrink: 0;
    overflow-y: auto;
    padding-bottom: $mock-banner-clearance;
  }

  &__content {
    flex: 1;
    overflow-y: auto;
    padding-bottom: $mock-banner-clearance;
    background-color: var(--p-gray-50);
  }

  &__step {
    border: 1px solid var(--p-stroke-secondary);
    border-radius: 8px;
    background-color: var(--p-surface-primary);
    min-height: 400px;
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
