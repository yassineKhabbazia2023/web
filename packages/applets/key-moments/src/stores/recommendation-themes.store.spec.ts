import { createPinia, setActivePinia } from 'pinia'
import { RecommendationRubric } from '../enums/key-moments.enums'
import { RecommendationsService } from '../services/recommendations.service'
import { useRecommendationThemesStore } from './recommendation-themes.store'

const THEMES = [{ id: 1, rubric: RecommendationRubric.MANAGEMENT, label: 'Outil de gestion' }]

beforeEach(() => {
  setActivePinia(createPinia())
})

describe('useRecommendationThemesStore', () => {
  it('should read the themes once for the session', async () => {
    vi.spyOn(RecommendationsService, 'getThemes').mockResolvedValue(THEMES)
    const store = useRecommendationThemesStore()

    await store.readThemes()
    await store.readThemes()

    expect(store.themes).toEqual(THEMES)
    expect(vi.mocked(RecommendationsService.getThemes)).toHaveBeenCalledOnce()
  })

  it('should read again after a failure', async () => {
    vi.spyOn(RecommendationsService, 'getThemes')
      .mockRejectedValueOnce(new Error('down'))
      .mockResolvedValueOnce(THEMES)
    const store = useRecommendationThemesStore()

    await expect(store.readThemes()).rejects.toThrow('down')
    await store.readThemes()

    expect(store.themes).toEqual(THEMES)
    expect(vi.mocked(RecommendationsService.getThemes)).toHaveBeenCalledTimes(2)
  })
})
