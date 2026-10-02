import { flushPromises } from '@vue/test-utils'
import { displayNotification } from '@pulse/styleguide'
import { getStoreMock } from '@pulse/common/mocks/vitest'
import { RecommendationRubric } from '@key-moments/enums/key-moments.enums'
import { RecommendationsService } from '@key-moments/services/recommendations.service'
import { useOffersCatalogStore } from '@key-moments/stores/offers-catalog.store'
import { useRecommendationThemesStore } from '@key-moments/stores/recommendation-themes.store'
import { catalogWithSearchTerms } from '@key-moments/utils/offers.utils'
import { useCategoryDrawer } from './category-drawer.composable'

const CATEGORY = { id: 3, label: 'BTP', pitch: 'Chantiers.' }
const EMPTY_FIELDS = { priority: null, observations: null, risk: null, recommendation: null }
const THEMES = [
  { id: 7, rubric: RecommendationRubric.SECTOR, label: 'TVA' },
  { id: 8, rubric: RecommendationRubric.SECTOR, label: 'Sous-traitance' },
  { id: 9, rubric: RecommendationRubric.SOCIAL, label: 'Paie' },
]
const RECOMMENDATION = { ...EMPTY_FIELDS, themeId: 7, recommendation: 'Autoliquider.', offerIds: [10] }

beforeEach(() => {
  getStoreMock(useRecommendationThemesStore).themes = THEMES
  getStoreMock(useOffersCatalogStore).catalog = catalogWithSearchTerms([
    { id: 10, title: 'Pack TVA', subCategory: { subCategoryId: 1, name: 'Fiscal', category: { categoryId: 1, name: 'Fiscalité' } } },
  ])
  vi.spyOn(RecommendationsService, 'getCategoryRecommendations').mockResolvedValue([RECOMMENDATION])
  vi.spyOn(RecommendationsService, 'createCategory').mockResolvedValue(CATEGORY)
  vi.spyOn(RecommendationsService, 'updateCategory').mockResolvedValue(CATEGORY)
  vi.spyOn(RecommendationsService, 'saveCategoryRecommendations').mockResolvedValue()
})

describe('useCategoryDrawer', () => {
  it('should open empty on a creation, the catalogue read', async () => {
    const { openCreate, isOpen, form, rubricViews, catalog, isIncomplete } = useCategoryDrawer({ onSaved: vi.fn() })

    openCreate()
    await flushPromises()

    expect(isOpen.value).toBe(true)
    expect(form).toEqual({ label: '', pitch: '' })
    expect(rubricViews.value.every(view => view.views.length === 0)).toBe(true)
    expect(catalog.value).toHaveLength(1)
    expect(vi.mocked(getStoreMock(useOffersCatalogStore).readCatalog)).toHaveBeenCalled()
    expect(isIncomplete.value).toBe(true)
  })

  it('should open on the category with its recommendations, keyed and resolved', async () => {
    const { openEdit, form, rubricViews, isLoading } = useCategoryDrawer({ onSaved: vi.fn() })

    openEdit(CATEGORY)
    await flushPromises()

    expect(isLoading.value).toBe(false)
    expect(form).toEqual({ label: 'BTP', pitch: 'Chantiers.' })
    expect(rubricViews.value[2].views[0]).toEqual(expect.objectContaining({ themeId: 7, themeLabel: 'TVA', key: expect.any(String) }))
    expect(rubricViews.value[2].views[0].offers[0]).toEqual(expect.objectContaining({ title: 'Pack TVA', isRetired: false }))
  })

  it('should create the category then write its list, and tell the parent', async () => {
    const onSaved = vi.fn()
    const { openCreate, form, addRecommendation, updateRecommendation, save, isOpen } = useCategoryDrawer({ onSaved })

    openCreate()
    form.label = ' Artisanat '
    const key = addRecommendation(RecommendationRubric.SOCIAL)
    updateRecommendation(key, { themeId: 9, offerIds: [10] })
    await save()

    expect(vi.mocked(RecommendationsService.createCategory)).toHaveBeenCalledWith({ label: 'Artisanat', pitch: '' })
    expect(vi.mocked(RecommendationsService.saveCategoryRecommendations))
      .toHaveBeenCalledWith(3, [{ ...EMPTY_FIELDS, themeId: 9, offerIds: [10] }])
    expect(isOpen.value).toBe(false)
    expect(onSaved).toHaveBeenCalledOnce()
    expect(vi.mocked(displayNotification)).toHaveBeenCalledWith('success', expect.any(String))
  })

  it('should update an existing category and write its list in the edited order', async () => {
    const { openEdit, rubricViews, addRecommendation, updateRecommendation, moveRecommendation, save } = useCategoryDrawer({ onSaved: vi.fn() })

    openEdit(CATEGORY)
    await flushPromises()
    const key = addRecommendation(RecommendationRubric.SECTOR)
    updateRecommendation(key, { themeId: 8 })
    moveRecommendation(key, 0)
    await save()

    expect(vi.mocked(RecommendationsService.updateCategory)).toHaveBeenCalledWith(3, { label: 'BTP', pitch: 'Chantiers.' })
    expect(vi.mocked(RecommendationsService.saveCategoryRecommendations).mock.calls[0][1].map(line => line.themeId))
      .toEqual([8, 7])
    expect(rubricViews.value[2].views).toHaveLength(2)
  })

  it('should not save while a line has no theme, and say so', async () => {
    const { openEdit, addRecommendation, removeRecommendation, hasIncompleteLine, isIncomplete, save } = useCategoryDrawer({ onSaved: vi.fn() })

    openEdit(CATEGORY)
    await flushPromises()
    const key = addRecommendation(RecommendationRubric.WEALTH)

    expect(hasIncompleteLine.value).toBe(true)
    expect(isIncomplete.value).toBe(true)
    await save()
    expect(vi.mocked(RecommendationsService.updateCategory)).not.toHaveBeenCalled()

    removeRecommendation(key)

    expect(isIncomplete.value).toBe(false)
  })

  it('should keep the drawer open and tell the reader when the save is refused, the list refreshed for the category that went through', async () => {
    vi.mocked(RecommendationsService.saveCategoryRecommendations).mockRejectedValue({ response: { status: 400, data: { title: 'Thème trop long.' } } })
    const onSaved = vi.fn()
    const { openEdit, save, isOpen } = useCategoryDrawer({ onSaved })

    openEdit(CATEGORY)
    await flushPromises()
    await save()

    expect(isOpen.value).toBe(true)
    expect(onSaved).toHaveBeenCalledOnce()
    expect(vi.mocked(displayNotification)).toHaveBeenCalledWith('error', 'keyMoments.settings.recommendations.categoryDrawer.saveError')
  })

  it('should have the list show a category created even when its recommendations are refused, and update it on the next save', async () => {
    vi.mocked(RecommendationsService.saveCategoryRecommendations).mockRejectedValueOnce(new Error('down'))
    const onSaved = vi.fn()
    const { openCreate, form, save, isOpen } = useCategoryDrawer({ onSaved })

    openCreate()
    form.label = 'Artisanat'
    await save()

    expect(isOpen.value).toBe(true)
    expect(onSaved).toHaveBeenCalledOnce()

    await save()

    expect(vi.mocked(RecommendationsService.createCategory)).toHaveBeenCalledOnce()
    expect(vi.mocked(RecommendationsService.updateCategory)).toHaveBeenCalledWith(3, { label: 'Artisanat', pitch: '' })
  })

  it('should not refresh the list when the category itself is refused', async () => {
    vi.mocked(RecommendationsService.createCategory).mockRejectedValueOnce(new Error('down'))
    const onSaved = vi.fn()
    const { openCreate, form, save } = useCategoryDrawer({ onSaved })

    openCreate()
    form.label = 'Artisanat'
    await save()

    expect(onSaved).not.toHaveBeenCalled()
  })

  it('should flag the lines whose theme the referential refused, keep the drawer open, and clear a flag once the theme changes', async () => {
    vi.mocked(RecommendationsService.saveCategoryRecommendations).mockRejectedValue({
      response: {
        status: 422,
        data: {
          code: 'unknown-theme',
          errors: [{ code: 'unknown-theme', pointer: '/recommendations/0/themeId', detail: 'Theme 7 is not in the referential.' }],
        },
      },
    })
    const { openEdit, save, isOpen, rubricViews, updateRecommendation } = useCategoryDrawer({ onSaved: vi.fn() })

    openEdit(CATEGORY)
    await flushPromises()
    await save()

    const [refused] = rubricViews.value[2].views

    expect(isOpen.value).toBe(true)
    expect(refused.isThemeRefused).toBe(true)
    expect(vi.mocked(displayNotification)).toHaveBeenCalledWith('error', 'keyMoments.recommendations.unknownThemeError')

    updateRecommendation(refused.key, { themeId: 8 })

    expect(rubricViews.value[2].views[0].isThemeRefused).toBe(false)
  })

  it('should not save while the recommendations are being read, since saving replaces the whole list', async () => {
    let answer: (lines: typeof RECOMMENDATION[]) => void = () => {}
    vi.mocked(RecommendationsService.getCategoryRecommendations).mockReturnValueOnce(new Promise((resolve) => {
      answer = resolve
    }))
    const { openEdit, isSaveDisabled, save } = useCategoryDrawer({ onSaved: vi.fn() })

    openEdit(CATEGORY)
    await save()

    expect(isSaveDisabled.value).toBe(true)
    expect(vi.mocked(RecommendationsService.saveCategoryRecommendations)).not.toHaveBeenCalled()

    answer([RECOMMENDATION])
    await flushPromises()

    expect(isSaveDisabled.value).toBe(false)
  })

  it('should not save a category whose recommendations could not be read, and say so', async () => {
    vi.mocked(RecommendationsService.getCategoryRecommendations).mockRejectedValueOnce(new Error('down'))
    const { openEdit, areRecommendationsUnreadable, isSaveDisabled, isLoading, save } = useCategoryDrawer({ onSaved: vi.fn() })

    openEdit(CATEGORY)
    await flushPromises()
    await save()

    expect(isLoading.value).toBe(false)
    expect(areRecommendationsUnreadable.value).toBe(true)
    expect(isSaveDisabled.value).toBe(true)
    expect(vi.mocked(RecommendationsService.saveCategoryRecommendations)).not.toHaveBeenCalled()
    expect(vi.mocked(displayNotification)).toHaveBeenCalledWith('error', 'keyMoments.settings.recommendations.categoryDrawer.readError')
  })

  it('should let the reading of the category reopened last win over an earlier one answering late', async () => {
    const OTHER = { id: 4, label: 'Commerce', pitch: '' }
    let answerFirst: (lines: typeof RECOMMENDATION[]) => void = () => {}
    vi.mocked(RecommendationsService.getCategoryRecommendations)
      .mockReturnValueOnce(new Promise((resolve) => {
        answerFirst = resolve
      }))
      .mockResolvedValueOnce([])
    const { openEdit, close, rubricViews, isLoading, isSaveDisabled } = useCategoryDrawer({ onSaved: vi.fn() })

    openEdit(CATEGORY)
    close()
    openEdit(OTHER)
    await flushPromises()
    answerFirst([RECOMMENDATION])
    await flushPromises()

    expect(rubricViews.value.every(view => view.views.length === 0)).toBe(true)
    expect(isLoading.value).toBe(false)
    expect(isSaveDisabled.value).toBe(false)
  })

  it('should forget a failed reading once the drawer reopens on a creation', async () => {
    vi.mocked(RecommendationsService.getCategoryRecommendations).mockRejectedValueOnce(new Error('down'))
    const { openEdit, openCreate, form, areRecommendationsUnreadable, isSaveDisabled } = useCategoryDrawer({ onSaved: vi.fn() })

    openEdit(CATEGORY)
    await flushPromises()
    openCreate()
    form.label = 'Artisanat'

    expect(areRecommendationsUnreadable.value).toBe(false)
    expect(isSaveDisabled.value).toBe(false)
  })

  it('should say the themes could not be read', async () => {
    vi.mocked(getStoreMock(useRecommendationThemesStore).readThemes).mockRejectedValueOnce(new Error('down'))
    const { openCreate, areThemesUnreadable } = useCategoryDrawer({ onSaved: vi.fn() })

    openCreate()
    await flushPromises()

    expect(areThemesUnreadable.value).toBe(true)
  })
})
