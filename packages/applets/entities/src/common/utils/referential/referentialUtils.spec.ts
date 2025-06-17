import { vi, it, expect, describe } from 'vitest'
import { loggerMock, loggerWarnSpy } from '@pulse/core/mocks'
import {
  referentialOptionsToPDropdownOption,
  getReferentialDropdownOptions,
  getEnrichedField,
  getEnrichedFormSection,
  getFormSections,
  getFormStructure,
} from './referentialUtils'
import { type ReferentialOptions } from '@entities/services/account'
import type { PDropdownOption } from '@pulse/styleguide/types'
import MEGOffersFormStructure from '@entities/common/config/forms/MEGOffersFormStructure.json'
import LOOPOfferFormStructure from '@entities/common/config/forms/LOOPOfferFormStructure.json'
import InformationFormStructure from '@entities/common/config/forms/InformationFormStructure.json'
import { getMockedAccountReferential, getMockedReferentialHubs, getMockedReferentialOffices } from '@entities/__mocks__/account-row.mocks'
import { getMockedFormField, getMockedFormSection } from '@entities/__mocks__/company-information.mocks'
import type { FormField, FormSection } from '@entities/pages/entities/components/CompanyInformation/CompanyInformationTypes'
import { ProviderName } from '@entities/common/types/ProviderNameEnums'
import type { FormStructureName } from './referentialUtilsTypes'

const mockedReferential = getMockedAccountReferential()
const mockedReferentialHubs = getMockedReferentialHubs().slice(0, 2)
const mockedFormSection = getMockedFormSection()
const mockedReferentialOffices = getMockedReferentialOffices()

vi.mock('@pulse/core', () => ({ logger: loggerMock }))

vi.mock('@entities/services/account', async () => {
  const actual = await vi.importActual('@entities/services/account')
  return {
    ...actual,
    fetchAccountReferential: vi.fn(() => getMockedAccountReferential()),
    fetchReferentialHubs: vi.fn(() => getMockedReferentialHubs()),
    fetchReferentialOffices: vi.fn(() => getMockedReferentialOffices()),
  }
})

describe('referentialUtils', () => {
  describe('referentialOptionsToPDropdownOption', () => {
    it('should return proper dropdownOptions', () => {
      const referentialOptions: ReferentialOptions = {
        a: 'A',
        b: 'B',
      }
      const dropdownOptions = referentialOptionsToPDropdownOption(referentialOptions)
      const expected: PDropdownOption[] = [{
        pValue: 'a',
        pLabel: 'A',
      }, {
        pValue: 'b',
        pLabel: 'B',
      }]
      expect(dropdownOptions).toStrictEqual(expected)
    })

    it('should return undefined when referentialItem is undefined', () => {
      const referentialItem = undefined
      const dropdownOptions = referentialOptionsToPDropdownOption(referentialItem)
      expect(dropdownOptions).toBeUndefined()
    })
  })

  describe('getReferentialDropdownOptions', () => {
    it('should return proper dropdownOptions when referentialKey equals "hubName"', () => {
      const referentialKey = 'hubName'
      const referentialDropdownOptions = getReferentialDropdownOptions(
        mockedReferential,
        mockedReferentialHubs,
        mockedReferentialOffices,
        referentialKey,
      )
      const expected = [{
        pLabel: 'Hub Aquitaine Nord',
        pValue: 1,
      }, {
        pLabel: 'Hub Languedoc-Roussillon',
        pValue: 2,
      }]
      expect(referentialDropdownOptions).toStrictEqual(expected)
    })

    it('should return proper dropdownOptions when referentialKey is "accountingType"', () => {
      const referentialKey = 'accountingType'
      const referentialDropdownOptions = getReferentialDropdownOptions(
        mockedReferential,
        mockedReferentialHubs,
        mockedReferentialOffices,
        referentialKey,
      )
      const expected = [{
        pLabel: 'Engagement',
        pValue: 'Engagement',
      }, {
        pLabel: 'Trésorerie',
        pValue: 'Tresorerie',
      }]
      expect(referentialDropdownOptions).toStrictEqual(expected)
    })

    it('should return undefined when referentialItem is undefined', () => {
      const referentialKey = undefined
      const referentialDropdownOptions = getReferentialDropdownOptions(
        mockedReferential,
        mockedReferentialHubs,
        mockedReferentialOffices,
        referentialKey,
      )
      expect(referentialDropdownOptions).toBeUndefined()
    })
  })

  describe('getEnrichedField', () => {
    it('should return proper enrichedField when pFieldType equals "dropdown"', () => {
      const field: FormField = getMockedFormField({
        referentialKey: 'accountingType',
        pFieldType: 'dropdown',
      })
      const referentialDropdownOptions = getEnrichedField(
        mockedReferential,
        mockedReferentialHubs,
        mockedReferentialOffices,
        field,
      )
      const expected = {
        pDropdownOptions: [{
          pLabel: 'Engagement',
          pValue: 'Engagement',
        }, {
          pLabel: 'Trésorerie',
          pValue: 'Tresorerie',
        }],
        pFieldKey: 'field-key',
        pFieldType: 'dropdown',
        pLabel: 'field-label',
        referentialKey: 'accountingType',
      }
      expect(referentialDropdownOptions).toStrictEqual(expected)
    })

    it('should emit logger.warn when pFieldType is out from referential', () => {

      const field: FormField = getMockedFormField({
        referentialKey: 'foo',
        pFieldType: 'dropdown',
      })
      const referentialDropdownOptions = getEnrichedField(
        mockedReferential,
        mockedReferentialHubs,
        mockedReferentialOffices,
        field,
      )
      const expected = {
        pFieldKey: 'field-key',
        pFieldType: 'dropdown',
        pLabel: 'field-label',
        referentialKey: 'foo',
      }
      expect(loggerWarnSpy).toHaveBeenCalledOnce()
      expect(loggerWarnSpy).toHaveBeenNthCalledWith(1, "missing referential for field: 'foo'")
      expect(referentialDropdownOptions).toStrictEqual(expected)
    })
  })

  describe('getEnrichedFormSection', () => {
    it('should return proper dropdownOptions', () => {
      const referentialDropdownOptions = getEnrichedFormSection(
        mockedReferential,
        mockedReferentialHubs,
        mockedReferentialOffices,
        mockedFormSection,
      )
      const expected: FormSection = {
        title: 'Title',
        sectionKey: undefined,
        fields: [{
          pFieldKey: 'field-key',
          pFieldType: 'input',
          pLabel: 'field-label',
        }],
      }
      expect(referentialDropdownOptions).toStrictEqual(expected)
    })
  })

  describe('getFormSections', () => {
    it.each([
      {
        formType: ProviderName.MEG,
        expectedFormStructure: MEGOffersFormStructure,
      },
      {
        formType: ProviderName.LOOP,
        expectedFormStructure: LOOPOfferFormStructure,
      },
      {
        formType: 'CompanyProfile',
        expectedFormStructure: InformationFormStructure,
      },
    ] as {
      formType: FormStructureName
      expectedFormStructure: FormSection[]
    }[])(
      'should return correct form structure if the form type is $formType',
      ({ formType, expectedFormStructure }) => {
        const formStructure = getFormSections(
          formType,
        )

        expect(formStructure).toStrictEqual(expectedFormStructure)
      },
    )
  })

  describe('getFormStructure', () => {
    it.each([
      {
        formType: ProviderName.MEG,
        forceDisabled: false,
      },
      {
        formType: ProviderName.MEG,
        forceDisabled: true,
      },
      {
        formType: ProviderName.LOOP,
        forceDisabled: false,
      },
      {
        formType: ProviderName.LOOP,
        forceDisabled: true,
      },
      {
        formType: 'CompanyProfile',
        forceDisabled: false,
      },
      {
        formType: 'CompanyProfile',
        forceDisabled: true,
      },
    ] as {
      formType: FormStructureName
      forceDisabled: boolean
    }[])(
      'should return correct form structure if the form type is $formType',
      async ({ formType, forceDisabled }) => {
        const formStructure = await getFormStructure(
          formType,
          forceDisabled,
        )

        const snapShotName = `./snapshots/getFormStructure.${formType}.forceDisabled.${forceDisabled}.snap`
        await expect(formStructure).toMatchFileSnapshot(snapShotName)
      },
    )

    it('should return empty array when formType is undefined', async () => {
      const formStructure = await getFormStructure()

      expect(formStructure).toStrictEqual([])
    })
  })
})
