<template>
  <PDrawer
    v-model="drawerModel"
    :title="`${t('new-collection')}`"
    :showPreviousStep="false"
    size="50%"
    direction="rtl"
  >
    <PSteps
          :active="currentStep-1"
          direction="horizontal"
          processStatus="process"
          finishStatus="success"
      >
        <PStepItem :title="t('entity')" />
        <PStepItem :title="t('infos')" />
        <PStepItem :title="t('banking-data')" />
      </PSteps>
    <h5>{{t(stepLabel)}}</h5>
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
    fr-FR:
        new-collection: 'Nouvelle collecte'
        next: 'Suivant'
        entity: 'Entité'
        infos: 'Infos'
        banking-data: 'Données bancaires'
</i18n>

<script setup lang='ts'>
import { useI18n } from 'vue-i18n'
import { computed, ref } from 'vue'
import { PIArrowRight } from '@kpmg/styleguide'
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
