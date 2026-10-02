import { api } from '@pulse/common/api'
import { RecommendationPriority, RecommendationRubric } from '../enums/key-moments.enums'
import { RecommendationsService } from './recommendations.service'

const CATEGORIES = 'keymoments/api/recommendation-categories'
const CATEGORY = { id: 3, label: 'BTP', pitch: 'Chantiers.' }
const THEME = { id: 1, rubric: RecommendationRubric.MANAGEMENT, label: 'Outil de gestion' }
const RECOMMENDATION = {
  themeId: 1,
  priority: RecommendationPriority.PRIMARY,
  observations: null,
  risk: null,
  recommendation: 'Reco.',
  offerIds: [],
}

describe('RecommendationsService', () => {
  it('should read the themes', async () => {
    vi.mocked(api.gateway.get).mockResolvedValueOnce({ data: [THEME] })

    expect(await RecommendationsService.getThemes()).toEqual([THEME])
    expect(vi.mocked(api.gateway.get)).toHaveBeenCalledWith('keymoments/api/recommendation-themes')
  })

  it('should read the categories', async () => {
    vi.mocked(api.gateway.get).mockResolvedValueOnce({ data: [CATEGORY] })

    expect(await RecommendationsService.getCategories()).toEqual([CATEGORY])
    expect(vi.mocked(api.gateway.get)).toHaveBeenCalledWith(CATEGORIES)
  })

  it('should create and update a category', async () => {
    vi.mocked(api.gateway.post).mockResolvedValueOnce({ data: CATEGORY })
    vi.mocked(api.gateway.put).mockResolvedValueOnce({ data: CATEGORY })

    expect(await RecommendationsService.createCategory({ label: 'BTP', pitch: 'Chantiers.' })).toEqual(CATEGORY)
    expect(await RecommendationsService.updateCategory(3, { label: 'BTP', pitch: 'Chantiers.' })).toEqual(CATEGORY)
    expect(vi.mocked(api.gateway.post)).toHaveBeenCalledWith(CATEGORIES, { label: 'BTP', pitch: 'Chantiers.' })
    expect(vi.mocked(api.gateway.put)).toHaveBeenCalledWith(`${CATEGORIES}/3`, { label: 'BTP', pitch: 'Chantiers.' })
  })

  it('should delete a category', async () => {
    vi.mocked(api.gateway.delete).mockResolvedValueOnce({})

    await RecommendationsService.deleteCategory(3)

    expect(vi.mocked(api.gateway.delete)).toHaveBeenCalledWith(`${CATEGORIES}/3`)
  })

  it('should read and replace the recommendations of a category', async () => {
    vi.mocked(api.gateway.get).mockResolvedValueOnce({ data: [RECOMMENDATION] })
    vi.mocked(api.gateway.put).mockResolvedValueOnce({})

    expect(await RecommendationsService.getCategoryRecommendations(3)).toEqual([RECOMMENDATION])
    await RecommendationsService.saveCategoryRecommendations(3, [RECOMMENDATION])

    expect(vi.mocked(api.gateway.get)).toHaveBeenCalledWith(`${CATEGORIES}/3/recommendations`)
    expect(vi.mocked(api.gateway.put))
      .toHaveBeenCalledWith(`${CATEGORIES}/3/recommendations`, { recommendations: [RECOMMENDATION] })
  })

  it('should replace the recommendations of an exercice whole', async () => {
    vi.mocked(api.gateway.put).mockResolvedValueOnce({})
    const payload = { categoryId: 3, recommendations: [{ ...RECOMMENDATION, isHidden: false, isFromCategory: true }] }

    await RecommendationsService.saveRecommendations(12, 34, payload)

    expect(vi.mocked(api.gateway.put))
      .toHaveBeenCalledWith('keymoments/api/accounts/12/exercices/34/recommendations', payload)
  })
})
