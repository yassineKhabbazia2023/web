import { logger } from '@pulse/toolbox'
import { displayNotification } from '@pulse/styleguide'
import { usePublications } from './publication.composable'
import { KeyMomentsService } from '../../services/key-moments.service'
import type {
  PublicationDetailPayload,
  PublicationPayload,
} from '../../services/key-moments.service.types'

/** One published exercice, 7; exercice 8 has never been published. */
const PUBLICATIONS: PublicationPayload[] = [
  {
    id: 99,
    exerciceId: 7,
    closingId: 90,
    closingVersion: 2,
    templateId: 1,
    templateVersion: '1.0.0',
    publishedBy: '123',
    publishedByName: 'John Doe',
    publishedAt: '2026-08-13T09:40:00Z',
    preferenceComparisonExercice: 'N-1',
    preferenceCurrencyDisplay: 'euro',
  },
  {
    id: 98,
    exerciceId: 7,
    closingId: 90,
    closingVersion: 1,
    templateId: 1,
    templateVersion: '1.0.0',
    publishedBy: '456',
    publishedByName: 'Marie Leroy',
    publishedAt: '2026-08-01T09:40:00Z',
    preferenceComparisonExercice: 'N-1',
    preferenceCurrencyDisplay: 'euro',
  },
]

const DETAIL: PublicationDetailPayload = {
  ...PUBLICATIONS[0],
  isActive: true,
  recommendations: [],
  comments: [{
    slotId: 'synthese',
    text: 'À nuancer.',
  }],
  hiddenWidgetIds: ['effectifs'],
}

beforeEach(() => {
  vi.spyOn(KeyMomentsService, 'getPublications').mockResolvedValue(PUBLICATIONS)
  vi.spyOn(KeyMomentsService, 'getPublication').mockResolvedValue(DETAIL)
  vi.spyOn(KeyMomentsService, 'unpublish').mockResolvedValue()
  vi.spyOn(KeyMomentsService, 'restorePublished').mockResolvedValue()
})

describe('usePublications', () => {

  describe('reading what is published', () => {

    it('should tell a published exercice apart from one that never was', async () => {
      const { loadPublications, publicationOf } = usePublications(42)

      await loadPublications()

      expect(publicationOf(7)?.id).toBe(99)
      expect(publicationOf(8)).toBeUndefined()
    })

    /** Two publications on one exercice: the client reads the most recent. */
    it('should read the most recent publication of an exercice', async () => {
      const { loadPublications, publicationOf } = usePublications(42)

      await loadPublications()

      expect(publicationOf(7)?.publishedByName).toBe('John Doe')
    })

    it('should read everything the publication of an exercice froze', async () => {
      const { loadPublications, openExercice, publicationDetail } = usePublications(42)
      await loadPublications()

      await openExercice(7)

      expect(vi.mocked(KeyMomentsService.getPublication)).toHaveBeenCalledWith(42, 99)
      expect(publicationDetail.value?.comments[0].text).toBe('À nuancer.')
      expect(publicationDetail.value?.hiddenWidgetIds).toEqual(['effectifs'])
    })

    it('should read no detail on an exercice that never had a publication', async () => {
      const { loadPublications, openExercice, publicationDetail } = usePublications(42)
      await loadPublications()

      await openExercice(8)

      expect(vi.mocked(KeyMomentsService.getPublication)).not.toHaveBeenCalled()
      expect(publicationDetail.value).toBeUndefined()
    })

    /**
     * Not knowing what is published is never being up to date: the detail is
     * left absent, which is what makes the page offer to publish rather than
     * claim anything.
     */
    it('should leave the detail absent when it cannot be read', async () => {
      vi.spyOn(KeyMomentsService, 'getPublication').mockRejectedValue(new Error('boom'))
      const { loadPublications, openExercice, publicationDetail } = usePublications(42)
      await loadPublications()

      await openExercice(7)

      expect(publicationDetail.value).toBeUndefined()
      expect(vi.mocked(logger.error)).toHaveBeenCalled()
    })

    /** An exercice opened over another must never compare against the first. */
    it('should drop the detail of the exercice it leaves', async () => {
      const { loadPublications, openExercice, publicationDetail } = usePublications(42)
      await loadPublications()
      await openExercice(7)

      await openExercice(8)

      expect(publicationDetail.value).toBeUndefined()
    })
  })

  describe('resolving the published preferences', () => {

    it('should resolve the reading a published exercice was published under', async () => {
      const { resolvePublishedPreferences } = usePublications(42)

      const preferences = await resolvePublishedPreferences(7)

      expect(preferences).toEqual({
        templateId: 1,
        referenceKey: 'N-1',
        isInThousands: false,
      })
    })

    it('should resolve no preferences for an exercice that never was published', async () => {
      const { resolvePublishedPreferences } = usePublications(42)

      expect(await resolvePublishedPreferences(8)).toBeUndefined()
    })

    it('should read a publication in thousands as such', async () => {
      vi.mocked(KeyMomentsService.getPublications).mockResolvedValue([
        { ...PUBLICATIONS[0], preferenceCurrencyDisplay: 'thousands' },
      ])
      const { resolvePublishedPreferences } = usePublications(42)

      const preferences = await resolvePublishedPreferences(7)

      expect(preferences?.isInThousands).toBe(true)
    })
  })

  describe('unpublishing', () => {

    /** The published state comes from the back, here as everywhere else. */
    it('should retire the publication and re-read what is published', async () => {
      vi.mocked(KeyMomentsService.getPublications)
        .mockResolvedValueOnce(PUBLICATIONS)
        .mockResolvedValueOnce([])
      const { loadPublications, publicationOf, unpublish } = usePublications(42)
      await loadPublications()

      const hasWorked = await unpublish(99)

      expect(hasWorked).toBe(true)
      expect(vi.mocked(KeyMomentsService.unpublish)).toHaveBeenCalledWith(42, 99)
      expect(vi.mocked(displayNotification)).toHaveBeenCalledWith('success', expect.any(String))
      expect(publicationOf(7)).toBeUndefined()
    })

    /** A view that failed to withdraw its subject must stay where it is. */
    it('should notify the failure, re-read nothing and say it failed', async () => {
      vi.spyOn(KeyMomentsService, 'unpublish').mockRejectedValue(new Error('boom'))
      const { loadPublications, publicationOf, unpublish } = usePublications(42)
      await loadPublications()

      const hasWorked = await unpublish(99)

      expect(hasWorked).toBe(false)
      expect(vi.mocked(displayNotification)).toHaveBeenCalledWith('error', expect.any(String))
      expect(vi.mocked(KeyMomentsService.getPublications)).toHaveBeenCalledOnce()
      expect(publicationOf(7)?.id).toBe(99)
    })
  })

  describe('restoring the published version', () => {

    it('should restore the draft of the exercice and say it worked', async () => {
      const { restorePublished, isRestoring } = usePublications(42)

      const restoring = restorePublished(7)

      expect(isRestoring.value).toBe(true)
      expect(await restoring).toBe(true)
      expect(isRestoring.value).toBe(false)
      expect(vi.mocked(KeyMomentsService.restorePublished)).toHaveBeenCalledWith(42, 7)
      expect(vi.mocked(displayNotification)).toHaveBeenCalledWith('success', expect.any(String))
    })

    it('should notify the failure and say it failed', async () => {
      vi.mocked(KeyMomentsService.restorePublished).mockRejectedValue(new Error('boom'))
      const { restorePublished, isRestoring } = usePublications(42)

      expect(await restorePublished(7)).toBe(false)
      expect(isRestoring.value).toBe(false)
      expect(vi.mocked(logger.error)).toHaveBeenCalled()
      expect(vi.mocked(displayNotification)).toHaveBeenCalledWith('error', expect.any(String))
    })

    it('should read the publications again when the exercice is no longer published', async () => {
      vi.mocked(KeyMomentsService.restorePublished).mockRejectedValue({
        response: { status: 409, data: { code: 'not-published' } },
      })
      vi.mocked(KeyMomentsService.getPublications).mockResolvedValue([])
      const { restorePublished, publicationOf, publicationDetail } = usePublications(42)

      expect(await restorePublished(7)).toBe(false)
      expect(vi.mocked(displayNotification))
        .toHaveBeenCalledWith('error', 'keyMoments.publish.restore.notPublished')
      expect(publicationOf(7)).toBeUndefined()
      expect(publicationDetail.value).toBeUndefined()
    })

    it('should restore nothing without an account', async () => {
      const { restorePublished } = usePublications(null)

      expect(await restorePublished(7)).toBe(false)
      expect(vi.mocked(KeyMomentsService.restorePublished)).not.toHaveBeenCalled()
    })
  })
})
