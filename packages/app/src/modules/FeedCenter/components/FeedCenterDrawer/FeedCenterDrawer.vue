<template>
  <PDrawer
    v-model="isDrawerOpened"
    class="feed-center-drawer"
    pType="mini"
    :pTitle="t('title')"
    modal
    pDirection="ttb"
    destroyOnClose
    @close-drawer-button="closeNotificationsDrawer"
  >
    <PTabs v-model="activeTab">
      <PTabPane :label="t('tabs.all-notifications')" name="all-notifications">
        <NotificationsWrapper
          :wrapperType="SelectedNotificationEnum.ALL"
          :notifications="notifications"
        />
      </PTabPane>

      <PTabPane
        name="unread-notifications"
      >
        <template #label>
          <div class="flex flex--align-items-center">
            <p class="margin-right--1">
              {{ t('tabs.unread-notifications') }}
            </p>
            <PPastille v-if="unreadNotificationsCount" pSize="small">
              {{ shortenedCount }}
            </PPastille>
          </div>
        </template>
        <NotificationsWrapper
          :wrapperType="SelectedNotificationEnum.UNREAD"
          :notifications="unreadNotifications"
          data-testid="unread-notifications"
        />
      </PTabPane>
    </PTabs>

  </PDrawer>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { computed, onMounted, ref } from 'vue'
import {
  PDrawer,
  PPastille,
  PTabs,
  PTabPane,
} from '@pulse/styleguide'
/* eslint-disable import/extensions */
import { type FeedCenterNotification, SelectedNotificationEnum } from '@app/modules/FeedCenter/types/notification.type'
import { fetchNotifications } from '@app/modules/FeedCenter/services/notifications.service'
import type { FeedCenterDrawerProps } from './FeedCenterDrawerTypes'
import NotificationsWrapper from './NotificationsWrapper'

const { t } = useI18n({
  inheritLocale: true,
  useScope: 'local',
})

const emit = defineEmits<{
  'update:model-value': [boolean]
}>()

const props = defineProps<FeedCenterDrawerProps>()

const isDrawerOpened = computed({
  get: () => props.modelValue,
  set: (value: boolean) => {
    emit('update:model-value', value)
  },
})

const notifications = ref<FeedCenterNotification[]>([])
const unreadNotifications = computed(() => notifications.value.filter(notification => notification.isRead === false))

onMounted(async () => {
  const { notifications: fetchedNotification } = await fetchNotifications()
  notifications.value = fetchedNotification
})

function closeNotificationsDrawer() {
  isDrawerOpened.value = false
}

const activeTab = ref<SelectedNotificationEnum>(SelectedNotificationEnum.ALL)

const shortenedCount = computed(
  () => props.unreadNotificationsCount > 99
    ? '99+'
    : props.unreadNotificationsCount,
)
</script>

<i18n lang="yaml">
en-US:
  title: 'Notifications'
  tabs:
    all-notifications: 'All'
    unread-notifications: 'Unread'
fr-FR:
  title: 'Notifications'
  tabs:
    all-notifications: 'Tout'
    unread-notifications: 'Non lu'
</i18n>

