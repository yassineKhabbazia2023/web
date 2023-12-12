<template>
    <div class="document-modal-action-explorer">
    <div class="document-modal-action-explorer__right">
      <PButton
        v-for="(item, index) in modalActionsButtons"
        :key="index"
        :type="item.buttonType"
        :plain="item.plain"
        :circle="item.buttonName === '' ? true : false"
        :loading="item.loading"
        :pDisabled="item.disabled"
        :size="item.size"
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
import { PButton } from '@kpmg/styleguide'
import { ModalActionsProps } from './DocumentsModalActionsFooterTypes'

defineProps<ModalActionsProps>()
</script>
<style lang="scss">
.document-modal-action-explorer__button {
  margin-right: 16px;

  &:last-of-type {
    margin-right: 0;
  }
}
</style>
