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
    <div class="padding-y--3">
      <PSwitch v-model="isFavouritesFilterEnabled" />
      <span class="padding-left--2">{{ t('favorites') }}</span>
    </div>

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
            <PPastille v-if="unreadNotificationsCountRef" pSize="small">
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
import { computed, toRef, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import {
  PDrawer,
  PPastille,
  PTabs,
  PTabPane,
  PSwitch,
} from '@pulse/styleguide/components'
import { SelectedNotificationEnum } from '@app/modules/FeedCenter/types/notification.type'
import type { FeedCenterDrawerProps } from './feed-center-drawer.types'
import NotificationsWrapper from './NotificationsWrapper'
import { useFeedCenterDrawer } from './feed-center-drawer.composable'
import { PDrawerProps } from '@pulse/styleguide/types'
import { useUserStore } from '@pulse/common/stores'
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
  'update:model-value': [boolean],
  'notifications-updated': [],
  'favourites-filter-updated': [boolean]
}>()

const props = defineProps<FeedCenterDrawerProps>()
// Keeps reactivity for prop changes, ensuring the count stays updated from the parent.
const unreadNotificationsCountRef = toRef(props, 'unreadNotificationsCount')

const userStore = useUserStore()
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
  emit('notifications-updated')
}

const {
  closeNotificationsDrawer,
  activeTab,
  notifications,
  areNotificationsLoading,
  shortenedCount,
  unreadNotifications,
  isFavouritesFilterEnabled,
} = useFeedCenterDrawer(isDrawerOpened, unreadNotificationsCountRef)

watch(isFavouritesFilterEnabled, () => {
  emit('favourites-filter-updated', isFavouritesFilterEnabled.value)
  localStorage.setItem('favoriteEnabled', isFavouritesFilterEnabled.value.toString())
})

</script>

<i18n lang="yaml">
en-US:
  title: 'Notifications'
  mark-all-as-read: 'Mark all as read'
  tabs:
    all-notifications: 'All'
    unread-notifications: 'Unread'
  favorites: 'Favorites'
fr-FR:
  title: 'Notifications'
  mark-all-as-read: 'Tout marquer comme lu'
  tabs:
    all-notifications: 'Tout'
    unread-notifications: 'Non lu'
  favorites: 'Favoris'
</i18n>
