<template>
  <PDrawer
    v-model="isDrawerOpened"
    pSize="50%"
    @close-drawer-button="closeDrawer"
  >
    <template #header-prefix>
      <PTitle :pTitle="t('addProspect')" />
    </template>
    <ProspectCreationContent
      v-model:formData="formData"
      :stepIndex="stepIndex"
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
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { PDrawer, PDrawerActions, PTitle } from '@pulse/styleguide/components'
import ProspectCreationContent from './components/prospect-creation-content/prospect-creation-content.vue'
import { PROSPECT_CREATION_DRAWER_STEPS } from './prospect-creation-drawer.const'
import { useProspectCreationDrawer } from './prospect-creation-drawer.composable'
import type { ProspectFormData } from './prospect-creation-drawer.types'

const emit = defineEmits<{
  submit: [formData: ProspectFormData]
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

const {
  stepIndex,
  formData,
  isFirstStep,
  isLastStep,
  goNextStep,
  goPreviousStep,
} = useProspectCreationDrawer(PROSPECT_CREATION_DRAWER_STEPS)

const previousLabel = computed(() => isFirstStep.value ? t('cancel') : t('previous'))
const nextLabel = computed(() => isLastStep.value ? t('submit') : t('next'))

const backCTA = computed(() => ({ pLabel: previousLabel.value, pTestId: 'previousButton' }))
const primaryCTA = computed(() => ({ pLabel: nextLabel.value, pTestId: 'nextButton' }))

function closeDrawer() {
  isDrawerOpened.value = false
}

function onClickNext() {
  if (isLastStep.value) {
    emit('submit', formData.value)
    closeDrawer()
  } else {
    goNextStep()
  }
}

function onClickPrevious() {
  if (isFirstStep.value) {
    closeDrawer()
  } else {
    goPreviousStep()
  }
}
</script>
