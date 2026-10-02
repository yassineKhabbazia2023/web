import { api } from '@pulse/common/api'
import { API_PREFIXES } from '@pulse/common/constants'
import type {
  CategoryPayload,
  CategoryRequest,
  ExerciceRecommendationsPayload,
  RecommendationPayload,
  RecommendationThemePayload,
} from './recommendations.service.types'

const CATEGORIES = `${API_PREFIXES.KEY_MOMENTS}/recommendation-categories`
const THEMES = `${API_PREFIXES.KEY_MOMENTS}/recommendation-themes`

/**
 * The categories of base recommendations, and the copy an exercice keeps of
 * them. The two readings are open to every collaborator; the writings of a
 * category are the administrator's. The exercice's own list is read with its
 * draft (`KeyMomentsService.getDraft`), and written here.
 */
export class RecommendationsService {

  /** The closed list of themes, in display order: never sorted again. */
  static async getThemes(): Promise<RecommendationThemePayload[]> {
    const { data } = await api.gateway.get<RecommendationThemePayload[]>(THEMES)

    return data
  }

  static async getCategories(): Promise<CategoryPayload[]> {
    const { data } = await api.gateway.get<CategoryPayload[]>(CATEGORIES)

    return data
  }

  static async createCategory(request: CategoryRequest): Promise<CategoryPayload> {
    const { data } = await api.gateway.post<CategoryPayload>(CATEGORIES, request)

    return data
  }

  static async updateCategory(categoryId: number, request: CategoryRequest): Promise<CategoryPayload> {
    const { data } = await api.gateway.put<CategoryPayload>(`${CATEGORIES}/${categoryId}`, request)

    return data
  }

  /** Its recommendations go with it; the exercices keep their copy. */
  static async deleteCategory(categoryId: number): Promise<void> {
    await api.gateway.delete(`${CATEGORIES}/${categoryId}`)
  }

  static async getCategoryRecommendations(categoryId: number): Promise<RecommendationPayload[]> {
    const { data } = await api.gateway.get<RecommendationPayload[]>(`${CATEGORIES}/${categoryId}/recommendations`)

    return data
  }

  /** A whole replacement: the order of the array is the order. */
  static async saveCategoryRecommendations(
    categoryId: number,
    recommendations: RecommendationPayload[],
  ): Promise<void> {
    await api.gateway.put(`${CATEGORIES}/${categoryId}/recommendations`, { recommendations })
  }

  /**
   * A whole replacement of the exercice's list, the last writer winning. An
   * empty list empties the exercice; the category goes with it.
   */
  static async saveRecommendations(
    entityId: number,
    exerciceId: number,
    payload: ExerciceRecommendationsPayload,
  ): Promise<void> {
    await api.gateway.put(
      `${API_PREFIXES.KEY_MOMENTS}/accounts/${entityId}/exercices/${exerciceId}/recommendations`,
      payload,
    )
  }
}
