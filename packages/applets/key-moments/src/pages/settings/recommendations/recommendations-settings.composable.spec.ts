import { flushPromises } from '@vue/test-utils'
import { withSetup } from '@pulse/toolbox/utils/test'
import { displayNotification } from '@pulse/styleguide'
import { RecommendationsService } from '@key-moments/services/recommendations.service'
import { useRecommendationsSettings } from './recommendations-settings.composable'

const CATEGORIES = [
  { id: 1, label: 'BTP', pitch: 'Chantiers.' },
  { id: 2, label: 'Commerce', pitch: 'Boutiques.' },
]

beforeEach(() => {
  vi.spyOn(RecommendationsService, 'getCategories').mockResolvedValue(CATEGORIES)
  vi.spyOn(RecommendationsService, 'deleteCategory').mockResolvedValue()
})

describe('useRecommendationsSettings', () => {
  it('should read the categories on mount', async () => {
    const [{ categories, isLoading }] = withSetup(() => useRecommendationsSettings())
    await flushPromises()

    expect(isLoading.value).toBe(false)
    expect(categories.value).toEqual(CATEGORIES)
  })

  it('should tell the reader when the categories cannot be read', async () => {
    vi.mocked(RecommendationsService.getCategories).mockRejectedValue(new Error('down'))

    const [{ categories }] = withSetup(() => useRecommendationsSettings())
    await flushPromises()

    expect(categories.value).toEqual([])
    expect(vi.mocked(displayNotification)).toHaveBeenCalledWith('error', expect.any(String))
  })

  it('should delete a category and read the list again', async () => {
    const [{ remove }] = withSetup(() => useRecommendationsSettings())
    await flushPromises()

    await remove(1)

    expect(vi.mocked(RecommendationsService.deleteCategory)).toHaveBeenCalledWith(1)
    expect(vi.mocked(RecommendationsService.getCategories)).toHaveBeenCalledTimes(2)
    expect(vi.mocked(displayNotification)).toHaveBeenCalledWith('success', expect.any(String))
  })

  it('should tell a refused deletion and still read the list again', async () => {
    vi.mocked(RecommendationsService.deleteCategory).mockRejectedValue(new Error('refused'))

    const [{ remove }] = withSetup(() => useRecommendationsSettings())
    await flushPromises()

    await remove(1)

    expect(vi.mocked(displayNotification)).toHaveBeenCalledWith('error', expect.any(String))
    expect(vi.mocked(RecommendationsService.getCategories)).toHaveBeenCalledTimes(2)
  })
})
