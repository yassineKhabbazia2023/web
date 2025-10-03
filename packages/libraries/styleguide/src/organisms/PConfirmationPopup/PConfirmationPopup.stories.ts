import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { ref } from 'vue'
import PConfirmationPopup from './PConfirmationPopup.vue'
import PButton from '../../atoms/PButton'
import { PConfirmationPopupProps } from './PConfirmationPopupTypes'

const meta: Meta<typeof PConfirmationPopup> = {
  title: 'Organisms/PConfirmationPopup',
  component: PConfirmationPopup,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A confirmation popup component with customizable title, message, and buttons. Used for confirming user actions.',
      },
    },
  },
  argTypes: {
    pIsVisible: {
      control: 'boolean',
      description: 'Whether the popup is visible',
      table: {
        type: { summary: 'boolean' },
      },
    },
    pTitle: {
      control: 'text',
      description: 'Title of the confirmation popup',
      table: {
        type: { summary: 'string' },
      },
    },
    pConfirmButtonContent: {
      control: 'text',
      description: 'Text content for the confirm button',
      table: {
        type: { summary: 'string' },
      },
    },
    pCancelButtonContent: {
      control: 'text',
      description: 'Text content for the cancel button',
      table: {
        type: { summary: 'string' },
      },
    },
    pConfirmButtonIsLoading: {
      control: 'boolean',
      description: 'Whether the confirm button is in loading state',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    pAlignCenter: {
      control: 'boolean',
      description: 'Whether to center-align the content',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'true' },
      },
    },
    pNoCloseButton: {
      control: 'boolean',
      description: 'Whether to hide the close button',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'true' },
      },
    },
  },
  tags: ['!autodocs'],
}

export default meta
type Story = StoryObj<PConfirmationPopupProps>

export const Default: Story = {
  render: (args) => ({
    components: { PConfirmationPopup, PButton },
    setup() {
      const isVisible = ref(false)

      const openDialog = () => {
        isVisible.value = true
      }

      const onUpdatePIsVisible = (visible: boolean) => {
        isVisible.value = visible
        console.log('Visibility updated:', visible)
      }

      const onConfirmButtonClick = () => {
        console.log('Confirm button clicked')
        isVisible.value = false
      }

      const onCancelButtonClick = () => {
        console.log('Cancel button clicked')
        isVisible.value = false
      }

      const onClosePopup = () => {
        console.log('Close popup clicked')
        isVisible.value = false
      }

      return {
        args,
        isVisible,
        openDialog,
        onUpdatePIsVisible,
        onConfirmButtonClick,
        onCancelButtonClick,
        onClosePopup,
      }
    },
    template: `
      <div style="padding: 20px;">
        <PButton @click="openDialog">
          Open Confirmation Dialog
        </PButton>

        <PConfirmationPopup
          v-bind="args"
          :pIsVisible="isVisible"
          @update:p-is-visible="onUpdatePIsVisible"
          @on-confirm-button-click="onConfirmButtonClick"
          @on-cancel-button-click="onCancelButtonClick"
          @on-close-popup="onClosePopup"
        >
          <p>Acceptez-vous cette action ?</p>
        </PConfirmationPopup>
      </div>
    `,
  }),
  args: {
    pIsVisible: false,
    pTitle: 'Confirmation',
    pConfirmButtonContent: 'Yes',
    pCancelButtonContent: 'No',
    pConfirmButtonIsLoading: false,
    pAlignCenter: true,
    pNoCloseButton: true,
  },
}

export const WithLoadingState: Story = {
  render: (args) => ({
    components: { PConfirmationPopup, PButton },
    setup() {
      const isVisible = ref(false)
      const isLoading = ref(false)

      const openDialog = () => {
        isVisible.value = true
        isLoading.value = false
      }

      const onUpdatePIsVisible = (visible: boolean) => {
        isVisible.value = visible
        if (!visible) {
          isLoading.value = false
        }
      }

      const onConfirmButtonClick = () => {
        isLoading.value = true
        // Simulate async operation
        setTimeout(() => {
          console.log('Confirm operation completed')
          isVisible.value = false
          isLoading.value = false
        }, 2000)
      }

      const onCancelButtonClick = () => {
        console.log('Cancel button clicked')
        isVisible.value = false
        isLoading.value = false
      }

      const onClosePopup = () => {
        console.log('Close popup clicked')
        isVisible.value = false
        isLoading.value = false
      }

      return {
        args,
        isVisible,
        isLoading,
        openDialog,
        onUpdatePIsVisible,
        onConfirmButtonClick,
        onCancelButtonClick,
        onClosePopup,
      }
    },
    template: `
      <div style="padding: 20px;">
        <PButton @click="openDialog">
          Open Dialog with Loading
        </PButton>

        <PConfirmationPopup
          v-bind="args"
          :pIsVisible="isVisible"
          :pConfirmButtonIsLoading="isLoading"
          @update:p-is-visible="onUpdatePIsVisible"
          @on-confirm-button-click="onConfirmButtonClick"
          @on-cancel-button-click="onCancelButtonClick"
          @on-close-popup="onClosePopup"
        >
          <p>This action will take a moment to complete. Are you sure?</p>
        </PConfirmationPopup>
      </div>
    `,
  }),
  args: {
    pIsVisible: false,
    pTitle: 'Processing Action',
    pConfirmButtonContent: 'Confirm',
    pCancelButtonContent: 'Cancel',
    pConfirmButtonIsLoading: false,
    pAlignCenter: true,
    pNoCloseButton: false,
  },
}

export const DeleteConfirmation: Story = {
  render: (args) => ({
    components: { PConfirmationPopup, PButton },
    setup() {
      const isVisible = ref(false)

      const openDialog = () => {
        isVisible.value = true
      }

      const onUpdatePIsVisible = (visible: boolean) => {
        isVisible.value = visible
      }

      const onConfirmButtonClick = () => {
        console.log('Item deleted')
        isVisible.value = false
      }

      const onCancelButtonClick = () => {
        console.log('Delete cancelled')
        isVisible.value = false
      }

      const onClosePopup = () => {
        console.log('Close popup clicked')
        isVisible.value = false
      }

      return {
        args,
        isVisible,
        openDialog,
        onUpdatePIsVisible,
        onConfirmButtonClick,
        onCancelButtonClick,
        onClosePopup,
      }
    },
    template: `
      <div style="padding: 20px;">
        <PButton pType="danger" @click="openDialog">
          Delete Item
        </PButton>

        <PConfirmationPopup
          v-bind="args"
          :pIsVisible="isVisible"
          @update:p-is-visible="onUpdatePIsVisible"
          @on-confirm-button-click="onConfirmButtonClick"
          @on-cancel-button-click="onCancelButtonClick"
          @on-close-popup="onClosePopup"
        >
          <p><strong>Warning:</strong> This action cannot be undone.</p>
          <p>Are you sure you want to delete this item?</p>
        </PConfirmationPopup>
      </div>
    `,
  }),
  args: {
    pIsVisible: false,
    pTitle: 'Delete Item',
    pConfirmButtonContent: 'Delete',
    pCancelButtonContent: 'Cancel',
    pConfirmButtonIsLoading: false,
    pAlignCenter: false,
    pNoCloseButton: false,
  },
}

export const WithCloseButton: Story = {
  render: (args) => ({
    components: { PConfirmationPopup, PButton },
    setup() {
      const isVisible = ref(false)

      const openDialog = () => {
        isVisible.value = true
      }

      const onUpdatePIsVisible = (visible: boolean) => {
        isVisible.value = visible
      }

      const onConfirmButtonClick = () => {
        console.log('Confirm button clicked')
        isVisible.value = false
      }

      const onCancelButtonClick = () => {
        console.log('Cancel button clicked')
        isVisible.value = false
      }

      return {
        args,
        isVisible,
        openDialog,
        onUpdatePIsVisible,
        onConfirmButtonClick,
        onCancelButtonClick,
      }
    },
    template: `
      <div style="padding: 20px;">
        <PButton @click="openDialog">
          Open Modal Dialog
        </PButton>

        <PConfirmationPopup
          v-bind="args"
          :pIsVisible="isVisible"
          @update:p-is-visible="onUpdatePIsVisible"
          @on-confirm-button-click="onConfirmButtonClick"
          @on-cancel-button-click="onCancelButtonClick"
        >
          <p>This dialog must be answered - you can close it with the X button.</p>
        </PConfirmationPopup>
      </div>
    `,
  }),
  args: {
    pIsVisible: false,
    pTitle: 'Modal Confirmation',
    pConfirmButtonContent: 'Accept',
    pCancelButtonContent: 'Decline',
    pConfirmButtonIsLoading: false,
    pAlignCenter: true,
    pNoCloseButton: false,
  },
}
