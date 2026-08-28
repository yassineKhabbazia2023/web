import { displayNotification } from '@pulse/styleguide'
import type { CopyWorkItemsToClipboardOptions, WorkItem, WorkItemsByTeam } from '@backoffice/types/azure-devops.type'
import { WORK_ITEM_COMPLETED_STATES } from '@backoffice/constants/azure-devops.const'
import { escapeHtml } from '@pulse/toolbox/utils/html'

export const extractWorkItemIdsFromClipboard = (clipboardData: DataTransfer): string[] => {
  const html = clipboardData.getData('text/html')
  if (html !== '') {
    const urlMatches = [...html.matchAll(/_workitems\/edit\/(\d+)/gi)]
    if (urlMatches.length > 0) {
      return [...new Set(urlMatches.map((match) => match[1]))]
    }
  }

  const text = clipboardData.getData('text')
  const workItemPattern = /(?:User Story|Bug|Task|Feature|Epic|Issue|Enabler Story|Incident)\s+(\d+)/gi
  const hashPattern = /#(\d+)/g
  const matches = [
    ...text.matchAll(workItemPattern),
    ...text.matchAll(hashPattern),
  ].map((match) => match[1])

  return [...new Set(matches)]
}

const isWorkItemCompleted = (state: string): boolean => {
  return (WORK_ITEM_COMPLETED_STATES as readonly string[]).includes(state)
}

// Multi-repository options carry workItemsByRepository/sortedRepositoryNames instead of a flat workItemsByTeam.
const hasRepositoryGroups = (options: CopyWorkItemsToClipboardOptions): boolean => {
  return options.workItemsByRepository !== undefined
    && options.sortedRepositoryNames !== undefined
    && options.sortedRepositoryNames.length > 0
}

const getSortedTeamNamesByCount = (workItemsByTeam: WorkItemsByTeam): string[] => {
  return Object.keys(workItemsByTeam).sort((a, b) => workItemsByTeam[b].length - workItemsByTeam[a].length)
}

const buildTeamsExportHeader = (): { html: string, text: string } => {
  const html = `
<p>🚄 <strong>Statut livraison</strong> : proposition</p>
<p>✅ <strong>Validé par</strong> : </p>
<p>🎯 <strong>Cible livraison</strong> : </p>
<p>🚀 <strong>Date réelle livraison</strong> : </p>
<p>🛑 <strong>Indisponibilité de la plateforme</strong> : </p>
<p>📖 <strong>Contenu</strong> : </p>
<br/>
`.trim()

  const text = `🚄 Statut livraison : proposition
✅ Validé par :
🎯 Cible livraison :
🚀 Date réelle livraison :
🛑 Indisponibilité de la plateforme :
📖 Contenu :
`

  return { html, text }
}

const formatWorkItemHtml = (item: WorkItem): string => {
  const isCompleted = isWorkItemCompleted(item.state)
  const warningIcon = isCompleted ? '' : '⚠️ '
  const stateDisplay = isCompleted ? item.state : `${item.state} ⚠️`
  return `<li>${warningIcon}<a href="${escapeHtml(item.webUrl)}">#${item.id}</a> ${escapeHtml(item.type)} - ${escapeHtml(item.title)} (${escapeHtml(stateDisplay)})</li>`
}

const formatWorkItemText = (item: WorkItem): string[] => {
  const isCompleted = isWorkItemCompleted(item.state)
  const warningIcon = isCompleted ? '' : '⚠️ '
  const stateDisplay = isCompleted ? item.state : `${item.state} ⚠️`
  return [
    `  ${warningIcon}#${item.id} ${item.type} - ${item.title} (${stateDisplay})`,
    `    ${item.webUrl}`,
  ]
}

const formatTeamBlockHtml = (teamName: string, items: WorkItem[]): string[] => {
  const itemCount = items.length
  const pluralSuffix = itemCount > 1 ? 's' : ''

  return [
    `<p><strong>${escapeHtml(teamName)}</strong> (${itemCount} work item${pluralSuffix})</p>`,
    '<ul>',
    ...items.map(formatWorkItemHtml),
    '</ul>',
  ]
}

const formatTeamBlockText = (teamName: string, items: WorkItem[]): string[] => {
  const itemCount = items.length
  const pluralSuffix = itemCount > 1 ? 's' : ''

  return [
    `${teamName} (${itemCount} work item${pluralSuffix})`,
    ...items.flatMap(formatWorkItemText),
    '',
  ]
}

const formatForTeamsHtml = (options: CopyWorkItemsToClipboardOptions): string => {
  const { html: header } = buildTeamsExportHeader()
  const htmlParts: string[] = [header]

  if (hasRepositoryGroups(options)) {
    for (const repoName of options.sortedRepositoryNames!) {
      const workItemsByTeam = options.workItemsByRepository![repoName]
      htmlParts.push(`<p><strong>[${escapeHtml(repoName)}]</strong></p>`)
      for (const teamName of getSortedTeamNamesByCount(workItemsByTeam)) {
        htmlParts.push(...formatTeamBlockHtml(teamName, workItemsByTeam[teamName]))
      }
    }
  } else {
    for (const teamName of options.sortedTeamNames) {
      htmlParts.push(...formatTeamBlockHtml(teamName, options.workItemsByTeam[teamName]))
    }
  }

  return htmlParts.join('')
}

const formatForTeamsText = (options: CopyWorkItemsToClipboardOptions): string => {
  const { text: header } = buildTeamsExportHeader()
  const lines: string[] = [header]

  if (hasRepositoryGroups(options)) {
    for (const repoName of options.sortedRepositoryNames!) {
      const workItemsByTeam = options.workItemsByRepository![repoName]
      lines.push(`[${repoName}]`, '')
      for (const teamName of getSortedTeamNamesByCount(workItemsByTeam)) {
        lines.push(...formatTeamBlockText(teamName, workItemsByTeam[teamName]))
      }
    }
  } else {
    for (const teamName of options.sortedTeamNames) {
      lines.push(...formatTeamBlockText(teamName, options.workItemsByTeam[teamName]))
    }
  }

  return lines.join('\n').trim()
}

const getTeamDisplayName = (teamName: string): string => {
  return teamName.trim() === '' ? 'Liste de work items' : teamName
}

const formatWorkItemsOnlyTeamBlockHtml = (teamName: string, items: WorkItem[]): string[] => {
  return formatTeamBlockHtml(getTeamDisplayName(teamName), items)
}

const formatWorkItemsOnlyTeamBlockText = (teamName: string, items: WorkItem[]): string[] => {
  return formatTeamBlockText(getTeamDisplayName(teamName), items)
}

const formatWorkItemsOnlyHtml = (options: CopyWorkItemsToClipboardOptions): string => {
  const htmlParts: string[] = []

  if (hasRepositoryGroups(options)) {
    for (const repoName of options.sortedRepositoryNames!) {
      const workItemsByTeam = options.workItemsByRepository![repoName]
      htmlParts.push(`<p><strong>[${escapeHtml(repoName)}]</strong></p>`)
      for (const teamName of getSortedTeamNamesByCount(workItemsByTeam)) {
        htmlParts.push(...formatWorkItemsOnlyTeamBlockHtml(teamName, workItemsByTeam[teamName]))
      }
    }
  } else {
    if (options.repositoryName !== undefined) {
      htmlParts.push(`<p><strong>[${escapeHtml(options.repositoryName)}]</strong></p>`)
    }
    for (const teamName of options.sortedTeamNames) {
      htmlParts.push(...formatWorkItemsOnlyTeamBlockHtml(teamName, options.workItemsByTeam[teamName]))
    }
  }

  return htmlParts.join('')
}

const formatWorkItemsOnlyText = (options: CopyWorkItemsToClipboardOptions): string => {
  const lines: string[] = []

  if (hasRepositoryGroups(options)) {
    for (const repoName of options.sortedRepositoryNames!) {
      const workItemsByTeam = options.workItemsByRepository![repoName]
      lines.push(`[${repoName}]`, '')
      for (const teamName of getSortedTeamNamesByCount(workItemsByTeam)) {
        lines.push(...formatWorkItemsOnlyTeamBlockText(teamName, workItemsByTeam[teamName]))
      }
    }
  } else {
    if (options.repositoryName !== undefined) {
      lines.push(`[${options.repositoryName}]`, '')
    }
    for (const teamName of options.sortedTeamNames) {
      lines.push(...formatWorkItemsOnlyTeamBlockText(teamName, options.workItemsByTeam[teamName]))
    }
  }

  return lines.join('\n').trim()
}

// Copies rich HTML by selecting a real (offscreen) DOM node and using the legacy execCommand('copy').
// Some desktop paste targets (notably Microsoft Teams) don't reliably honor HTML written through the
// modern navigator.clipboard.write() API, but do accept a copy that comes from an actual DOM selection.
const copyHtmlViaDomSelection = (html: string): boolean => {
  const container = document.createElement('div')
  container.innerHTML = html
  container.style.position = 'fixed'
  container.style.top = '0'
  container.style.left = '-9999px'
  container.style.whiteSpace = 'pre-wrap'
  document.body.appendChild(container)

  const selection = window.getSelection()
  if (selection === null) {
    document.body.removeChild(container)
    return false
  }

  const range = document.createRange()
  range.selectNodeContents(container)
  selection.removeAllRanges()
  selection.addRange(range)

  let succeeded: boolean
  try {
    succeeded = document.execCommand('copy')
  } catch {
    succeeded = false
  }

  selection.removeAllRanges()
  document.body.removeChild(container)
  return succeeded
}

const copyHtmlToClipboard = async (htmlContent: string, textContent: string): Promise<void> => {
  if (copyHtmlViaDomSelection(htmlContent)) {
    return
  }

  // Fallback for browsers without execCommand support
  const htmlBlob = new Blob([htmlContent], { type: 'text/html' })
  const textBlob = new Blob([textContent], { type: 'text/plain' })

  await navigator.clipboard.write([
    new ClipboardItem({
      'text/html': htmlBlob,
      'text/plain': textBlob,
    }),
  ])
}

export const copyWorkItemsAsTeamsExport = async (options: CopyWorkItemsToClipboardOptions): Promise<void> => {
  const htmlContent = formatForTeamsHtml(options)
  const textContent = formatForTeamsText(options)

  try {
    await copyHtmlToClipboard(htmlContent, textContent)
    displayNotification('success', 'Message MEP copié dans le presse-papiers')
  } catch {
    displayNotification('error', 'Impossible de copier dans le presse-papiers')
  }
}

export const copyWorkItemsOnly = async (options: CopyWorkItemsToClipboardOptions): Promise<void> => {
  const htmlContent = formatWorkItemsOnlyHtml(options)
  const textContent = formatWorkItemsOnlyText(options)

  try {
    await copyHtmlToClipboard(htmlContent, textContent)
    displayNotification('success', 'Work items copiés dans le presse-papiers')
  } catch {
    displayNotification('error', 'Impossible de copier dans le presse-papiers')
  }
}
