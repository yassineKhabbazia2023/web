<template>
  <div class="step-terms-preview">
    <h2 class="font-bold margin-bottom--6">
      {{ t('widgets.pennylaneAmendmentFlow.step3.title') }}
    </h2>

    <p class="font-large margin-bottom--4">
      {{ t('widgets.pennylaneAmendmentFlow.step3.subtitle') }}
    </p>

    <PennylaneTermsViewer
      class="step-terms-preview__viewer margin-bottom--8"
      @scroll-complete="handleScrollComplete"
    />
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import PennylaneTermsViewer from './components/pennylane-terms-viewer.vue'

const { t } = useI18n({
  inheritLocale: true,
  useScope: 'global',
})

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
