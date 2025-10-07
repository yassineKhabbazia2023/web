import { ref } from 'vue'
import { defineStore } from 'pinia'
import { type FeedCenterNotification } from '../types/notification.type'

export const useFeedCenterStore = defineStore('feed-center', () => {

  const notifications = ref<FeedCenterNotification[]>([])

  function setNotifications(feedCenterNotifications: FeedCenterNotification[]) {
    notifications.value = feedCenterNotifications
  }

  return {
    notifications,
    setNotifications,
  }
})
