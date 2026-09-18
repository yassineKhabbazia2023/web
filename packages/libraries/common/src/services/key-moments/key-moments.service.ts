import { api } from '@pulse/common/api'
import { API_PREFIXES } from '../../constants/api-prefixes'

export class PublishedKeyMomentsService {
  /**
   * Whether the account has at least one published key moment.
   *
   * Reads the very list the client page opens on: the route is addressed by an
   * account, answers the client token, and returns the exercices a publication
   * is active on — so an empty array is an account with nothing to read.
   *
   * Declared here rather than borrowed from the applet because the navigation
   * lives in a library, which never depends on an applet.
   */
  static async hasPublishedKeyMoments(accountId: number): Promise<boolean> {
    const { data } = await api.gateway.get<unknown[]>(
      `${API_PREFIXES.KEY_MOMENTS}/accounts/${accountId}/key-moments`,
    )

    return (data?.length ?? 0) > 0
  }
}
