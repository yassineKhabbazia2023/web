import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { OnboardingStepStatus } from '../prospect-conformity.enums'
import ConformityDocuments from './conformity-documents.vue'
import { createRenderWithState } from './conformity-documents.stories.helpers'

const renderWithState = createRenderWithState(true)

const meta: Meta<typeof ConformityDocuments> = {
  title: 'Applets/Entities/Prospect/Conformity/ConformityDocuments/Collaborator',
  component: ConformityDocuments,
  tags: ['autodocs'],
  args: { hasSupportingDocumentsStep: true },
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

// Every document uploaded, with a delete action on each line (collaborator only).
export const AllUploaded: Story = {
  render: renderWithState('filled'),
}

// Step completed: both sections are read-only (save CTA disabled, no delete action).
export const Completed: Story = {
  render: renderWithState('filled', OnboardingStepStatus.Completed),
}

// The shared /supporting-documents request failed: both sections show the error alert.
export const LoadError: Story = {
  render: renderWithState('error'),
}
