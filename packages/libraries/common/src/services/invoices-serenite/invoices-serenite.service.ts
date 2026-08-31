import { api } from '@pulse/common/api'

import { API_PREFIXES } from '../../constants/api-prefixes'
import type {
  InvoicesSereniteAnswerRequest,
  InvoicesSereniteModalResponse,
  InvoicesSereniteResponseResult,
} from './invoices-serenite.service.types'

// Single global resource: GET tells whether the modal must be displayed, POST records that it was seen
const SERENITY_MODAL_URL = `${API_PREFIXES.CONNECT}/serenity-modal`

export class InvoicesSereniteService {
  /**
   * Tells whether the Serenite modal must be displayed: the backend checks that the current user's wallet
   * contains at least one eligible entity (B2B routing code, no electronic address id, no Pennylane offer)
   * and that the user has not seen the modal yet.
   */
  static async fetchShouldDisplayModal(): Promise<boolean> {
    const { data } = await api.gateway.get<InvoicesSereniteModalResponse>(SERENITY_MODAL_URL)

    return data.shouldDisplay
  }

  /**
   * Records that the user has seen the modal so it is never displayed again for this user.
   * The backend answers 204, 400 (invalid payload) or 409 (already seen).
   */
  static async markModalAsSeen(result: InvoicesSereniteResponseResult): Promise<void> {
    const payload: InvoicesSereniteAnswerRequest = { isAccepted: result === 'yes' }

    await api.gateway.post(SERENITY_MODAL_URL, payload)
  }
}
