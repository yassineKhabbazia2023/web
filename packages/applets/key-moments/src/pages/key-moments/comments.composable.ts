import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { logger } from '@pulse/toolbox'
import { isNotNullNorEmpty } from '@pulse/toolbox/utils/validator'
import { displayNotification } from '@pulse/styleguide'
import { useUserStore } from '@pulse/common/stores'
import { getFullName } from '@pulse/common/utils'
import { KeyMomentsService } from '../../services/key-moments.service'
import { readApiError } from '../../utils/api-error.utils'
import { RejectionCode } from '../../enums/key-moments.enums'
import type { usePublications } from './publication.composable'
import type { CommentVariantPayload } from '../../services/key-moments.service.types'
import type { PublishedOfferPayload } from '../../services/offers.service.types'
import type {
  CommentBoard,
  CommentVariant,
  PublishContext,
  Screen,
  Widget,
} from '../../types/key-moments.types'

/**
 * The delivered variant and the published state are handed in by the caller
 * rather than read here, so an earlier closing version and the current
 * publication stay in sync with the page.
 */
export function useComments(
  entityId: number | null,
  publications: ReturnType<typeof usePublications>,
) {
  const { t } = useI18n()
  const userStore = useUserStore()

  const accountId = entityId

  const variantsBySlot = ref<Record<string, CommentVariantPayload[]>>({})
  const loadedExerciceId = ref<number>()
  const loadedClosingId = ref<number>()

  /** Missing means not arbitrated yet, falling back to the most recent delivered text. */
  const retainedBySlot = ref<Record<string, string>>({})

  /**
   * Kept separate from `retainedBySlot`: a missing entry there falls back to
   * the delivered text, while this publishes nothing at all.
   */
  const discardedBySlot = ref<Record<string, boolean>>({})

  const isPublishing = ref(false)

  const myContributorId = computed(() => {
    const id = userStore.user?.id

    return id === undefined ? undefined : String(id)
  })

  const myName = computed(() => {
    const user = userStore.user

    return user === undefined ? '' : getFullName(user.firstName, user.lastName)
  })

  /** Uniquely identifies a reading: contributor id, or closing version for a delivered text. */
  function variantKey(contributorId: string | null, closingVersion?: number): string {
    return contributorId ?? `closing:${closingVersion ?? ''}`
  }

  function buildInitials(name: string): string {
    const words = name.trim().split(/\s+/u).filter(word => word.length > 0)

    if (words.length === 0) {
      return ''
    }

    const first = words[0].charAt(0)
    const last = words.length === 1 ? '' : words[words.length - 1].charAt(0)

    return `${first}${last}`.toUpperCase()
  }

  /** Maps the API payload (explicit `null`s) to the view model (keys left out). */
  function toVariant(payload: CommentVariantPayload): CommentVariant {
    const closingVersion = payload.closingVersion ?? undefined
    const updatedAt = payload.updatedAt ?? undefined

    if (payload.contributorId === null) {
      const label = closingVersion === undefined
        ? t('keyMoments.comment.delivered')
        : t('keyMoments.comment.deliveredVersion', { version: closingVersion })

      return {
        key: variantKey(null, closingVersion),
        contributorId: null,
        closingVersion,
        label,
        // A closing has no name to abbreviate, so its tab uses the label as is
        tabLabel: label,
        text: payload.text,
        updatedAt,
        isMine: false,
      }
    }

    const label = payload.contributorName ?? t('keyMoments.comment.unknownContributor')

    return {
      key: variantKey(payload.contributorId),
      contributorId: payload.contributorId,
      label,
      tabLabel: buildInitials(label),
      text: payload.text,
      updatedAt,
      isMine: payload.contributorId === myContributorId.value,
    }
  }

  /** Failures are logged only — the page still shows the delivered variant either way. */
  async function readVariants(): Promise<void> {
    const exerciceId = loadedExerciceId.value

    if (accountId === null || exerciceId === undefined) {
      return
    }

    try {
      const slots = await KeyMomentsService.getComments(
        accountId,
        exerciceId,
        loadedClosingId.value,
      )

      variantsBySlot.value = Object.fromEntries(slots.map(slot => [slot.slotId, slot.variants]))
      // Covers every known slot, including one discarded with no variant yet (`variants: []`)
      discardedBySlot.value = Object.fromEntries(slots.map(slot => [slot.slotId, slot.isDiscarded]))
      retainedBySlot.value = Object.fromEntries(slots
        .map(slot => [slot.slotId, slot.variants.find(variant => variant.isRetained === true)])
        .filter((entry): entry is [string, CommentVariantPayload] => entry[1] !== undefined)
        .map(([slotId, variant]) => [
          slotId,
          variantKey(variant.contributorId, variant.closingVersion ?? undefined),
        ]))
    } catch (error) {
      logger.error('[KeyMoments] unable to load the contributions', error)
    }
  }

  /** Both are taken because which reading would be published depends on the closing. */
  async function loadComments(exerciceId: number, closingId?: number): Promise<void> {
    variantsBySlot.value = {}
    // Arbitration only applies to the variants of one exercice
    retainedBySlot.value = {}
    discardedBySlot.value = {}
    loadedExerciceId.value = exerciceId
    loadedClosingId.value = closingId

    await readVariants()
  }

  /**
   * The tab my writing opens on before anything is saved, carrying the same
   * key my saved contribution will use — so the tab survives the write
   * instead of being replaced by another.
   */
  const myDraftVariant = computed<CommentVariant | undefined>(() => {
    const contributorId = myContributorId.value

    return contributorId === undefined ? undefined : {
      key: variantKey(contributorId),
      contributorId,
      label: myName.value,
      tabLabel: buildInitials(myName.value),
      text: '',
      isMine: true,
    }
  })

  /**
   * The tabs of a slot, in reading order: delivered texts (oldest first, one
   * per closing version), then contributions that carry a text, mine
   * included. `deliveredText` and `closingVersion` are a fallback for a slot
   * the API has never indexed — reads straight from what the report displays.
   */
  function variantsFor(
    slotId: string,
    deliveredText: string,
    closingVersion?: number,
  ): CommentVariant[] {
    const variants = variantsBySlot.value[slotId] ?? []

    // A delivered variant has a version and no contributor; the two are mutually exclusive
    const served = variants
      .filter(variant => variant.contributorId === null && variant.closingVersion !== null)

    const delivered = served.length > 0
      ? served.map(toVariant)
      : [toVariant({
        contributorId: null,
        contributorName: null,
        closingVersion: closingVersion ?? null,
        text: deliveredText,
        updatedAt: null,
        // Not indexed by the API, so neither retained nor publishable
        isRetained: false,
        isPublishable: false,
      })]

    // Mine is a contribution like any other: it exists once it has text
    const contributions = variants
      .filter(variant => variant.contributorId !== null)
      .filter(variant => isNotNullNorEmpty(variant.text))

    return [...delivered, ...contributions.map(toVariant)]
  }

  /**
   * Nothing is written locally before the API accepts it. Returns whether it
   * was taken, so the encart only closes on a text the base actually holds.
   */
  async function saveComment(slotId: string, text: string): Promise<boolean> {
    const exerciceId = loadedExerciceId.value
    const contributorId = myContributorId.value

    if (accountId === null || exerciceId === undefined || contributorId === undefined) {
      return false
    }

    try {
      await KeyMomentsService.saveComment(accountId, exerciceId, slotId, text)
    } catch (error) {
      logger.error('[KeyMoments] unable to save the contribution', error)
      displayNotification('error', t('keyMoments.comment.saveError'))

      return false
    }

    // Re-read rather than guessed: emptying a reading may delete it or discard the slot
    await readVariants()

    return true
  }

  /**
   * Retains a reading as a separate, immediate write — nothing moves locally
   * before the API accepts it.
   */
  async function retainVariant(slotId: string, variant: CommentVariant): Promise<void> {
    const exerciceId = loadedExerciceId.value

    if (accountId === null || exerciceId === undefined) {
      return
    }

    try {
      await KeyMomentsService.retainComment(accountId, exerciceId, slotId, {
        sourceContributorId: variant.contributorId,
        sourceClosingVersion: variant.closingVersion ?? null,
      })

      // Re-read rather than patched: only the API knows what would actually be published
      await readVariants()
    } catch (error) {
      logger.error('[KeyMoments] unable to retain the reading', error)
      displayNotification('error', t('keyMoments.comment.retainError'))
    }
  }

  /**
   * Takes a slot out of the publication entirely — unlike an unarbitrated
   * slot, which still publishes on the API's fallback. Undone only by
   * retaining a reading, which reopens it.
   */
  async function discardSlot(slotId: string): Promise<void> {
    const exerciceId = loadedExerciceId.value

    if (accountId === null || exerciceId === undefined) {
      return
    }

    try {
      await KeyMomentsService.retainComment(accountId, exerciceId, slotId, {
        sourceContributorId: null,
        sourceClosingVersion: null,
        retainNone: true,
      })

      await readVariants()
    } catch (error) {
      logger.error('[KeyMoments] unable to discard the slot', error)
      displayNotification('error', t('keyMoments.comment.discardError'))
    }
  }

  function isSlotDiscarded(slotId: string): boolean {
    return discardedBySlot.value[slotId] === true
  }

  function retainedKeyOf(slotId: string): string {
    return retainedBySlot.value[slotId] ?? ''
  }

  function buildCommentBoards(
    screens: Screen[],
    openClosingVersion?: number,
  ): Record<string, CommentBoard> {
    return Object.fromEntries(screens
      .flatMap(screen => screen.widgets)
      .filter((widget): widget is Widget & { commentSlotId: string } => (
        widget.commentSlotId !== undefined
      ))
      .map(widget => [widget.id, {
        slotId: widget.commentSlotId,
        variants: variantsFor(widget.commentSlotId, widget.comment, openClosingVersion),
        retainedKey: retainedKeyOf(widget.commentSlotId),
        publishableKey: publishableKeyOf(widget.commentSlotId),
        isDiscarded: isSlotDiscarded(widget.commentSlotId),
        draftVariant: myDraftVariant.value,
      }]))
  }

  /**
   * Read off the `isPublishable` flag the API sets rather than computed here:
   * the fallback rule depends on which closing is published, which this page
   * can't reliably determine on its own.
   */
  function publishableVariant(slotId: string): CommentVariantPayload | undefined {
    return (variantsBySlot.value[slotId] ?? []).find(variant => variant.isPublishable)
  }

  function publishableText(slotId: string): string {
    return publishableVariant(slotId)?.text ?? ''
  }

  /**
   * Which tab carries the reading that would go out — distinct from the
   * retained one, since an unarbitrated slot still publishes on the API's
   * fallback.
   */
  function publishableKeyOf(slotId: string): string {
    const variant = publishableVariant(slotId)

    return variant === undefined
      ? ''
      : variantKey(variant.contributorId, variant.closingVersion ?? undefined)
  }

  /**
   * Empty texts are kept: this is the only side of the diff that knows which
   * slots the report actually carries.
   */
  function buildPublishedComments(screens: Screen[]): Record<string, string> {
    const slotIds = new Set(screens
      .flatMap(screen => screen.widgets)
      .map(widget => widget.commentSlotId)
      .filter((slotId): slotId is string => slotId !== undefined))

    return Object.fromEntries([...slotIds].map(slotId => [slotId, publishableText(slotId)]))
  }

  /**
   * The API applies its own rule to the readings it already stores — nothing
   * of the editorial pass travels here. Offers are sent whole, wording
   * included, since the API never reads the catalogue and refuses a
   * publication leaving one undescribed. The published state is re-read
   * afterwards rather than assumed from what was sent.
   */
  async function publish(
    context: PublishContext,
    offers: PublishedOfferPayload[],
  ): Promise<boolean> {
    const exerciceId = loadedExerciceId.value

    if (accountId === null || isPublishing.value) {
      return false
    }

    isPublishing.value = true

    try {
      await KeyMomentsService.publish(accountId, {
        templateId: context.templateId,
        closingId: context.closingId,
        preferenceComparisonExercice: context.preferenceComparisonExercice,
        preferenceCurrencyDisplay: context.preferenceCurrencyDisplay,
        offers,
      })
      displayNotification('success', t('keyMoments.publish.success'))
      await publications.loadPublications()

      if (exerciceId !== undefined) {
        await publications.openExercice(exerciceId)
      }

      return true
    } catch (error) {
      logger.error('[KeyMoments] unable to publish the key moment', error)
      displayNotification(
        'error',
        readApiError(error)?.code === RejectionCode.MISSING_OFFER_DESCRIPTION
          ? t('keyMoments.publish.missingOffersError')
          : t('keyMoments.publish.error'),
      )

      return false
    } finally {
      isPublishing.value = false
    }
  }

  /**
   * Only which reading is retained moves — texts are never rewritten, and a
   * slot the publication says nothing about keeps its current arbitration (no
   * un-retaining). Writes run via `allSettled` so one rejection doesn't stop
   * the rest, and the state is re-read once after every write has settled.
   */
  async function restorePublishedArbitration(): Promise<void> {
    const exerciceId = loadedExerciceId.value
    const detail = publications.publicationDetail.value

    if (accountId === null || exerciceId === undefined || detail === undefined) {
      return
    }

    const outcomes = await Promise.allSettled([
      ...detail.comments.map(comment => KeyMomentsService.retainComment(
        accountId,
        exerciceId,
        comment.slotId,
        {
          sourceContributorId: comment.sourceContributorId,
          sourceClosingVersion: comment.sourceClosingVersion,
        },
      )),
      ...(detail.discardedSlotIds ?? []).map(slotId => KeyMomentsService.retainComment(
        accountId,
        exerciceId,
        slotId,
        {
          sourceContributorId: null,
          sourceClosingVersion: null,
          retainNone: true,
        },
      )),
    ])

    const refused = outcomes.filter(outcome => outcome.status === 'rejected')

    if (refused.length > 0) {
      logger.error('[KeyMoments] some retained readings could not be brought back', refused)
      displayNotification('error', t('keyMoments.comment.retainError'))
    }

    await readVariants()
  }

  return {
    isPublishing,
    loadComments,
    myDraftVariant,
    variantsFor,
    saveComment,
    retainVariant,
    discardSlot,
    retainedKeyOf,
    buildCommentBoards,
    buildPublishedComments,
    restorePublishedArbitration,
    publish,
  }
}
