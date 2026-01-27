<template>
  <div>
    <div
      class="
        invoices-form-step__placeholder
        flex
        flex--justify-content-center
        flex--align-items-center
        margin-top--6
      "
    >
      <p class="invoices-form-step__placeholder-text">
        {{ t('entities.invoices.step2Placeholder') }}
      </p>
    </div>

    <div
      class="
        flex
        flex--justify-content-flex-end
        flex-gap--3
        margin-top--6
      "
    >
      <PButton
        pType="default"
        @click="$emit('back')"
      >
        {{ t('entities.invoices.backButton') }}
      </PButton>
      <PButton
        pType="primary"
        pDisabled
      >
        {{ t('entities.invoices.submitButton') }}
      </PButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { PButton } from '@pulse/styleguide/components'

defineEmits<{
  'back': []
}>()

const { t } = useI18n()
</script>

<style scoped lang="scss">
.invoices-form-step {
  &__placeholder {
    min-height: 150px;
    border: 2px dashed var(--p-gray-300);
    border-radius: 8px;
  }

  &__placeholder-text {
    color: var(--p-gray-500);
  }
}
</style>
