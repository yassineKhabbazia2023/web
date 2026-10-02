import { ref } from 'vue'
import { useRecommendationOffersSelection } from './recommendation-offers-picker.composable'
import type { SearchableOffer } from '../../../types/key-moments.types'

function offer(id: number): SearchableOffer {
  return {
    id,
    title: `Offre ${id}`,
    subCategory: { subCategoryId: 1, name: 'Sous-catégorie', category: { categoryId: 1, name: 'Catégorie' } },
    searchTerms: `offre ${id}`,
  }
}

const CATALOG = [offer(10), offer(20), offer(30)]

describe('useRecommendationOffersSelection', () => {
  it('should start from the initial selection once reset, as an opening does', () => {
    const { isSelected, selectedCount, reset } = useRecommendationOffersSelection({
      catalog: CATALOG,
      initialSelection: [20],
      onValidate: vi.fn(),
    })

    reset()

    expect(isSelected(20)).toBe(true)
    expect(isSelected(10)).toBe(false)
    expect(selectedCount.value).toBe(1)
  })

  it('should add an offer on a first toggle and remove it on the next', () => {
    const { isSelected, toggleOffer } = useRecommendationOffersSelection({
      catalog: CATALOG,
      initialSelection: [],
      onValidate: vi.fn(),
    })

    toggleOffer(10)
    expect(isSelected(10)).toBe(true)

    toggleOffer(10)
    expect(isSelected(10)).toBe(false)
  })

  it('should validate the ids in the order of the catalogue, not of the clicks', () => {
    const onValidate = vi.fn()
    const { toggleOffer, validateSelection } = useRecommendationOffersSelection({
      catalog: CATALOG,
      initialSelection: [],
      onValidate,
    })

    toggleOffer(30)
    toggleOffer(10)
    validateSelection()

    expect(onValidate).toHaveBeenCalledWith([10, 30])
  })

  it('should forget the toggles and read the initial selection anew on reset', () => {
    const initialSelection = ref([10])
    const onValidate = vi.fn()
    const { isSelected, toggleOffer, reset } = useRecommendationOffersSelection({
      catalog: CATALOG,
      initialSelection,
      onValidate,
    })

    reset()
    toggleOffer(10)
    toggleOffer(20)
    initialSelection.value = [30]
    reset()

    expect(isSelected(10)).toBe(false)
    expect(isSelected(20)).toBe(false)
    expect(isSelected(30)).toBe(true)
    expect(onValidate).not.toHaveBeenCalled()
  })
})
