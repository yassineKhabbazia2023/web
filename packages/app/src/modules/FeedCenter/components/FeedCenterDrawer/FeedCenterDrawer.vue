<template>
  <PDrawer
    v-model="isDrawerOpened"
    class="feed-center-drawer"
    pType="mini"
    :pTitle="t('title')"
    modal
    pDirection="ttb"
    destroyOnClose
    :pHeaderToolbox="toolboxParams"
    @close-drawer-button="closeNotificationsDrawer"
    @p-toolbox-item-clicked="handleToolboxItemClick"
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
import type { FeedCenterDrawerProps } from './feed-center-drawer.types'
import NotificationsWrapper from './NotificationsWrapper'
import { useFeedCenterDrawer } from './feed-center-drawer.composable'
import { PDrawerProps } from '@pulse/styleguide/types'
import { commonStore } from '@pulse/common'
import { patchAllNotificationsAsRead } from './feed-center-drawer.manager'
import {
  trackNotificationMarkAsRead,
} from '@app/modules/FeedCenter/services/tracking/tracking.service'
import { NotificationTrackingReadType } from '@app/modules/FeedCenter/services/tracking/tracking.types'

const { t } = useI18n({
  inheritLocale: true,
  useScope: 'local',
})

const emit = defineEmits<{
  'update:model-value': [boolean]
}>()

const props = defineProps<FeedCenterDrawerProps>()
const { unreadNotificationsCount } = toRefs(props)

const userStore = commonStore()
const userId = computed(() => userStore.user?.id)

const isDrawerOpened = computed({
  get: () => props.modelValue,
  set: (value: boolean) => {
    emit('update:model-value', value)
  },
})

const toolboxParams: PDrawerProps['pHeaderToolbox'] = {
  pElements: [
    {
      pValue: t('mark-all-as-read'),
      pIconName: 'checkCircle',
      pActionName: 'markAllAsRead',
    },
  ],
}

async function handleToolboxItemClick() {
  notifications.value = await patchAllNotificationsAsRead(userId.value)
  trackNotificationMarkAsRead(NotificationTrackingReadType.ALL_READ)
}

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
  mark-all-as-read: 'Mark all as read'
  tabs:
    all-notifications: 'All'
    unread-notifications: 'Unread'
fr-FR:
  title: 'Notifications'
  mark-all-as-read: 'Tout marquer comme lu'
  tabs:
    all-notifications: 'Tout'
    unread-notifications: 'Non lu'
</i18n>
