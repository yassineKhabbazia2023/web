import { ref } from 'vue'
import { flushPromises } from '@vue/test-utils'
import { logger } from '@pulse/toolbox'
import { displayNotification } from '@pulse/styleguide'
import { withSetup } from '@pulse/toolbox/utils/test'
import { getStoreMock } from '@pulse/common/mocks/vitest'
import { armCurrentUserPermissions } from '@pulse/common/mocks/vitest/current-user.permissions.helper'
import { RecommendationPriority, RecommendationRubric } from '../../enums/key-moments.enums'
import { RecommendationsService } from '../../services/recommendations.service'
import { useOffersCatalogStore } from '../../stores/offers-catalog.store'
import { useRecommendationThemesStore } from '../../stores/recommendation-themes.store'
import { catalogWithSearchTerms } from '../../utils/offers.utils'
import { useRecommendations } from './recommendations.composable'
import type { ExerciceRecommendationsPayload } from '../../services/recommendations.service.types'

const ENTITY_ID = 42
const EXERCICE_ID = 7

const EMPTY_FIELDS = { priority: null, observations: null, risk: null, recommendation: null }

const THEMES = [
  { id: 1, rubric: RecommendationRubric.MANAGEMENT, label: 'Trésorerie' },
  { id: 2, rubric: RecommendationRubric.MANAGEMENT, label: 'Cash' },
  { id: 3, rubric: RecommendationRubric.SOCIAL, label: 'Épargne' },
  { id: 4, rubric: RecommendationRubric.SECTOR, label: 'TVA' },
]

const DRAFT: ExerciceRecommendationsPayload = {
  categoryId: 1,
  recommendations: [
    { ...EMPTY_FIELDS, themeId: 1, recommendation: 'Reco.', offerIds: [10], isHidden: false, isFromCategory: true },
    { ...EMPTY_FIELDS, themeId: 3, offerIds: [], isHidden: true, isFromCategory: false },
  ],
}

const CATALOG = catalogWithSearchTerms([
  { id: 10, title: 'Tableau de bord', subCategory: { subCategoryId: 1, name: 'Pilotage', category: { categoryId: 1, name: 'Gestion' } } },
])

function setup(draft: ExerciceRecommendationsPayload = DRAFT) {
  const exerciceId = ref<number | undefined>(EXERCICE_ID)
  const draftRef = ref<ExerciceRecommendationsPayload | undefined>(draft)
  const [composable, app] = withSetup(() => useRecommendations({ entityId: ENTITY_ID, exerciceId, draft: draftRef }))

  return { ...composable, exerciceId, draftRef, app }
}

beforeEach(() => {
  vi.useFakeTimers()
  armCurrentUserPermissions(true)
  getStoreMock(useRecommendationThemesStore).themes = THEMES
  vi.spyOn(RecommendationsService, 'getCategories').mockResolvedValue([{ id: 1, label: 'BTP', pitch: 'Chantiers.' }])
  vi.spyOn(RecommendationsService, 'getCategoryRecommendations').mockResolvedValue([])
  vi.spyOn(RecommendationsService, 'saveRecommendations').mockResolvedValue()
  getStoreMock(useOffersCatalogStore).catalog = CATALOG
})

afterEach(() => {
  vi.useRealTimers()
})

describe('useRecommendations', () => {
  it('should hold the draft, name its category and resolve its offers, without writing anything', async () => {
    const { hasCategory, categoryLabel, rubricViews, totalCount, visibleCount, publishableRecommendations } = setup()
    await flushPromises()

    expect(hasCategory.value).toBe(true)
    expect(categoryLabel.value).toBe('BTP')
    expect(totalCount.value).toBe(2)
    expect(visibleCount.value).toBe(1)
    expect(rubricViews.value).toHaveLength(5)
    expect(rubricViews.value[0].views[0].offers[0]).toEqual(expect.objectContaining({ title: 'Tableau de bord', isRetired: false }))
    expect(publishableRecommendations.value).toHaveLength(1)
    expect(vi.mocked(RecommendationsService.saveRecommendations)).not.toHaveBeenCalled()
  })

  it('should name each line from the themes, and publish them worded as the client reads them', async () => {
    const { rubricViews, publishableRecommendations } = setup()
    await flushPromises()

    expect(rubricViews.value[0].views[0].themeLabel).toBe('Trésorerie')
    expect(rubricViews.value[3].views[0].themeLabel).toBe('Épargne')
    expect(publishableRecommendations.value[0]).toEqual(expect.objectContaining({ rubric: RecommendationRubric.MANAGEMENT, theme: 'Trésorerie' }))
  })

  it('should hold a draft without a category', async () => {
    const { hasCategory } = setup({ categoryId: null, recommendations: [] })
    await flushPromises()

    expect(hasCategory.value).toBe(false)
  })

  it('should hold a draft whose list is missing as an empty one', async () => {
    const { totalCount, rubricViews } = setup({ recommendations: null } as unknown as ExerciceRecommendationsPayload)
    await flushPromises()

    expect(totalCount.value).toBe(0)
    expect(rubricViews.value.every(view => view.views.length === 0)).toBe(true)
  })

  it('should say the themes could not be read', async () => {
    vi.mocked(getStoreMock(useRecommendationThemesStore).readThemes).mockRejectedValueOnce(new Error('down'))
    const { areThemesUnreadable } = setup()
    await flushPromises()

    expect(areThemesUnreadable.value).toBe(true)
    expect(vi.mocked(logger.error)).toHaveBeenCalled()
  })

  it('should read nothing without the offer permission', async () => {
    armCurrentUserPermissions(false)
    const { canSeeRecommendations, recommendations } = setup()
    await flushPromises()

    expect(canSeeRecommendations.value).toBe(false)
    expect(recommendations.value).toEqual([])
    expect(vi.mocked(getStoreMock(useOffersCatalogStore).readCatalog)).not.toHaveBeenCalled()
  })

  it('should write a text change once the pause is over, the whole list with its category', async () => {
    const { rubricViews, updateRecommendation } = setup()
    await flushPromises()

    updateRecommendation(rubricViews.value[0].views[0].key, { recommendation: 'Modif' })
    updateRecommendation(rubricViews.value[0].views[0].key, { recommendation: 'Modifiée' })

    expect(vi.mocked(RecommendationsService.saveRecommendations)).not.toHaveBeenCalled()

    await vi.advanceTimersByTimeAsync(800)

    expect(vi.mocked(RecommendationsService.saveRecommendations)).toHaveBeenCalledExactlyOnceWith(ENTITY_ID, EXERCICE_ID, {
      categoryId: 1,
      recommendations: [
        { ...EMPTY_FIELDS, themeId: 1, recommendation: 'Modifiée', offerIds: [10], isHidden: false, isFromCategory: true },
        { ...EMPTY_FIELDS, themeId: 3, offerIds: [], isHidden: true, isFromCategory: false },
      ],
    })
  })

  it('should write a removal and a move at once', async () => {
    const { removeRecommendation, moveRecommendation, addRecommendation } = setup()
    await flushPromises()

    const key = addRecommendation(RecommendationRubric.MANAGEMENT)
    moveRecommendation(key, 0)
    await flushPromises()
    removeRecommendation(key)
    await flushPromises()

    expect(vi.mocked(RecommendationsService.saveRecommendations)).toHaveBeenCalledTimes(2)
  })

  it('should never write a line without a theme, and not count it as publishable', async () => {
    const { addRecommendation, updateRecommendation, totalCount, publishableRecommendations, withoutThemeCount, flushSave } = setup()
    await flushPromises()

    const key = addRecommendation(RecommendationRubric.WEALTH)
    updateRecommendation(key, { observations: 'Vu' })
    await flushSave()

    expect(totalCount.value).toBe(3)
    expect(publishableRecommendations.value).toHaveLength(1)
    expect(withoutThemeCount.value).toBe(1)
    expect(vi.mocked(RecommendationsService.saveRecommendations).mock.calls[0][2].recommendations).toHaveLength(2)
  })

  it('should count a hidden line without a theme, which would be lost as much as a visible one', async () => {
    const { addRecommendation, updateRecommendation, withoutThemeCount } = setup()
    await flushPromises()

    const key = addRecommendation(RecommendationRubric.WEALTH)
    updateRecommendation(key, { isHidden: true })

    expect(withoutThemeCount.value).toBe(1)
  })

  it('should stop adding at a hundred lines', async () => {
    const { addRecommendation, canAdd } = setup({ recommendations: [] })
    await flushPromises()

    Array.from({ length: 100 }).forEach(() => addRecommendation(RecommendationRubric.SECTOR))

    expect(canAdd.value).toBe(false)
  })

  describe('flushSave', () => {
    it('should write what the pause still holds and tell it went through', async () => {
      const { rubricViews, updateRecommendation, flushSave } = setup()
      await flushPromises()

      updateRecommendation(rubricViews.value[0].views[0].key, { priority: RecommendationPriority.PRIMARY })

      expect(await flushSave()).toBe(true)
      expect(vi.mocked(RecommendationsService.saveRecommendations)).toHaveBeenCalledOnce()
      expect(await flushSave()).toBe(true)
      expect(vi.mocked(RecommendationsService.saveRecommendations)).toHaveBeenCalledOnce()
    })

    it('should tell a refused save, keep the copy and send it again on the next flush', async () => {
      vi.mocked(RecommendationsService.saveRecommendations).mockRejectedValueOnce(new Error('down'))
      const { rubricViews, updateRecommendation, flushSave, hasSaveFailed } = setup()
      await flushPromises()

      updateRecommendation(rubricViews.value[0].views[0].key, { risk: 'R' })

      expect(await flushSave()).toBe(false)
      expect(hasSaveFailed.value).toBe(true)
      expect(vi.mocked(logger.error)).toHaveBeenCalled()
      expect(vi.mocked(displayNotification)).toHaveBeenCalledWith('error', expect.any(String))
      expect(rubricViews.value[0].views[0].risk).toBe('R')

      expect(await flushSave()).toBe(true)
      expect(hasSaveFailed.value).toBe(false)
      expect(vi.mocked(RecommendationsService.saveRecommendations)).toHaveBeenCalledTimes(2)
    })

    it('should flag the lines refused for their theme until they change it, and clear the flags once a save goes through', async () => {
      vi.mocked(RecommendationsService.saveRecommendations).mockRejectedValueOnce({
        response: {
          status: 422,
          data: {
            code: 'unknown-theme',
            errors: [{ code: 'unknown-theme', pointer: '/recommendations/1/themeId', detail: 'Theme 3 is not in the referential.' }],
          },
        },
      })
      const { rubricViews, updateRecommendation, flushSave } = setup()
      await flushPromises()

      updateRecommendation(rubricViews.value[0].views[0].key, { risk: 'R' })

      expect(await flushSave()).toBe(false)
      expect(rubricViews.value[3].views[0].isThemeRefused).toBe(true)
      expect(rubricViews.value[0].views[0].isThemeRefused).toBe(false)
      expect(vi.mocked(displayNotification)).toHaveBeenCalledWith('error', 'keyMoments.recommendations.unknownThemeError')

      updateRecommendation(rubricViews.value[0].views[0].key, { risk: 'R2' })

      expect(rubricViews.value[3].views[0].isThemeRefused).toBe(true)
      expect(await flushSave()).toBe(true)
      expect(rubricViews.value[3].views[0].isThemeRefused).toBe(false)
    })

    it('should clear the flag of a refused line once its theme changes', async () => {
      vi.mocked(RecommendationsService.saveRecommendations).mockRejectedValueOnce({
        response: {
          status: 422,
          data: { code: 'unknown-theme', errors: [{ code: 'unknown-theme', pointer: '/recommendations/0/themeId', detail: '' }] },
        },
      })
      const { rubricViews, updateRecommendation, flushSave } = setup()
      await flushPromises()

      updateRecommendation(rubricViews.value[0].views[0].key, { risk: 'R' })
      await flushSave()
      updateRecommendation(rubricViews.value[0].views[0].key, { themeId: 2 })

      expect(rubricViews.value[0].views[0].isThemeRefused).toBe(false)
    })

    it('should write the saves one after the other', async () => {
      let resolveFirst: () => void = () => {}
      vi.mocked(RecommendationsService.saveRecommendations)
        .mockImplementationOnce(() => new Promise<void>((resolve) => {
          resolveFirst = resolve
        }))
      const { rubricViews, removeRecommendation, updateRecommendation, isSaving } = setup()
      await flushPromises()

      removeRecommendation(rubricViews.value[3].views[0].key)
      updateRecommendation(rubricViews.value[0].views[0].key, { themeId: 2 })
      await vi.advanceTimersByTimeAsync(800)

      expect(isSaving.value).toBe(true)
      expect(vi.mocked(RecommendationsService.saveRecommendations)).toHaveBeenCalledOnce()

      resolveFirst()
      await flushPromises()

      expect(vi.mocked(RecommendationsService.saveRecommendations)).toHaveBeenCalledTimes(2)
      expect(vi.mocked(RecommendationsService.saveRecommendations).mock.calls[1][2].recommendations[0].themeId).toBe(2)
    })
  })

  describe('discardPendingSave', () => {
    it('should write nothing of what the pause holds, and nothing when the draft is read again', async () => {
      const { rubricViews, updateRecommendation, discardPendingSave, draftRef } = setup()
      await flushPromises()

      updateRecommendation(rubricViews.value[0].views[0].key, { risk: 'R' })
      await discardPendingSave()
      await vi.advanceTimersByTimeAsync(800)
      draftRef.value = { ...DRAFT }
      await flushPromises()

      expect(vi.mocked(RecommendationsService.saveRecommendations)).not.toHaveBeenCalled()
      expect(rubricViews.value[0].views[0].risk).toBeUndefined()
    })

    it('should wait on the save already sent, and not send it again once refused', async () => {
      let rejectSent: (error: Error) => void = () => {}
      vi.mocked(RecommendationsService.saveRecommendations)
        .mockImplementationOnce(() => new Promise<void>((_resolve, reject) => {
          rejectSent = reject
        }))
      const { rubricViews, removeRecommendation, discardPendingSave, flushSave } = setup()
      await flushPromises()

      removeRecommendation(rubricViews.value[0].views[0].key)
      let isDiscarded = false
      const discarding = discardPendingSave().then(() => {
        isDiscarded = true
      })
      await flushPromises()

      expect(isDiscarded).toBe(false)

      rejectSent(new Error('down'))
      await discarding
      await flushSave()

      expect(vi.mocked(RecommendationsService.saveRecommendations)).toHaveBeenCalledOnce()
    })
  })

  describe('resumeDiscardedSave', () => {
    it('should send what the pause held once the replacement did not come', async () => {
      const { rubricViews, updateRecommendation, discardPendingSave, resumeDiscardedSave } = setup()
      await flushPromises()

      updateRecommendation(rubricViews.value[0].views[0].key, { risk: 'R' })
      await discardPendingSave()
      resumeDiscardedSave()
      await flushPromises()

      expect(vi.mocked(RecommendationsService.saveRecommendations)).toHaveBeenCalledOnce()
      expect(vi.mocked(RecommendationsService.saveRecommendations).mock.calls[0][2].recommendations[0].risk).toBe('R')
    })

    it('should send again a save refused before the replacement', async () => {
      vi.mocked(RecommendationsService.saveRecommendations).mockRejectedValueOnce(new Error('down'))
      const { rubricViews, removeRecommendation, discardPendingSave, resumeDiscardedSave, flushSave } = setup()
      await flushPromises()

      removeRecommendation(rubricViews.value[0].views[0].key)
      await flushSave()
      await discardPendingSave()
      resumeDiscardedSave()
      await flushPromises()

      expect(vi.mocked(RecommendationsService.saveRecommendations)).toHaveBeenCalledTimes(2)
    })

    it('should send nothing when nothing was given up, nor once the draft was read again', async () => {
      const { rubricViews, updateRecommendation, discardPendingSave, resumeDiscardedSave, draftRef } = setup()
      await flushPromises()

      await discardPendingSave()
      resumeDiscardedSave()
      updateRecommendation(rubricViews.value[0].views[0].key, { risk: 'R' })
      await discardPendingSave()
      draftRef.value = { ...DRAFT }
      await flushPromises()
      resumeDiscardedSave()
      await flushPromises()

      expect(vi.mocked(RecommendationsService.saveRecommendations)).not.toHaveBeenCalled()
    })
  })

  describe('chooseCategory', () => {
    it('should copy the category visible, its themes locked, over the list and write it at once', async () => {
      vi.mocked(RecommendationsService.getCategoryRecommendations)
        .mockResolvedValueOnce([{ ...EMPTY_FIELDS, themeId: 4, offerIds: [] }])
      const { chooseCategory, categoryId, recommendations } = setup({ recommendations: [] })
      await flushPromises()

      await chooseCategory(1)

      expect(categoryId.value).toBe(1)
      expect(recommendations.value).toEqual([expect.objectContaining({ themeId: 4, isHidden: false, isFromCategory: true })])
      expect(vi.mocked(RecommendationsService.saveRecommendations)).toHaveBeenCalledWith(ENTITY_ID, EXERCICE_ID, {
        categoryId: 1,
        recommendations: [{ ...EMPTY_FIELDS, themeId: 4, offerIds: [], isHidden: false, isFromCategory: true }],
      })
    })

    it('should keep the list when the category cannot be read', async () => {
      vi.mocked(RecommendationsService.getCategoryRecommendations).mockRejectedValueOnce(new Error('down'))
      const { chooseCategory, categoryId, totalCount } = setup()
      await flushPromises()

      await chooseCategory(2)

      expect(categoryId.value).toBe(1)
      expect(totalCount.value).toBe(2)
      expect(vi.mocked(displayNotification)).toHaveBeenCalledWith('error', expect.any(String))
    })
  })

  describe('another draft', () => {
    it('should write what the pause held to the exercice it belongs to, then hold the new draft', async () => {
      const { rubricViews, updateRecommendation, draftRef, exerciceId, totalCount } = setup()
      await flushPromises()

      updateRecommendation(rubricViews.value[0].views[0].key, { themeId: 2 })
      exerciceId.value = 8
      draftRef.value = { recommendations: [] }
      await flushPromises()

      expect(totalCount.value).toBe(0)
      expect(vi.mocked(RecommendationsService.saveRecommendations)).toHaveBeenCalledOnce()
      expect(vi.mocked(RecommendationsService.saveRecommendations).mock.calls[0][1]).toBe(EXERCICE_ID)
      expect(vi.mocked(RecommendationsService.saveRecommendations).mock.calls[0][2].recommendations[0].themeId).toBe(2)
    })

    it('should hold nothing on an unreadable draft', async () => {
      const { totalCount, hasCategory, draftRef } = setup()
      await flushPromises()

      draftRef.value = undefined
      await flushPromises()

      expect(totalCount.value).toBe(0)
      expect(hasCategory.value).toBe(false)
    })
  })

  it('should write what the pause holds when the page leaves', async () => {
    const { rubricViews, updateRecommendation, app } = setup()
    await flushPromises()

    updateRecommendation(rubricViews.value[0].views[0].key, { themeId: 2 })
    app.unmount()
    await flushPromises()

    expect(vi.mocked(RecommendationsService.saveRecommendations)).toHaveBeenCalledOnce()
  })
})
