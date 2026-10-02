import { onMounted, ref } from 'vue'
import { logger } from '@pulse/toolbox'
import { HTTP_RESPONSES } from '@pulse/common/constants'
import { useCurrentEntityStore } from '@pulse/common/stores'
import { useEntityName } from '../../composables/use-entity-name.composable'
import { CurrencyDisplay } from '../../enums/key-moments.enums'
import { assembleDataset } from '../../utils/data.utils'
import { ReportManager } from '../../managers/report.manager'
import { CustomerKeyMomentsService } from '../../services/customer-key-moments.service'
import { KeyMomentsTracking } from '../../services/key-moments.tracking'
import { readApiStatus } from '../../utils/api-error.utils'
import type { CustomerKeyMomentSummaryPayload } from '../../services/customer-key-moments.service.types'
import type {
  ClosingEntity,
  Dataset,
  Screen,
  Template,
} from '../../types/key-moments.types'
import type { PublishedRecommendationPayload } from '../../types/recommendations.types'

/**
 * Nothing that amounts to an absence becomes an error.
 *
 * A `404` covers three cases the microservice deliberately does not tell apart
 * — unknown exercice, exercice of another account, no active publication — and
 * a `403` says the domain is switched off. Both empty the page rather than
 * shouting at a reader who has done nothing wrong. The `ProblemDetails` the
 * `404` carries is never displayed: it is indistinct by design.
 */
function isAbsence(error: unknown): boolean {
  const status = readApiStatus(error)

  return status === HTTP_RESPONSES.NOT_FOUND || status === HTTP_RESPONSES.FORBIDDEN
}

/**
 * The published key moment as the client reads it: what the firm arbitrated,
 * under the reading it arbitrated it in.
 *
 * The client never names a delivery. Every call is addressed by an account and
 * an exercice, and the server resolves the publication active on it — which is
 * what keeps an unpublished closing out of reach.
 *
 * `isTracked` says whether a display is reported to analytics: a collaborator
 * reading the page through the preview is not a client reading it.
 */
export function useCustomerKeyMoments(
  entityId: number | null,
  initialExerciceId?: number,
  options: { isTracked?: boolean } = {},
) {
  const currentEntityStore = useCurrentEntityStore()
  const { entityName } = useEntityName()
  const isTracked = options.isTracked ?? true

  /** Bound to a const so that the null guard narrows inside the loaders. */
  const accountId = entityId

  const isLoading = ref(true)
  const hasError = ref(false)
  /** Nothing to read, which is a normal state and never a failure */
  const isEmpty = ref(false)

  /** The exercices with an active publication, as the server sorted them */
  const exerciceCatalogue = ref<CustomerKeyMomentSummaryPayload[]>([])
  const selectedExerciceId = ref<number>()

  const screens = ref<Screen[]>([])
  /** Whose figures are read, as the closing named the firm's client */
  const entity = ref<ClosingEntity>()
  const publishedAt = ref<string>()
  /** What the firm recommends, in order, frozen by the publication */
  const recommendations = ref<PublishedRecommendationPayload[]>([])

  /** Locale the closing was produced in, which every date of the page reads */
  const locale = ref('fr-FR')

  /**
   * Opens on the unit the firm published in, and stays in the reader's hands
   * afterwards: a reading choice, which the publication only defaults.
   */
  const isInThousands = ref(false)

  /**
   * What the open exercice is built from, kept so that changing the unit
   * redraws the page without a round trip to the server.
   */
  let openedSources: {
    dataset: Dataset
    template: Template
    referenceKey: string | undefined
  } | undefined

  /**
   * The retained texts replace those of the closing. `buildReport` reads the
   * comments of the dataset and nowhere else, so this is the single door an
   * editorial text comes through: left to the closing, the page would show
   * the delivered wording — plausible, complete, and not what was published.
   */
  function drawReport() {
    if (openedSources === undefined) {
      return
    }

    const report = ReportManager.buildReport(
      openedSources.dataset,
      openedSources.template,
      {
        // a section the firm hid is gone, where the collaborator surface keeps
        // it faded to carry the button that brings it back
        keepHidden: false,
        inThousands: isInThousands.value,
        referenceKey: openedSources.referenceKey,
      },
    )

    screens.value = report.screens
    entity.value = report.entity
  }

  /** Reading in thousands only changes how the figures are written. */
  function toggleThousands(inThousands: boolean) {
    isInThousands.value = inThousands
    drawReport()
  }

  /**
   * Reads one exercice whole: the arbitration, the figures, the gabarit and the
   * vocabulary at once. None of the four depends on another, so none waits.
   */
  async function openExercice(exerciceId: number) {
    if (accountId === null) {
      return
    }

    selectedExerciceId.value = exerciceId

    const [keyMoment, closing, template, indicators] = await Promise.all([
      CustomerKeyMomentsService.getKeyMoment(accountId, exerciceId),
      CustomerKeyMomentsService.getKeyMomentDocument(accountId, exerciceId),
      CustomerKeyMomentsService.getKeyMomentTemplate(accountId, exerciceId),
      CustomerKeyMomentsService.getIndicators(),
    ])

    const dataset = assembleDataset(indicators, closing)

    publishedAt.value = keyMoment.publishedAt
    locale.value = dataset.metadata.locale
    // A key moment published before the recommendations has none
    recommendations.value = keyMoment.recommendations ?? []
    isInThousands.value = keyMoment.preferenceCurrencyDisplay === CurrencyDisplay.THOUSANDS

    openedSources = {
      dataset: { ...dataset, comments: keyMoment.comments },
      template,
      referenceKey: keyMoment.preferenceComparisonExercice ?? undefined,
    }
    drawReport()

    /**
     * A publication that hides every sub-section is served whole, with no
     * screen left: an absence like the others, under the same neutral message,
     * since the reader must not learn that a section existed.
     *
     * Recommendations count as something to read. A key moment reduced to what
     * the firm advises is unusual, but it is published, and answering it with
     * "nothing to read" would hide a page that exists.
     */
    isEmpty.value = screens.value.length === 0 && recommendations.value.length === 0

    // Tracks one successful, non-empty display; a unit change redraws without re-tracking
    if (isTracked && isEmpty.value === false) {
      KeyMomentsTracking.trackDisplayed(currentEntityStore.currentEntity?.office?.name)
    }
  }

  /** Empties the page on an absence, and only raises on a real failure. */
  function readFailure(error: unknown, message: string) {
    if (isAbsence(error)) {
      // Neutral for the reader, said in the logs: these routes answer both
      // tokens, so a `403` is the domain switched off or a misconfiguration,
      // and nothing else would ever report it.
      logger.warn(`${message} — read as an absence`, error)
      openedSources = undefined
      screens.value = []
      recommendations.value = []
      entity.value = undefined
      isEmpty.value = true

      return
    }

    hasError.value = true
    logger.error(message, error)
  }

  async function selectExercice(exerciceId: number) {
    isLoading.value = true
    hasError.value = false

    try {
      await openExercice(exerciceId)
    } catch (error) {
      readFailure(error, '[KeyMoments] unable to load the published key moment')
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Opens the account on its most recent published exercice — the head of a
   * list the microservice already sorted, which is never re-sorted here — or on
   * the one the caller asked for, when it is among those published. An exercice
   * asked for and not published falls back rather than empties: the request
   * comes from a link, and a link that ages should still show something.
   */
  async function loadKeyMoments() {
    isLoading.value = true
    hasError.value = false

    if (accountId === null) {
      isLoading.value = false
      hasError.value = true
      logger.error('[KeyMoments] no entity id in the route, cannot load the published key moment')

      return
    }

    try {
      exerciceCatalogue.value = await CustomerKeyMomentsService.getPublishedExercices(accountId)

      const [mostRecent] = exerciceCatalogue.value
      const asked = exerciceCatalogue.value
        .find(summary => summary.exerciceId === initialExerciceId)
        ?? mostRecent

      // an account with no publication at all: an empty screen, not a failure
      if (asked === undefined) {
        isEmpty.value = true

        return
      }

      await openExercice(asked.exerciceId)
    } catch (error) {
      readFailure(error, '[KeyMoments] unable to load the published key moments')
    } finally {
      isLoading.value = false
    }
  }

  onMounted(() => {
    loadKeyMoments()
  })

  return {
    entityName,
    isLoading,
    hasError,
    isEmpty,
    screens,
    recommendations,
    entity,
    exerciceCatalogue,
    selectedExerciceId,
    publishedAt,
    locale,
    isInThousands,
    selectExercice,
    toggleThousands,
  }
}
