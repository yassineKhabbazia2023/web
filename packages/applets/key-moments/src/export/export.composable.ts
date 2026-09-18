import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { logger } from '@pulse/toolbox'
import { downloadFile } from '@pulse/common/helpers'
import { displayNotification } from '@pulse/styleguide'
import { ExportFormat, OfferPriority } from '../enums/key-moments.enums'
import type { CustomerOfferPayload } from '../services/customer-key-moments.service.types'
import type { LinkedOffer, Report } from '../types/key-moments.types'
import type { DeckLabels } from './export.types'

/** Named after the entity and the exercice, so two exports never collide in the same folder. */
function exportFileName(siret: string, exerciceYear: string | undefined, format: ExportFormat): string {
  const year = exerciceYear === undefined ? '' : `-${exerciceYear}`

  return `moments-cles-${siret}${year}.${format}`
}

/**
 * The recommendations in the shape the export writes them, read from the ones
 * the client was served.
 *
 * Three fields the served payload does not carry are stated here rather than
 * guessed: it holds only what the client may see, so an offer that reached them
 * is by construction neither hidden nor withdrawn, and a degree that reached
 * them is one the firm chose to show. Nothing is inferred — the microservice
 * already made all three arbitrations before serving the page.
 */
function offersOf(offers: CustomerOfferPayload[]): LinkedOffer[] {
  return offers.map(offer => ({
    offerId: offer.offerId,
    title: offer.title,
    shortDescription: offer.shortDescription,
    categoryName: offer.categoryName,
    comment: offer.comment,
    benefitsComment: offer.benefitsComment,
    priority: offer.priority,
    isPriorityVisible: true,
    isHidden: false,
    isRetired: false,
  }))
}

/**
 * Exports the report as it is read: one page per row of the grid, every figure
 * written as text and tables. Only a chart travels as a picture — there is no
 * text in a drawing to hand over.
 *
 * The deck and the PDF are the same pages: the format settles which document
 * they are drawn into, and nothing else.
 *
 * Read off the client surface and nowhere else: what is exported is the key
 * moment as it was published, never the draft the editor is still holding.
 *
 * Nothing of the export is imported until it is asked for — neither the two
 * libraries nor the modules laying the pages out. The reader is drawn for the
 * client as much as for the collaborator, and only one of the two is ever
 * offered the gesture: a client who can never export must not carry the code
 * that would have done it.
 */
export function useExport() {
  const { t } = useI18n()

  const exportingFormat = ref<ExportFormat>()

  const isExportingDeck = computed(() => exportingFormat.value === ExportFormat.PPTX)
  const isExportingPdf = computed(() => exportingFormat.value === ExportFormat.PDF)

  /** Everything the pages write and only the page can translate. */
  function deckLabels(caption: string[]): DeckLabels {
    return {
      title: t('keyMoments.title'),
      caption,
      lineLabel: t('keyMoments.table.label'),
      assets: t('keyMoments.balanceSheet.assets'),
      liabilities: t('keyMoments.balanceSheet.liabilities'),
      narrativeStart: t('keyMoments.narrative.start'),
      narrativeEnd: t('keyMoments.narrative.end'),
      variation: t('keyMoments.cards.variation'),
      comment: t('keyMoments.comment.title'),
      continued: t('keyMoments.export.continued'),
      offersTitle: t('keyMoments.offers.title'),
      offersSubtitle: t('keyMoments.offers.subtitle'),
      offerPriorities: {
        [OfferPriority.PRIMARY]: t('keyMoments.offers.priority.primary'),
        [OfferPriority.SIGNIFICANT]: t('keyMoments.offers.priority.significant'),
        [OfferPriority.INFORMATIVE]: t('keyMoments.offers.priority.informative'),
      },
      offerComment: t('keyMoments.offers.card.commentTitle'),
      offerBenefitsComment: t('keyMoments.offers.card.benefitsCommentTitle'),
    }
  }

  /** `offers` defaults to none, matching a report served without that section. */
  async function exportReport(
    format: ExportFormat,
    report: Report,
    caption: string[],
    offers: CustomerOfferPayload[] = [],
    exerciceYear?: string,
  ): Promise<void> {
    if (exportingFormat.value !== undefined) {
      return
    }

    exportingFormat.value = format

    try {
      const [{ ExportManager }, { readReport }] = await Promise.all([
        import('./export.manager'),
        import('./export.utils'),
      ])

      const rows = await readReport(report)
      const labels = deckLabels(caption)
      const written = offersOf(offers)

      const file = format === ExportFormat.PDF
        ? await ExportManager.buildPdf(report, labels, rows, written)
        : await ExportManager.buildDeck(report, labels, rows, written)

      downloadFile(file, exportFileName(report.entity.siret, exerciceYear, format))
    } catch (error) {
      logger.error(`[KeyMoments] unable to export the report as a ${format} file`, error)
      displayNotification('error', t(`keyMoments.export.error.${format}`))
    } finally {
      exportingFormat.value = undefined
    }
  }

  return {
    isExportingDeck,
    isExportingPdf,
    exportReport,
  }
}
