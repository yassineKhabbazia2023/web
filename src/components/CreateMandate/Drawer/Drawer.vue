<template>
  <PDrawer
    v-model="drawerModel"
    :title="`${t('new-collection')}`"
    :showPreviousStep="false"
    size="50%"
    direction="rtl"
    class="drawer"
  >
    <PSteps
          :active="currentStep-1"
          direction="horizontal"
          processStatus="process"
          finishStatus="success"
          class="drawer__stepper"
      >
        <PStepItem :title="t('entity')" />
        <PStepItem :title="t('infos')" />
        <PStepItem :title="t('banking-data')" />
      </PSteps>
    <h5 class="drawer__title">
      <div v-if="currentStep == 1">
        {{ t('entity') }}
      </div>
      <div v-if="currentStep == 2">
        {{ t('signatory') }}
      </div>
      <div v-if="currentStep == 3">
        {{ t('bank-identity-statement') }}
      </div>
      <PTooltip
        :content="t('tooltip')"
        placement="top"
        v-if="currentStep === 1"
        >
        <PIcon class="drawer__tooltip" color="#A4A4A4">
          <PIQuestionCircle />
        </PIcon>
      </PTooltip>
    </h5>
    <Form
      :step="currentStep"
      @next-step-event-form="nextStepAvailability=true"
      @loading-event-form="nextStepAvailability=false" />
    <template #footer>
      <div>
        <PButton
          v-if="currentStep == 2 || currentStep == 3"
          type="default"
          size="default"
          :plain="false"
          :round="false"
          :loading="false"
          data-testid="next-step-test"
          @click="goToPreviousStep()"
        >
        <PIcon class="el-button__icon--left">
          <PIArrowLeft />
        </PIcon>
          {{ t('previous') }}
        </PButton>
        <PButton
          v-if="currentStep == 3"
          type="primary"
          size="default"
          :plain="false"
          :round="false"
          :loading="false"
          data-testid="validate-step-test"
        >
          {{ t('validate') }}
        </PButton>
        <PButton
          v-if="currentStep == 1 || currentStep == 2"
          type="primary"
          size="default"
          :plain="false"
          :round="false"
          :disabled="!nextStepAvailability"
          :loading="false"
          data-testid="next-step-test"
          @click="goToNextStep()"
        >
          {{ t('next')}}
          <PIcon class="el-button__icon--right">
            <PIArrowRight />
          </PIcon>
        </PButton>
      </div>
    </template>
  </PDrawer>
</template>

<i18n lang="yaml">
    en-US:
        new-collection: 'New collection'
        next: 'Next'
        previous: 'Previous'
        validate: 'Validate'
        entity: 'Entity'
        signatory: 'Signatory'
        infos: 'Infos'
        bank-identity-statement: 'Bank Identity Statement'
        tooltip: 'The IBS number entered must be part of your
          portfolio and have an active commitment.'
    fr-FR:
        new-collection: 'Nouvelle collecte'
        next: 'Suivant'
        previous: 'Précédent'
        validate: 'Valider'
        entity: 'Entité'
        signatory: 'Signataire'
        infos: 'Infos'
        bank-identity-statement: 'Relevé d’identité bancaire'
        tooltip: "Le numéro d’IBS saisi doit faire parti de
          votre portefeuille et avoir un engagement actif."
</i18n>

<script setup lang='ts'>
import { useI18n } from 'vue-i18n'
import { computed, ref } from 'vue'
import {
  PIArrowLeft,
  PIArrowRight,
  PIQuestionCircle,
  PDrawer,
  PSteps,
  PStepItem,
  PTooltip,
  PIcon,
  PButton
} from '@kpmg/styleguide'
import Form from '@/components/CreateMandate/Form'
const currentStep = ref(1)
const nextStepAvailability = ref(false)

const { t } = useI18n({
  inheritLocale: true,
  useScope: 'local'
})

const emit = defineEmits(['update:modelValue'])

const props = defineProps({
  modelValue: Boolean
})

const drawerModel = computed({
  get() {
    return props.modelValue
  },
  set(value) {
    emit('update:modelValue', value)
  }
})

const goToNextStep = () => {
  if (currentStep.value === 1) {
    return currentStep.value++
  }
  nextStepAvailability.value = false
  currentStep.value++
}

const goToPreviousStep = () => {
  currentStep.value--
}

defineExpose({
  drawerModel,
  goToNextStep,
  currentStep,
  nextStepAvailability
})
</script>
<style lang="scss">
.drawer {
  &__title {
    display: flex;
    align-items: center;
    color: var(--pulse-color-neutral-gray-900);
    font-size: 16px;
    font-style: normal;
    font-weight: 600;
    line-height: 120%;
    padding: 4px 0px;
    margin-bottom: 16px;
    text-transform: capitalize;
  }
  &__stepper {
    margin-bottom: 24px;
  }
  &__tooltip {
    margin-top: 1px;
    margin-left: 8px;
  }
}
</style>
