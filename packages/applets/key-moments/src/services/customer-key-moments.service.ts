import { api } from '@pulse/common/api'
import { API_PREFIXES } from '@pulse/common/constants'
import { validateTemplate } from '../validation/key-moments.validation'
import type {
  CustomerKeyMomentPayload,
  CustomerKeyMomentSummaryPayload,
} from './customer-key-moments.service.types'
import type { Closing, Indicators, Template } from '../types/key-moments.types'

/**
 * The only place that knows the URLs a client reads a key moment through.
 *
 * Every route is addressed by an account and an exercice, never by a delivery:
 * `KeyMomentsService` and its `closingId`/`publicationId` routes answer the
 * collaborator under an AAD token, and are closed to the client token.
 *
 * The reverse does not hold, and the mirror view depends on it: these routes
 * answer both tokens, which is what lets the collaborator read the client page
 * itself instead of a second rendering of it.
 */
export class CustomerKeyMomentsService {

  /**
   * The exercices the account has a published key moment on.
   *
   * Served **already sorted** by exercice end date, descending — the
   * chronology of the exercice, not that of the publication — and returned as
   * it comes. `KeyMomentsService.getExercices` re-sorts what it reads; this one
   * deliberately does not.
   */
  static async getPublishedExercices(
    entityId: number,
  ): Promise<CustomerKeyMomentSummaryPayload[]> {
    const { data } = await api.gateway.get<CustomerKeyMomentSummaryPayload[]>(
      `${API_PREFIXES.KEY_MOMENTS}/accounts/${entityId}/key-moments`,
    )

    return data
  }

  /** The retained texts of the exercice, and the preferences they were published under. */
  static async getKeyMoment(
    entityId: number,
    exerciceId: number,
  ): Promise<CustomerKeyMomentPayload> {
    const { data } = await api.gateway.get<CustomerKeyMomentPayload>(
      `${API_PREFIXES.KEY_MOMENTS}/accounts/${entityId}/exercices/${exerciceId}/key-moment`,
    )

    return data
  }

  /**
   * The document of the closing the active publication pinned, in the very
   * format the collaborator route serves: only the URL differs, so the parsing
   * and the rendering are shared.
   */
  static async getKeyMomentDocument(
    entityId: number,
    exerciceId: number,
  ): Promise<Closing> {
    const { data } = await api.gateway.get<Closing>(
      `${API_PREFIXES.KEY_MOMENTS}/accounts/${entityId}/exercices/${exerciceId}/key-moment/document`,
    )

    return data
  }

  /**
   * The template of the version the publication pinned — the route resolves the
   * version itself, which is why the client never carries one.
   *
   * Served verbatim, like the catalogue route, so it is validated defensively:
   * the validation rebuilds the document, and two calls never share a mutable
   * object.
   */
  static async getKeyMomentTemplate(
    entityId: number,
    exerciceId: number,
  ): Promise<Template> {
    const { data } = await api.gateway.get<unknown>(
      `${API_PREFIXES.KEY_MOMENTS}/accounts/${entityId}/exercices/${exerciceId}/key-moment/template`,
    )

    return validateTemplate(data)
  }

  /**
   * The accounting vocabulary, which the report cannot be assembled without.
   *
   * The only route of this surface the client shares with the collaborator:
   * `GET /indicators` answers both tokens (AAD and Gigya MyPulse v2), where
   * every write of the vocabulary stays AAD-only. Declared here rather than
   * borrowed from `KeyMomentsService` so that the client surface reads whole
   * from one class — and so that closing it later would move one method.
   */
  static async getIndicators(): Promise<Indicators> {
    const { data } = await api.gateway.get<Indicators>(`${API_PREFIXES.KEY_MOMENTS}/indicators`)

    return data
  }
}
