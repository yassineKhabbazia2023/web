<template>
  <div>
    <Teleport to="body">
      <FeedCenterDrawer
        v-model="isFeedCenterOpened"
        :unreadNotificationsCount="unreadNotificationsCount"
        @notifications-updated="setNotificationsCount"
        @open-notification-settings-drawer="openNotificationSettingsDrawer"
      />

      <NotificationSettings
        v-if="isNotificationSettingsDrawerOpened === true"
        v-model="isNotificationSettingsDrawerOpened"
      />
    </Teleport>

    <div class="position--relative padding-left--2">
      <PButton
        pIconOnly
        :pIsActive="isFeedCenterOpened"
        pPlain
        pSize="small"
        :pType="isFeedCenterOpened ? 'white' : 'default'"
        data-testid="feed-center-button"
        @click="isFeedCenterOpened = !isFeedCenterOpened"
      >
        <PIcon :pName="feedCenterIconName" />
        <div
          v-if="unreadNotificationsCount > 0"
          class="feed-center-header__notification-pastille"
        >
          <PPastille
            v-if="!isFeedCenterOpened"
            pSize="small"
            pType="warning"
          >
            {{ unreadNotificationsCount }}
          </PPastille>
        </div>
      </PButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { PButton, PIcon, PPastille } from '@pulse/styleguide/components'
import FeedCenterDrawer from '../../components/FeedCenterDrawer'
import NotificationSettings from '../../components/NotificationSettings/notification-settings.vue'
import { useFeedCenterHeader } from '../../composables/use-feed-center-header'

const {
  isFeedCenterOpened,
  unreadNotificationsCount,
  isNotificationSettingsDrawerOpened,
  setNotificationsCount,
  openNotificationSettingsDrawer,
} = useFeedCenterHeader()

const feedCenterIconName = computed(() =>
  isFeedCenterOpened.value ? 'x' : 'bell',
)
</script>

<style lang="scss" scoped>
.feed-center-header__notification-pastille {
  position: absolute;
  right: 0;
  top: 0;
}
</style>
