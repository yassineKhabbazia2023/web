<template>
  <div
    class="
      flex
      flex--align-items-center
      flex--direction-column
      flex-gap--6
      invoices-vault-being-created-step
    "
  >
    <PIcon pName="hourglassDuotone" pSize="56" />
    <p
      class="
        invoices-vault-being-created-step__title
        text-center
        h2
      "
    >
      {{ t('entities.invoices.spaceCreationStep.title') }}
    </p>

    <p
      class="
        invoices-vault-being-created-step__estimated-time
        margin-bottom--8
        text-center
      "
    >
      {{ t('entities.invoices.spaceCreationStep.estimated-time') }}
    </p>
  </div>
</template>

<script lang="ts" setup>
import { PIcon } from '@pulse/styleguide/components'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
</script>

<style scoped lang="scss">
.invoices-vault-being-created-step {
  &__title {
    max-width: 80%;
  }

  &__estimated-time {
    max-width: 55%;
  }
}
</style>
