import { vi, it, expect, describe } from 'vitest'
import {
  getOfferFormSections,
  getStaffSizeRange,
} from './CompanyInformationUtils'
import MEGOffersFormStructure from '../config/MEGOffersFormStructure.json'
import LOOPOfferFormStructure from '../config/LOOPOfferFormStructure.json'
import type { ProviderFormName } from '../CompanyInformationTypes'
import { getMockedAccountReferential, getMockedReferentialHubs } from '@/services/account/accountMock'
import { getMockedFormSection } from '../CompanyInformationMock'

vi.mock('@/services/account', () => ({
  fetchAccountReferential: vi.fn(() => getMockedAccountReferential()),
  fetchReferentialHubs: vi.fn(() => getMockedReferentialHubs()),
}))

vi.mock('@/common/referentialUtils', () => ({
  getEnrichedFormSection: vi.fn(() => getMockedFormSection()),
}))

describe('utils', () => {
  describe('getOfferFormStructure', () => {
    it.each([
      {
        providerName: 'MEG',
        offerFormStructure: MEGOffersFormStructure,
      },
      {
        providerName: 'LOOP',
        offerFormStructure: LOOPOfferFormStructure,
      },
      {
        providerName: 'Other',
        offerFormStructure: [],
      },
    ])(
      'should return correct form structure if the provider is $providerName',
      ({ providerName, offerFormStructure }) => {
        const formStructure = getOfferFormSections(
          providerName as ProviderFormName,
        )

        expect(formStructure).toStrictEqual(offerFormStructure)
      },
    )
  })
  describe('getStaffSizeRange', () => {
    it.each([
      {
        staffSize: 15,
        expectedStaffSizeRange: '11-49',
      },
      {
        staffSize: 55,
        expectedStaffSizeRange: '50-299',
      },
      {
        staffSize: 305,
        expectedStaffSizeRange: '+300',
      },
      {
        staffSize: 0,
        expectedStaffSizeRange: '0',
      },
      {
        staffSize: 1,
        expectedStaffSizeRange: '1',
      },
    ])(
      'should determine the range of staff sizes for $staffSize',
      ({ staffSize, expectedStaffSizeRange }) => {
        expect(getStaffSizeRange(staffSize)).toBe(expectedStaffSizeRange)
      },
    )
  })
})
