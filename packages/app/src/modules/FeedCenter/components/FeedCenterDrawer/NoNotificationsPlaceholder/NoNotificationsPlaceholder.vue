<template>
  <div
    class="
      no-notification-placeholder
      margin-x--auto
      flex
      flex--direction-column
      flex--align-items-center
      flex--justify-content-center
    "
  >
    <div class="no-notification-placeholder__image margin-bottom--7">
      <PImage pName="bell-slash-duotone" />
    </div>
    <p class="text-center font-small font-semibold text-color--neutral-gray-500">
      {{ t('empty') }}
    </p>
    <p
      class="text-center font-small padding-top--2 text-color--neutral-gray-300"
      data-testid="no-notification-additional-information"
    >
      <template v-if="placeholderType === 'all-notifications'">
        {{ t('additional-information.notification-here') }}
      </template>
      <template v-if="placeholderType === 'unread-notifications'">
        {{ t('additional-information.unread-notifications-here') }}
      </template>
    </p>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { PImage } from '@pulse/styleguide/components'
import type { NoNotificationsPlaceholderProps } from './NoNotificationsPlaceholderTypes'

const { t } = useI18n({
  inheritLocale: true,
  useScope: 'local',
})

defineProps<NoNotificationsPlaceholderProps>()
</script>

<style lang="scss" scoped>
.no-notification-placeholder {
  &__image {
    width: 28px;
    height: 28px;
  }
}
</style>

<i18n lang="yaml">
en-US:
  empty: "You don't have any notifications yet"
  additional-information:
    notification-here: 'Here you can find all the notifications from your entities.'
    unread-notifications-here: 'Here you can find all the unread notifications from your entities.'
fr-FR:
  empty: "Vous n'avez pas encore de notifications"
  additional-information:
    notification-here: 'Retrouvez ici toutes les notifications de vos entités'
    unread-notifications-here: 'Retrouvez ici toutes les notifications non lues de vos entités'
</i18n>
