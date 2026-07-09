import type { Meta, StoryObj } from '@storybook/vue3-vite'
import ConformityDocuments from './conformity-documents.vue'
import { createRenderWithState } from './conformity-documents.stories.helpers'

const renderWithState = createRenderWithState(false)

const meta: Meta<typeof ConformityDocuments> = {
  title: 'Applets/Entities/Prospect/Conformity/ConformityDocuments/Client',
  component: ConformityDocuments,
  tags: ['autodocs'],
  render: renderWithState('partial'),
}

export default meta
type Story = StoryObj<typeof meta>

// Nothing uploaded yet: an upload zone for every supporting document and the complementary dropzone.
export const Empty: Story = {
  render: renderWithState('empty'),
}

// Some supporting documents uploaded, the rest still missing.
export const PartiallyFilled: Story = {
  render: renderWithState('partial'),
}

// Every document uploaded, shown read-only (no delete action for the client).
export const AllUploaded: Story = {
  render: renderWithState('filled'),
}

// The shared /supporting-documents request failed: both sections show the error alert.
export const LoadError: Story = {
  render: renderWithState('error'),
}
