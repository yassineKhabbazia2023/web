import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { logger } from '@pulse/toolbox'
import { displayNotification } from '@pulse/styleguide'
import { KeyMomentsService } from '../../services/key-moments.service'
import { readApiError } from '../../utils/api-error.utils'
import { CurrencyDisplay, RejectionCode } from '../../enums/key-moments.enums'
import type {
  PublicationDetailPayload,
  PublicationPayload,
} from '../../services/key-moments.service.types'
import type { PublishedPreferences } from '../../types/key-moments.types'

/**
 * The published state of a dossier: which exercices the client reads, and
 * everything the publication of the one on screen froze.
 *
 * Held apart from the editorial pass that produces it, because two surfaces
 * read it — the editor, to say whether publishing would change anything, and
 * the mirror view, to say what it is withdrawing.
 */
export function usePublications(entityId: number | null) {
  const { t } = useI18n()

  /** Bound to a const so that the null guard narrows inside the loaders. */
  const accountId = entityId

  /** Publications the account carries, one per published exercice */
  const publications = ref<PublicationPayload[]>([])

  /**
   * What the publication of the open exercice froze. Undefined covers the two
   * cases the page must not tell apart in its favour: an exercice never
   * published, and a detail that could not be read. Not knowing what is
   * published is never being up to date.
   */
  const publicationDetail = ref<PublicationDetailPayload>()

  const isUnpublishing = ref(false)
  const isRestoring = ref(false)

  /** Whether the publications are being read, so a view says nothing before they are. */
  const isLoading = ref(false)

  /**
   * Served by account rather than by exercice, so one read covers the dossier.
   * A failure empties nothing: the page keeps whatever it already knew.
   */
  async function loadPublications(): Promise<void> {
    if (accountId === null) {
      return
    }

    isLoading.value = true

    try {
      publications.value = await KeyMomentsService.getPublications(accountId)
    } catch (error) {
      logger.error('[KeyMoments] unable to read the publications', error)
    } finally {
      isLoading.value = false
    }
  }

  /** The most recent publication of an exercice, none meaning never published. */
  function publicationOf(exerciceId: number): PublicationPayload | undefined {
    return publications.value
      .filter(publication => publication.exerciceId === exerciceId)
      .sort((left, right) => right.publishedAt.localeCompare(left.publishedAt))[0]
  }

  /**
   * The reading the exercice was published under, settled before it opens. The
   * publications are re-read on the way: they are served by account, so a
   * single call covers the dossier and always states what the microservice
   * holds.
   */
  async function resolvePublishedPreferences(
    exerciceId: number,
  ): Promise<PublishedPreferences | undefined> {
    await loadPublications()

    const publication = publicationOf(exerciceId)

    return publication === undefined ? undefined : {
      templateId: publication.templateId,
      referenceKey: publication.preferenceComparisonExercice ?? undefined,
      isInThousands: publication.preferenceCurrencyDisplay === CurrencyDisplay.THOUSANDS,
    }
  }

  /**
   * Reads what the active publication of an exercice froze — the texts it
   * retained and the sub-sections it left out, which the summaries never carry.
   *
   * Cleared before the read rather than after: an exercice opened while the
   * previous detail is still held would compare against another exercice.
   */
  async function openExercice(exerciceId: number): Promise<void> {
    publicationDetail.value = undefined

    const publication = publicationOf(exerciceId)

    if (accountId === null || publication === undefined) {
      return
    }

    try {
      publicationDetail.value = await KeyMomentsService.getPublication(accountId, publication.id)
    } catch (error) {
      logger.error('[KeyMoments] unable to read what the publication retained', error)
    }
  }

  /**
   * Takes a publication out of the active ones, and says whether it worked so
   * that the caller may leave a view that no longer has anything to show. The
   * arbitration is left where it is: unpublishing states that nothing is
   * published any more, not that the readings retained were wrong.
   */
  async function unpublish(publicationId: number): Promise<boolean> {
    if (accountId === null) {
      return false
    }

    isUnpublishing.value = true

    try {
      await KeyMomentsService.unpublish(accountId, publicationId)
      displayNotification('success', t('keyMoments.unpublish.success'))
      await loadPublications()

      return true
    } catch (error) {
      logger.error('[KeyMoments] unable to unpublish the key moment', error)
      displayNotification('error', t('keyMoments.unpublish.error'))

      return false
    } finally {
      isUnpublishing.value = false
    }
  }

  /**
   * Puts the draft of the exercice back as its active publication left it, and
   * says whether it worked so that the caller reads the draft again. A failure
   * leaves the draft untouched: the microservice restores all of it or nothing.
   * A publication withdrawn meanwhile is read again, which takes the gesture away.
   */
  async function restorePublished(exerciceId: number): Promise<boolean> {
    if (accountId === null) {
      return false
    }

    isRestoring.value = true

    try {
      await KeyMomentsService.restorePublished(accountId, exerciceId)
      displayNotification('success', t('keyMoments.publish.restore.success'))

      return true
    } catch (error) {
      logger.error('[KeyMoments] unable to restore the published version', error)

      const isNotPublished = readApiError(error)?.code === RejectionCode.NOT_PUBLISHED

      displayNotification('error', t(isNotPublished
        ? 'keyMoments.publish.restore.notPublished'
        : 'keyMoments.publish.restore.error'))

      if (isNotPublished) {
        await loadPublications()
        await openExercice(exerciceId)
      }

      return false
    } finally {
      isRestoring.value = false
    }
  }

  return {
    publications,
    publicationDetail,
    isLoading,
    isUnpublishing,
    isRestoring,
    loadPublications,
    publicationOf,
    resolvePublishedPreferences,
    openExercice,
    unpublish,
    restorePublished,
  }
}
