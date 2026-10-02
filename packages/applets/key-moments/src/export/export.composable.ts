import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { logger } from '@pulse/toolbox'
import { downloadFile } from '@pulse/common/helpers'
import { displayNotification } from '@pulse/styleguide'
import { ExportFormat, RecommendationPriority, RecommendationRubric } from '../enums/key-moments.enums'
import type { Report } from '../types/key-moments.types'
import type { PublishedRecommendationPayload } from '../types/recommendations.types'
import type { DeckLabels } from './export.types'

/** Named after the entity and the exercice, so two exports never collide in the same folder. */
function exportFileName(siret: string, exerciceYear: string | undefined, format: ExportFormat): string {
  const year = exerciceYear === undefined ? '' : `-${exerciceYear}`

  return `moments-cles-${siret}${year}.${format}`
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
  function deckLabels(entityName: string, caption: string[]): DeckLabels {
    return {
      title: t('keyMoments.title'),
      entityName,
      caption,
      lineLabel: t('keyMoments.table.label'),
      assets: t('keyMoments.balanceSheet.assets'),
      liabilities: t('keyMoments.balanceSheet.liabilities'),
      narrativeStart: t('keyMoments.narrative.start'),
      narrativeEnd: t('keyMoments.narrative.end'),
      variation: t('keyMoments.cards.variation'),
      comment: t('keyMoments.comment.title'),
      continued: t('keyMoments.export.continued'),
      recommendationsTitle: t('keyMoments.recommendations.title'),
      recommendationsSubtitle: t('keyMoments.recommendations.subtitle'),
      priorities: {
        [RecommendationPriority.PRIMARY]: t('keyMoments.recommendations.priority.primary'),
        [RecommendationPriority.SIGNIFICANT]: t('keyMoments.recommendations.priority.significant'),
        [RecommendationPriority.INFORMATIVE]: t('keyMoments.recommendations.priority.informative'),
      },
      rubrics: Object.fromEntries(Object.values(RecommendationRubric)
        .map(rubric => [rubric, t(`keyMoments.recommendations.rubrics.${rubric}`)])) as Record<RecommendationRubric, string>,
      observations: t('keyMoments.recommendations.customer.observations'),
      risk: t('keyMoments.recommendations.customer.risk'),
      recommendation: t('keyMoments.recommendations.customer.recommendation'),
      offers: t('keyMoments.recommendations.export.offers'),
    }
  }

  async function exportReport(
    format: ExportFormat,
    report: Report,
    entityName: string,
    caption: string[],
    recommendations: PublishedRecommendationPayload[],
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
      const labels = deckLabels(entityName, caption)

      const file = format === ExportFormat.PDF
        ? await ExportManager.buildPdf(labels, rows, recommendations)
        : await ExportManager.buildDeck(labels, rows, recommendations)

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
