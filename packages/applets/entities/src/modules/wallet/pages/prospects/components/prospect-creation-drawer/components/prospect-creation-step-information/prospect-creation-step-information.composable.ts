import { ref } from 'vue'
import type { Ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { logger } from '@pulse/toolbox'
import { displayNotification } from '@pulse/styleguide'
import { ProspectsService } from '@entities/services/prospects/prospects.service'
import { ProspectEligibilityStatus } from '@entities/modules/wallet/enums'
import type { ProspectEntitySearchResult, ProspectFormData } from '@entities/modules/wallet/types'
import type { EntityEligibilityResult } from './prospect-creation-step-information.types'

export function useProspectEntitySearch(prospectFormData: Ref<ProspectFormData>) {
  const { t } = useI18n()

  const entitySearchQuery = ref('')
  const hasEntityError = ref(false)

  async function fetchEntitySuggestions(
    queryString: string,
    callback: (results: ProspectEntitySearchResult[]) => void,
  ): Promise<void> {
    if (queryString === '') {
      callback([])
      return
    }
    try {
      const results = await ProspectsService.searchEntities(queryString)
      callback(results)
    } catch (error) {
      logger.error('Failed to search prospect entities', error)
      displayNotification('error', t('entities.wallet.prospect.form.entitySearchError'))
      callback([])
    }
  }

  function onEntitySelect(item: ProspectEntitySearchResult): void {
    prospectFormData.value.legalName = item.legalName
    prospectFormData.value.siret = item.siret
    prospectFormData.value.siren = item.siren
    prospectFormData.value.address = item.address
    prospectFormData.value.zipCode = item.zipCode
    prospectFormData.value.city = item.city
    prospectFormData.value.country = item.country
    prospectFormData.value.region = item.region
    prospectFormData.value.department = item.department
    prospectFormData.value.nafCode = item.nafCode
    prospectFormData.value.legalForm = item.legalForm
    hasEntityError.value = false
  }

  function onEntityClear(): void {
    prospectFormData.value.legalName = ''
    prospectFormData.value.siret = ''
    prospectFormData.value.siren = ''
    prospectFormData.value.address = ''
    prospectFormData.value.zipCode = ''
    prospectFormData.value.city = ''
    prospectFormData.value.country = ''
    prospectFormData.value.region = ''
    prospectFormData.value.department = ''
    prospectFormData.value.nafCode = ''
    prospectFormData.value.legalForm = ''
    entitySearchQuery.value = ''
    hasEntityError.value = false
  }

  function validateEntitySelection(): boolean {
    const isValid = prospectFormData.value.legalName !== ''
    hasEntityError.value = isValid === false
    return isValid
  }

  async function checkEntityEligibility(): Promise<EntityEligibilityResult> {
    try {
      const status = await ProspectsService.checkProspectCreationEligibility(prospectFormData.value.siret)

      if (status === ProspectEligibilityStatus.ELIGIBLE) {
        hasEntityError.value = false
        return { ok: true, errorMessageKey: null }
      }

      hasEntityError.value = true
      return {
        ok: false,
        errorMessageKey: status === ProspectEligibilityStatus.INVALID_SIRET
          ? 'entities.wallet.prospect.form.invalidSiretAlert'
          : 'entities.wallet.prospect.form.siretAlreadyExistsAlert',
      }
    } catch (error) {
      logger.error('Prospect creation eligibility check failed', error)
      displayNotification('error', t('entities.wallet.prospect.form.eligibilityCheckError'))
      hasEntityError.value = false
      return { ok: false, errorMessageKey: null }
    }
  }

  return {
    entitySearchQuery,
    hasEntityError,
    fetchEntitySuggestions,
    onEntitySelect,
    onEntityClear,
    validateEntitySelection,
    checkEntityEligibility,
  }
}
