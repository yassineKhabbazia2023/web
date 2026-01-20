<template>
  <div class="step-terms-preview">
    <h2 class="font-extrabold margin-bottom--6">
      {{ t('widgets.pennylaneAmendmentFlow.step3.title') }}
    </h2>

    <p class="font-large margin-bottom--4">
      {{ t('widgets.pennylaneAmendmentFlow.step3.subtitle') }}
    </p>

    <PennylaneTermsViewer
      v-if="props.accountId > 0"
      :account-id="props.accountId"
      class="step-terms-preview__viewer margin-bottom--8"
      @scroll-complete="handleScrollComplete"
    />

    <PAlert
      v-else
      pType="warning"
      class="margin-top--4"
    >
      {{ t('widgets.pennylaneAmendmentFlow.step3.noPdfAvailable') }}
    </PAlert>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { PAlert } from '@pulse/styleguide/components'
import PennylaneTermsViewer from './components/pennylane-terms-viewer.vue'
import type { StepTermsPreviewProps } from './step-terms-preview.types'

const { t } = useI18n({
  inheritLocale: true,
  useScope: 'global',
})

const props = defineProps<StepTermsPreviewProps>()

const emit = defineEmits<{
  'scroll-complete': []
}>()

function handleScrollComplete() {
  emit('scroll-complete')
}
</script>

<style lang="scss" scoped>
.step-terms-preview {
  height: 100%;
  display: flex;
  flex-direction: column;

  &__viewer {
    flex: 1;
    min-height: 0;
  }
}
</style>
