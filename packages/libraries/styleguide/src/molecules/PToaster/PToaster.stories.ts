import type { Meta, StoryObj } from '@storybook/vue3-vite'
import PButton from '../../atoms/PButton'
import { PNotification, displayNotification } from '../../utils/PNotification/PNotification'
import type { NotificationPosition } from '../../utils/PNotification/PNotificationTypes'
import { defineComponent } from 'vue'

// Create a dummy component for the story
const PToaster = defineComponent({
  name: 'PToaster',
  template: '<div></div>',
})

const meta: Meta<typeof PToaster> = {
  title: 'Molecules/Toaster',
  component: PToaster as any,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Toaster notifications using the PNotification utility for displaying success, error, loading and custom messages.',
      },
    },
  },
}

export default meta
type Story = StoryObj<typeof PToaster>

export const Success: Story = {
  render: () => ({
    components: { PButton },
    setup() {
      const openSuccess = () => {
        PNotification({
          message: 'Operation completed successfully!',
          iconName: 'check',
          showClose: false,
          customClass: 'success',
        })
      }
      return { openSuccess }
    },
    template: `
      <PButton pPlain @click="openSuccess">
        Show Success Notification
      </PButton>
    `,
  }),
}

export const Error: Story = {
  render: () => ({
    components: { PButton },
    setup() {
      const openError = () => {
        PNotification({
          message: 'An error occurred while processing your request.',
          iconName: 'exclamationTriangle',
          customClass: 'error',
          showClose: false,
        })
      }
      return { openError }
    },
    template: `
      <PButton pPlain @click="openError">
        Show Error Notification
      </PButton>
    `,
  }),
}

export const Loading: Story = {
  render: () => ({
    components: { PButton },
    setup() {
      const openLoading = () => {
        PNotification({
          message: 'Processing your request, please wait...',
          iconName: 'loaderGradient',
          showClose: false,
          customClass: 'loading',
          duration: 0, // Keep open until manually closed
        })
      }
      return { openLoading }
    },
    template: `
      <PButton pPlain @click="openLoading">
        Show Loading Notification
      </PButton>
    `,
  }),
}

export const WithCloseButton: Story = {
  render: () => ({
    components: { PButton },
    setup() {
      const openWithClose = () => {
        PNotification({
          message: 'This notification can be closed manually.',
          iconName: 'check',
          showClose: true,
          customClass: 'success',
          duration: 0, // Don't auto-close
        })
      }
      return { openWithClose }
    },
    template: `
      <PButton pPlain @click="openWithClose">
        Show Notification with Close Button
      </PButton>
    `,
  }),
}

export const WithTitle: Story = {
  render: () => ({
    components: { PButton },
    setup() {
      const openWithTitle = () => {
        PNotification({
          title: 'Important Notice',
          message: 'This is a notification with both title and message.',
          iconName: 'infoCircle',
          showClose: true,
          customClass: 'info',
        })
      }
      return { openWithTitle }
    },
    template: `
      <PButton pPlain @click="openWithTitle">
        Show Notification with Title
      </PButton>
    `,
  }),
}

export const DifferentPositions: Story = {
  render: () => ({
    components: { PButton },
    setup() {
      const positions: NotificationPosition[] = ['top-right', 'top-left', 'bottom-right', 'bottom-left']

      const openAtPosition = (position: NotificationPosition) => {
        PNotification({
          message: `Notification at ${position}`,
          iconName: 'infoCircle',
          showClose: true,
          customClass: 'info',
          position,
        })
      }

      return { positions, openAtPosition }
    },
    template: `
      <div class="flex flex-wrap gap-4">
        <PButton 
          v-for="position in positions" 
          :key="position"
          pPlain 
          @click="openAtPosition(position)"
        >
          {{ position }}
        </PButton>
      </div>
    `,
  }),
}

export const UsingDisplayNotificationHelper: Story = {
  render: () => ({
    components: { PButton },
    setup() {
      const showSuccess = () => {
        displayNotification('success', 'Operation completed successfully!')
      }

      const showError = () => {
        displayNotification('error', 'Something went wrong!')
      }

      return { showSuccess, showError }
    },
    template: `
      <div class="flex gap-4">
        <PButton pPlain @click="showSuccess">
          Success Helper
        </PButton>
        <PButton pPlain @click="showError">
          Error Helper
        </PButton>
      </div>
    `,
  }),
}
