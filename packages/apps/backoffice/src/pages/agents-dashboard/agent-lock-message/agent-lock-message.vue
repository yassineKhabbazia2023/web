<template>
  <PAlert
    pType="information"
    pIconName="lock"
    data-testid="agents-dashboard-lock-message-alert"
  >
    <div
      class="
        agent-lock-message
        flex
        flex--align-items-flex-start
        flex--justify-content-space-between
        flex-gap--4
      "
    >
      <div
        class="agent-lock-message__content font-small"
        data-testid="agents-dashboard-lock-message-content"
        v-html="message"
      />

      <div class="flex flex--align-items-center flex-gap--2">
        <PTooltip pContent="Copier le message">
          <PButton
            pTestId="agents-dashboard-lock-message-copy-button"
            pIconOnly
            pSize="small"
            @click="$emit('copy')"
          >
            <PIcon
              pName="files"
              pSize="16"
            />
          </PButton>
        </PTooltip>

        <PTooltip pContent="Fermer">
          <PButton
            pTestId="agents-dashboard-lock-message-close-button"
            pIconOnly
            pSize="small"
            @click="$emit('close')"
          >
            <PIcon
              pName="x"
              pSize="16"
            />
          </PButton>
        </PTooltip>
      </div>
    </div>
  </PAlert>
</template>

<script setup lang="ts">
import { PAlert, PButton, PIcon, PTooltip } from '@pulse/styleguide/components'

defineProps<{
  message: string
}>()

defineEmits<{
  'close': []
  'copy': []
}>()
</script>

<style lang="scss" scoped>
:deep(.p-alert__content) {
  flex: 1;
}

.agent-lock-message {
  width: 100%;

  &__content {
    overflow-wrap: anywhere;
  }
}
</style>
