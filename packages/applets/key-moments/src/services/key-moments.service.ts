import { api } from '@pulse/common/api'
import { API_PREFIXES } from '@pulse/common/constants'
import { assembleDataset } from '../utils/data.utils'
import { validateTemplate } from '../validation/key-moments.validation'
import type {
  CommentVariantPayload,
  PublicationDetailPayload,
  PublicationPayload,
  PublishPayload,
  RetainedCommentPayload,
  SlotCommentsPayload,
  TemplateCatalogueEntry,
} from './key-moments.service.types'
import type {
  Closing,
  Dataset,
  EditorPreferences,
  ExerciceDraft,
  ExerciceSummary,
  Indicators,
  Template,
  TemplateSummary,
} from '../types/key-moments.types'

/**
 * The microservice omits every key it does not fill instead of writing a null:
 * a delivered variant arrives without `contributorId`, a contribution without
 * `closingVersion`. Rewritten here as explicit nulls, at the single door those
 * payloads come through, so that telling a delivered text from a contribution
 * stays one comparison — an absent key and a null say the same thing, and only
 * one of the two ever reaches the page.
 */
function readVariant(payload: CommentVariantPayload): CommentVariantPayload {
  return {
    ...payload,
    contributorId: payload.contributorId ?? null,
    contributorName: payload.contributorName ?? null,
    closingVersion: payload.closingVersion ?? null,
    updatedAt: payload.updatedAt ?? null,
    // read as false when absent: a microservice that does not know the field
    // describes no publication, which is exactly what nothing publishable says
    isPublishable: payload.isPublishable === true,
  }
}

/** The only place that knows where the documents of a key moment come from. */
export class KeyMomentsService {

  static async getTemplateCatalogue(): Promise<TemplateSummary[]> {
    const { data } = await api.gateway.get<TemplateCatalogueEntry[]>(`${API_PREFIXES.KEY_MOMENTS}/templates`)

    return data.map(({ templateId, code, version, label }) => ({
      templateId,
      id: code,
      version,
      label,
    }))
  }

  /**
   * Validated defensively: the document is authored outside the app, and the
   * validation rebuilds it, so two calls never share a mutable object.
   */
  static async getTemplate(templateId: number, version?: string): Promise<Template> {
    const { data } = await api.gateway.get<unknown>(
      `${API_PREFIXES.KEY_MOMENTS}/templates/${templateId}/content`,
      { params: { version } },
    )

    return validateTemplate(data)
  }

  static async getIndicators(): Promise<Indicators> {
    const { data } = await api.gateway.get<Indicators>(`${API_PREFIXES.KEY_MOMENTS}/indicators`)

    return data
  }

  static async getExercices(entityId: number): Promise<ExerciceSummary[]> {
    const { data } = await api.gateway.get<ExerciceSummary[]>(
      `${API_PREFIXES.KEY_MOMENTS}/accounts/${entityId}/exercices`,
    )

    return [...data].sort((left, right) => right.exerciceEndDate.localeCompare(left.exerciceEndDate))
  }

  /**
   * Everything the editor reads when opening an exercice, in one call: the
   * saved preferences, the hidden sub-sections, the recommendations and the
   * closings. Nothing saved yet is a `200` with null fields and empty lists,
   * never a `404` — that one only ever names an exercice unknown to the account.
   *
   * The closings are sorted here as `getClosings` sorts them, so that a caller
   * reads the head of the list as the last import.
   */
  static async getDraft(entityId: number, exerciceId: number): Promise<ExerciceDraft> {
    const { data } = await api.gateway.get<ExerciceDraft>(
      `${API_PREFIXES.KEY_MOMENTS}/accounts/${entityId}/exercices/${exerciceId}/draft`,
    )

    return {
      ...data,
      closings: [...data.closings].sort((left, right) => right.version - left.version),
    }
  }

  /**
   * Writes the three reading choices at once, the whole object every time: a
   * field sent null erases the stored choice, so the caller always states the
   * three values it knows.
   */
  static async savePreferences(
    entityId: number,
    exerciceId: number,
    preferences: EditorPreferences,
  ): Promise<void> {
    await api.gateway.put(
      `${API_PREFIXES.KEY_MOMENTS}/accounts/${entityId}/exercices/${exerciceId}/preferences`,
      preferences,
    )
  }

  static async getKeyMomentsData(entityId: number, closingId: number): Promise<Dataset> {
    const [indicators, closing] = await Promise.all([
      KeyMomentsService.getIndicators(),
      api.gateway
        .get<Closing>(`${API_PREFIXES.KEY_MOMENTS}/accounts/${entityId}/closings/${closingId}`)
        .then(response => response.data),
    ])

    return assembleDataset(indicators, closing)
  }

  /**
   * One call serves the whole page: comments belong to an exercice, not to a
   * widget. Every variant is normalised on the way in — see `readVariant`.
   *
   * `closingId` is what makes the microservice mark the reading each slot would
   * publish, and it is the closing on screen: which variant goes out depends on
   * the delivery being published, so asking without one gets nothing marked.
   * A closing belonging to another exercice is answered `404`, and read here as
   * any failed read is.
   */
  static async getComments(
    entityId: number,
    exerciceId: number,
    closingId?: number,
  ): Promise<SlotCommentsPayload[]> {
    const { data } = await api.gateway.get<SlotCommentsPayload[]>(
      `${API_PREFIXES.KEY_MOMENTS}/accounts/${entityId}/exercices/${exerciceId}/comments`,
      { params: { closingId } },
    )

    return data.map(({ slotId, variants, isDiscarded }) => ({
      slotId,
      variants: variants.map(readVariant),
      // read as false when absent, as a variant marker is: a microservice that
      // does not know the field describes no slot the firm took out
      isDiscarded: isDiscarded === true,
    }))
  }

  /**
   * Upsert on `(exercice, slot, contributor)`: the same call is replayable, and
   * the author never travels in the body — the gateway headers carry it.
   */
  static async saveComment(
    entityId: number,
    exerciceId: number,
    slotId: string,
    text: string,
  ): Promise<void> {
    await api.gateway.put(
      `${API_PREFIXES.KEY_MOMENTS}/accounts/${entityId}/exercices/${exerciceId}/slots/${slotId}/comments`,
      { text },
    )
  }

  /**
   * The reading retained for a slot, which the next publication will freeze.
   * Idempotent on `(exercice, slot)`: retaining another variant replaces it,
   * and `GET /comments` marks it back with `isRetained`.
   *
   * The same route discards a slot, under `retainNone` — retaining nothing is
   * a choice of the same kind, and it is undone by retaining a reading again.
   */
  static async retainComment(
    entityId: number,
    exerciceId: number,
    slotId: string,
    payload: RetainedCommentPayload,
  ): Promise<void> {
    await api.gateway.post(
      `${API_PREFIXES.KEY_MOMENTS}/accounts/${entityId}/exercices/${exerciceId}/slots/${slotId}/comments/retain`,
      payload,
    )
  }

  /**
   * Writes the whole list rather than one sub-section: the decision is read back
   * as a whole, and a replayed call always says the same thing.
   */
  static async saveHiddenWidgets(
    entityId: number,
    exerciceId: number,
    widgetIds: string[],
  ): Promise<void> {
    await api.gateway.put(
      `${API_PREFIXES.KEY_MOMENTS}/accounts/${entityId}/exercices/${exerciceId}/hidden-widgets`,
      { widgetIds },
    )
  }

  /**
   * Answers `201` with no body: what was published is read back from the
   * publications of the account, never from what the front just sent.
   */
  static async publish(entityId: number, payload: PublishPayload): Promise<void> {
    await api.gateway.post(`${API_PREFIXES.KEY_MOMENTS}/accounts/${entityId}/publish`, payload)
  }

  /**
   * Retires a publication without erasing it: the microservice keeps what was
   * frozen and only drops it from the active publications, which is what
   * `GET /published` serves.
   */
  static async unpublish(entityId: number, publicationId: number): Promise<void> {
    await api.gateway.post(
      `${API_PREFIXES.KEY_MOMENTS}/accounts/${entityId}/published/${publicationId}/unpublish`,
    )
  }

  static async getPublications(entityId: number): Promise<PublicationPayload[]> {
    const { data } = await api.gateway.get<PublicationPayload[]>(
      `${API_PREFIXES.KEY_MOMENTS}/accounts/${entityId}/published`,
    )

    return data
  }

  /**
   * The arbitration a publication froze. The summaries carry no comment at all,
   * so what was actually retained is only ever read here.
   */
  static async getPublication(
    entityId: number,
    publicationId: number,
  ): Promise<PublicationDetailPayload> {
    const { data } = await api.gateway.get<PublicationDetailPayload>(
      `${API_PREFIXES.KEY_MOMENTS}/accounts/${entityId}/published/${publicationId}`,
    )

    return data
  }

  /**
   * The document is sent unchecked: the microservice validates it against the
   * same JSON Schema the export is produced under.
   */
  static async importClosing(entityId: number, closing: unknown): Promise<void> {
    await api.gateway.post(`${API_PREFIXES.KEY_MOMENTS}/accounts/${entityId}/key-moment`, closing)
  }
}
