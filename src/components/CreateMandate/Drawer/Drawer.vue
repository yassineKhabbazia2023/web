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
      {{t(stepLabel)}} <PTooltip
          v-if="currentStep===1"
          :content="t('tooltip')"
          placement="top"
          >
              <PIcon class="drawer__tooltip">
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
          type="primary"
          size="default"
          :plain="false"
          :round="false"
          :disabled="!nextStepAvailability"
          :loading="false"
          @click="goToNextStep()"
        >
          {{ t('next') }}
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
        entity: 'Entity'
        infos: 'Infos'
        banking-data: 'Banking data'
        tooltip: 'The IBS number entered must be part of your
          portfolio and have an active commitment.'
    fr-FR:
        new-collection: 'Nouvelle collecte'
        next: 'Suivant'
        entity: 'Entité'
        infos: 'Infos'
        banking-data: 'Données bancaires'
        tooltip: "Le numéro d’IBS saisi doit faire parti de
          votre portefeuille et avoir un engagement actif."
</i18n>

<script setup lang='ts'>
import { useI18n } from 'vue-i18n'
import { computed, ref } from 'vue'
import { PIArrowRight, PIQuestionCircle } from '@kpmg/styleguide'
import Form from '@/components/CreateMandate/Form'
const currentStep = ref(1)
const nextStepAvailability = ref(false)
const titleMap = {
  1: 'entity',
  2: 'signatory',
  3: 'bank-details'
}

const { t } = useI18n({
  inheritLocale: true,
  useScope: 'local'
})

const emit = defineEmits(['drawer-previous-button-click', 'update:modelValue'])

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

const stepLabel = computed(() => {
  return titleMap[currentStep.value]
})

const goToNextStep = () => {
  nextStepAvailability.value = false
  currentStep.value++
}

defineExpose({
  drawerModel
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
  }
  &__stepper {
    margin-top: -18px;
    margin-bottom: 24px;
  }
  &__tooltip {
    margin-top: 1px;
    margin-left: 8px;
  }
}
</style>
