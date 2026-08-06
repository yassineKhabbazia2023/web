import { API_PREFIXES } from '@pulse/common/constants'
import {
  apiGatewayDeleteMock,
  apiGatewayGetMock,
  apiGatewayPostMock,
  apiGatewayPutMock,
} from '@pulse/common/mocks/vitest'
import { BeneficiaryDocumentType } from '@entities/modules/entity/prospect/types'
import {
  OnboardingStep,
  OnboardingStepStatus,
} from '@entities/modules/entity/prospect/conformity/prospect-conformity.enums'
import { getBeneficiariesResponseMock, getFileMock } from '@entities/__mocks__/beneficiaries.mocks'
import {
  getMockedProspectAccountRow,
  getProspectCreationPayloadMock,
} from '@entities/__mocks__/prospect.mocks'
import { getMockedCollaborators } from '@entities/__mocks__/collaborators.mocks'
import {
  getCollaboratorTargetRolesMock,
  getProspectEntitySearchResultMock,
} from '@entities/modules/wallet/pages/prospects/components/prospect-creation-drawer/__mocks__/prospect-creation-drawer.mocks'
import { ProspectEligibilityStatus } from '@entities/modules/wallet/enums'
import { ProspectsService } from './prospects.service'
import type { OnboardingStepResponse } from './prospects.types'

const mocks = {
  get: apiGatewayGetMock,
  post: apiGatewayPostMock,
  put: apiGatewayPutMock,
  delete: apiGatewayDeleteMock,
}

const prospectId = 602
const accountId = 1971
const entityId = 1971

describe('ProspectsService', () => {
  describe('fetchProspectsAccounts', () => {
    it('should GET the current user prospects without a query string when no params are provided', async () => {
      const responseData = {
        items: [getMockedProspectAccountRow()],
        currentPage: 1,
        totalItems: 1,
        totalPages: 1,
      }
      mocks.get.mockResolvedValueOnce({ data: responseData })

      const result = await ProspectsService.fetchProspectsAccounts()

      expect(mocks.get).toHaveBeenCalledWith(`${API_PREFIXES.WALLET}/prospects/currentuser`)
      expect(result).toEqual(responseData)
    })

    it('should append the search params to the URL when provided', async () => {
      const searchParams = new URLSearchParams({ page: '1', pageSize: '20' })
      mocks.get.mockResolvedValueOnce({ data: { items: [], currentPage: 1, totalItems: 0, totalPages: 0 } })

      await ProspectsService.fetchProspectsAccounts(searchParams)

      expect(mocks.get).toHaveBeenCalledWith(
        `${API_PREFIXES.WALLET}/prospects/currentuser?${searchParams}`,
      )
    })
  })

  describe('archiveProspect', () => {
    it('should DELETE the prospect for the current user', async () => {
      await ProspectsService.archiveProspect(prospectId)

      expect(mocks.delete).toHaveBeenCalledWith(
        `${API_PREFIXES.WALLET}/prospects/${prospectId}/currentuser`,
      )
    })
  })

  describe('searchEntities', () => {
    it('should GET the accounts search endpoint with the query and return the data', async () => {
      const query = 'acme'
      const responseData = [getProspectEntitySearchResultMock()]
      mocks.get.mockResolvedValueOnce({ data: responseData })

      const result = await ProspectsService.searchEntities(query)

      expect(mocks.get).toHaveBeenCalledWith(`${API_PREFIXES.PROSPECT}/accounts/search`, {
        params: { query },
      })
      expect(result).toEqual(responseData)
    })

    it('should return an empty array when the response has no data', async () => {
      mocks.get.mockResolvedValueOnce({ data: undefined })

      const result = await ProspectsService.searchEntities('acme')

      expect(result).toEqual([])
    })
  })

  describe('createProspect', () => {
    it('should POST the onboarding endpoint with the payload', async () => {
      const payload = getProspectCreationPayloadMock()

      await ProspectsService.createProspect(payload)

      expect(mocks.post).toHaveBeenCalledWith(
        `${API_PREFIXES.PROSPECT}/onboarding/currentuser`,
        payload,
      )
    })
  })

  describe('checkProspectCreationEligibility', () => {
    const siret = '12345678900001'

    it('should GET the eligibility endpoint with the siret and a validateStatus predicate', async () => {
      mocks.get.mockResolvedValueOnce({ status: 202 })

      await ProspectsService.checkProspectCreationEligibility(siret)

      expect(mocks.get).toHaveBeenCalledWith(`${API_PREFIXES.PROSPECT}/prospects/check-eligibility`, {
        params: { siret },
        validateStatus: expect.any(Function),
      })

      const { validateStatus } = mocks.get.mock.calls[0][1]
      expect(validateStatus(200)).toBe(true)
      expect(validateStatus(202)).toBe(true)
      expect(validateStatus(400)).toBe(true)
      expect(validateStatus(404)).toBe(false)
    })

    it('should return ELIGIBLE when the status is 202', async () => {
      mocks.get.mockResolvedValueOnce({ status: 202 })

      const result = await ProspectsService.checkProspectCreationEligibility(siret)

      expect(result).toBe(ProspectEligibilityStatus.ELIGIBLE)
    })

    it('should return ALREADY_CLIENT when the status is 200', async () => {
      mocks.get.mockResolvedValueOnce({ status: 200 })

      const result = await ProspectsService.checkProspectCreationEligibility(siret)

      expect(result).toBe(ProspectEligibilityStatus.ALREADY_CLIENT)
    })

    it('should return INVALID_SIRET when the status is 400', async () => {
      mocks.get.mockResolvedValueOnce({ status: 400 })

      const result = await ProspectsService.checkProspectCreationEligibility(siret)

      expect(result).toBe(ProspectEligibilityStatus.INVALID_SIRET)
    })
  })

  describe('fetchCollaboratorTargetRoles', () => {
    it('should GET the collab roles and return the data', async () => {
      const responseData = getCollaboratorTargetRolesMock()
      mocks.get.mockResolvedValueOnce({ data: responseData })

      const result = await ProspectsService.fetchCollaboratorTargetRoles()

      expect(mocks.get).toHaveBeenCalledWith(`${API_PREFIXES.PROSPECT}/collab-roles`)
      expect(result).toEqual(responseData)
    })

    it('should return an empty array when the response has no data', async () => {
      mocks.get.mockResolvedValueOnce({ data: undefined })

      const result = await ProspectsService.fetchCollaboratorTargetRoles()

      expect(result).toEqual([])
    })
  })

  describe('fetchCollaborators', () => {
    it('should GET the contacts endpoint with the search and the default page size', async () => {
      const search = 'emma'
      const collaborators = getMockedCollaborators()
      mocks.get.mockResolvedValueOnce({ data: { items: collaborators } })

      const result = await ProspectsService.fetchCollaborators(search)

      expect(mocks.get).toHaveBeenCalledWith(`${API_PREFIXES.PROSPECT}/contacts`, {
        params: { search, pageSize: 100 },
      })
      expect(result).toEqual(collaborators)
    })

    it('should forward an explicit page size', async () => {
      mocks.get.mockResolvedValueOnce({ data: { items: [] } })

      await ProspectsService.fetchCollaborators('emma', 25)

      expect(mocks.get).toHaveBeenCalledWith(`${API_PREFIXES.PROSPECT}/contacts`, {
        params: { search: 'emma', pageSize: 25 },
      })
    })

    it('should return an empty array when the response has no items', async () => {
      mocks.get.mockResolvedValueOnce({ data: {} })

      const result = await ProspectsService.fetchCollaborators('emma')

      expect(result).toEqual([])
    })
  })

  describe('fetchBeneficiaries', () => {
    it('should GET the beneficiaries of the account and return the data', async () => {
      const responseData = getBeneficiariesResponseMock()
      mocks.get.mockResolvedValueOnce({ data: responseData })

      const result = await ProspectsService.fetchBeneficiaries(accountId)

      expect(mocks.get).toHaveBeenCalledWith(
        `${API_PREFIXES.PROSPECT}/onboarding/${accountId}/beneficiaries`,
      )
      expect(result).toEqual(responseData)
    })
  })

  describe('uploadBeneficiaryDocuments', () => {
    it('should POST a multipart form with the document type and every file', async () => {
      const beneficiaryId = 'beneficiary-guid-1'
      const recto = getFileMock('cni-recto.pdf')
      const verso = getFileMock('cni-verso.pdf')

      await ProspectsService.uploadBeneficiaryDocuments(
        accountId,
        beneficiaryId,
        BeneficiaryDocumentType.CNI,
        [recto, verso],
      )

      expect(mocks.post).toHaveBeenCalledWith(
        `${API_PREFIXES.PROSPECT}/onboarding/${accountId}/beneficiaries/${beneficiaryId}/identity-documents`,
        expect.any(FormData),
        { headers: { 'Content-Type': 'multipart/form-data' } },
      )
      const [, formData] = mocks.post.mock.calls[0]
      expect(formData.get('documentType')).toBe(BeneficiaryDocumentType.CNI)
      expect(formData.getAll('files')).toEqual([recto, verso])
    })
  })

  describe('deleteProspectDocument', () => {
    it('should DELETE the account document by its id', async () => {
      const documentId = 'doc-guid-1'

      await ProspectsService.deleteProspectDocument(accountId, documentId)

      expect(mocks.delete).toHaveBeenCalledWith(
        `${API_PREFIXES.PROSPECT}/onboarding/${accountId}/documents/${documentId}`,
      )
    })
  })

  describe('getProspectDocumentDeleteBaseUrl', () => {
    it('should build the document deletion base url of the account', () => {
      expect(ProspectsService.getProspectDocumentDeleteBaseUrl(accountId)).toBe(
        `${API_PREFIXES.PROSPECT}/onboarding/${accountId}/documents`,
      )
    })
  })

  describe('fetchOnboardingSteps', () => {
    it('should GET the onboarding steps of the account and return the data', async () => {
      const responseData: OnboardingStepResponse[] = [
        { id: OnboardingStep.CommercialProposal, status: OnboardingStepStatus.InProgress },
      ]
      mocks.get.mockResolvedValueOnce({ data: responseData })

      const result = await ProspectsService.fetchOnboardingSteps(accountId)

      expect(mocks.get).toHaveBeenCalledWith(
        `${API_PREFIXES.PROSPECT}/onboarding/${accountId}/steps`,
      )
      expect(result).toEqual(responseData)
    })
  })

  describe('fetchOnboardingStep', () => {
    it('should GET the individual onboarding step of the account and return the data', async () => {
      const responseData: OnboardingStepResponse = {
        id: OnboardingStep.CommercialProposal,
        status: OnboardingStepStatus.InProgress,
      }
      mocks.get.mockResolvedValueOnce({ data: responseData })

      const result = await ProspectsService.fetchOnboardingStep(accountId, OnboardingStep.CommercialProposal)

      expect(mocks.get).toHaveBeenCalledWith(
        `${API_PREFIXES.PROSPECT}/onboarding/${accountId}/steps/${OnboardingStep.CommercialProposal}`,
      )
      expect(result).toEqual(responseData)
    })
  })

  describe('completeOnboardingStep', () => {
    it('should PUT the step complete endpoint with the account id and unchanged step name body', async () => {
      await ProspectsService.completeOnboardingStep(accountId, OnboardingStep.CommercialProposal)

      expect(mocks.put).toHaveBeenCalledWith(
        `${API_PREFIXES.PROSPECT}/onboarding/${accountId}/steps/complete`,
        { StepName: OnboardingStep.CommercialProposal },
      )
    })
  })

  describe('downloadCommercialProposal', () => {
    it('should GET the commercial proposal content as a blob and return it', async () => {
      const blob = new Blob(['binary'], { type: 'application/pdf' })
      mocks.get.mockResolvedValueOnce({ data: blob })

      const result = await ProspectsService.downloadCommercialProposal(entityId)

      expect(mocks.get).toHaveBeenCalledWith(
        `${API_PREFIXES.PROSPECT}/onboarding/${entityId}/commercial-proposal/content`,
        { responseType: 'blob' },
      )
      expect(result).toBe(blob)
    })
  })

  describe('uploadCommercialProposal', () => {
    it('should POST a multipart form with the file', async () => {
      const file = getFileMock('proposal.pdf')

      await ProspectsService.uploadCommercialProposal(entityId, file)

      expect(mocks.post).toHaveBeenCalledWith(
        `${API_PREFIXES.PROSPECT}/onboarding/${entityId}/commercial-proposal`,
        expect.any(FormData),
        { headers: { 'Content-Type': 'multipart/form-data' } },
      )
      const [, formData] = mocks.post.mock.calls[0]
      expect(formData.get('file')).toBe(file)
    })
  })

  describe('downloadEngagementLetter', () => {
    it('should GET the engagement letter content as a blob and return it', async () => {
      const blob = new Blob(['binary'], { type: 'application/pdf' })
      mocks.get.mockResolvedValueOnce({ data: blob })

      const result = await ProspectsService.downloadEngagementLetter(entityId)

      expect(mocks.get).toHaveBeenCalledWith(
        `${API_PREFIXES.PROSPECT}/onboarding/${entityId}/engagement-letter/content`,
        { responseType: 'blob' },
      )
      expect(result).toBe(blob)
    })
  })

  describe('uploadEngagementLetter', () => {
    it('should POST a multipart form with the file', async () => {
      const file = getFileMock('engagement-letter.pdf')

      await ProspectsService.uploadEngagementLetter(entityId, file)

      expect(mocks.post).toHaveBeenCalledWith(
        `${API_PREFIXES.PROSPECT}/onboarding/${entityId}/engagement-letter`,
        expect.any(FormData),
        { headers: { 'Content-Type': 'multipart/form-data' } },
      )
      const [, formData] = mocks.post.mock.calls[0]
      expect(formData.get('file')).toBe(file)
    })
  })
})
