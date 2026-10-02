import { isNotNullNorEmpty } from '@pulse/toolbox/utils/validator'
import { RecommendationRubric } from '../enums/key-moments.enums'
import { readApiError } from './api-error.utils'
import type { CatalogOfferPayload, PublishedOfferPayload } from '../services/offers.service.types'
import type {
  ExerciceRecommendationPayload,
  RecommendationPayload,
  RecommendationThemePayload,
} from '../services/recommendations.service.types'
import type {
  PublishedRecommendationPayload,
  PublishedRubric,
  RecommendationView,
  ResolvedOffer,
  RubricView,
  WorkingRecommendation,
} from '../types/recommendations.types'

export type TextField = 'observations' | 'risk' | 'recommendation'

export const TEXT_FIELDS: TextField[] = ['observations', 'risk', 'recommendation']

/** The rubrics in display order, which is the order of the enum. */
const RECOMMENDATION_RUBRICS = Object.values(RecommendationRubric)

/** The refusal of a save naming themes the referential does not know. */
const UNKNOWN_THEME_CODE = 'unknown-theme'
const UNKNOWN_THEME_POINTER = /^\/recommendations\/(\d+)\/themeId$/

function filledOrNull(text: string | undefined): string | null {
  return isNotNullNorEmpty(text) ? text : null
}

/** The rubric a line sits in: its theme's, else the one it was added to; none for a theme the list does not know. */
function rubricOf(
  recommendation: WorkingRecommendation,
  themesById: Map<number, RecommendationThemePayload>,
): RecommendationRubric | undefined {
  return recommendation.themeId === undefined
    ? recommendation.rubric
    : themesById.get(recommendation.themeId)?.rubric
}

function themesByIdOf(themes: RecommendationThemePayload[]): Map<number, RecommendationThemePayload> {
  return new Map(themes.map(theme => [theme.id, theme]))
}

function offersByIdOf(catalog: CatalogOfferPayload[]): Map<number, CatalogOfferPayload> {
  return new Map(catalog.map(offer => [offer.id, offer]))
}

let keyCount = 0

/** A key of the page's own, never reused within a session. */
function nextRecommendationKey(): string {
  keyCount += 1

  return `reco-${keyCount}`
}

/** As read, keyed, the null fields absent. */
export function toWorking(recommendations: ExerciceRecommendationPayload[]): WorkingRecommendation[] {
  return recommendations.map(recommendation => ({
    key: nextRecommendationKey(),
    themeId: recommendation.themeId,
    priority: recommendation.priority ?? undefined,
    observations: recommendation.observations ?? undefined,
    risk: recommendation.risk ?? undefined,
    recommendation: recommendation.recommendation ?? undefined,
    offerIds: [...recommendation.offerIds],
    isHidden: recommendation.isHidden,
    isFromCategory: recommendation.isFromCategory,
  }))
}

/** A recommendation of a category, copied into an exercice: visible, keyed, its theme locked. */
export function copiedFromCategory(recommendations: RecommendationPayload[]): WorkingRecommendation[] {
  return toWorking(recommendations
    .map(recommendation => ({ ...recommendation, isHidden: false, isFromCategory: true })))
}

/** A recommendation of a category, as its own editor works on it: keyed, its theme free. */
export function categoryLinesOf(recommendations: RecommendationPayload[]): WorkingRecommendation[] {
  return toWorking(recommendations
    .map(recommendation => ({ ...recommendation, isHidden: false, isFromCategory: false })))
}

export function emptyRecommendation(rubric: RecommendationRubric): WorkingRecommendation {
  return { key: nextRecommendationKey(), rubric, offerIds: [], isHidden: false, isFromCategory: false }
}

/** Whether the microservice would accept the line: a theme is required, the rest is not. */
export function isComplete(
  recommendation: WorkingRecommendation,
): recommendation is WorkingRecommendation & { themeId: number } {
  return recommendation.themeId !== undefined
}

/**
 * What a save sends: the complete lines only, the empty fields null, nothing
 * of the copy (`key`, `rubric`). An incomplete line stays on the page until
 * it has a theme; it is never written, and never published.
 */
export function toPayload(recommendations: WorkingRecommendation[]): ExerciceRecommendationPayload[] {
  return recommendations
    .filter(isComplete)
    .map(recommendation => ({
      themeId: recommendation.themeId,
      priority: recommendation.priority ?? null,
      observations: filledOrNull(recommendation.observations),
      risk: filledOrNull(recommendation.risk),
      recommendation: filledOrNull(recommendation.recommendation),
      offerIds: [...recommendation.offerIds],
      isHidden: recommendation.isHidden,
      isFromCategory: recommendation.isFromCategory,
    }))
}

/**
 * The lines a save was refused for their theme, by key. The refusal points
 * at positions in the list sent, which holds the complete lines only.
 */
export function refusedThemeKeysOf(error: unknown, sent: WorkingRecommendation[]): string[] | undefined {
  const apiError = readApiError(error)

  if (apiError?.code !== UNKNOWN_THEME_CODE) {
    return undefined
  }

  const sentKeys = sent.filter(isComplete).map(recommendation => recommendation.key)

  return apiError.entries
    .map(entry => UNKNOWN_THEME_POINTER.exec(entry.pointer ?? '')?.[1])
    .filter((index): index is string => index !== undefined)
    .map(index => sentKeys[Number(index)])
    .filter((key): key is string => key !== undefined)
}

/** The same lines as a category keeps them: without the visibility of an exercice. */
export function toCategoryPayload(recommendations: WorkingRecommendation[]): RecommendationPayload[] {
  return toPayload(recommendations)
    .map(({ isHidden: _isHidden, isFromCategory: _isFromCategory, ...recommendation }) => recommendation)
}

export function patched(
  recommendations: WorkingRecommendation[],
  key: string,
  patch: Partial<WorkingRecommendation>,
): WorkingRecommendation[] {
  return recommendations
    .map(recommendation => (recommendation.key === key ? { ...recommendation, ...patch, key } : recommendation))
}

export function without(recommendations: WorkingRecommendation[], key: string): WorkingRecommendation[] {
  return recommendations.filter(recommendation => recommendation.key !== key)
}

/**
 * Moved to `index` among the lines of its own rubric, the other rubrics kept
 * where they are: the list is flat, but a recommendation never changes rubric
 * by a move.
 */
export function movedInRubric(
  recommendations: WorkingRecommendation[],
  key: string,
  index: number,
  themes: RecommendationThemePayload[],
): WorkingRecommendation[] {
  const themesById = themesByIdOf(themes)
  const moved = recommendations.find(recommendation => recommendation.key === key)

  if (moved === undefined) {
    return recommendations
  }

  const movedRubric = rubricOf(moved, themesById)
  const isSibling = (recommendation: WorkingRecommendation) => rubricOf(recommendation, themesById) === movedRubric
  const siblings = recommendations
    .filter(recommendation => isSibling(recommendation) && recommendation.key !== key)

  siblings.splice(Math.max(0, Math.min(index, siblings.length)), 0, moved)

  let cursor = 0

  return recommendations
    .map(recommendation => (isSibling(recommendation) ? siblings[cursor++] : recommendation))
}

/** Named from the catalogue; an offer gone from it is retired, its id standing for a title. */
function resolveOffers(offerIds: number[], offersById: Map<number, CatalogOfferPayload>): ResolvedOffer[] {
  return offerIds.map((offerId) => {
    const known = offersById.get(offerId)

    return {
      offerId,
      title: known?.title ?? String(offerId),
      shortDescription: known?.shortDescription,
      categoryName: known?.subCategory?.category?.name,
      tags: known?.tags,
      isRetired: known === undefined,
    }
  })
}

/**
 * Every rubric of the list, in order, empty or not, with the themes it offers
 * and its lines, their theme named and their offers resolved. A line whose
 * theme the list does not know sits in no rubric.
 */
export function toRubricViews(
  recommendations: WorkingRecommendation[],
  catalog: CatalogOfferPayload[],
  themes: RecommendationThemePayload[],
  refusedThemeKeys: Set<string>,
): RubricView[] {
  const themesById = themesByIdOf(themes)
  const offersById = offersByIdOf(catalog)

  return RECOMMENDATION_RUBRICS.map(rubric => ({
    rubric,
    themes: themes.filter(theme => theme.rubric === rubric),
    views: recommendations
      .filter(recommendation => rubricOf(recommendation, themesById) === rubric)
      .map((recommendation): RecommendationView => ({
        ...recommendation,
        themeLabel: recommendation.themeId === undefined ? undefined : themesById.get(recommendation.themeId)?.label,
        offers: resolveOffers(recommendation.offerIds, offersById),
        isThemeRefused: refusedThemeKeys.has(recommendation.key),
      })),
  }))
}

export function countVisible(recommendations: WorkingRecommendation[]): number {
  return recommendations.filter(recommendation => recommendation.isHidden === false).length
}

/** The lines without a theme, hidden ones included: such a line is never saved, and would be lost on the next reading. */
export function countWithoutTheme(recommendations: WorkingRecommendation[]): number {
  return recommendations.filter(recommendation => isComplete(recommendation) === false).length
}

/** The wording of an offer, frozen from the catalogue as it stands at publication. */
function publishedOfferOf(offer: CatalogOfferPayload): PublishedOfferPayload {
  return {
    offerId: offer.id,
    title: offer.title,
    shortDescription: offer.shortDescription,
    categoryName: offer.subCategory?.category?.name,
    subCategoryName: offer.subCategory?.name,
    imageUrl: offer.imageUrl,
    pdfUrl: offer.pdfUrl,
  }
}

/**
 * What a publication freezes: the visible and complete recommendations, in
 * order, their rubric and theme worded from the list of themes, the retired
 * offers excluded, the empty fields absent — the very
 * shape the client is served, so the preview and the diff read it.
 */
export function publishableRecommendationsOf(
  recommendations: WorkingRecommendation[],
  catalog: CatalogOfferPayload[],
  themes: RecommendationThemePayload[],
): PublishedRecommendationPayload[] {
  const byId = offersByIdOf(catalog)
  const themesById = themesByIdOf(themes)

  return recommendations
    .filter(isComplete)
    .filter(recommendation => recommendation.isHidden === false)
    .flatMap((recommendation) => {
      const theme = themesById.get(recommendation.themeId)

      if (theme === undefined) {
        return []
      }

      const published: PublishedRecommendationPayload = {
        rubric: theme.rubric,
        theme: theme.label,
        offers: recommendation.offerIds
          .map(offerId => byId.get(offerId))
          .filter((offer): offer is CatalogOfferPayload => offer !== undefined)
          .map(publishedOfferOf),
      }

      if (recommendation.priority !== undefined) {
        published.priority = recommendation.priority
      }

      TEXT_FIELDS.forEach((field) => {
        const text = recommendation[field]

        if (isNotNullNorEmpty(text)) {
          published[field] = text
        }
      })

      return [published]
    })
}

/** Each offer cited by a visible recommendation, once. */
function citedOfferIdsOf(recommendations: WorkingRecommendation[]): number[] {
  const citedIds = recommendations
    .filter(recommendation => recommendation.isHidden === false)
    .flatMap(recommendation => recommendation.offerIds)

  return [...new Set(citedIds)]
}

/**
 * What the publication is handed of the offers: each offer cited by a visible
 * recommendation, once, worded from the catalogue. An offer gone from it is
 * not here — `unresolvedOfferIdsOf` names it, and publishing waits.
 */
export function publishedOffersOf(
  recommendations: WorkingRecommendation[],
  catalog: CatalogOfferPayload[],
): PublishedOfferPayload[] {
  const byId = offersByIdOf(catalog)

  return citedOfferIdsOf(recommendations)
    .map(offerId => byId.get(offerId))
    .filter((offer): offer is CatalogOfferPayload => offer !== undefined)
    .map(publishedOfferOf)
}

/**
 * The offers a publication could not describe: attached to a visible
 * recommendation and gone from the catalogue. Publishing is refused while one
 * remains, so the page states them beforehand.
 */
export function unresolvedOfferIdsOf(
  recommendations: WorkingRecommendation[],
  catalog: CatalogOfferPayload[],
): number[] {
  const knownIds = new Set(catalog.map(offer => offer.id))

  return citedOfferIdsOf(recommendations).filter(offerId => knownIds.has(offerId) === false)
}

/** The published list grouped by rubric in display order, a rubric with nothing left out. */
export function groupedByRubric(recommendations: PublishedRecommendationPayload[]): PublishedRubric[] {
  return RECOMMENDATION_RUBRICS
    .map(rubric => ({
      rubric,
      recommendations: recommendations.filter(recommendation => recommendation.rubric === rubric),
    }))
    .filter(group => group.recommendations.length > 0)
}

/**
 * Texts compare with an absent one and an empty one read alike; offers compare
 * on their ids, never on the wording of the catalogue.
 */
function signatureOf(line: PublishedRecommendationPayload): string {
  return JSON.stringify([
    line.rubric,
    line.theme,
    line.priority ?? null,
    line.observations ?? '',
    line.risk ?? '',
    line.recommendation ?? '',
    line.offers.map(offer => offer.offerId),
  ])
}

/** How many lines the two lists keep alike and in the same order (longest common subsequence). */
function keptInOrder(
  published: PublishedRecommendationPayload[],
  current: PublishedRecommendationPayload[],
): number {
  // Signed once per line, so the table below only compares strings
  const currentSignatures = current.map(signatureOf)
  let previousRow = Array.from({ length: current.length + 1 }, () => 0)

  published.map(signatureOf).forEach((publishedSignature) => {
    const row = [0]

    currentSignatures.forEach((currentSignature, index) => {
      row.push(publishedSignature === currentSignature
        ? previousRow[index] + 1
        : Math.max(previousRow[index + 1], row[index]))
    })

    previousRow = row
  })

  return previousRow[current.length]
}

/**
 * The number of lines that changed, went, came or moved. Counted against what
 * both lists keep in order rather than position by position: hiding one line
 * shifts every line after it, and none of those changed for the client.
 */
export function compareRecommendations(
  published: PublishedRecommendationPayload[],
  current: PublishedRecommendationPayload[],
): number {
  return Math.max(published.length, current.length) - keptInOrder(published, current)
}
