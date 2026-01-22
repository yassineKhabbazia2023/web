import { PennylaneService } from '@pulse/common/services/pennylane'
import { logger } from '@pulse/toolbox'

export async function openTermsPdfInNewTab(accountId: number): Promise<void> {
  try {
    const pdfData = await PennylaneService.getTermsContent(accountId)
    const blob = new Blob([pdfData], { type: 'application/pdf' })
    const fileURL = URL.createObjectURL(blob)
    window.open(fileURL)
  } catch {
    logger.error('Error opening terms PDF in new tab')
  }
}
