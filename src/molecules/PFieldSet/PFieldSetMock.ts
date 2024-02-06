import type { PDropdownOption } from '../PDropdown/PDropdownTypes'
import { getMockedInputField, getDropdownField } from '../PField/PFieldMock'
import type { PFieldProps } from '../PField/PFieldTypes'

export function getMockedFields(
  fieldCase: string,
  withReadonlyFields = false
): PFieldProps<any>[] {
  const countryOptions: PDropdownOption[] = [{
    pValue: 'fr',
    pLabel: 'France'
  }, {
    pValue: 'be',
    pLabel: 'Belgique'
  }]

  if (fieldCase === 'companyIdentification') {
    return [
      getMockedInputField('lastname', 'Nom', 'Mac Cain', 30, withReadonlyFields),
      getMockedInputField('firstname', 'Prénom', "Johnny's Pizza", 65)
    ]
  }
  if (fieldCase === 'companyContact') {
    return [
      getMockedInputField('email', 'E-mail de contact', 'contact@kpmg.fr', 45, false, ['email']),
      getMockedInputField('phone', 'Numéro de téléphone', '0123456789', 45, false, ['phone'])
    ]
  }
  if (fieldCase === 'companyAddress') {
    return [
      getMockedInputField('stree', 'Numéro de nom de la voie', '36 rue de Besançon', 90),
      getMockedInputField('additional', 'Compléments (Bât, étage, etc.)', 'Aucune saisie', 90),
      getMockedInputField('zipCode', 'Code postal', '25300', 20),
      getMockedInputField('city', 'Ville', 'Pontarlier', 30),
      getDropdownField('country', 'Pays', 40, countryOptions)
    ]
  }
  if (fieldCase === 'accountingAndTaxInformation') {
    const yearDurationOptions: PDropdownOption[] = [{
      pValue: 12,
      pLabel: '12 mois'
    }, {
      pValue: 24,
      pLabel: '24 mois'
    }]
    const accountingTypeOptions: PDropdownOption[] = [{
      pValue: 'accrual',
      pLabel: "Comptabilité d'engagement"
    }, {
      pValue: 'financial',
      pLabel: 'Comptabilité financière'
    }]
    const taxSystemOptions: PDropdownOption[] = [{
      pValue: 'bic',
      pLabel: 'BIC (Bénéfices Industriels et Commerciaux)'
    }, {
      pValue: 'other',
      pLabel: 'Autre'
    }]
    const taxationRegimeOptions: PDropdownOption[] = [{
      pValue: 'is',
      pLabel: 'IS (impôts sur les sociétés)'
    }, {
      pValue: 'other',
      pLabel: 'Autre'
    }]
    const activityTypeOptions: PDropdownOption[] = [{
      pValue: 'services',
      pLabel: 'Prestataire de service'
    }, {
      pValue: 'other',
      pLabel: 'Autre'
    }]

    return [
      getMockedInputField('accountingYearStart', "Début de l'exercice", '01/01/2023', 30),
      getDropdownField('accountingYearDuration', "Durée de l'exercice", 30, yearDurationOptions),
      getDropdownField('accountingType', 'Type de comptabilité', 30, accountingTypeOptions),
      getDropdownField('country', 'Pays', 30, countryOptions),
      getDropdownField('taxSystem', 'Régime fiscal', 30, taxSystemOptions),
      getDropdownField('taxationRegime', "Régime d'imposition", 30, taxationRegimeOptions),
      getDropdownField('activityType', "Type d'activité", 30, activityTypeOptions)
    ]
  }

  return []
}
