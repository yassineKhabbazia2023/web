import { displayNotification } from '@pulse/styleguide'
import { getStoreMock } from '@pulse/common/mocks/vitest'
import { RECOMMENDATIONS_MAX_COUNT } from '../const/key-moments.consts'
import { RecommendationRubric } from '../enums/key-moments.enums'
import { useOffersCatalogStore } from '../stores/offers-catalog.store'
import { useRecommendationThemesStore } from '../stores/recommendation-themes.store'
import { emptyRecommendation } from '../utils/recommendations.utils'
import { useRecommendationList } from './use-recommendation-list.composable'

const THEMES = [
  { id: 1, rubric: RecommendationRubric.MANAGEMENT, label: 'Trésorerie' },
  { id: 2, rubric: RecommendationRubric.MANAGEMENT, label: 'Cash' },
]

const UNKNOWN_THEME_ERROR = {
  response: {
    status: 422,
    data: { code: 'unknown-theme', errors: [{ code: 'unknown-theme', pointer: '/recommendations/0/themeId', detail: '' }] },
  },
}

beforeEach(() => {
  getStoreMock(useRecommendationThemesStore).themes = THEMES
  getStoreMock(useOffersCatalogStore).catalog = []
})

describe('useRecommendationList', () => {
  it('should add an empty line to its rubric and hand its key back', () => {
    const { addRecommendation, rubricViews } = useRecommendationList()

    const key = addRecommendation(RecommendationRubric.SOCIAL)

    expect(rubricViews.value.find(view => view.rubric === RecommendationRubric.SOCIAL)?.views[0].key).toBe(key)
  })

  it('should patch, move and remove a line', () => {
    const { hold, recommendations, updateRecommendation, moveRecommendation, removeRecommendation } = useRecommendationList()
    const first = { ...emptyRecommendation(RecommendationRubric.MANAGEMENT), themeId: 1 }
    const second = { ...emptyRecommendation(RecommendationRubric.MANAGEMENT), themeId: 2 }
    hold([first, second])

    updateRecommendation(first.key, { risk: 'R' })
    moveRecommendation(first.key, 1)

    expect(recommendations.value.map(line => line.key)).toEqual([second.key, first.key])
    expect(recommendations.value[1].risk).toBe('R')

    removeRecommendation(second.key)

    expect(recommendations.value.map(line => line.key)).toEqual([first.key])
  })

  it('should stop offering to add once the list is full', () => {
    const { hold, canAdd } = useRecommendationList()

    hold(Array.from({ length: RECOMMENDATIONS_MAX_COUNT }, () => emptyRecommendation(RecommendationRubric.MANAGEMENT)))

    expect(canAdd.value).toBe(false)
  })

  it('should mark and say a theme refusal, until the line changes its theme', () => {
    const { hold, recommendations, rubricViews, recordThemeRefusal, updateRecommendation } = useRecommendationList()
    const line = { ...emptyRecommendation(RecommendationRubric.MANAGEMENT), themeId: 1 }
    hold([line])

    expect(recordThemeRefusal(UNKNOWN_THEME_ERROR, recommendations.value)).toBe(true)
    expect(rubricViews.value[0].views[0].isThemeRefused).toBe(true)
    expect(vi.mocked(displayNotification)).toHaveBeenCalledWith('error', 'keyMoments.recommendations.unknownThemeError')

    updateRecommendation(line.key, { themeId: 2 })

    expect(rubricViews.value[0].views[0].isThemeRefused).toBe(false)
  })

  it('should leave a refusal of another kind to the editor', () => {
    const { recordThemeRefusal } = useRecommendationList()

    expect(recordThemeRefusal(new Error('down'), [])).toBe(false)
    expect(vi.mocked(displayNotification)).not.toHaveBeenCalled()
  })

  it('should forget the refusals when another list is held or they are cleared', () => {
    const { hold, recommendations, rubricViews, recordThemeRefusal, clearRefusals } = useRecommendationList()
    const line = { ...emptyRecommendation(RecommendationRubric.MANAGEMENT), themeId: 1 }
    hold([line])
    recordThemeRefusal(UNKNOWN_THEME_ERROR, recommendations.value)

    clearRefusals()

    expect(rubricViews.value[0].views[0].isThemeRefused).toBe(false)

    recordThemeRefusal(UNKNOWN_THEME_ERROR, recommendations.value)
    hold([line])

    expect(rubricViews.value[0].views[0].isThemeRefused).toBe(false)
  })
})
