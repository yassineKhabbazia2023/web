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
          :isLoading="areNotificationsLoading"
          :notifications="notifications"
          :wrapperType="SelectedNotificationEnum.ALL"
          @notification-clicked="closeNotificationsDrawer"
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
          :isLoading="areNotificationsLoading"
          :wrapperType="SelectedNotificationEnum.UNREAD"
          :notifications="unreadNotifications"
          data-testid="unread-notifications"
          @notification-clicked="closeNotificationsDrawer"
        />
      </PTabPane>
    </PTabs>
  </PDrawer>
</template>

<script setup lang="ts">
import { computed, toRefs } from 'vue'
import { useI18n } from 'vue-i18n'
import {
  PDrawer,
  PPastille,
  PTabs,
  PTabPane,
} from '@pulse/styleguide/components'
import { SelectedNotificationEnum } from '@app/modules/FeedCenter/types/notification.type'
import type { FeedCenterDrawerProps } from './FeedCenterDrawerTypes'
import NotificationsWrapper from './NotificationsWrapper'
import { useFeedCenterDrawer } from './feed-center-drawer.composable'

const { t } = useI18n({
  inheritLocale: true,
  useScope: 'local',
})

const emit = defineEmits<{
  'update:model-value': [boolean]
}>()

const props = defineProps<FeedCenterDrawerProps>()
const { unreadNotificationsCount } = toRefs(props)

const isDrawerOpened = computed({
  get: () => props.modelValue,
  set: (value: boolean) => {
    emit('update:model-value', value)
  },
})

const {
  closeNotificationsDrawer,
  activeTab,
  notifications,
  areNotificationsLoading,
  shortenedCount,
  unreadNotifications,
} = useFeedCenterDrawer(isDrawerOpened, unreadNotificationsCount)
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
