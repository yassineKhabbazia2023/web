<template>
  <PDialog
    v-model="isVisible"
    p-width="33%"
    :p-fullscreen="isMobile"
    :p-show-close="true"
    :p-align-center="true"
    class="pennylane-amendment-success-dialog"
  >
    <div class="pennylane-amendment-success-dialog__content flex flex--direction-column flex--align-items-center">
      <PIcon
        p-name="rocket"
        p-size="24"
        class="text-color--black-rock-900 margin-bottom--4"
      />

      <h3 class="font-xxlarge font-semibold margin-bottom--4 text-center">
        {{ t('widgets.pennylaneAmendmentFlow.success.title') }}
      </h3>

      <p class="font-base margin-bottom--8 pennylane-amendment-success-dialog__description text-center">
        <template v-if="isDelayedActivation">
          {{ t('widgets.pennylaneAmendmentFlow.success.descriptionDelayedPart1') }}
          <span class="font-bold">
            {{ t('widgets.pennylaneAmendmentFlow.success.descriptionDelayedBold1') }}
          </span>
          {{ t('widgets.pennylaneAmendmentFlow.success.descriptionDelayedPart2') }}
          <span class="font-bold">
            {{ t('widgets.pennylaneAmendmentFlow.success.descriptionDelayedBold2') }}{{ formattedFreeTrialEndDate }}.
          </span>
        </template>
        <template v-else>
          {{ t('widgets.pennylaneAmendmentFlow.success.descriptionPart1') }}
          <span class="font-bold">
            {{ t('widgets.pennylaneAmendmentFlow.success.pennylane') }}
          </span>
          {{ t('widgets.pennylaneAmendmentFlow.success.descriptionPart2') }}
          <span class="font-bold">
            {{ t('widgets.pennylaneAmendmentFlow.success.boldAccessPart') }}{{ formattedFreeTrialEndDate }}.
          </span>
        </template>
      </p>

      <PButton
        p-type="primary"
        class="flex--align-self-flex-end"
        @click="handleClose"
      >
        {{ t('widgets.pennylaneAmendmentFlow.success.buttonClose') }}
      </PButton>
    </div>
  </PDialog>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useResponsive } from '@pulse/styleguide'
import { PDialog, PButton, PIcon } from '@pulse/styleguide/components'
import type { PennylaneAmendmentSuccessDialogProps } from './pennylane-amendment-success-dialog.types'
import { DELAYED_ACTIVATION_DATE } from '../pennylane-amendment.consts'

const { t, d } = useI18n({
  inheritLocale: true,
  useScope: 'global',
})

const { isMobile } = useResponsive()

const props = defineProps<PennylaneAmendmentSuccessDialogProps>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
}>()

const isVisible = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
})

const isDelayedActivation = computed(() => props.freeTrialEndDate === DELAYED_ACTIVATION_DATE)

const formattedFreeTrialEndDate = computed(() => {
  if (!props.freeTrialEndDate) {
    return ''
  }
  return d(new Date(props.freeTrialEndDate), 'longText')
})

const handleClose = () => {
  isVisible.value = false
}
</script>

<style lang="scss" scoped>
.pennylane-amendment-success-dialog {
  &__description {
    line-height: 1.6;
  }
}
</style>
