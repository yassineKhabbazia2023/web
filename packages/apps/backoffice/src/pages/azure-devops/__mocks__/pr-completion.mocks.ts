import type { AzureDevOpsPullRequest } from '@backoffice/types/azure-devops.type'

export const buildMockPr = (overrides: Partial<AzureDevOpsPullRequest> = {}): AzureDevOpsPullRequest => ({
  pullRequestId: 1,
  title: 'Test PR',
  creationDate: '2024-01-15T10:00:00Z',
  closedDate: '2024-01-15T14:00:00Z',
  status: 'completed',
  isDraft: false,
  repository: { id: 'repo-1', name: 'Pulse.Web' },
  createdBy: { displayName: 'John Doe', uniqueName: 'john@example.com' },
  sourceRefName: 'refs/heads/feature/test',
  targetRefName: 'refs/heads/main',
  ...overrides,
})
