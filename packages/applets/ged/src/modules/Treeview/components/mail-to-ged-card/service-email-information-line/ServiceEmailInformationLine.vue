<template>
  <div
    class="
      service-email-information-line
      flex
      flex--justify-content-space-between
      flex--align-items-center
      padding-y--3
      padding-x--3
    "
  >
    <div
      class="
        service-email-information-line__information
        flex
        flex--align-items-center
      "
    >
      <PIcon pName="folder" pSize="24" />
      <div class="flex flex--direction-column">
        {{ depositPath }}
        <span class="text-color--neutral-gray-500 font-small">{{ email }}</span>
      </div>
    </div>
    <div
      class="
        service-email-information-line__actions
        flex
      "
    >
      <PButton
        pIconOnly
        pType="default"
        @click="copyServiceEmailToClipboard(email)"
      >
        <PIcon pName="files" />
      </PButton>
      <PButton
        pType="primary"
        pTag="a"
        :href="`mailto:${email}`"
      >
        {{ t('sendEmail') }}
      </PButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { PButton, PIcon } from '@pulse/styleguide/components'
import { ServiceEmailInformationLineProps } from './service-email-information-line.type'
import { copyServiceEmailToClipboard } from './service-email-information-line.manager'

const { t } = useI18n({
  inheritLocale: true,
  useScope: 'local',
  messages: {
    'en-US': {
      sendEmail: 'Send an e-mail',
    },
    'fr-FR': {
      sendEmail: 'Envoyer un e-mail',
    },
  },
})

defineProps<ServiceEmailInformationLineProps>()
</script>

<style lang="scss">
.service-email-information-line {
  width: 100%;
  &:last-of-type:not(:only-of-type) {
    border-top: 1px solid var(--p-gray-100);
  }

  &__information {
    gap: 12px;
  }

  &__actions {
    gap: 8px;
  }
}
</style>

