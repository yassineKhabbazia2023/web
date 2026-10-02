<template>
  <PConfirmationPopup
    v-model:pIsVisible="isVisible"
    pAppendToBody
    :pTitle="t('keyMoments.publish.popup.title')"
    :pConfirmButtonContent="confirmLabel"
    :pCancelButtonContent="t('keyMoments.publish.popup.cancel')"
    :pConfirmButtonIsLoading="isPublishing"
    :pWidth="width"
    :pTestId="`${testIdPrefix}-popup`"
    @on-confirm-button-click="emit('confirm')"
    @on-cancel-button-click="isVisible = false"
  >
    <p>{{ message }}</p>
    <p
      v-if="recommendationsLine !== undefined"
      class="margin-top--2"
      :data-testid="`${testIdPrefix}-recommendations-line`"
    >
      {{ recommendationsLine }}
    </p>
    <ul
      v-if="divergenceLabels.length > 0"
      class="
        list-style-none
        overflow-hidden
        margin-top--3
      "
      :data-testid="`${testIdPrefix}-divergences`"
    >
      <li
        v-for="label in divergenceLabels"
        :key="label"
        class="
          key-moments-publish-popup__divergence
          padding-y--2
          padding-x--3
          font-small
          text-color--gray-500
        "
      >
        {{ label }}
      </li>
    </ul>
  </PConfirmationPopup>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { PConfirmationPopup } from '@pulse/styleguide/components'

defineProps<{
  message: string
  /** What publishing does with the recommendations; absent while no draft is loaded */
  recommendationsLine?: string
  /** What publishing would change for the client, worded */
  divergenceLabels: string[]
  confirmLabel: string
  isPublishing: boolean
  width?: string
  testIdPrefix: string
}>()

const emit = defineEmits<{
  confirm: []
}>()

const isVisible = defineModel<boolean>('isVisible', { required: true })

const { t } = useI18n()
</script>

<style scoped lang="scss">
.key-moments-publish-popup__divergence:nth-child(odd) {
  background-color: var(--p-surface-neutral-lighter);
}
</style>
