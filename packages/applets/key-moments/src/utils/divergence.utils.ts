import { DivergenceFamily, DivergenceKind } from '../enums/key-moments.enums'
import { compareRecommendations } from './recommendations.utils'
import type { Divergence, PublishableState } from '../types/key-moments.types'

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
    ...compareRecommendationsSection(current, published),
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
 * Compared on what both lists keep in order: the order is what the client
 * reads, so moving a recommendation is a modification like any other, while
 * hiding one does not count every line after it. Offers
 * compare on their ids, never on the wording of the catalogue: rewording an
 * offer there is nobody's gesture. Both sides are the published projection,
 * visible ones only, which is what makes hiding one report here.
 */
function compareRecommendationsSection(current: PublishableState, published: PublishableState): Divergence[] {
  const count = compareRecommendations(published.recommendations, current.recommendations)

  return count === 0 ? [] : [{
    kind: DivergenceKind.RECOMMENDATIONS,
    family: DivergenceFamily.MODIFICATION,
    values: { count },
  }]
}
