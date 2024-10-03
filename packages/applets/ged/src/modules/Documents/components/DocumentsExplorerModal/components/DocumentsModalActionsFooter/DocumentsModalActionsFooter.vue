<template>
  <div class="document-modal-action-explorer">
    <div class="document-modal-action-explorer__right">
      <PButton
        v-for="(item, index) in modalActionsButtons"
        :key="index"
        :pType="item.buttonType"
        :pPlain="item.plain"
        :pCircle="item.buttonName === '' ? true : false"
        :pLoading="item.loading"
        :pDisabled="item.disabled"
        :pSize="item.size"
        class="document-modal-action-explorer__button"
        @click="$emit('modal-action-button-clicked', item.buttonActionName)">
        <p>
          {{ item.buttonName }}
        </p>
      </PButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import { PButton } from '@pulse/styleguide'
import type { ModalActionsProps } from './DocumentsModalActionsFooterTypes'

defineProps<ModalActionsProps>()

defineEmits<{
  'modal-action-button-clicked': [string]
}>()
</script>
<style lang="scss">
.document-modal-action-explorer__button {
  margin-right: 16px;

  &:last-of-type {
    margin-right: 0;
  }
}
</style>
