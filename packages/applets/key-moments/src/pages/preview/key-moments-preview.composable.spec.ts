import { ref } from 'vue'
import { getStoreMock } from '@pulse/common/mocks/vitest'
import { useKeyMomentsPreview } from './key-moments-preview.composable'
import { PreviewMode } from './key-moments-preview.enums'
import { useKeyMomentsDraftStore } from '../../stores/key-moments-draft.store'
import { ReportManager } from '../../managers/report.manager'
import { PublicationState } from '../../enums/key-moments.enums'
import type { KeyMomentsDraft, KeyMomentsDraftPublishing } from '../../stores/key-moments-draft.types'
import type { PublicationPayload } from '../../services/key-moments.service.types'
import type { Report } from '../../types/key-moments.types'

const PUBLICATION = { id: 1, publishedAt: '2026-03-14T09:12:00Z' } as PublicationPayload

const REPORT: Report = {
  entity: { name: 'SAS TEST', legalForm: 'SAS', siret: '12345678900015' },
  screens: [],
}

const PUBLISHING: KeyMomentsDraftPublishing = {
  context: {} as KeyMomentsDraftPublishing['context'],
  snapshots: [],
  buttonLabel: 'Publier',
  popupMessage: '',
  divergenceLabels: [],
  isDisabled: false,
}

function draftOf(overrides: Partial<KeyMomentsDraft> = {}): KeyMomentsDraft {
  return {
    exerciceId: 9,
    exerciceStartDate: '2025-01-01',
    exerciceEndDate: '2025-12-31',
    locale: 'fr-FR',
    dataset: {} as KeyMomentsDraft['dataset'],
    template: {} as KeyMomentsDraft['template'],
    referenceKey: 'N-1',
    isInThousands: true,
    offers: [],
    publicationState: PublicationState.MODIFIED,
    publishing: PUBLISHING,
    ...overrides,
  }
}

const draftStoreMock = getStoreMock(useKeyMomentsDraftStore)

function setup(publication?: PublicationPayload, exerciceId = 9) {
  return useKeyMomentsPreview(ref(exerciceId), ref(publication))
}

describe('useKeyMomentsPreview', () => {
  beforeEach(() => {
    vi.spyOn(ReportManager, 'buildReport').mockReturnValue(structuredClone(REPORT))
  })

  describe('the mode it opens on', () => {
    it('should offer the published one alone when publishing would change nothing', () => {
      draftStoreMock.draft = draftOf({ publicationState: PublicationState.UP_TO_DATE })

      const { mode, draft, isModeSegmentVisible } = setup(PUBLICATION)

      expect(mode.value).toBe(PreviewMode.PUBLISHED)
      expect(draft.value).toBeUndefined()
      expect(isModeSegmentVisible.value).toBe(false)
    })

    it.each([
      PublicationState.MODIFIED,
      PublicationState.DELIVERY,
      PublicationState.UNKNOWN,
    ])('should open on the draft when the exercice is %s', (publicationState) => {
      draftStoreMock.draft = draftOf({ publicationState })

      const { mode, isModeSegmentVisible } = setup(PUBLICATION)

      expect(mode.value).toBe(PreviewMode.DRAFT)
      expect(isModeSegmentVisible.value).toBe(true)
    })

    it('should open on the draft when nothing was ever published', () => {
      draftStoreMock.draft = draftOf({ publicationState: PublicationState.NEVER })

      const { mode, isModeSegmentVisible } = setup(undefined)

      expect(mode.value).toBe(PreviewMode.DRAFT)
      expect(isModeSegmentVisible.value).toBe(false)
    })

    it('should fall back on the published one when the store holds no draft', () => {
      draftStoreMock.draft = undefined

      const { mode, draft, isModeSegmentVisible } = setup(PUBLICATION)

      expect(mode.value).toBe(PreviewMode.PUBLISHED)
      expect(draft.value).toBeUndefined()
      expect(isModeSegmentVisible.value).toBe(false)
    })

    it('should ignore a draft of another exercice', () => {
      draftStoreMock.draft = draftOf({ exerciceId: 8 })

      const { mode, draft } = setup(PUBLICATION)

      expect(draft.value).toBeUndefined()
      expect(mode.value).toBe(PreviewMode.PUBLISHED)
    })

    it('should have nothing to show without a draft nor a publication', () => {
      draftStoreMock.draft = undefined

      const { mode } = setup(undefined)

      expect(mode.value).toBeUndefined()
    })
  })

  it('should offer the segment and follow the reader between the two', () => {
    draftStoreMock.draft = draftOf()

    const { mode, isModeSegmentVisible, selectMode } = setup(PUBLICATION)

    expect(isModeSegmentVisible.value).toBe(true)
    selectMode(PreviewMode.PUBLISHED)
    expect(mode.value).toBe(PreviewMode.PUBLISHED)
    selectMode(PreviewMode.DRAFT)
    expect(mode.value).toBe(PreviewMode.DRAFT)
  })

  it('should give the draft choice up once the draft is gone', () => {
    draftStoreMock.draft = draftOf()

    const { mode, selectMode } = setup(PUBLICATION)

    selectMode(PreviewMode.DRAFT)
    draftStoreMock.draft = undefined

    expect(mode.value).toBe(PreviewMode.PUBLISHED)
  })

  describe('the draft laid out', () => {
    it('should lay the draft out without the hidden sub-sections, in the unit of the editor', () => {
      const draft = draftOf({ isInThousands: true })
      draftStoreMock.draft = draft

      const { draftReport, isInThousands } = setup(PUBLICATION)

      expect(isInThousands.value).toBe(true)
      expect(draftReport.value).toEqual(REPORT)
      expect(vi.mocked(ReportManager.buildReport)).toHaveBeenCalledWith(
        draft.dataset,
        draft.template,
        { keepHidden: false, inThousands: true, referenceKey: 'N-1' },
      )
    })

    /**
     * The preview reads what the client would be served, and that reading was
     * settled in the editor: nothing on the page offers to change it.
     */
    it('should lay the draft out in euros when the editor holds it in euros', () => {
      draftStoreMock.draft = draftOf({ isInThousands: false })

      const { draftReport, isInThousands } = setup(PUBLICATION)

      expect(isInThousands.value).toBe(false)
      expect(draftReport.value).toEqual(REPORT)
      expect(vi.mocked(ReportManager.buildReport)).toHaveBeenLastCalledWith(
        expect.anything(),
        expect.anything(),
        expect.objectContaining({ inThousands: false }),
      )
    })

    it('should lay nothing out without a draft', () => {
      draftStoreMock.draft = undefined

      const { draftReport } = setup(PUBLICATION)

      expect(draftReport.value).toBeUndefined()
      expect(vi.mocked(ReportManager.buildReport)).not.toHaveBeenCalled()
    })
  })
})
