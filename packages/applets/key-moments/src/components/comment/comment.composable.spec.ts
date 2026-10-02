import { reactive } from 'vue'
import { useCommentList } from './comment.composable'
import type { CommentVariant } from '../../types/key-moments.types'

const DELIVERED_V1: CommentVariant = {
  key: 'closing:1',
  contributorId: null,
  closingVersion: 1,
  label: 'Version 1',
  tabLabel: 'Version 1',
  text: 'Texte de la v1.',
  isMine: false,
}

const DELIVERED_V3: CommentVariant = {
  key: 'closing:3',
  contributorId: null,
  closingVersion: 3,
  label: 'Version 3',
  tabLabel: 'Version 3',
  text: 'Texte de la v3.',
  isMine: false,
}

const COLLEAGUE_READING: CommentVariant = {
  key: '456',
  contributorId: '456',
  label: 'Jane Roe',
  tabLabel: 'JR',
  text: 'Sa lecture.',
  isMine: false,
}

const MY_DRAFT: CommentVariant = {
  key: '123',
  contributorId: '123',
  label: 'John Doe',
  tabLabel: 'JD',
  text: '',
  isMine: true,
}

function setupList(overrides: Partial<Parameters<typeof useCommentList>[0]> = {}) {
  const source = reactive({
    variants: [DELIVERED_V1, DELIVERED_V3, COLLEAGUE_READING],
    retainedKey: '',
    publishableKey: DELIVERED_V3.key,
    isDiscarded: false,
    draftVariant: MY_DRAFT as CommentVariant | undefined,
    ...overrides,
  })

  return { source, ...useCommentList(source) }
}

describe('useCommentList', () => {
  describe('orderedVariants', () => {
    it('should list every reading in the order it was written', () => {
      const earlyReading = { ...COLLEAGUE_READING, key: '789', updatedAt: '2026-08-20T10:00:00Z' }
      const lateReading = { ...COLLEAGUE_READING, updatedAt: '2026-08-21T10:00:00Z' }

      const { orderedVariants } = setupList({
        variants: [lateReading, DELIVERED_V1, earlyReading, DELIVERED_V3],
      })

      expect(orderedVariants.value.map(variant => variant.key))
        .toEqual([DELIVERED_V1.key, DELIVERED_V3.key, earlyReading.key, lateReading.key])
    })

    it('should follow the variants when a reading is added', () => {
      const { source, orderedVariants } = setupList()

      source.variants = [...source.variants, { ...MY_DRAFT, text: 'Ma lecture.' }]

      expect(orderedVariants.value).toHaveLength(4)
    })
  })

  describe('isDisplayed', () => {
    it('should show the reading that would go out as displayed, arbitrated or not', () => {
      const { isDisplayed } = setupList()

      expect(isDisplayed(DELIVERED_V3)).toBe(true)
      expect(isDisplayed(DELIVERED_V1)).toBe(false)
    })

    it('should display nothing once the slot is discarded', () => {
      const { isDisplayed } = setupList({ isDiscarded: true })

      expect(isDisplayed(DELIVERED_V3)).toBe(false)
    })
  })

  describe('canRetain', () => {
    it('should offer to retain any other written reading', () => {
      const { canRetain } = setupList()

      expect(canRetain(DELIVERED_V1)).toBe(true)
      expect(canRetain(COLLEAGUE_READING)).toBe(true)
    })

    it('should not offer to retain the displayed reading', () => {
      const { canRetain } = setupList()

      expect(canRetain(DELIVERED_V3)).toBe(false)
    })

    it('should not offer to retain an empty reading', () => {
      const { canRetain } = setupList()

      expect(canRetain({ ...DELIVERED_V1, text: '' })).toBe(false)
    })

    it('should offer to retain the fallback again once the slot is discarded', () => {
      const { canRetain } = setupList({ isDiscarded: true })

      expect(canRetain(DELIVERED_V3)).toBe(true)
    })
  })

  describe('canFreeze', () => {
    it('should offer to freeze the reading displayed by default', () => {
      const { canFreeze } = setupList()

      expect(canFreeze(DELIVERED_V3)).toBe(true)
    })

    it('should not offer it once that reading is retained', () => {
      const { canFreeze } = setupList({ retainedKey: DELIVERED_V3.key })

      expect(canFreeze(DELIVERED_V3)).toBe(false)
    })

    it('should not offer it on a reading that is not displayed', () => {
      const { canFreeze } = setupList()

      expect(canFreeze(DELIVERED_V1)).toBe(false)
    })

    it('should not offer it once the slot is discarded', () => {
      const { canFreeze } = setupList({ isDiscarded: true })

      expect(canFreeze(DELIVERED_V3)).toBe(false)
    })
  })

  describe('canCompose', () => {
    it('should open the writing while I have no reading of my own', () => {
      const { canCompose } = setupList()

      expect(canCompose.value).toBe(true)
    })

    it('should close it once my reading exists', () => {
      const { canCompose } = setupList({
        variants: [DELIVERED_V3, { ...MY_DRAFT, text: 'Ma lecture.' }],
      })

      expect(canCompose.value).toBe(false)
    })

    it('should close it when nothing may be written', () => {
      const { canCompose } = setupList({ draftVariant: undefined })

      expect(canCompose.value).toBe(false)
    })
  })
})
