<template>
  <PDrawer
    v-model="isDrawerOpened"
    pSize="50%"
    :beforeClose="requestExit"
    data-testid="prospect-drawer"
    @close-drawer-button="requestExit"
  >
    <template #header-prefix>
      <PTitle :pTitle="t('addProspect')" />
    </template>
    <ProspectCreationContent
      ref="contentRef"
      v-model:form-data="formData"
      :step-index="stepIndex"
      :dropdowns-content="dropdownsContent"
      :collaborator-target-roles="collaboratorTargetRoles"
    />
    <template #footer>
      <PDrawerActions
        :pBackCTA="backCTA"
        :pPrimaryCTA="primaryCTA"
        @click-primary-cta="onClickNext"
        @click-back-cta="onClickPrevious"
      />
    </template>
  </PDrawer>

  <ProspectCreationExitConfirmationModal
    v-model="isExitConfirmationOpen"
    @confirm="confirmExit"
  />
</template>

<script setup lang="ts">
import { computed, ref, useTemplateRef } from 'vue'
import { useI18n } from 'vue-i18n'
import { PDrawer, PDrawerActions, PTitle } from '@pulse/styleguide/components'
import ProspectCreationContent from './components/prospect-creation-content/prospect-creation-content.vue'
import ProspectCreationExitConfirmationModal from './components/prospect-creation-exit-confirmation-modal/prospect-creation-exit-confirmation-modal.vue'
import { PROSPECT_CREATION_DRAWER_STEPS } from './prospect-creation-drawer.const'
import { useProspectCreationDrawer } from './prospect-creation-drawer.composable'
import { ProspectCreationDrawerManager } from './prospect-creation-drawer.manager'
import type { ProspectCreationPayload } from '@entities/modules/wallet/types'

const props = defineProps<{
  isSubmitting?: boolean
}>()

const emit = defineEmits<{
  submit: [payload: ProspectCreationPayload]
}>()

const { t } = useI18n({
  inheritLocale: true,
  useScope: 'local',
  messages: {
    'en-US': {
      addProspect: 'Add a prospect',
      next: 'Next',
      previous: 'Previous',
      cancel: 'Cancel',
      submit: 'Create prospect',
    },
    'fr-FR': {
      addProspect: 'Ajouter un prospect',
      next: 'Suivant',
      previous: 'Précédent',
      cancel: 'Annuler',
      submit: 'Créer un Prospect',
    },
  },
})

const isDrawerOpened = defineModel<boolean>({ required: true })

const contentRef = useTemplateRef<{ validate: () => Promise<boolean> }>('contentRef')

const {
  stepIndex,
  formData,
  dropdownsContent,
  collaboratorTargetRoles,
  isFirstStep,
  isLastStep,
  isDirty,
  goNextStep,
  goPreviousStep,
} = useProspectCreationDrawer(PROSPECT_CREATION_DRAWER_STEPS)

const previousLabel = computed(() => isFirstStep.value ? t('cancel') : t('previous'))
const nextLabel = computed(() => isLastStep.value ? t('submit') : t('next'))

const isAwaitingValidation = ref(false)

const backCTA = computed(() => ({ pLabel: previousLabel.value, pTestId: 'prospect-drawer-btn-back' }))
const primaryCTA = computed(() => ({
  pLabel: nextLabel.value,
  pTestId: isLastStep.value ? 'prospect-drawer-btn-submit' : 'prospect-drawer-btn-next',
  pLoading: isAwaitingValidation.value || props.isSubmitting === true,
}))

const isExitConfirmationOpen = ref(false)

// Intercepts every close attempt to ask for confirmation first when the form has been touched.
function requestExit() {
  if (isDirty.value === false) {
    confirmExit()
    return
  }
  isExitConfirmationOpen.value = true
}

function confirmExit() {
  isExitConfirmationOpen.value = false
  isDrawerOpened.value = false
}

function submitProspect() {
  const payload = ProspectCreationDrawerManager.toCreationPayload(
    formData.value,
    collaboratorTargetRoles.value,
    dropdownsContent.value,
  )
  emit('submit', payload)
}

async function onClickNext() {
  isAwaitingValidation.value = true
  try {
    const isValid = contentRef.value === null ? true : await contentRef.value.validate()
    if (isValid === false) {
      return
    }
    if (isLastStep.value) {
      submitProspect()
    } else {
      goNextStep()
    }
  } finally {
    isAwaitingValidation.value = false
  }
}

function onClickPrevious() {
  if (isFirstStep.value) {
    requestExit()
  } else {
    goPreviousStep()
  }
}
</script>
