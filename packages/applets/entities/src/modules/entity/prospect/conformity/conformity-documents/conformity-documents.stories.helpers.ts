import type { StoryObj } from '@storybook/vue3-vite'
import { useCurrentEntityStore, useUserStore } from '@pulse/common/stores'
import { getMockedEntitySummary, getMockedUser } from '@pulse/common/mocks'
import { SupportingDocumentType } from '@entities/enums'
import { getSupportingDocumentItemMock, getUploadedSupportingDocumentMock } from '@entities/__mocks__'
import { ConformityDocumentsService } from '@entities/services/conformity-documents'
import type { SupportingDocumentsResponse } from '@entities/services/conformity-documents'
import { ProspectsService } from '@entities/services/prospects/prospects.service'
import { OnboardingStep, OnboardingStepStatus } from '../prospect-conformity.enums'
import ConformityDocuments from './conformity-documents.vue'

// Possible screens of the conformity-documents parent, driven by the shared API state.
export type ConformityDocumentsState = 'empty' | 'partial' | 'filled' | 'error'

const PREDEFINED_DOCUMENTS = [
  { type: SupportingDocumentType.KBIS, maxFiles: 1, fileName: 'kbis.pdf' },
  { type: SupportingDocumentType.STATUTS, maxFiles: 2, fileName: 'statuts.pdf' },
  { type: SupportingDocumentType.BENEFICIAL_OWNER_DECLARATION, maxFiles: 1, fileName: 'declaration-beneficiaires.pdf' },
  { type: SupportingDocumentType.PREFECTURE_DECLARATION, maxFiles: 1, fileName: 'declaration-prefecture.pdf' },
]

const buildUploadedDocuments = (count: number, fileName: string, baseId: number) =>
  Array.from({ length: count }, (_, index) =>
    getUploadedSupportingDocumentMock({
      id: baseId + index,
      fileName: count > 1 ? fileName.replaceAll('.pdf', `-${index + 1}.pdf`) : fileName,
    }),
  )

// Number of already-uploaded documents per predefined type for a given story state.
const getUploadedCount = (
  state: Exclude<ConformityDocumentsState, 'error'>,
  maxFiles: number,
  index: number,
): number => {
  if (state === 'filled') {
    return maxFiles
  }
  if (state === 'partial' && index === 0) {
    return 1
  }
  return 0
}

// empty: every upload zone shown · partial: only the first supporting document + complementary uploaded ·
// filled: each type satisfies its maxFiles, so no leftover upload slot remains.
const buildResponse = (state: Exclude<ConformityDocumentsState, 'error'>): SupportingDocumentsResponse => ({
  documents: [
    ...PREDEFINED_DOCUMENTS.map((document, index) => {
      const uploadedCount = getUploadedCount(state, document.maxFiles, index)
      return getSupportingDocumentItemMock({
        type: document.type,
        maxFiles: document.maxFiles,
        documents: buildUploadedDocuments(uploadedCount, document.fileName, (index + 1) * 10),
      })
    }),
    getSupportingDocumentItemMock({
      type: SupportingDocumentType.COMPLEMENTARY,
      maxFiles: 10,
      documents: state === 'empty'
        ? []
        : [getUploadedSupportingDocumentMock({ id: 99, fileName: 'contrat-location.pdf' })],
    }),
  ],
})

const RESPONSES: Record<Exclude<ConformityDocumentsState, 'error'>, SupportingDocumentsResponse> = {
  empty: buildResponse('empty'),
  partial: buildResponse('partial'),
  filled: buildResponse('filled'),
}

// Seeds the user (collab/customer) and entity, then stubs the API so the story renders the
// chosen state offline, without a backend. The step status drives the read-only (completed) view.
function mockConformityDocuments(
  isCollaborator: boolean,
  state: ConformityDocumentsState,
  stepStatus: OnboardingStepStatus,
): void {
  useUserStore().setUser(getMockedUser({ isCollab: isCollaborator }))
  useCurrentEntityStore().setCurrentEntity(getMockedEntitySummary({ prospectId: 1 }))
  ConformityDocumentsService.getSupportingDocuments = state === 'error'
    ? () => Promise.reject(new Error('Supporting documents request failed (404)'))
    : () => Promise.resolve(RESPONSES[state])
  ConformityDocumentsService.uploadConformityDocument = () => Promise.resolve()
  ProspectsService.fetchOnboardingStep = () =>
    Promise.resolve({ id: OnboardingStep.SupportingDocuments, status: stepStatus })
}

export const createRenderWithState = (isCollaborator: boolean) =>
  (
    state: ConformityDocumentsState,
    stepStatus: OnboardingStepStatus = OnboardingStepStatus.ToDo,
  ): StoryObj<typeof ConformityDocuments>['render'] =>
    (args) => ({
      components: { ConformityDocuments },
      setup() {
        mockConformityDocuments(isCollaborator, state, stepStatus)
        return { args }
      },
      template: `
        <div style="padding: 24px;">
          <div style="width: 720px;">
            <ConformityDocuments v-bind="args" />
          </div>
        </div>
      `,
    })
