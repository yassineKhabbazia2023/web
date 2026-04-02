import { displayNotification } from '@pulse/styleguide'
import type { CopyWorkItemsToClipboardOptions, WorkItem } from '@backoffice/types/azure-devops.type'
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

const formatForTeamsHtml = (options: CopyWorkItemsToClipboardOptions): string => {
  const { workItemsByTeam, sortedTeamNames } = options
  const { html: header } = buildTeamsExportHeader()
  const htmlParts: string[] = [header]

  for (const teamName of sortedTeamNames) {
    const items = workItemsByTeam[teamName]
    const itemCount = items.length
    const pluralSuffix = itemCount > 1 ? 's' : ''

    htmlParts.push(
      `<p><strong>${escapeHtml(teamName)}</strong> (${itemCount} work item${pluralSuffix})</p>`,
      '<ul>',
      ...items.map(formatWorkItemHtml),
      '</ul>',
    )
  }

  return htmlParts.join('')
}

const formatForTeamsText = (options: CopyWorkItemsToClipboardOptions): string => {
  const { workItemsByTeam, sortedTeamNames } = options
  const { text: header } = buildTeamsExportHeader()
  const lines: string[] = [header]

  for (const teamName of sortedTeamNames) {
    const items = workItemsByTeam[teamName]
    const itemCount = items.length
    const pluralSuffix = itemCount > 1 ? 's' : ''

    lines.push(
      `${teamName} (${itemCount} work item${pluralSuffix})`,
      ...items.flatMap(formatWorkItemText),
      '',
    )
  }

  return lines.join('\n').trim()
}

const formatWorkItemsOnlyHtml = (options: CopyWorkItemsToClipboardOptions): string => {
  const { workItemsByTeam, sortedTeamNames, repositoryName } = options
  const htmlParts: string[] = []

  if (repositoryName !== undefined) {
    htmlParts.push(`<p><strong>[${escapeHtml(repositoryName)}]</strong></p>`)
  }

  for (const teamName of sortedTeamNames) {
    const items = workItemsByTeam[teamName]
    const displayName = teamName.trim() === '' ? 'Liste de work items' : teamName
    const itemCount = items.length
    const pluralSuffix = itemCount > 1 ? 's' : ''

    htmlParts.push(
      `<p><strong>${escapeHtml(displayName)}</strong> (${itemCount} work item${pluralSuffix})</p>`,
      '<ul>',
      ...items.map(formatWorkItemHtml),
      '</ul>',
    )
  }

  return htmlParts.join('')
}

const formatWorkItemsOnlyText = (options: CopyWorkItemsToClipboardOptions): string => {
  const { workItemsByTeam, sortedTeamNames, repositoryName } = options
  const lines: string[] = []

  if (repositoryName !== undefined) {
    lines.push(`[${repositoryName}]`, '')
  }

  for (const teamName of sortedTeamNames) {
    const items = workItemsByTeam[teamName]
    const displayName = teamName.trim() === '' ? 'Liste de work items' : teamName
    const itemCount = items.length
    const pluralSuffix = itemCount > 1 ? 's' : ''

    lines.push(
      `${displayName} (${itemCount} work item${pluralSuffix})`,
      ...items.flatMap(formatWorkItemText),
      '',
    )
  }

  return lines.join('\n').trim()
}

export const copyWorkItemsAsTeamsExport = async (options: CopyWorkItemsToClipboardOptions): Promise<void> => {
  const htmlContent = formatForTeamsHtml(options)
  const textContent = formatForTeamsText(options)

  try {
    const htmlBlob = new Blob([htmlContent], { type: 'text/html' })
    const textBlob = new Blob([textContent], { type: 'text/plain' })

    await navigator.clipboard.write([
      new ClipboardItem({
        'text/html': htmlBlob,
        'text/plain': textBlob,
      }),
    ])
    displayNotification('success', 'Message MEP copié dans le presse-papiers')
  } catch {
    displayNotification('error', 'Impossible de copier dans le presse-papiers')
  }
}

export const copyWorkItemsOnly = async (options: CopyWorkItemsToClipboardOptions): Promise<void> => {
  const htmlContent = formatWorkItemsOnlyHtml(options)
  const textContent = formatWorkItemsOnlyText(options)

  try {
    const htmlBlob = new Blob([htmlContent], { type: 'text/html' })
    const textBlob = new Blob([textContent], { type: 'text/plain' })

    await navigator.clipboard.write([
      new ClipboardItem({
        'text/html': htmlBlob,
        'text/plain': textBlob,
      }),
    ])
    displayNotification('success', 'Work items copiés dans le presse-papiers')
  } catch {
    displayNotification('error', 'Impossible de copier dans le presse-papiers')
  }
}
