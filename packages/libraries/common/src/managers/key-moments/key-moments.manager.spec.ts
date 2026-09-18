import { logger } from '@pulse/toolbox'
import { getStoreMock } from '@pulse/common/mocks/vitest'
import { useCurrentEntityStore, useUserStore } from '../../stores/main'
import { PublishedKeyMomentsService } from '../../services/key-moments/key-moments.service'
import { FeatureFlagManager } from '../feature-flag/feature-flag.manager'
import { KeyMomentsManager } from './key-moments.manager'

const currentEntityStoreMock = getStoreMock(useCurrentEntityStore)
const userStoreMock = getStoreMock(useUserStore)

describe('KeyMomentsManager.canShowKeyMoments', () => {
  it.each([
    {
      description: 'returns false if the feature is switched off',
      isKeyMomentsEnabled: false,
      isCollab: true,
      currentEntityId: 1,
      hasPublishedKeyMoments: true,
      expected: false,
    },
    {
      description: 'returns true for a collaborator without reading the account',
      isKeyMomentsEnabled: true,
      isCollab: true,
      currentEntityId: 1,
      hasPublishedKeyMoments: false,
      expected: true,
    },
    {
      description: 'returns false for a client with no entity in context',
      isKeyMomentsEnabled: true,
      isCollab: false,
      currentEntityId: undefined,
      hasPublishedKeyMoments: true,
      expected: false,
    },
    {
      description: 'returns true for a client whose account has a published key moment',
      isKeyMomentsEnabled: true,
      isCollab: false,
      currentEntityId: 1,
      hasPublishedKeyMoments: true,
      expected: true,
    },
    {
      description: 'returns false for a client whose account has nothing published',
      isKeyMomentsEnabled: true,
      isCollab: false,
      currentEntityId: 1,
      hasPublishedKeyMoments: false,
      expected: false,
    },
  ])(
    '$description',
    async ({ isKeyMomentsEnabled, isCollab, currentEntityId, hasPublishedKeyMoments, expected }) => {
      vi.spyOn(FeatureFlagManager, 'isKeyMomentsActivated').mockReturnValue(isKeyMomentsEnabled)
      userStoreMock.isCollab = isCollab
      currentEntityStoreMock.currentEntityId = currentEntityId
      const hasPublishedKeyMomentsSpy = vi.spyOn(PublishedKeyMomentsService, 'hasPublishedKeyMoments')
        .mockResolvedValue(hasPublishedKeyMoments)

      const result = await KeyMomentsManager.canShowKeyMoments()

      expect(result).toBe(expected)

      if (isKeyMomentsEnabled && isCollab === false && currentEntityId !== undefined) {
        expect(hasPublishedKeyMomentsSpy).toHaveBeenCalledExactlyOnceWith(currentEntityId)
      } else {
        expect(hasPublishedKeyMomentsSpy).not.toHaveBeenCalled()
      }
    },
  )

  it('should hide the entry and warn when the account cannot be read', async () => {
    vi.spyOn(FeatureFlagManager, 'isKeyMomentsActivated').mockReturnValue(true)
    userStoreMock.isCollab = false
    currentEntityStoreMock.currentEntityId = 1
    const failure = new Error('boom')
    vi.spyOn(PublishedKeyMomentsService, 'hasPublishedKeyMoments').mockRejectedValue(failure)

    const result = await KeyMomentsManager.canShowKeyMoments()

    expect(result).toBe(false)
    expect(vi.mocked(logger.warn)).toHaveBeenCalledWith(expect.any(String), failure)
  })
})
