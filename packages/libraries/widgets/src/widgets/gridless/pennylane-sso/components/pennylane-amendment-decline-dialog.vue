<template>
  <PDialog
    v-model="isVisible"
    p-width="44%"
    :p-fullscreen="isMobile"
    p-show-close
    p-align-center
    class="pennylane-amendment-decline-dialog"
  >
    <div class="pennylane-amendment-decline-dialog__content flex flex--direction-column flex--align-items-center">
      <PIcon
        p-name="infoCircle"
        p-size="24"
        class="text-color--black-rock-900 margin-bottom--4"
      />

      <h3 class="font-xxlarge font-semibold margin-bottom--4 text-center">
        {{ t('widgets.pennylaneAmendmentFlow.decline.title') }}
      </h3>

      <p class="font-base margin-bottom--4 pennylane-amendment-decline-dialog__description text-center">
        {{ t('widgets.pennylaneAmendmentFlow.decline.descriptionPart1') }}
        <span class="font-bold">{{ t('widgets.pennylaneAmendmentFlow.decline.reformBold') }}</span>
        {{ t('widgets.pennylaneAmendmentFlow.decline.descriptionPart2') }}
        <span class="font-bold">
          {{ t('widgets.pennylaneAmendmentFlow.decline.conditionsBold') }}
        </span>{{ t('widgets.pennylaneAmendmentFlow.decline.descriptionPart3') }}
      </p>

      <p class="font-base margin-bottom--4 pennylane-amendment-decline-dialog__description text-center">
        {{ t('widgets.pennylaneAmendmentFlow.decline.accessPart1') }}
        <span class="font-bold">{{ t('widgets.pennylaneAmendmentFlow.decline.pennylane') }}</span>
        {{ t('widgets.pennylaneAmendmentFlow.decline.accessPart2') }}
      </p>

      <p class="font-base margin-bottom--6 pennylane-amendment-decline-dialog__description text-center">
        {{ t('widgets.pennylaneAmendmentFlow.decline.instructionPart1') }}
        <span class="font-bold">{{ t('widgets.pennylaneAmendmentFlow.decline.instructionBold') }}</span>
        {{ t('widgets.pennylaneAmendmentFlow.decline.instructionPart2') }}
      </p>

      <PAlert
        pType="info"
        class="font-base margin-bottom--6 width--100"
      >
        {{ t('widgets.pennylaneAmendmentFlow.decline.supportNotice') }}
      </PAlert>

      <PButton
        p-type="primary"
        class="flex--align-self-flex-end"
        @click="handleClose"
      >
        {{ t('widgets.pennylaneAmendmentFlow.decline.buttonClose') }}
      </PButton>
    </div>
  </PDialog>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useResponsive } from '@pulse/styleguide'
import { PDialog, PButton, PIcon, PAlert } from '@pulse/styleguide/components'
import type { PennylaneAmendmentDeclineDialogProps } from './pennylane-amendment-decline-dialog.type'

const { t } = useI18n({
  inheritLocale: true,
  useScope: 'global',
})

const { isMobile } = useResponsive()

const props = defineProps<PennylaneAmendmentDeclineDialogProps>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
}>()

const isVisible = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
})

const handleClose = () => {
  isVisible.value = false
}
</script>

<style lang="scss" scoped>
.pennylane-amendment-decline-dialog {
  &__description {
    line-height: 1.6;
  }
}
</style>
