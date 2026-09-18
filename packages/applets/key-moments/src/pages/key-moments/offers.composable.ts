import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { logger } from '@pulse/toolbox'
import { displayNotification } from '@pulse/styleguide'
import { CurrentUserManager } from '@pulse/common/managers'
import { ACCOUNT_PERMISSIONS, HTTP_RESPONSES } from '@pulse/common/constants'
import { OffersService } from '../../services/offers.service'
import {
  catalogWithSearchTerms,
  joinOffers,
  publishableOffers,
  publishedOfferSnapshots,
  restoredOffers,
  snapshotOf,
  unresolvedOfferIds,
} from '../../utils/offers.utils'
import { OFFERS_CAP } from '../../const/key-moments.consts'
import { readApiStatus } from '../../utils/api-error.utils'
import type {
  CatalogOfferPayload,
  LinkedOfferPayload,
  OffersCatalogPayload,
} from '../../services/offers.service.types'
import type { LinkedOffer, SearchableOffer } from '../../types/key-moments.types'

/** A 404 means nothing was ever attached, not a failure — nothing for the reader to act on. */
function isAbsence(error: unknown): boolean {
  return readApiStatus(error) === HTTP_RESPONSES.NOT_FOUND
}

export function useOffers(entityId: number | null) {
  const { t } = useI18n()

  const accountId = entityId

  const linked = ref<LinkedOfferPayload[]>([])
  const catalog = ref<SearchableOffer[]>([])
  const isSaving = ref(false)
  const loadedExerciceId = ref<number>()
  const isListUnreadable = ref(false)

  /**
   * Write in flight; the next one waits for it. Each gesture composes its list
   * from `linked` at write time, not call time, so two writes in a row both land.
   */
  let pendingWrite: Promise<void> = Promise.resolve()

  /**
   * Display only: the `OFFER` permission does not actually guard either read
   * here (the attached list is a Keymoments route, the catalogue is open to any
   * collaborator).
   */
  const canSeeOffers = computed(
    () => CurrentUserManager.hasPermission(ACCOUNT_PERMISSIONS.OFFER),
  )

  const linkedOffers = computed<LinkedOffer[]>(() => joinOffers(linked.value, catalog.value))

  const publishableSelection = computed(() => publishableOffers(linked.value))

  /** Offer titles resolved from the catalogue for publishing; only the title is stored. */
  const publishedSnapshots = computed(
    () => publishedOfferSnapshots(linked.value, catalog.value),
  )

  /** Attached offers the catalogue cannot resolve; publishing is blocked while any exist. */
  const unresolvedIds = computed(() => unresolvedOfferIds(linked.value, catalog.value))

  /** The cap counts the hidden ones: it bounds what is stored, not what shows. */
  const isAtCap = computed(() => linked.value.length >= OFFERS_CAP)

  const attachedIds = computed(() => new Set(linked.value.map(offer => offer.offerId)))

  async function readLinkedOffers(exerciceId: number): Promise<LinkedOfferPayload[]> {
    if (accountId === null) {
      return []
    }

    try {
      const attached = await OffersService.getLinkedOffers(accountId, exerciceId)

      isListUnreadable.value = false

      return attached
    } catch (error) {
      const message = '[KeyMoments] unable to read the recommendations of the exercice'

      if (isAbsence(error)) {
        logger.warn(`${message} — read as an absence`, error)
        isListUnreadable.value = false
      } else {
        logger.error(message, error)
        isListUnreadable.value = true
      }

      return []
    }
  }

  /**
   * Read separately from the attached list so one domain being down never
   * blanks the other. A failed read leaves the catalogue empty, which reads as
   * every attached offer being unresolved instead of failing the publish click.
   */
  async function readCatalog(): Promise<OffersCatalogPayload> {
    try {
      return await OffersService.getOffersCatalog()
    } catch (error) {
      logger.error('[KeyMoments] unable to read the offers catalogue', error)

      return { offers: [], categories: [] }
    }
  }

  async function loadOffers(exerciceId: number): Promise<void> {
    if (accountId === null) {
      return
    }

    loadedExerciceId.value = exerciceId

    // Catalogue is exercice-agnostic: read once and cached; a failed read retries next switch
    const [attached, offersCatalog] = await Promise.all([
      readLinkedOffers(exerciceId),
      catalog.value.length > 0 ? null : readCatalog(),
    ])

    if (offersCatalog !== null) {
      catalog.value = catalogWithSearchTerms(offersCatalog.offers)
    }

    // Exercice changed while this one was loading: discard its result
    if (loadedExerciceId.value !== exerciceId) {
      return
    }

    linked.value = attached
  }

  /**
   * Returns false on a refused, dropped or failed write, so a caller waiting
   * on it (e.g. an open encart) stays open.
   */
  async function writeOffers(
    exerciceId: number,
    compose: (current: LinkedOfferPayload[]) => LinkedOfferPayload[] | undefined,
  ): Promise<boolean> {
    if (accountId === null) {
      return false
    }

    if (isListUnreadable.value) {
      displayNotification('error', t('keyMoments.offers.readError'))

      return false
    }

    const write = pendingWrite.then(async () => {
      if (loadedExerciceId.value !== exerciceId) {
        logger.warn('[KeyMoments] a recommendation gesture was dropped, the exercice changed meanwhile', exerciceId)

        return false
      }

      const next = compose(linked.value)

      if (next === undefined) {
        return true
      }

      isSaving.value = true

      try {
        await OffersService.saveLinkedOffers(accountId, exerciceId, next)

        // Accepted by the API, but the page has since moved to another exercice: don't overwrite it
        if (loadedExerciceId.value === exerciceId) {
          linked.value = next
        }

        return true
      } catch (error) {
        logger.error('[KeyMoments] unable to write the recommendations of the exercice', error)
        displayNotification('error', t('keyMoments.offers.error'))

        return false
      } finally {
        isSaving.value = false
      }
    })

    // Queue only tracks order; each caller keeps its own write's result
    pendingWrite = write.then(() => undefined)

    return write
  }

  async function attachOffer(exerciceId: number, offer: CatalogOfferPayload): Promise<void> {
    await writeOffers(exerciceId, current => (
      current.length >= OFFERS_CAP || current.some(candidate => candidate.offerId === offer.id)
        ? undefined
        : [...current, snapshotOf(offer)]
    ))
  }

  /** Detaching loses the comment and the degree — that is what tells it from hiding. */
  async function detachOffer(exerciceId: number, offerId: number): Promise<void> {
    await writeOffers(exerciceId, current => current.filter(offer => offer.offerId !== offerId))
  }

  /**
   * Clearing the degree also hides it (a visible offer must have a degree),
   * and setting a degree shows it unless the caller says otherwise.
   */
  async function updateOffer(
    exerciceId: number,
    offerId: number,
    patch: Partial<LinkedOfferPayload>,
  ): Promise<boolean> {
    return writeOffers(exerciceId, current => current.map((offer) => {
      if (offer.offerId !== offerId) {
        return offer
      }

      const updated = { ...offer, ...patch }

      if (updated.priority === undefined) {
        return { ...updated, isPriorityVisible: false }
      }

      const hasJustBeenGivenADegree = offer.priority === undefined
        && patch.isPriorityVisible === undefined

      return hasJustBeenGivenADegree
        ? { ...updated, isPriorityVisible: true }
        : updated
    }))
  }

  /**
   * Restores the published snapshot exactly as frozen, including offers the
   * firm hid — the publication never recorded them, so treating its list as
   * complete would detach them and lose their comment and degree.
   */
  async function restoreOffers(
    exerciceId: number,
    published: LinkedOfferPayload[],
  ): Promise<void> {
    await writeOffers(exerciceId, current => restoredOffers(published, current))
  }

  return {
    linkedOffers,
    catalog,
    canSeeOffers,
    isAtCap,
    isSaving,
    attachedIds,
    publishableSelection,
    publishedSnapshots,
    unresolvedIds,
    loadOffers,
    attachOffer,
    detachOffer,
    updateOffer,
    restoreOffers,
  }
}
