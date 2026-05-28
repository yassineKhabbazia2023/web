import { APP_NAME } from '@pulse/common/constants'
import { PennylaneService } from '@pulse/common/services/pennylane'
import { isMobileDevice, logger } from '@pulse/toolbox'

async function getTermsPdfBlob(accountId: number): Promise<Blob> {
  const pdfData = await PennylaneService.getTermsContent(accountId)
  return new Blob([pdfData], { type: 'application/pdf' })
}

/**
 * Opens the Pennylane terms PDF in a new browser tab.
 * On mobile devices, triggers a download instead since mobile browsers
 * don't handle embedded PDFs well (iOS shows only first page, Android may not display at all).
 * On desktop, uses an embedded viewer for compatibility with Edge and other browsers
 * that delegate PDF display to external plugins.
 */
export async function openTermsPdfInNewTab(accountId: number): Promise<void> {
  if (isMobileDevice()) {
    await downloadTermsPdf(accountId)
    return
  }

  const newTab = window.open('', '_blank')

  if (newTab === null) {
    logger.error('Failed to open new tab - popup may be blocked')
    return
  }

  try {
    const blob = await getTermsPdfBlob(accountId)
    const fileURL = URL.createObjectURL(blob)

    const doc = newTab.document
    doc.title = `Conditions Générales ${APP_NAME}`

    const style = doc.createElement('style')
    style.textContent = 'body, html { margin: 0; padding: 0; height: 100%; overflow: hidden; } embed { width: 100%; height: 100%; }'
    doc.head.appendChild(style)

    const embed = doc.createElement('embed')
    embed.src = fileURL
    embed.type = 'application/pdf'
    doc.body.appendChild(embed)
  } catch {
    newTab.close()
    logger.error('Error opening terms PDF in new tab')
  }
}

/**
 * Downloads the Pennylane terms PDF file.
 * Errors are caught and logged but not propagated to avoid blocking the user flow.
 */
export async function downloadTermsPdf(accountId: number): Promise<void> {
  try {
    const blob = await getTermsPdfBlob(accountId)
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = 'conditions-generales-rydge-conseil.pdf'
    link.click()
    // Delay revocation to allow the browser to start the download (especially on iOS Safari)
    setTimeout(() => URL.revokeObjectURL(link.href), 100)
  } catch {
    logger.error('Error downloading terms PDF')
  }
}
