<template>
  <div
    class="
            notifications-drawer
            flex flex--direction-column
          "
    :class="{ 'flex--align-items-center flex--justify-content-center': shouldContentBeCentered }"
  >
    <PLoader
      v-if="isLoading"
      pType="primary"
      pSize="40"
    />
    <NoNotificationsPlaceholder
      v-else-if="notifications.length === 0"
      :placeholderType="wrapperType"
    />
    <template
      v-else-if="notifications.length > 0"
    >
      <Notification
        v-for="(notification, index) in notifications"
        :id="notification.id"
        :key="index"
        :accountsNames="getNotificationAccountNames(notification)"
        :elapsedTime="getTimeSinceCreation({
          creationDate: notification.createdAt,
          minuteSuffix: t('suffixes.minute'),
          hourSuffix: t('suffixes.hour'),
          daySuffix: t('suffixes.day'),
          weekSuffix: t('suffixes.week'),
        })"
        :isRead="notification.isRead"
        :message="notification.message"
        :notificationType="notification.notificationType"
        @click="handleNotificationClick(notification)"
      />
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { PLoader } from '@pulse/styleguide/components'
import type { FeedCenterNotification } from '@app/modules/FeedCenter/types/notification.type'
import NoNotificationsPlaceholder from '../NoNotificationsPlaceholder'
import type { NotificationsWrapperProps } from './notifications-wrapper.types'
import Notification from '../Notification'
import {
  handleNotificationAction,
  getNotificationAccountNames,
  getTimeSinceCreation,
} from './notifications-wrapper.manager'
import {
  trackNotificationsConsulted,
  trackNotificationMarkAsRead,
} from '@app/modules/FeedCenter/services/tracking/tracking.service'
import { NotificationTrackingReadType } from '@app/modules/FeedCenter/services/tracking/tracking.types'


const emit = defineEmits<{
  'notification-clicked': [void]
}>()
const props = defineProps<NotificationsWrapperProps>()

const router = useRouter()

const { t } = useI18n({
  inheritLocale: true,
  useScope: 'local',
})

const shouldContentBeCentered = computed(() => props.notifications.length === 0 || props.isLoading)

function handleNotificationClick(notification: FeedCenterNotification) {
  trackNotificationsConsulted(notification.notificationType)
  handleNotificationAction({
    notification,
    router,
  })
  trackNotificationMarkAsRead(NotificationTrackingReadType.SINGLE_READ)
  emit('notification-clicked')
}
</script>

<style lang="scss" scoped>
  // target height - header height - drawer header height - tab title height
  .notifications-drawer {
    height: calc(92vh - var(--p-header-height) - 92px - 45px - 32px);
  }
</style>

<i18n lang="yaml">
en-US:
  suffixes:
    minute: 'min'
    hour: 'h'
    day: 'd'
    week: 'w'
fr-FR:
  suffixes:
    minute: 'min'
    hour: 'h'
    day: 'j'
    week: 'sem'
</i18n>
