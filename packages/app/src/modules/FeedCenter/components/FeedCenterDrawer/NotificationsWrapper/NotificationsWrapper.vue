<template>
  <div
    class="
            notifications-drawer
            flex flex--direction-column
          "
    :class="{ 'flex--align-items-center flex--justify-content-center': notifications.length === 0 }"
  >
    <NoNotificationsPlaceholder
      v-if="notifications.length === 0"
      :placeholderType="wrapperType"
    />
    <template
      v-if="notifications.length > 0"
    >
      <Notification
        v-for="(notification, index) in notifications"
        :key="index"
        :accountsNames="getNotificationAccountNames(notification)"
        :elapsedTime="getTimeSinceCreation({
          creationDate: notification.createdAt,
          minuteSuffix: t('suffixes.minute'),
          hourSuffix: t('suffixes.hour'),
          daySuffix: t('suffixes.day'),
          weekSuffix: t('suffixes.week'),
        })"
        :id="notification.id"
        :isRead="notification.isRead"
        :message="notification.message"
        :notificationType="notification.notificationType"
        @click="handleNotificationAction({
          notifications,
          notification,
          router
        })"
      />
    </template>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import NoNotificationsPlaceholder from '../NoNotificationsPlaceholder'
// eslint-disable-next-line import/extensions
import type { NotificationsWrapperProps } from './NotificationsWrapper.types'
import Notification from '../Notification'
import {
  handleNotificationAction,
  getNotificationAccountNames,
  getTimeSinceCreation,
  // eslint-disable-next-line import/extensions
} from './notification.manager'

defineProps<NotificationsWrapperProps>()

const { t } = useI18n({
  inheritLocale: true,
  useScope: 'local',
})

const router = useRouter()

</script>

<style lang="scss" scoped>
  // target height - header height - drawer header height - tab title height
  .notifications-drawer {
    height: calc(92vh - 56px - 92px - 45px - 32px);
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
