import { copyWorkItemsAsTeamsExport, copyWorkItemsOnly, extractWorkItemIdsFromClipboard } from './work-items-clipboard.utils'
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

const createDataTransfer = (data: Record<string, string>): DataTransfer => ({
  getData: (type: string) => data[type] ?? '',
}) as DataTransfer

describe('extractWorkItemIdsFromClipboard', () => {
  describe('from HTML (Azure DevOps URLs)', () => {
    it('should extract a single work item ID from an Azure DevOps URL', () => {
      const dt = createDataTransfer({
        'text/html': '<a href="https://dev.azure.com/org/project/_workitems/edit/12345">WI 12345</a>',
        'text': 'WI 12345',
      })

      expect(extractWorkItemIdsFromClipboard(dt)).toEqual(['12345'])
    })

    it('should extract multiple work item IDs from several URLs', () => {
      const dt = createDataTransfer({
        'text/html': `
          <a href="https://dev.azure.com/org/project/_workitems/edit/111">WI</a>
          <a href="https://dev.azure.com/org/project/_workitems/edit/222">WI</a>
          <a href="https://dev.azure.com/org/project/_workitems/edit/333">WI</a>
        `,
        'text': '',
      })

      expect(extractWorkItemIdsFromClipboard(dt)).toEqual(['111', '222', '333'])
    })

    it('should deduplicate IDs from HTML URLs', () => {
      const dt = createDataTransfer({
        'text/html': `
          <a href="/_workitems/edit/100">WI</a>
          <a href="/_workitems/edit/100">WI</a>
        `,
        'text': '',
      })

      expect(extractWorkItemIdsFromClipboard(dt)).toEqual(['100'])
    })

    it('should prioritize HTML extraction over text when HTML contains valid URLs', () => {
      const dt = createDataTransfer({
        'text/html': '<a href="/_workitems/edit/999">WI</a>',
        'text': 'Bug 12345 #67890',
      })

      expect(extractWorkItemIdsFromClipboard(dt)).toEqual(['999'])
    })
  })

  describe('from plain text (work item patterns)', () => {
    it('should extract IDs from "User Story XXXXX" pattern', () => {
      const dt = createDataTransfer({ 'text': 'User Story 60109' })

      expect(extractWorkItemIdsFromClipboard(dt)).toEqual(['60109'])
    })

    it('should extract IDs from "Bug XXXXX" pattern', () => {
      const dt = createDataTransfer({ 'text': 'Bug 42000' })

      expect(extractWorkItemIdsFromClipboard(dt)).toEqual(['42000'])
    })

    it('should extract IDs from "Enabler Story XXXXX" pattern', () => {
      const dt = createDataTransfer({ 'text': 'Enabler Story 55555' })

      expect(extractWorkItemIdsFromClipboard(dt)).toEqual(['55555'])
    })

    it.each([
      'Task', 'Feature', 'Epic', 'Issue', 'Incident',
    ])('should extract IDs from "%s XXXXX" pattern', (type) => {
      const dt = createDataTransfer({ 'text': `${type} 77777` })

      expect(extractWorkItemIdsFromClipboard(dt)).toEqual(['77777'])
    })

    it('should be case-insensitive for work item types', () => {
      const dt = createDataTransfer({ 'text': 'user story 60109 BUG 12345' })

      expect(extractWorkItemIdsFromClipboard(dt)).toEqual(['60109', '12345'])
    })

    it('should extract IDs from hash notation (#XXXXX)', () => {
      const dt = createDataTransfer({ 'text': '#12345 #67890' })

      expect(extractWorkItemIdsFromClipboard(dt)).toEqual(['12345', '67890'])
    })

    it('should extract IDs from mixed patterns', () => {
      const dt = createDataTransfer({ 'text': 'User Story 60109 and #42000 plus Bug 12345' })

      expect(extractWorkItemIdsFromClipboard(dt)).toEqual(['60109', '12345', '42000'])
    })

    it('should deduplicate IDs from text patterns', () => {
      const dt = createDataTransfer({ 'text': '#100 User Story 100' })

      expect(extractWorkItemIdsFromClipboard(dt)).toEqual(['100'])
    })
  })

  describe('edge cases', () => {
    it('should return an empty array when no data is available', () => {
      const dt = createDataTransfer({})

      expect(extractWorkItemIdsFromClipboard(dt)).toEqual([])
    })

    it('should return an empty array when text contains no matching patterns', () => {
      const dt = createDataTransfer({ 'text': 'no work items here' })

      expect(extractWorkItemIdsFromClipboard(dt)).toEqual([])
    })

    it('should fall back to text when HTML is present but contains no URLs', () => {
      const dt = createDataTransfer({
        'text/html': '<p>Just some text without URLs</p>',
        'text': 'Bug 55555',
      })

      expect(extractWorkItemIdsFromClipboard(dt)).toEqual(['55555'])
    })
  })
})

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

    expect(displayNotification).toHaveBeenCalledWith('success', 'Message MEP copié dans le presse-papiers')
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

describe('copyWorkItemsOnly', () => {
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

  it('does not include MEP header in HTML', async () => {
    await copyWorkItemsOnly({
      workItemsByTeam: mockWorkItemsByTeam,
      sortedTeamNames: mockSortedTeamNames,
    })

    expect(capturedHtml).not.toContain('Statut livraison')
    expect(capturedHtml).not.toContain('Validé par')
    expect(capturedHtml).not.toContain('Cible livraison')
  })

  it('includes repository name in brackets in HTML when provided', async () => {
    await copyWorkItemsOnly({
      workItemsByTeam: mockWorkItemsByTeam,
      sortedTeamNames: mockSortedTeamNames,
      repositoryName: 'Pulse.Web',
    })

    expect(capturedHtml).toContain('<strong>[Pulse.Web]</strong>')
  })

  it('does not include repository name in HTML when not provided', async () => {
    await copyWorkItemsOnly({
      workItemsByTeam: mockWorkItemsByTeam,
      sortedTeamNames: mockSortedTeamNames,
    })

    expect(capturedHtml).not.toContain('<p><strong>[Pulse.Web]</strong></p>')
  })

  it('formats teams with work item counts in HTML', async () => {
    await copyWorkItemsOnly({
      workItemsByTeam: mockWorkItemsByTeam,
      sortedTeamNames: mockSortedTeamNames,
    })

    expect(capturedHtml).toContain('<strong>Team Alpha</strong> (2 work items)')
    expect(capturedHtml).toContain('<strong>Team Beta</strong> (1 work item)')
  })

  it('includes work item links and details in HTML', async () => {
    await copyWorkItemsOnly({
      workItemsByTeam: mockWorkItemsByTeam,
      sortedTeamNames: mockSortedTeamNames,
    })

    expect(capturedHtml).toContain('href="https://dev.azure.com/1"')
    expect(capturedHtml).toContain('#1')
    expect(capturedHtml).toContain('Feature A')
  })

  it('includes repository name in brackets in plain text when provided', async () => {
    await copyWorkItemsOnly({
      workItemsByTeam: mockWorkItemsByTeam,
      sortedTeamNames: mockSortedTeamNames,
      repositoryName: 'Pulse.Web',
    })

    expect(capturedText).toMatch(/^\[Pulse\.Web\]/)
  })

  it('does not include MEP header in plain text', async () => {
    await copyWorkItemsOnly({
      workItemsByTeam: mockWorkItemsByTeam,
      sortedTeamNames: mockSortedTeamNames,
    })

    expect(capturedText).not.toContain('Statut livraison')
    expect(capturedText).not.toContain('Validé par')
  })

  it('formats teams with work item counts in plain text', async () => {
    await copyWorkItemsOnly({
      workItemsByTeam: mockWorkItemsByTeam,
      sortedTeamNames: mockSortedTeamNames,
    })

    expect(capturedText).toContain('Team Alpha (2 work items)')
    expect(capturedText).toContain('Team Beta (1 work item)')
  })

  it('displays Liste de work items for empty team names', async () => {
    const workItemsWithEmptyTeam: WorkItemsByTeam = {
      '': [{ id: 1, title: 'Item', type: 'Task', state: 'Active', webUrl: 'https://example.com', team: '' }],
    }

    await copyWorkItemsOnly({
      workItemsByTeam: workItemsWithEmptyTeam,
      sortedTeamNames: [''],
    })

    expect(capturedHtml).toContain('<strong>Liste de work items</strong>')
    expect(capturedText).toContain('Liste de work items')
  })

  it('shows success notification on successful copy', async () => {
    await copyWorkItemsOnly({
      workItemsByTeam: mockWorkItemsByTeam,
      sortedTeamNames: mockSortedTeamNames,
    })

    expect(displayNotification).toHaveBeenCalledWith('success', 'Work items copiés dans le presse-papiers')
  })

  it('shows error notification on clipboard failure', async () => {
    mockWrite.mockRejectedValueOnce(new Error('Clipboard error'))

    await copyWorkItemsOnly({
      workItemsByTeam: mockWorkItemsByTeam,
      sortedTeamNames: mockSortedTeamNames,
    })

    expect(displayNotification).toHaveBeenCalledWith('error', 'Impossible de copier dans le presse-papiers')
  })
})
