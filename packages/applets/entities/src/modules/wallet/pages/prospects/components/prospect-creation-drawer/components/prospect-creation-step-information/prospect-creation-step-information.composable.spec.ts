import { ref } from 'vue'
import { useProspectEntitySearch } from './prospect-creation-step-information.composable'
import { ProspectsService } from '@entities/services/prospects/prospects.service'
import { ProspectEligibilityStatus } from '@entities/modules/wallet/enums'
import type { ProspectEntitySearchResult } from '@entities/modules/wallet/types'
import { displayNotification } from '@pulse/styleguide'
import { logger } from '@pulse/toolbox'
import {
  getProspectEntitySearchResultMock,
  getProspectFormDataMock,
} from '../../__mocks__'

vi.mock('@entities/services/prospects/prospects.service')
vi.mock('vue-i18n', () => ({
  useI18n: () => ({ t: (key: string) => key }),
}))
vi.mock('@pulse/styleguide', () => ({
  displayNotification: vi.fn(),
}))
vi.mock('@pulse/toolbox', () => ({
  logger: { error: vi.fn() },
}))

describe('useProspectEntitySearch', () => {
  describe('initial state', () => {
    it('should have empty entitySearchQuery', () => {
      const prospectFormData = ref(getProspectFormDataMock())
      const { entitySearchQuery } = useProspectEntitySearch(prospectFormData)

      expect(entitySearchQuery.value).toBe('')
    })

    it('should have hasEntityError set to false', () => {
      const prospectFormData = ref(getProspectFormDataMock())
      const { hasEntityError } = useProspectEntitySearch(prospectFormData)

      expect(hasEntityError.value).toBe(false)
    })
  })

  describe('fetchEntitySuggestions', () => {
    it('should return empty array when query is empty', async () => {
      const prospectFormData = ref(getProspectFormDataMock())
      const { fetchEntitySuggestions } = useProspectEntitySearch(prospectFormData)
      const callback = vi.fn()

      await fetchEntitySuggestions('', callback)

      expect(callback).toHaveBeenCalledWith([])
      expect(vi.mocked(ProspectsService.searchEntities)).not.toHaveBeenCalled()
    })

    it('should call ProspectsService and return results', async () => {
      const prospectFormData = ref(getProspectFormDataMock())
      const { fetchEntitySuggestions } = useProspectEntitySearch(prospectFormData)
      const callback = vi.fn()
      const mockResults: ProspectEntitySearchResult[] = [getProspectEntitySearchResultMock()]
      vi.mocked(ProspectsService.searchEntities).mockResolvedValueOnce(mockResults)

      await fetchEntitySuggestions('ACME', callback)

      expect(vi.mocked(ProspectsService.searchEntities)).toHaveBeenCalledWith('ACME')
      expect(callback).toHaveBeenCalledWith(mockResults)
    })

    it('should clear suggestions, log and notify when the service throws', async () => {
      const prospectFormData = ref(getProspectFormDataMock())
      const { fetchEntitySuggestions } = useProspectEntitySearch(prospectFormData)
      const callback = vi.fn()
      const fetchError = new Error('Network error')
      vi.mocked(ProspectsService.searchEntities).mockRejectedValueOnce(fetchError)

      await fetchEntitySuggestions('ACME', callback)

      expect(callback).toHaveBeenCalledWith([])
      expect(vi.mocked(logger.error)).toHaveBeenCalledWith(
        'Failed to search prospect entities',
        fetchError,
      )
      expect(vi.mocked(displayNotification)).toHaveBeenCalledWith(
        'error',
        'entities.wallet.prospect.form.entitySearchError',
      )
    })
  })

  describe('onEntitySelect', () => {
    it('should update prospectFormData with selected entity', () => {
      const prospectFormData = ref(getProspectFormDataMock())
      const { onEntitySelect } = useProspectEntitySearch(prospectFormData)
      const selectedEntity = getProspectEntitySearchResultMock()

      onEntitySelect(selectedEntity)

      expect(prospectFormData.value.legalName).toBe('ACME Corp')
      expect(prospectFormData.value.siret).toBe('12345678900001')
      expect(prospectFormData.value.siren).toBe('123456789')
      expect(prospectFormData.value.address).toBe('1 rue de Paris')
      expect(prospectFormData.value.zipCode).toBe('75001')
      expect(prospectFormData.value.city).toBe('Paris')
      expect(prospectFormData.value.country).toBe('France')
      expect(prospectFormData.value.region).toBe('Île-de-France')
      expect(prospectFormData.value.department).toBe('Paris')
      expect(prospectFormData.value.nafCode).toBe('6201Z')
      expect(prospectFormData.value.legalForm).toBe('SAS')
    })

    it('should clear hasEntityError when entity is selected', () => {
      const prospectFormData = ref(getProspectFormDataMock())
      const { onEntitySelect, hasEntityError } = useProspectEntitySearch(prospectFormData)
      hasEntityError.value = true

      onEntitySelect(getProspectEntitySearchResultMock({ legalName: 'Test', siren: '123', siret: '456' }))

      expect(hasEntityError.value).toBe(false)
    })
  })

  describe('onEntityClear', () => {
    it('should clear entity fields from prospectFormData', () => {
      const prospectFormData = ref(getProspectFormDataMock({
        legalName: 'ACME Corp',
        siret: '12345678900001',
        siren: '123456789',
        address: '1 rue de Paris',
        zipCode: '75001',
        city: 'Paris',
        country: 'France',
        region: 'Île-de-France',
        department: 'Paris',
        nafCode: '6201Z',
        legalForm: 'SAS',
      }))
      const { onEntityClear } = useProspectEntitySearch(prospectFormData)

      onEntityClear()

      expect(prospectFormData.value.legalName).toBe('')
      expect(prospectFormData.value.siret).toBe('')
      expect(prospectFormData.value.siren).toBe('')
      expect(prospectFormData.value.address).toBe('')
      expect(prospectFormData.value.zipCode).toBe('')
      expect(prospectFormData.value.city).toBe('')
      expect(prospectFormData.value.country).toBe('')
      expect(prospectFormData.value.region).toBe('')
      expect(prospectFormData.value.department).toBe('')
      expect(prospectFormData.value.nafCode).toBe('')
      expect(prospectFormData.value.legalForm).toBe('')
    })

    it('should clear entitySearchQuery', () => {
      const prospectFormData = ref(getProspectFormDataMock())
      const { onEntityClear, entitySearchQuery } = useProspectEntitySearch(prospectFormData)
      entitySearchQuery.value = 'some search'

      onEntityClear()

      expect(entitySearchQuery.value).toBe('')
    })

    it('should clear hasEntityError', () => {
      const prospectFormData = ref(getProspectFormDataMock())
      const { onEntityClear, hasEntityError } = useProspectEntitySearch(prospectFormData)
      hasEntityError.value = true

      onEntityClear()

      expect(hasEntityError.value).toBe(false)
    })
  })

  describe('validateEntitySelection', () => {
    it('should return true and not set error when legalName is filled', () => {
      const prospectFormData = ref(getProspectFormDataMock())
      prospectFormData.value.legalName = 'ACME Corp'
      const { validateEntitySelection, hasEntityError } = useProspectEntitySearch(prospectFormData)

      const result = validateEntitySelection()

      expect(result).toBe(true)
      expect(hasEntityError.value).toBe(false)
    })

    it('should return false and set error when legalName is empty', () => {
      const prospectFormData = ref(getProspectFormDataMock())
      const { validateEntitySelection, hasEntityError } = useProspectEntitySearch(prospectFormData)

      const result = validateEntitySelection()

      expect(result).toBe(false)
      expect(hasEntityError.value).toBe(true)
    })

    it('should not call eligibility API', () => {
      const prospectFormData = ref(getProspectFormDataMock())
      prospectFormData.value.legalName = 'ACME Corp'
      const { validateEntitySelection } = useProspectEntitySearch(prospectFormData)

      validateEntitySelection()

      expect(vi.mocked(ProspectsService.checkProspectCreationEligibility)).not.toHaveBeenCalled()
    })
  })

  describe('checkEntityEligibility', () => {
    it('should return ok=true with no message when status is ELIGIBLE', async () => {
      const prospectFormData = ref(getProspectFormDataMock())
      prospectFormData.value.siret = '12345678900001'
      vi.mocked(ProspectsService.checkProspectCreationEligibility)
        .mockResolvedValueOnce(ProspectEligibilityStatus.ELIGIBLE)
      const { checkEntityEligibility, hasEntityError } = useProspectEntitySearch(prospectFormData)

      const result = await checkEntityEligibility()

      expect(result).toEqual({ ok: true, errorMessageKey: null })
      expect(hasEntityError.value).toBe(false)
      expect(vi.mocked(ProspectsService.checkProspectCreationEligibility)).toHaveBeenCalledWith('12345678900001')
    })

    it('should return ok=false with siretAlreadyExists when status is ALREADY_CLIENT', async () => {
      const prospectFormData = ref(getProspectFormDataMock())
      prospectFormData.value.siret = '12345678900001'
      vi.mocked(ProspectsService.checkProspectCreationEligibility)
        .mockResolvedValueOnce(ProspectEligibilityStatus.ALREADY_CLIENT)
      const { checkEntityEligibility, hasEntityError } = useProspectEntitySearch(prospectFormData)

      const result = await checkEntityEligibility()

      expect(result).toEqual({
        ok: false,
        errorMessageKey: 'entities.wallet.prospect.form.siretAlreadyExistsAlert',
      })
      expect(hasEntityError.value).toBe(true)
      expect(vi.mocked(displayNotification)).not.toHaveBeenCalled()
    })

    it('should return ok=false with invalidSiret when status is INVALID_SIRET', async () => {
      const prospectFormData = ref(getProspectFormDataMock())
      prospectFormData.value.siret = '12345678900001'
      vi.mocked(ProspectsService.checkProspectCreationEligibility)
        .mockResolvedValueOnce(ProspectEligibilityStatus.INVALID_SIRET)
      const { checkEntityEligibility, hasEntityError } = useProspectEntitySearch(prospectFormData)

      const result = await checkEntityEligibility()

      expect(result).toEqual({
        ok: false,
        errorMessageKey: 'entities.wallet.prospect.form.invalidSiretAlert',
      })
      expect(hasEntityError.value).toBe(true)
      expect(vi.mocked(displayNotification)).not.toHaveBeenCalled()
    })

    it('should return ok=false with no message, log and notify when API throws', async () => {
      const prospectFormData = ref(getProspectFormDataMock())
      prospectFormData.value.siret = '12345678900001'
      const checkError = new Error('Server error')
      vi.mocked(ProspectsService.checkProspectCreationEligibility).mockRejectedValueOnce(checkError)
      const { checkEntityEligibility, hasEntityError } = useProspectEntitySearch(prospectFormData)

      const result = await checkEntityEligibility()

      expect(result).toEqual({ ok: false, errorMessageKey: null })
      expect(hasEntityError.value).toBe(false)
      expect(vi.mocked(logger.error)).toHaveBeenCalledWith(
        'Prospect creation eligibility check failed',
        checkError,
      )
      expect(vi.mocked(displayNotification)).toHaveBeenCalledWith(
        'error',
        'entities.wallet.prospect.form.eligibilityCheckError',
      )
    })
  })
})
