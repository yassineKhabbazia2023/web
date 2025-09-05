<template>
  <div
    class="
      service-email-information-line
      flex
      flex--justify-content-space-between
      flex--align-items-center
    "
  >
    <div
      class="
        service-email-information-line__information
        flex
        flex--align-items-center flex-gap--3
      "
    >
      <PIcon pName="folder" pSize="20" />
      <div class="flex flex--direction-column">
        {{ depositPath }}
        <span class="text-color--neutral-gray-500 font-small">{{ email }}</span>
      </div>
    </div>
    <div
      class="
        service-email-information-line__actions
        flex flex-gap--8
      "
    >
      <PButton
        pIconOnly
        pType="default"
        @click="copyServiceEmailToClipboard(props.email)"
      >
        <PIcon pName="files" />
      </PButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import { PButton, PIcon } from '@pulse/styleguide/components'
import { ServiceEmailInformationLineProps } from '@ged/modules/Treeview/components/mail-to-ged-card/service-email-information-line/service-email-information-line.type.ts'
import { copyServiceEmailToClipboard } from '@ged/modules/Treeview/components/mail-to-ged-card/service-email-information-line/service-email-information-line.manager.ts'

const props = defineProps<ServiceEmailInformationLineProps>()
</script>

<style lang="scss" scoped>
.service-email-information-line {
  width: 100%;
  &:last-of-type:not(:only-of-type) {
    border-top: 1px solid var(--p-gray-100);
  }
}
</style>
