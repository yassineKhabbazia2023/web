import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { ref } from 'vue'
import { http, HttpResponse } from 'msw'
import FeedCenterHeaderWidget from './widgets/feed-center-header/feed-center-header.widget.vue'
import FeedCenterDrawer from './components/FeedCenterDrawer/FeedCenterDrawer.vue'
import NotificationSettings from './components/NotificationSettings/notification-settings.vue'
import { PButton } from '@pulse/styleguide/components'
import { useUserStore } from '@pulse/common/stores'
import { getMockedUser } from '@pulse/common/mocks'
import { useFeedCenterStore } from './stores/feed-center.store'
import { getWorker } from '@pulse/e2e-mocks/msw'
import {
  notificationsMock,
  unreadNotificationsMock,
} from './__mocks__/notifications.mocks'
import { getNotificationSettingsConfiguration } from './__mocks__/notification-settings.mocks'

function setupUserStore() {
  const userStore = useUserStore()
  userStore.setUser(getMockedUser({ isCollab: false }))
}

function setupEmptyNotifications() {
  getWorker().use(
    http.get('*/feedcenter/api/notifications/currentuser/unread/count', () => {
      return HttpResponse.json(0)
    }),
    http.get('*/feedcenter/api/notifications/currentuser', () => {
      return HttpResponse.json([])
    }),
  )
}

function setupWithNotifications() {
  getWorker().use(
    http.get('*/feedcenter/api/notifications/currentuser/unread/count', () => {
      return HttpResponse.json(unreadNotificationsMock.length)
    }),
    http.get('*/feedcenter/api/notifications/currentuser', () => {
      return HttpResponse.json(notificationsMock)
    }),
  )
}

const meta: Meta<typeof FeedCenterHeaderWidget> = {
  title: 'Applets/FeedCenter/Widgets',
  component: FeedCenterHeaderWidget,
  tags: ['!autodocs'],
}

export default meta
type Story = StoryObj<typeof meta>

// =====================
// Header Widget Stories
// =====================

export const HeaderWidgetWithoutNotifications: Story = {
  name: 'Header - Sans notifications',
  parameters: {
    layout: 'centered',
  },
  render: () => ({
    components: { FeedCenterHeaderWidget },
    setup() {
      setupEmptyNotifications()
      setupUserStore()
      return {}
    },
    template: '<FeedCenterHeaderWidget />',
  }),
}

export const HeaderWidgetWithNotifications: Story = {
  name: 'Header - Avec notifications',
  parameters: {
    layout: 'centered',
  },
  render: () => ({
    components: { FeedCenterHeaderWidget },
    setup() {
      setupWithNotifications()
      setupUserStore()
      return {}
    },
    template: '<FeedCenterHeaderWidget />',
  }),
}

// =====================
// Drawer Stories
// =====================

export const DrawerEmpty: Story = {
  name: 'Drawer - Vide',
  render: () => ({
    components: { FeedCenterDrawer, PButton },
    setup() {
      setupEmptyNotifications()
      setupUserStore()

      const feedCenterStore = useFeedCenterStore()
      feedCenterStore.setNotifications([])

      const isOpen = ref(true)
      const openDrawer = () => {
        isOpen.value = true
      }

      return { isOpen, openDrawer }
    },
    template: `
      <div>
        <PButton pType="primary" @click="openDrawer">Ouvrir/Fermer le drawer</PButton>
        <FeedCenterDrawer
          v-model="isOpen"
          :unreadNotificationsCount="0"
        />
      </div>
    `,
  }),
}

export const DrawerWithNotifications: Story = {
  name: 'Drawer - Avec notifications',
  render: () => ({
    components: { FeedCenterDrawer, PButton },
    setup() {
      setupWithNotifications()
      setupUserStore()

      const feedCenterStore = useFeedCenterStore()
      feedCenterStore.setNotifications(notificationsMock)

      const unreadCount = unreadNotificationsMock.length
      const isOpen = ref(true)
      const openDrawer = () => {
        isOpen.value = true
      }

      return { isOpen, openDrawer, unreadCount }
    },
    template: `
      <div>
        <PButton pType="primary" @click="openDrawer">Ouvrir/Fermer le drawer</PButton>
        <FeedCenterDrawer
          v-model="isOpen"
          :unreadNotificationsCount="unreadCount"
        />
      </div>
    `,
  }),
}

// =====================
// Settings Story
// =====================

export const Settings: Story = {
  render: () => ({
    components: { NotificationSettings, PButton },
    setup() {
      setupUserStore()

      getWorker().use(
        http.get('*/feedcenter/api/settings/currentUser', () => {
          return HttpResponse.json(getNotificationSettingsConfiguration())
        }),
        http.post('*/feedcenter/api/settings/currentUser', () => {
          return HttpResponse.json({ success: true })
        }),
      )

      const isOpen = ref(true)
      const openSettings = () => {
        isOpen.value = true
      }

      return { isOpen, openSettings }
    },
    template: `
      <div>
        <PButton pType="primary" @click="openSettings">Ouvrir les settings</PButton>
        <NotificationSettings v-model="isOpen" />
      </div>
    `,
  }),
}
