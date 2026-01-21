<template>
  <PDrawer
    v-model="isDrawerOpened"
    class="feed-center-drawer"
    :pType="isMobile ? 'fullscreen' : 'mini'"
    :pTitle="t('title')"
    modal
    :pDirection="isMobile ? undefined : 'ttb'"
    destroyOnClose
    :pHeaderToolbox="isMobile ? undefined : toolboxParams()"
    @close-drawer-button="closeNotificationsDrawer"
    @p-toolbox-item-clicked="handleToolboxItemClick"
  >
    <div class="position--relative height--100">
      <div
        v-if="isMobile"
        data-testid="mobile-not-available-overlay"
        class="
          feed-center-drawer__mobile-overlay
          flex
          flex--align-items-center
          flex--justify-content-center
          padding--4
        "
      >
        <MobileNotAvailableAlert />
      </div>
      <PTabs v-model="activeTab">
        <PTabPane :label="t('tabs.all-notifications')" name="all-notifications">
          <NotificationsWrapper
            :isLoading="areNotificationsLoading"
            :notifications="feedCenterStore.notifications"
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
    </div>
  </PDrawer>
</template>

<script setup lang="ts">
import { computed, toRef } from 'vue'
import { useI18n } from 'vue-i18n'
import {
  PDrawer,
  PPastille,
  PTabs,
  PTabPane,
} from '@pulse/styleguide/components'
import { MobileNotAvailableAlert } from '@pulse/shared/components'
import { useResponsive } from '@pulse/styleguide'
import { FeatureFlagManager } from '@pulse/common/managers'
import { SelectedNotificationEnum } from '../../types/notification.type'
import type { FeedCenterDrawerProps } from './feed-center-drawer.types'
import NotificationsWrapper from './NotificationsWrapper'
import { useFeedCenterDrawer } from './feed-center-drawer.composable'
import { PDrawerProps } from '@pulse/styleguide/types'
import { useUserStore } from '@pulse/common/stores'
import { patchAllNotificationsAsRead } from './feed-center-drawer.manager'
import {
  trackNotificationMarkAsRead,
} from '../../services/tracking/tracking.service'
import { NotificationTrackingReadType } from '../../services/tracking/tracking.types'
import { FeedCenterActions } from '../../feed-center.enum'
import { useFeedCenterStore } from '../../stores/feed-center.store'

const feedCenterStore = useFeedCenterStore()
const { isMobile } = useResponsive()

const { t } = useI18n({
  inheritLocale: true,
  useScope: 'local',
})

const emit = defineEmits<{
  'update:model-value': [boolean],
  'notifications-updated': [],
  'favourites-filter-updated': [boolean],
  'open-notification-settings-drawer': []
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

const toolboxParams = (): PDrawerProps['pHeaderToolbox'] => {
  const elements: PDrawerProps['pHeaderToolbox'] = {
    pElements: [
      {
        pValue: t('mark-all-as-read'),
        pIconName: 'checkCircle',
        pActionName: FeedCenterActions.MARK_ALL_AS_READ,
      },
    ],
  }

  if (FeatureFlagManager.isNotificationSettingsDrawerActivated() === true) {
    elements.pElements.push({
      pValue: t('notification-settings'),
      pIconName: 'gear',
      pActionName: FeedCenterActions.OPEN_SETTINGS_DRAWER,
    })
  }

  return elements
}

async function handleToolboxItemClick(actionName: string) {
  switch (actionName) {
    case FeedCenterActions.MARK_ALL_AS_READ: {
      const patchedNotifications = await patchAllNotificationsAsRead(userId.value)
      feedCenterStore.setNotifications(patchedNotifications)
      trackNotificationMarkAsRead(NotificationTrackingReadType.ALL_READ)
      emit('notifications-updated')
      break
    }
    case FeedCenterActions.OPEN_SETTINGS_DRAWER: {
      emit('open-notification-settings-drawer')
      break
    }
  }
}

const {
  closeNotificationsDrawer,
  activeTab,
  areNotificationsLoading,
  shortenedCount,
  unreadNotifications,
} = useFeedCenterDrawer(isDrawerOpened, unreadNotificationsCountRef)

</script>

<i18n lang="yaml">
en-US:
  title: 'Notifications'
  mark-all-as-read: 'Mark all as read'
  notification-settings: 'Access notifications settings'
  tabs:
    all-notifications: 'All'
    unread-notifications: 'Unread'
  favorites: 'Favorites'
fr-FR:
  title: 'Notifications'
  mark-all-as-read: 'Tout marquer comme lu'
  notification-settings: 'Accéder aux paramètres des notifications'
  tabs:
    all-notifications: 'Tout'
    unread-notifications: 'Non lu'
  favorites: 'Favoris'
</i18n>

<style scoped>
.feed-center-drawer__mobile-overlay {
  position: absolute;
  inset: 0;
  z-index: 10;
  background: rgba(255, 255, 255, 0.7);
  -webkit-backdrop-filter: blur(3px);
  backdrop-filter: blur(3px);
}
</style>
