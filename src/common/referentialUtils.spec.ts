import { vi, it, expect, describe } from 'vitest'
import {
  referentialOptionsToPDropdownOption,
  getReferentialDropdownOptions,
  getEnrichedField,
  getEnrichedFormSection,
} from './referentialUtils'
import type { ReferentialOptions } from '@/services/account'
import type { PDropdownOption } from '@kpmg/styleguide'
import { getMockedAccountReferential, getMockedReferentialHubs } from '@/services/account/accountMock'
import { getMockedFormField, getMockedFormSection }
  from '@/pages/entities/components/CompanyInformation/CompanyInformationMock'
import type { FormField, FormSection }
  from '@/pages/entities/components/CompanyInformation/CompanyInformationTypes'

const mockedReferential = getMockedAccountReferential()
const mockedReferentialHubs = getMockedReferentialHubs().slice(0, 2)
const mockedFormSection = getMockedFormSection()

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

    it('should emit console.warn when pFieldType is out from referential', () => {
      const consoleWarnSpy = vi.spyOn(console, 'warn')
      const field: FormField = getMockedFormField({
        referentialKey: 'foo',
        pFieldType: 'dropdown',
      })
      const referentialDropdownOptions = getEnrichedField(
        mockedReferential,
        mockedReferentialHubs,
        field,
      )
      const expected = {
        pFieldKey: 'field-key',
        pFieldType: 'dropdown',
        pLabel: 'field-label',
        referentialKey: 'foo',
      }
      expect(consoleWarnSpy).toHaveBeenCalledOnce()
      expect(consoleWarnSpy).toHaveBeenNthCalledWith(1, "missing referential for field: 'foo'")
      expect(referentialDropdownOptions).toStrictEqual(expected)
    })
  })

  describe('getEnrichedFormSection', () => {
    it('should return proper dropdownOptions', () => {
      const referentialDropdownOptions = getEnrichedFormSection(
        mockedReferential,
        mockedReferentialHubs,
        mockedFormSection,
      )
      const expected: FormSection = {
        title: 'Title',
        fields: [{
          pFieldKey: 'field-key',
          pFieldType: 'input',
          pLabel: 'field-label',
        }],
      }
      expect(referentialDropdownOptions).toStrictEqual(expected)
    })
  })
})
