import { copyWorkItemsAsTeamsExport } from './work-items-clipboard.utils'
import { displayNotification } from '@pulse/styleguide'
import type { WorkItemsByTeam } from '@backoffice/types/azure-devops.type'

vi.mock('@pulse/styleguide', () => ({
  displayNotification: vi.fn(),
}))

const mockWorkItemsByTeam: WorkItemsByTeam = {
  'Team Alpha': [
    { id: 1, title: 'Feature A', type: 'User Story', state: 'Closed', webUrl: 'https://dev.azure.com/1', team: 'Team Alpha' },
    { id: 2, title: 'Bug B', type: 'Bug', state: 'Active', webUrl: 'https://dev.azure.com/2', team: 'Team Alpha' },
  ],
  'Team Beta': [
    { id: 3, title: 'Task C', type: 'Task', state: 'Validated', webUrl: 'https://dev.azure.com/3', team: 'Team Beta' },
  ],
}

const mockSortedTeamNames = ['Team Alpha', 'Team Beta']

describe('copyWorkItemsAsTeamsExport', () => {
  let capturedHtml = ''
  let capturedText = ''
  let mockWrite: ReturnType<typeof vi.fn>

  beforeEach(() => {
    vi.clearAllMocks()
    capturedHtml = ''
    capturedText = ''

    mockWrite = vi.fn().mockResolvedValue(undefined)

    vi.stubGlobal('navigator', { clipboard: { write: mockWrite } })
    vi.stubGlobal('Blob', class MockBlob {
      content: string
      type: string
      constructor(parts: string[], options: { type: string }) {
        this.content = parts.join('')
        this.type = options.type
        if (options.type === 'text/html') {
          capturedHtml = this.content
        } else if (options.type === 'text/plain') {
          capturedText = this.content
        }
      }
    })
    vi.stubGlobal('ClipboardItem', function ClipboardItem(items: Record<string, unknown>) {
      return items
    })
  })

  it('includes the header with delivery status fields in HTML', async () => {
    await copyWorkItemsAsTeamsExport({
      workItemsByTeam: mockWorkItemsByTeam,
      sortedTeamNames: mockSortedTeamNames,
    })

    expect(capturedHtml).toContain('Statut livraison')
    expect(capturedHtml).toContain('Validé par')
    expect(capturedHtml).toContain('Cible livraison')
    expect(capturedHtml).toContain('Date réelle livraison')
  })

  it('formats teams with work item counts in HTML', async () => {
    await copyWorkItemsAsTeamsExport({
      workItemsByTeam: mockWorkItemsByTeam,
      sortedTeamNames: mockSortedTeamNames,
    })

    expect(capturedHtml).toContain('<strong>Team Alpha</strong> (2 work items)')
    expect(capturedHtml).toContain('<strong>Team Beta</strong> (1 work item)')
  })

  it('includes work item links and details in HTML', async () => {
    await copyWorkItemsAsTeamsExport({
      workItemsByTeam: mockWorkItemsByTeam,
      sortedTeamNames: mockSortedTeamNames,
    })

    expect(capturedHtml).toContain('href="https://dev.azure.com/1"')
    expect(capturedHtml).toContain('#1')
    expect(capturedHtml).toContain('Feature A')
  })

  it('adds warning icon for non-completed work items in HTML', async () => {
    await copyWorkItemsAsTeamsExport({
      workItemsByTeam: mockWorkItemsByTeam,
      sortedTeamNames: mockSortedTeamNames,
    })

    expect(capturedHtml).toContain('<li>⚠️ <a href="https://dev.azure.com/2"')
    expect(capturedHtml).toContain('Active ⚠️')
  })

  it('does not add warning icon for completed work items in HTML', async () => {
    await copyWorkItemsAsTeamsExport({
      workItemsByTeam: mockWorkItemsByTeam,
      sortedTeamNames: mockSortedTeamNames,
    })

    expect(capturedHtml).toContain('<li><a href="https://dev.azure.com/1"')
  })

  it('includes the header in plain text', async () => {
    await copyWorkItemsAsTeamsExport({
      workItemsByTeam: mockWorkItemsByTeam,
      sortedTeamNames: mockSortedTeamNames,
    })

    expect(capturedText).toContain('Statut livraison')
    expect(capturedText).toContain('Validé par')
  })

  it('formats teams with work item counts in plain text', async () => {
    await copyWorkItemsAsTeamsExport({
      workItemsByTeam: mockWorkItemsByTeam,
      sortedTeamNames: mockSortedTeamNames,
    })

    expect(capturedText).toContain('Team Alpha (2 work items)')
    expect(capturedText).toContain('Team Beta (1 work item)')
  })

  it('includes work item details with URLs in plain text', async () => {
    await copyWorkItemsAsTeamsExport({
      workItemsByTeam: mockWorkItemsByTeam,
      sortedTeamNames: mockSortedTeamNames,
    })

    expect(capturedText).toContain('#1 User Story - Feature A')
    expect(capturedText).toContain('https://dev.azure.com/1')
  })

  it('shows success notification on successful copy', async () => {
    await copyWorkItemsAsTeamsExport({
      workItemsByTeam: mockWorkItemsByTeam,
      sortedTeamNames: mockSortedTeamNames,
    })

    expect(displayNotification).toHaveBeenCalledWith('success', 'Export copié dans le presse-papiers')
  })

  it('shows error notification on clipboard failure', async () => {
    mockWrite.mockRejectedValueOnce(new Error('Clipboard error'))

    await copyWorkItemsAsTeamsExport({
      workItemsByTeam: mockWorkItemsByTeam,
      sortedTeamNames: mockSortedTeamNames,
    })

    expect(displayNotification).toHaveBeenCalledWith('error', 'Impossible de copier dans le presse-papiers')
  })
})
