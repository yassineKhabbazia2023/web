import { nextTick, reactive } from 'vue'
import { useCommentTabs } from './comment.composable'
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

function setupTabs(overrides: Partial<Parameters<typeof useCommentTabs>[0]> = {}) {
  const source = reactive({
    variants: [DELIVERED_V1, DELIVERED_V3, COLLEAGUE_READING],
    retainedKey: '',
    publishableKey: DELIVERED_V3.key,
    isDiscarded: false,
    draftVariant: MY_DRAFT as CommentVariant | undefined,
    ...overrides,
  })

  return { source, ...useCommentTabs(source) }
}

describe('useCommentTabs', () => {
  describe('active tab', () => {
    it('should open on the publishable reading', () => {
      const { activeVariant } = setupTabs()

      expect(activeVariant.value?.key).toBe(DELIVERED_V3.key)
    })

    it('should fall back on the most recent delivery when no tab matches', () => {
      const { activeVariant } = setupTabs({ publishableKey: '' })

      expect(activeVariant.value?.key).toBe(DELIVERED_V3.key)
    })

    it('should follow the publishable reading until the reader picks a tab', async () => {
      const { source, activeKey, readVariant } = setupTabs()

      source.publishableKey = DELIVERED_V1.key
      await nextTick()

      expect(activeKey.value).toBe(DELIVERED_V1.key)

      readVariant(COLLEAGUE_READING.key)
      source.publishableKey = DELIVERED_V3.key
      await nextTick()

      expect(activeKey.value).toBe(COLLEAGUE_READING.key)
    })

    it('should not follow the publishable reading while writing', async () => {
      const { source, activeKey, isEditing } = setupTabs()

      isEditing.value = true
      source.publishableKey = DELIVERED_V1.key
      await nextTick()

      expect(activeKey.value).toBe(DELIVERED_V3.key)
    })

    it('should keep the tab being read when the slot is discarded', async () => {
      const { source, activeKey } = setupTabs()

      source.publishableKey = ''
      await nextTick()

      expect(activeKey.value).toBe(DELIVERED_V3.key)
    })

    it('should leave the edition behind when switching tab', () => {
      const { activeKey, isEditing, readVariant } = setupTabs()

      isEditing.value = true
      readVariant(DELIVERED_V1.key)

      expect(activeKey.value).toBe(DELIVERED_V1.key)
      expect(isEditing.value).toBe(false)
    })

    it('should keep the edition when clicking the tab already read', () => {
      const { isEditing, readVariant } = setupTabs()

      isEditing.value = true
      readVariant(DELIVERED_V3.key)

      expect(isEditing.value).toBe(true)
    })
  })

  describe('canRetain', () => {
    it('should offer to retain a reading that is not retained yet', () => {
      const { canRetain } = setupTabs({ retainedKey: DELIVERED_V1.key })

      expect(canRetain.value).toBe(true)
    })

    it('should not offer to retain the retained reading', () => {
      const { canRetain } = setupTabs({ retainedKey: DELIVERED_V3.key })

      expect(canRetain.value).toBe(false)
    })

    it('should not offer to retain an empty reading', () => {
      const { canRetain } = setupTabs({
        variants: [{ ...DELIVERED_V3, text: '' }],
      })

      expect(canRetain.value).toBe(false)
    })
  })

  describe('canDiscard', () => {
    it('should offer to discard beside the publishable reading', () => {
      const { canDiscard } = setupTabs()

      expect(canDiscard.value).toBe(true)
    })

    it('should not offer to discard beside another tab', () => {
      const { canDiscard, readVariant } = setupTabs()

      readVariant(DELIVERED_V1.key)

      expect(canDiscard.value).toBe(false)
    })

    it('should not offer to discard a slot already discarded', () => {
      const { canDiscard } = setupTabs({ isDiscarded: true })

      expect(canDiscard.value).toBe(false)
    })

    it('should not offer to discard when nothing is publishable', () => {
      const { canDiscard } = setupTabs({ publishableKey: '' })

      expect(canDiscard.value).toBe(false)
    })
  })

  describe('writing', () => {
    it('should offer to write when the reader has no reading of their own', () => {
      const { canWrite } = setupTabs()

      expect(canWrite.value).toBe(true)
    })

    it('should not offer to write without a draft', () => {
      const { canWrite } = setupTabs({ draftVariant: undefined })

      expect(canWrite.value).toBe(false)
    })

    it('should not offer to write when the reader already has a reading', () => {
      const { canWrite } = setupTabs({
        variants: [DELIVERED_V3, { ...MY_DRAFT, text: 'Ma lecture.' }],
      })

      expect(canWrite.value).toBe(false)
    })

    it('should open the draft as a tab of its own when writing starts', () => {
      const { tabs, activeVariant, isEditing, canWrite, startWriting } = setupTabs()

      expect(tabs.value.map(variant => variant.key)).not.toContain(MY_DRAFT.key)

      startWriting()

      expect(tabs.value.at(-1)?.key).toBe(MY_DRAFT.key)
      expect(activeVariant.value?.key).toBe(MY_DRAFT.key)
      expect(isEditing.value).toBe(true)
      expect(canWrite.value).toBe(false)
    })

    it('should drop the draft tab once the saved reading arrives', () => {
      const { source, tabs, activeVariant, startWriting } = setupTabs()
      const savedReading = { ...MY_DRAFT, text: 'Ma lecture.' }

      startWriting()
      source.variants = [...source.variants, savedReading]

      expect(tabs.value).toEqual(source.variants)
      expect(activeVariant.value).toEqual(savedReading)
    })
  })
})
