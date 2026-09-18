import { DivergenceFamily, DivergenceKind } from '../enums/key-moments.enums'
import type { Divergence, PublishableOffer, PublishableState } from '../types/key-moments.types'

/**
 * Why the report on screen differs from what the client reads.
 *
 * The rule is one sentence: **it must be published if publishing would change
 * what the client reads.** Both sides are therefore described in the very shape
 * a publication settles, and compared field by field — nothing here knows where
 * either side came from, which is what makes every case a two-literal test.
 *
 * A closing and a template are compared on their identity first: a reader who
 * picked another one has made a decision, where a new version of the one they
 * already read arrived on its own. The two never report at once, since naming
 * the version of a document that was itself replaced says nothing.
 */
export function divergencesBetween(
  current: PublishableState,
  published: PublishableState,
): Divergence[] {
  return [
    ...compareClosing(current, published),
    ...compareTemplate(current, published),
    ...comparePreferences(current, published),
    ...compareComments(current, published),
    ...compareHiddenWidgets(current, published),
    ...compareOffers(current, published),
  ]
}

function compareClosing(current: PublishableState, published: PublishableState): Divergence[] {
  if (current.closingId !== published.closingId) {
    return [{
      kind: DivergenceKind.CLOSING,
      family: DivergenceFamily.MODIFICATION,
      // the one that would be published is what the reader needs named; the one
      // it replaces is stated by the mention of the published state itself
      values: { to: current.closingName },
    }]
  }

  if (current.closingVersion !== published.closingVersion) {
    return [{
      kind: DivergenceKind.CLOSING_VERSION,
      family: DivergenceFamily.DELIVERY,
      values: { from: published.closingVersion, to: current.closingVersion },
    }]
  }

  return []
}

/**
 * The firm chooses a model, never a specific version — the page always lays
 * it out on the latest one — so a model change and a version change are two
 * distinct kinds of divergence.
 */
function compareTemplate(current: PublishableState, published: PublishableState): Divergence[] {
  if (current.templateCode === undefined || current.templateCode !== published.templateCode) {
    return [{
      kind: DivergenceKind.TEMPLATE,
      family: DivergenceFamily.MODIFICATION,
      // a template retired from the catalogue since the publication leaves the
      // name empty, and the label falls back on saying that it changed
      values: { from: published.templateName, to: current.templateName },
    }]
  }

  if (current.templateId !== published.templateId || current.templateVersion !== published.templateVersion) {
    return [{
      kind: DivergenceKind.TEMPLATE_VERSION,
      family: DivergenceFamily.DELIVERY,
      values: { from: published.templateVersion, to: current.templateVersion },
    }]
  }

  return []
}

function comparePreferences(current: PublishableState, published: PublishableState): Divergence[] {
  const divergences: Divergence[] = []

  if (current.preferenceComparisonExercice !== published.preferenceComparisonExercice) {
    divergences.push({
      kind: DivergenceKind.COMPARISON,
      family: DivergenceFamily.MODIFICATION,
      // A side comparing against nothing has no exercise name
      values: {
        from: published.preferenceComparisonExercice ?? '',
        to: current.preferenceComparisonExercice ?? '',
      },
    })
  }

  if (current.preferenceCurrencyDisplay !== published.preferenceCurrencyDisplay) {
    divergences.push({
      kind: DivergenceKind.CURRENCY,
      family: DivergenceFamily.MODIFICATION,
      values: { to: current.preferenceCurrencyDisplay },
    })
  }

  return divergences
}

/**
 * Slots compare on their text alone, never on the source that produced it: the
 * client reads a text and nothing else, so a contributor rewording a reading
 * identically — or a reading retained from another voice under the same words —
 * changes nothing for them and must not light the button.
 *
 * Read over the slots the report on screen cites, and over those alone. The
 * publication is frozen by the microservice, which keeps the readings of the
 * whole exercise and not of one template: a text frozen for a slot no widget
 * carries is read by nobody, and counting it would name a modification that no
 * gesture made and that undoing cannot reach.
 *
 * An absent text and an empty one say the same thing to the reader, so they are
 * read as one — as two positions of the recommendations already are. Only one
 * side names the slots that would go out empty, and the two must not part over
 * that alone.
 */
function compareComments(current: PublishableState, published: PublishableState): Divergence[] {
  const count = Object.keys(current.comments)
    .filter(slotId => (current.comments[slotId] ?? '') !== (published.comments[slotId] ?? ''))
    .length

  return count === 0 ? [] : [{
    kind: DivergenceKind.COMMENTS,
    family: DivergenceFamily.MODIFICATION,
    values: { count },
  }]
}

/** Told apart both ways: taking a sub-section away and putting one back read differently. */
function compareHiddenWidgets(
  current: PublishableState,
  published: PublishableState,
): Divergence[] {
  const publishedIds = new Set(published.hiddenWidgets)
  const currentIds = new Set(current.hiddenWidgets)

  const hidden = current.hiddenWidgets.filter(widgetId => publishedIds.has(widgetId) === false)
  const shown = published.hiddenWidgets.filter(widgetId => currentIds.has(widgetId) === false)

  return hidden.length === 0 && shown.length === 0 ? [] : [{
    kind: DivergenceKind.HIDDEN_WIDGETS,
    family: DivergenceFamily.MODIFICATION,
    values: { hidden: hidden.length, shown: shown.length },
  }]
}

/**
 * Compared **position by position**: the order of the list is what the client
 * reads, so swapping two recommendations is a modification like any other.
 *
 * What is compared are the decisions — which offer, what was written about it,
 * what degree it carries and whether that degree is shown. Never the wording of
 * the catalogue: rewording an offer there is nobody's gesture, and lighting the
 * publish button on it would offer to undo something nobody could undo.
 *
 * Both sides are already projections leaving the hidden offers out, which is
 * what makes hiding one report here rather than pass for a detachment.
 */
function compareOffers(current: PublishableState, published: PublishableState): Divergence[] {
  const size = Math.max(current.offers.length, published.offers.length)

  const count = Array.from({ length: size })
    .filter((_, rank) => sameOffer(current.offers[rank], published.offers[rank]) === false)
    .length

  return count === 0 ? [] : [{
    kind: DivergenceKind.OFFERS,
    family: DivergenceFamily.MODIFICATION,
    values: { count },
  }]
}

/**
 * A position filled on one side and empty on the other is a difference. An
 * absent text and an empty one say the same thing to the reader, so they are
 * read as one.
 */
function sameOffer(left?: PublishableOffer, right?: PublishableOffer): boolean {
  if (left === undefined || right === undefined) {
    return left === right
  }

  return left.offerId === right.offerId
    && (left.comment ?? '') === (right.comment ?? '')
    && (left.benefitsComment ?? '') === (right.benefitsComment ?? '')
    && left.priority === right.priority
    && left.isPriorityVisible === right.isPriorityVisible
}
