import { logger } from '@pulse/toolbox'
import { displayNotification } from '@pulse/styleguide'
import { getStoreMock } from '@pulse/common/mocks/vitest'
import { getMockedUser } from '@pulse/common/mocks'
import { useUserStore } from '@pulse/common/stores'
import { useComments } from './comments.composable'
import { usePublications } from './publication.composable'
import { KeyMomentsService } from '../../services/key-moments.service'
import { CurrencyDisplay, Renderer } from '../../enums/key-moments.enums'
import type {
  PublicationDetailPayload,
  PublicationPayload,
  SlotCommentsPayload,
} from '../../services/key-moments.service.types'
import type { PublishedOfferPayload } from '../../services/offers.service.types'
import type { PublishContext, Screen } from '../../types/key-moments.types'

/**
 * One slot read by five voices: two imports that worded it differently, me, a
 * colleague, and a contributor who emptied their own reading.
 *
 * The served versions are 1 and 3, never 1 and 2: a delivery repeating the
 * previous wording is not served under its own number, so the numbers have
 * holes and nothing may derive one from a rank.
 */
const SLOTS: SlotCommentsPayload[] = [
  {
    slotId: 'synthese',
    variants: [
      {
        contributorId: null,
        contributorName: null,
        closingVersion: 1,
        text: 'Texte de la v1.',
        updatedAt: null,
        isRetained: false,
        isPublishable: false,
      },
      {
        contributorId: null,
        contributorName: null,
        closingVersion: 3,
        text: 'Texte livré du dernier closing.',
        updatedAt: null,
        // nothing is retained, and the microservice falls back on its own: the
        // most recent delivery is what would go out
        isRetained: false,
        isPublishable: true,
      },
      {
        contributorId: '123',
        contributorName: 'John Doe',
        closingVersion: null,
        text: 'Ma lecture.',
        updatedAt: '2026-08-13T09:12:00Z',
        isRetained: false,
        isPublishable: false,
      },
      {
        contributorId: '456',
        contributorName: 'Marie Leroy',
        closingVersion: null,
        text: 'À nuancer.',
        updatedAt: '2026-08-12T09:12:00Z',
        isRetained: false,
        isPublishable: false,
      },
      {
        contributorId: '789',
        contributorName: 'Paul Muet',
        closingVersion: null,
        text: '',
        updatedAt: null,
        isRetained: false,
        isPublishable: false,
      },
    ],
    isDiscarded: false,
  },
]

const CONTEXT: PublishContext = {
  templateId: 1,
  templateVersion: '1.0.0',
  closingId: 90,
  closingVersion: 2,
  preferenceComparisonExercice: 'N-1',
  preferenceCurrencyDisplay: CurrencyDisplay.EURO,
}

/** What publishing hands the microservice of the section, already resolved. */
const OFFERS: PublishedOfferPayload[] = [{
  offerId: 128,
  title: 'Prévoyance TNS',
  shortDescription: 'Couvre les arrêts de travail.',
  categoryName: 'Prévoyance',
  subCategoryName: 'TNS',
  imageUrl: 'prevoyance.png',
  pdfUrl: 'prevoyance.pdf',
}]

const PUBLICATIONS: PublicationPayload[] = [
  {
    id: 99,
    exerciceId: 7,
    closingId: 90,
    closingVersion: 2,
    templateId: 1,
    templateVersion: '1.0.0',
    publishedBy: '123',
    publishedByName: 'John Doe',
    publishedAt: '2026-08-13T09:40:00Z',
    preferenceComparisonExercice: 'N-1',
    preferenceCurrencyDisplay: 'euro',
  },
]

/** Two widgets, one reading a slot, one reading none. */
function buildScreens(): Screen[] {
  return [{
    id: 'activite',
    title: 'Votre activité',
    isHidden: false,
    widgets: [
      {
        id: 'synthese',
        title: 'Synthèse',
        comment: 'Texte livré du dernier closing.',
        commentSlotId: 'synthese',
        span: 12,
        renderer: Renderer.TABLE,
        availableRenderers: [Renderer.TABLE],
        isHidden: false,
        isCommentHidden: false,
      },
      {
        id: 'chartmargeca',
        title: 'Marge',
        comment: '',
        span: 6,
        renderer: Renderer.TABLE,
        availableRenderers: [Renderer.TABLE],
        isHidden: false,
        isCommentHidden: false,
      },
    ],
  }]
}

/** The arbitration a publication of the exercice froze: Marie Leroy's reading. */
const PUBLICATION_DETAIL: PublicationDetailPayload = {
  ...PUBLICATIONS[0],
  isActive: true,
  recommendations: [],
  comments: [{
    slotId: 'synthese',
    text: 'À nuancer.',
  }],
  hiddenWidgetIds: [],
}

/**
 * The readings the microservice holds, which the tests move rather than
 * re-stub: the page no longer predicts what would be published, it reads the
 * markers back — so a mock that never answers what a write just settled would
 * describe a microservice that does not exist.
 */
let slots: SlotCommentsPayload[]

/**
 * Retaining, as the microservice settles it: the chosen reading carries both
 * markers, and every other one loses them. A retained reading is the one that
 * would be published, which is exactly what the closing on screen makes true
 * here.
 */
function retainInBase(
  slotId: string,
  sourceContributorId: string | null,
  sourceClosingVersion: number | null,
): void {
  const slot = slotInBase(slotId)

  // retaining a reading reopens the slot: it is the only thing that undoes an
  // écart, and the two states never hold at once
  slot.isDiscarded = false
  slot.variants.forEach((variant) => {
    const isChosen = variant.contributorId === sourceContributorId
      && variant.closingVersion === sourceClosingVersion

    variant.isRetained = isChosen
    variant.isPublishable = isChosen
  })
}

/**
 * Discarding, as the microservice settles it: the slot goes out with nothing,
 * so no reading of it is retained nor publishable any more. Taken on a slot it
 * holds no reading of, which is the very case the route stopped refusing.
 */
function discardInBase(slotId: string): void {
  const slot = slotInBase(slotId)

  slot.isDiscarded = true
  slot.variants.forEach((variant) => {
    variant.isRetained = false
    variant.isPublishable = false
  })
}

/**
 * Deleting my own reading, as the microservice settles it: the line goes, and
 * the slot is discarded when the line that went was the retained one. A write
 * carrying a text is left to the stub resolving — the page holds what it just
 * wrote, and only an emptied line has it read the slot back.
 */
function deleteInBase(slotId: string): void {
  const slot = slotInBase(slotId)

  if (slot.variants.some(variant => variant.contributorId === '123' && variant.isRetained)) {
    slot.isDiscarded = true
  }

  slot.variants = slot.variants.filter(variant => variant.contributorId !== '123')
}

/**
 * Writing my own reading, as the microservice settles it: the line is rewritten
 * or created, and the markers stay where they were.
 */
function writeInBase(slotId: string, text: string): void {
  const slot = slotInBase(slotId)
  const mine = slot.variants.find(variant => variant.contributorId === '123')

  if (mine !== undefined) {
    mine.text = text

    return
  }

  slot.variants.push({
    contributorId: '123',
    contributorName: 'John Doe',
    closingVersion: null,
    text,
    updatedAt: '2026-02-01T10:00:00Z',
    isRetained: false,
    isPublishable: false,
  })
}

/** The slot as the base holds it, opened empty on the first gesture reaching it. */
function slotInBase(slotId: string): SlotCommentsPayload {
  const known = slots.find(slot => slot.slotId === slotId)

  if (known !== undefined) {
    return known
  }

  const opened: SlotCommentsPayload = { slotId, variants: [], isDiscarded: false }
  slots.push(opened)

  return opened
}

/**
 * The two composables as the page wires them, and in the order it wires them:
 * the published state is read on the exercice, the readings on the closing that
 * would be published.
 */
function buildComments() {
  const publications = usePublications(42)
  const comments = useComments(42, publications)

  async function openExercice(exerciceId: number, closingId = 90) {
    await publications.loadPublications()
    await publications.openExercice(exerciceId)
    await comments.loadComments(exerciceId, closingId)
  }

  return { ...comments, ...publications, openExercice }
}

beforeEach(() => {
  // getMockedUser is id 123 / John Doe: the id the fixture contributes under
  getStoreMock(useUserStore).user = getMockedUser()
  slots = structuredClone(SLOTS)
  // exercice 7 is the one the fixture describes; 8 was never written on
  vi.spyOn(KeyMomentsService, 'getComments')
    .mockImplementation((_accountId, exerciceId) => Promise.resolve(
      exerciceId === 7 ? structuredClone(slots) : [],
    ))
  vi.spyOn(KeyMomentsService, 'saveComment')
    .mockImplementation((_accountId, _exerciceId, slotId, text) => {
      if (text === '') {
        deleteInBase(slotId)
      } else {
        writeInBase(slotId, text)
      }

      return Promise.resolve()
    })
  vi.spyOn(KeyMomentsService, 'retainComment')
    .mockImplementation((_accountId, _exerciceId, slotId, payload) => {
      if (payload.retainNone === true) {
        discardInBase(slotId)
      } else {
        retainInBase(slotId, payload.sourceContributorId, payload.sourceClosingVersion)
      }

      return Promise.resolve()
    })
  // an exercice nobody published yet, which the publishing tests override
  vi.spyOn(KeyMomentsService, 'getPublications').mockResolvedValue([])
  vi.spyOn(KeyMomentsService, 'getPublication').mockResolvedValue(PUBLICATION_DETAIL)
})

describe('useComments', () => {

  describe('reading the variants', () => {

    /**
     * One call serves the whole page, and it names the closing: which reading
     * would be published depends on the delivery being published.
     */
    it('should read the contributions of the exercice once for the whole page', async () => {
      const { openExercice } = buildComments()

      await openExercice(7)

      expect(vi.mocked(KeyMomentsService.getComments)).toHaveBeenCalledExactlyOnceWith(42, 7, 90)
    })

    /**
     * The delivered texts first, chronologically — the oldest import on the
     * left, as the back serves them — then mine, since it is where I write,
     * then the readings of the others.
     */
    it('should compose the tabs in reading order', async () => {
      const { openExercice, variantsFor } = buildComments()
      await openExercice(7)

      const variants = variantsFor('synthese', 'Texte de la clôture ouverte.', 2)

      expect(variants.map(variant => variant.key))
        .toEqual(['closing:1', 'closing:3', '123', '456'])
      expect(variants[0].text).toBe('Texte de la v1.')
      expect(variants[1].text).toBe('Texte livré du dernier closing.')
      expect(variants[2].isMine).toBe(true)
      expect(variants[2].tabLabel).toBe('JD')
      expect(variants[3].label).toBe('Marie Leroy')
    })

    /**
     * A closing has no name to abbreviate: read by its initials its tab would
     * be blank, and the reader would be offered a button saying nothing.
     */
    it('should read the tab of a delivered text by the version it came from', async () => {
      const { openExercice, variantsFor } = buildComments()
      await openExercice(7)

      const variants = variantsFor('synthese', 'Texte de la clôture ouverte.', 2)

      expect(variants[0].tabLabel).not.toBe('')
      expect(variants[0].tabLabel).toBe(variants[0].label)
      expect(variants[1].tabLabel).toBe(variants[1].label)
    })

    /**
     * A delivered text belongs to the import that produced it, not to the fact
     * of being delivered. The version is the one the microservice serves, never
     * the one of the closing on screen: a delivery repeating the previous
     * wording is not served under its own number.
     */
    it('should name a delivered variant by the version that produced it', async () => {
      const { openExercice, variantsFor } = buildComments()
      await openExercice(7)

      const [delivered] = variantsFor('synthese', 'Texte.', 2)

      expect(delivered.label).toBe('keyMoments.comment.deliveredVersion')
      expect(delivered.closingVersion).toBe(1)
      expect(delivered.isMine).toBe(false)
    })

    /**
     * A slot the microservice never indexed still reads what the report shows:
     * the closing on screen stands in for the delivered variant.
     */
    it('should stand in with the open closing when no delivered variant is served', async () => {
      const { openExercice, variantsFor } = buildComments()
      await openExercice(7)

      const [delivered] = variantsFor('bilan', 'Texte de la v2.', 2)

      expect(delivered.text).toBe('Texte de la v2.')
      expect(delivered.key).toBe('closing:2')
    })

    it('should drop an empty contribution of someone else', async () => {
      const { openExercice, variantsFor } = buildComments()
      await openExercice(7)

      const variants = variantsFor('synthese', 'Livré.')

      expect(variants.some(variant => variant.contributorId === '789')).toBe(false)
    })

    /**
     * Mine is a reading like any other: it exists once it carries a text. An
     * empty tab would say nothing — the encart offers to write one instead.
     */
    it('should drop my own empty contribution', async () => {
      const { openExercice, variantsFor } = buildComments()
      await openExercice(7)

      const variants = variantsFor('bilan', 'Livré.')

      expect(variants).toHaveLength(1)
      expect(variants.some(variant => variant.isMine)).toBe(false)
    })

    /**
     * Writing a first reading must look like reading one, so the draft carries
     * my name and the very key my saved contribution will carry.
     */
    it('should offer the tab my writing opens on', () => {
      const { myDraftVariant } = buildComments()

      expect(myDraftVariant.value).toEqual({
        key: '123',
        contributorId: '123',
        label: 'John Doe',
        tabLabel: 'JD',
        text: '',
        isMine: true,
      })
    })

    /** Nobody to write as, nothing to write with. */
    it('should offer no draft tab when no user is loaded', () => {
      getStoreMock(useUserStore).user = undefined
      const { myDraftVariant } = buildComments()

      expect(myDraftVariant.value).toBeUndefined()
    })

    /** Writing is what opens my tab, and the write is what the base accepted. */
    it('should offer my tab once my contribution carries a text', async () => {
      const { openExercice, saveComment, variantsFor } = buildComments()
      await openExercice(7)

      await saveComment('bilan', 'Ma première lecture.')

      const variants = variantsFor('bilan', 'Livré.')

      expect(variants).toHaveLength(2)
      expect(variants[1].isMine).toBe(true)
      expect(variants[1].text).toBe('Ma première lecture.')
    })

    /** A failure empties the contributions without emptying the page. */
    it('should keep the delivered variant readable when the contributions fail to load', async () => {
      vi.spyOn(KeyMomentsService, 'getComments').mockRejectedValue(new Error('boom'))
      const { openExercice, variantsFor } = buildComments()

      await openExercice(7)

      expect(variantsFor('synthese', 'Livré.')[0].text).toBe('Livré.')
      expect(vi.mocked(logger.error)).toHaveBeenCalled()
      expect(vi.mocked(displayNotification)).not.toHaveBeenCalled()
    })
  })

  describe('assembling the widget boards', () => {

    it('should assemble a board for each widget reading a slot, and none for the others', async () => {
      const { openExercice, buildCommentBoards } = buildComments()
      await openExercice(7)

      const boards = buildCommentBoards(buildScreens(), 3)

      expect(Object.keys(boards)).toEqual(['synthese'])
      expect(boards.synthese.slotId).toBe('synthese')
      expect(boards.synthese.variants.map(variant => variant.text))
        .toContain('Texte livré du dernier closing.')
    })

    it('should offer my draft by default', async () => {
      const { openExercice, buildCommentBoards } = buildComments()
      await openExercice(7)

      const boards = buildCommentBoards(buildScreens(), 3)

      expect(boards.synthese.draftVariant?.isMine).toBe(true)
    })

    /**
     * Nobody arbitrated, and the slot publishes all the same — on the delivery
     * the microservice falls back to. The reader has to see which text that is
     * without opening every tab, so the check follows what would go out and not
     * the gesture nobody made.
     */
    it('should mark the reading that would go out even when none is retained', async () => {
      const { openExercice, buildCommentBoards } = buildComments()
      await openExercice(7)

      const boards = buildCommentBoards(buildScreens(), 3)

      expect(boards.synthese.retainedKey).toBe('')
      expect(boards.synthese.publishableKey).toBe('closing:3')
    })

    it('should move the mark onto the arbitration once one is made', async () => {
      const { openExercice, variantsFor, retainVariant, buildCommentBoards } = buildComments()
      await openExercice(7)
      const marie = variantsFor('synthese', 'Livré.', 3)
        .find(variant => variant.label === 'Marie Leroy')

      await retainVariant('synthese', marie!)

      expect(buildCommentBoards(buildScreens(), 3).synthese.publishableKey).toBe('456')
    })

    /** A slot the microservice marks nothing on publishes nothing to mark. */
    it('should mark nothing when the slot would go out empty', async () => {
      const { openExercice, buildCommentBoards } = buildComments()
      await openExercice(8)

      expect(buildCommentBoards(buildScreens(), 3).synthese.publishableKey).toBe('')
    })
  })

  describe('writing my contribution', () => {

    it('should upsert my contribution on the loaded exercice', async () => {
      const { openExercice, saveComment } = buildComments()
      await openExercice(7)

      const isSaved = await saveComment('synthese', 'Ma lecture corrigée.')

      expect(isSaved).toBe(true)
      expect(vi.mocked(KeyMomentsService.saveComment))
        .toHaveBeenCalledExactlyOnceWith(42, 7, 'synthese', 'Ma lecture corrigée.')
    })

    it('should read the saved text back from the slot', async () => {
      const { openExercice, saveComment, variantsFor } = buildComments()
      await openExercice(7)

      await saveComment('synthese', 'Ma lecture corrigée.')

      expect(variantsFor('synthese', 'Livré.', 2).find(variant => variant.isMine)?.text)
        .toBe('Ma lecture corrigée.')
    })

    it('should create my contribution on a slot I never wrote on', async () => {
      const { openExercice, saveComment, variantsFor } = buildComments()
      await openExercice(7)

      await saveComment('bilan', 'Premier jet.')

      expect(variantsFor('bilan', 'Livré.', 2).find(variant => variant.isMine)?.text)
        .toBe('Premier jet.')
    })

    /** Never display a text the base does not hold: the encart falls back. */
    it('should notify and keep the previous text when the write fails', async () => {
      vi.spyOn(KeyMomentsService, 'saveComment').mockRejectedValue(new Error('boom'))
      const { openExercice, saveComment, variantsFor } = buildComments()
      await openExercice(7)

      const isSaved = await saveComment('synthese', 'Perdu.')

      // said false so that the encart keeps the words rather than closing on them
      expect(isSaved).toBe(false)
      expect(variantsFor('synthese', 'Livré.', 2).find(variant => variant.isMine)?.text)
        .toBe('Ma lecture.')
      expect(vi.mocked(displayNotification)).toHaveBeenCalledWith('error', expect.any(String))
    })

    it('should not call the microservice without an account', async () => {
      const { saveComment } = useComments(null, usePublications(null))

      await saveComment('synthese', 'Ma lecture.')

      expect(vi.mocked(KeyMomentsService.saveComment)).not.toHaveBeenCalled()
    })

    /**
     * Emptying my reading deletes it, and only mine: the tab goes, the readings
     * of the others stay. Read back rather than patched — what the microservice
     * did there is more than the line that left.
     */
    it('should read the slot back when I empty my own reading', async () => {
      const { openExercice, saveComment, variantsFor } = buildComments()
      await openExercice(7)

      await saveComment('synthese', '')

      expect(vi.mocked(KeyMomentsService.getComments)).toHaveBeenCalledTimes(2)
      expect(variantsFor('synthese', 'Livré.', 2).some(variant => variant.isMine)).toBe(false)
      expect(variantsFor('synthese', 'Livré.', 2).some(variant => variant.label === 'Marie Leroy'))
        .toBe(true)
    })

    /**
     * Deleting the reading that was retained leaves the slot with nothing
     * chosen, and the microservice discards it rather than falling back on a
     * delivery the firm had ruled out. The page must state that, not guess it.
     */
    it('should state the slot as discarded when the reading I delete was the retained one', async () => {
      retainInBase('synthese', '123', null)
      const { openExercice, saveComment, buildCommentBoards, buildPublishedComments }
        = buildComments()
      await openExercice(7)

      await saveComment('synthese', '')

      expect(buildCommentBoards(buildScreens(), 3).synthese.isDiscarded).toBe(true)
      expect(buildPublishedComments(buildScreens())).toEqual({ synthese: '' })
    })
  })

  describe('arbitrating a variant', () => {

    /** Nothing retained reads as the most recent delivered text. */
    it('should retain nothing until told otherwise', async () => {
      const { openExercice, retainedKeyOf } = buildComments()
      await openExercice(7)

      expect(retainedKeyOf('synthese')).toBe('')
    })

    it('should retain the reading of a contributor once chosen', async () => {
      const { openExercice, variantsFor, retainVariant, retainedKeyOf } = buildComments()
      await openExercice(7)
      const marie = variantsFor('synthese', 'Livré.', 2)
        .find(variant => variant.label === 'Marie Leroy')

      await retainVariant('synthese', marie!)

      expect(retainedKeyOf('synthese')).toBe('456')
    })

    /**
     * The arbitration is written down at the very click: the star says what the
     * base holds, not what this session remembers.
     */
    it('should write the arbitration down as it is chosen', async () => {
      const { openExercice, variantsFor, retainVariant } = buildComments()
      await openExercice(7)
      const marie = variantsFor('synthese', 'Livré.', 2)
        .find(variant => variant.label === 'Marie Leroy')

      await retainVariant('synthese', marie!)

      expect(vi.mocked(KeyMomentsService.retainComment))
        .toHaveBeenCalledExactlyOnceWith(42, 7, 'synthese', {
          sourceContributorId: '456',
          sourceClosingVersion: null,
        })
    })

    /** A delivered text is designated by its version, never by its author. */
    it('should write a retained delivery down under its own version', async () => {
      const { openExercice, variantsFor, retainVariant } = buildComments()
      await openExercice(7)
      const [previous] = variantsFor('synthese', 'Livré.', 3)

      await retainVariant('synthese', previous)

      expect(vi.mocked(KeyMomentsService.retainComment))
        .toHaveBeenCalledExactlyOnceWith(42, 7, 'synthese', {
          sourceContributorId: null,
          sourceClosingVersion: 1,
        })
    })

    /** A star on a choice the base does not hold would be worse than an error. */
    it('should leave the star where it is when the arbitration cannot be written', async () => {
      vi.spyOn(KeyMomentsService, 'retainComment').mockRejectedValue(new Error('boom'))
      const { openExercice, variantsFor, retainVariant, retainedKeyOf } = buildComments()
      await openExercice(7)
      const marie = variantsFor('synthese', 'Livré.', 2)
        .find(variant => variant.label === 'Marie Leroy')

      await retainVariant('synthese', marie!)

      expect(retainedKeyOf('synthese')).toBe('')
      expect(vi.mocked(displayNotification)).toHaveBeenCalledWith('error', expect.any(String))
    })

    /** What the back marks is the arbitration: the page opens on it. */
    it('should read the arbitration the contributions carry', async () => {
      retainInBase('synthese', '456', null)
      const { openExercice, retainedKeyOf } = buildComments()

      await openExercice(7)

      expect(retainedKeyOf('synthese')).toBe('456')
    })

    /** A delivered variant is marked like any other, and matched on its version. */
    it('should read a retained delivery back on its own version', async () => {
      retainInBase('synthese', null, 1)
      const { openExercice, retainedKeyOf } = buildComments()

      await openExercice(7)

      expect(retainedKeyOf('synthese')).toBe('closing:1')
    })

    /** Two imports wording a slot differently are two retainable variants. */
    it('should retain an earlier delivered version over the most recent one', async () => {
      const { openExercice, variantsFor, retainVariant, retainedKeyOf } = buildComments()
      await openExercice(7)
      const [previous] = variantsFor('synthese', 'Livré.', 2)

      await retainVariant('synthese', previous)

      expect(retainedKeyOf('synthese')).toBe('closing:1')
    })

    /** An arbitration is about the variants of one exercice, never of another. */
    it('should forget the arbitration when another exercice is opened', async () => {
      const { openExercice, variantsFor, retainVariant, retainedKeyOf } = buildComments()
      await openExercice(7)
      const [delivered] = variantsFor('synthese', 'Livré.', 2)
      await retainVariant('synthese', delivered)

      await openExercice(8)

      expect(retainedKeyOf('synthese')).toBe('')
    })

  })

  describe('discarding a slot', () => {

    it('should write the discard down on the loaded exercice', async () => {
      const { openExercice, discardSlot } = buildComments()
      await openExercice(7)

      await discardSlot('synthese')

      expect(vi.mocked(KeyMomentsService.retainComment))
        .toHaveBeenCalledExactlyOnceWith(42, 7, 'synthese', {
          sourceContributorId: null,
          sourceClosingVersion: null,
          retainNone: true,
        })
    })

    /**
     * The readings stay there to be read — reintegrating is picking one of
     * them — and none of them is marked any more: nothing goes out.
     */
    it('should say the slot is discarded and mark no reading', async () => {
      const { openExercice, discardSlot, buildCommentBoards } = buildComments()
      await openExercice(7)

      await discardSlot('synthese')

      const board = buildCommentBoards(buildScreens(), 3).synthese

      expect(board.isDiscarded).toBe(true)
      expect(board.publishableKey).toBe('')
      expect(board.variants.length).toBeGreaterThan(0)
    })

    it('should publish nothing for a discarded slot', async () => {
      const { openExercice, discardSlot, buildPublishedComments } = buildComments()
      await openExercice(7)

      await discardSlot('synthese')

      expect(buildPublishedComments(buildScreens())).toEqual({ synthese: '' })
    })

    /** Retaining a reading is the one gesture that undoes an écart. */
    it('should reopen the slot when a reading is retained again', async () => {
      const { openExercice, discardSlot, variantsFor, retainVariant, buildCommentBoards }
        = buildComments()
      await openExercice(7)
      await discardSlot('synthese')
      const marie = variantsFor('synthese', 'Livré.', 3)
        .find(variant => variant.label === 'Marie Leroy')

      await retainVariant('synthese', marie!)

      const board = buildCommentBoards(buildScreens(), 3).synthese

      expect(board.isDiscarded).toBe(false)
      expect(board.publishableKey).toBe('456')
    })

    /**
     * A slot may be discarded before anybody worded it, and comes back served
     * with no reading at all. The encart still stands in with the text of the
     * closing on screen — it is what reintegrating would bring back — and the
     * publication carries none of it.
     */
    it('should read back a slot discarded before anybody worded it', async () => {
      slots = [{ slotId: 'synthese', variants: [], isDiscarded: true }]
      const { openExercice, buildCommentBoards, buildPublishedComments } = buildComments()

      await openExercice(7)

      const board = buildCommentBoards(buildScreens(), 3).synthese

      expect(board.isDiscarded).toBe(true)
      expect(board.variants.map(variant => variant.text)).toEqual(['Texte livré du dernier closing.'])
      expect(buildPublishedComments(buildScreens())).toEqual({ synthese: '' })
    })

    /** An encart saying nothing goes out where the base holds the reverse. */
    it('should notify and leave the slot where it is when the discard fails', async () => {
      vi.spyOn(KeyMomentsService, 'retainComment').mockRejectedValue(new Error('boom'))
      const { openExercice, discardSlot, buildCommentBoards } = buildComments()
      await openExercice(7)

      await discardSlot('synthese')

      const board = buildCommentBoards(buildScreens(), 3).synthese

      expect(board.isDiscarded).toBe(false)
      expect(board.publishableKey).toBe('closing:3')
      expect(vi.mocked(logger.error)).toHaveBeenCalled()
      expect(vi.mocked(displayNotification)).toHaveBeenCalledWith('error', expect.any(String))
    })

    /** A decision bears on the slots of one exercice, never of another. */
    it('should forget the discard when another exercice is opened', async () => {
      const { openExercice, discardSlot, buildCommentBoards } = buildComments()
      await openExercice(7)
      await discardSlot('synthese')

      await openExercice(8)

      expect(buildCommentBoards(buildScreens(), 3).synthese.isDiscarded).toBe(false)
    })

    it('should not call the microservice without an account', async () => {
      const { discardSlot } = useComments(null, usePublications(null))

      await discardSlot('synthese')

      expect(vi.mocked(KeyMomentsService.retainComment)).not.toHaveBeenCalled()
    })
  })

  describe('what would be published', () => {

    /**
     * Read off the marker the microservice puts on the readings, never worked
     * out here: nothing is retained, and it falls back on the last delivery.
     */
    it('should read the text each slot would go out with', async () => {
      const { openExercice, buildPublishedComments } = buildComments()
      await openExercice(7)

      expect(buildPublishedComments(buildScreens()))
        .toEqual({ synthese: 'Texte livré du dernier closing.' })
    })

    it('should follow the arbitration once one is made', async () => {
      const { openExercice, variantsFor, retainVariant, buildPublishedComments } = buildComments()
      await openExercice(7)
      const marie = variantsFor('synthese', 'Livré.', 2)
        .find(variant => variant.label === 'Marie Leroy')

      await retainVariant('synthese', marie!)

      expect(buildPublishedComments(buildScreens())).toEqual({ synthese: 'À nuancer.' })
    })

    /**
     * Named all the same, empty: this side is what says which slots the report
     * carries, and the comparison reads an empty text and an absent one as one.
     */
    it('should name a slot nothing would be published for, empty', async () => {
      const { openExercice, buildPublishedComments } = buildComments()
      await openExercice(8)

      expect(buildPublishedComments(buildScreens())).toEqual({ synthese: '' })
    })

    /**
     * The rule belongs to the microservice: a reading it does not mark does not
     * go out, whatever the report displays. Publishing an earlier closing is
     * exactly where the two used to disagree.
     */
    it('should never fall back on the text the report displays', async () => {
      slots[0].variants[1].isPublishable = false
      const { openExercice, buildPublishedComments } = buildComments()

      await openExercice(7)

      expect(buildPublishedComments(buildScreens())).toEqual({ synthese: '' })
    })
  })

  describe('publishing', () => {

    beforeEach(() => {
      vi.spyOn(KeyMomentsService, 'publish').mockResolvedValue()
      vi.spyOn(KeyMomentsService, 'getPublications').mockResolvedValue(PUBLICATIONS)
      vi.spyOn(KeyMomentsService, 'getPublication').mockResolvedValue(PUBLICATION_DETAIL)
    })

    /**
     * Nothing of the editorial pass travels: the microservice reads the
     * readings it stores and applies its own rule to them. No version travels
     * either — a publication always pins the ones on display. The
     * recommendations do, wording included: it never reads the catalogue.
     */
    it('should publish what identifies the report, and the recommendations', async () => {
      const { openExercice, publish } = buildComments()
      await openExercice(7)

      await publish(CONTEXT, OFFERS)

      expect(vi.mocked(KeyMomentsService.publish)).toHaveBeenCalledWith(42, {
        templateId: 1,
        closingId: 90,
        preferenceComparisonExercice: 'N-1',
        preferenceCurrencyDisplay: CurrencyDisplay.EURO,
        offers: OFFERS,
      })
    })

    /**
     * The popup answers every click on its confirm button: a second one landing
     * while the first publication is in flight must send nothing out again.
     */
    it('should refuse a publication while one is in flight', async () => {
      let settleFirstPublish = () => {}
      vi.spyOn(KeyMomentsService, 'publish')
        .mockImplementation(() => new Promise<void>(resolve => {
          settleFirstPublish = () => resolve()
        }))
      const { openExercice, publish } = buildComments()
      await openExercice(7)

      const firstCall = publish(CONTEXT, OFFERS)
      const secondCallAnswer = await publish(CONTEXT, OFFERS)
      settleFirstPublish()

      expect(secondCallAnswer).toBe(false)
      expect(await firstCall).toBe(true)
      expect(vi.mocked(KeyMomentsService.publish)).toHaveBeenCalledOnce()
    })

    /** What the page states about the published state comes from the back. */
    it('should notify and re-read the publications once published', async () => {
      const { openExercice, publish, publicationOf } = buildComments()
      await openExercice(7)

      await publish(CONTEXT, OFFERS)

      expect(vi.mocked(displayNotification)).toHaveBeenCalledWith('success', expect.any(String))
      expect(vi.mocked(KeyMomentsService.getPublications)).toHaveBeenCalledTimes(2)
      expect(publicationOf(7)?.publishedByName).toBe('John Doe')
    })

    it('should notify the failure and re-read nothing', async () => {
      vi.spyOn(KeyMomentsService, 'publish').mockRejectedValue(new Error('boom'))
      const { openExercice, publish } = buildComments()
      await openExercice(7)

      await publish(CONTEXT, OFFERS)

      expect(vi.mocked(displayNotification))
        .toHaveBeenCalledWith('error', 'keyMoments.publish.error')
      expect(vi.mocked(KeyMomentsService.getPublications)).toHaveBeenCalledOnce()
    })

    /**
     * The one refusal a reader can act on. Normally unreachable — the page
     * takes the button away as soon as a recommendation stops being described —
     * and worded all the same for the catalogue that goes away in between.
     */
    it('should word the refusal of a recommendation it cannot describe', async () => {
      vi.spyOn(KeyMomentsService, 'publish')
        .mockRejectedValue({ response: { data: { code: 'missing-offer-description' } } })
      const { openExercice, publish } = buildComments()
      await openExercice(7)

      await publish(CONTEXT, OFFERS)

      expect(vi.mocked(displayNotification))
        .toHaveBeenCalledWith('error', 'keyMoments.publish.missingOffersError')
    })

    /**
     * Publishing settles no arbitration: a slot that went out on the fallback
     * of the microservice stays unarbitrated, and is never starred as chosen.
     */
    it('should retain nothing of what it publishes', async () => {
      const { openExercice, publish, retainedKeyOf } = buildComments()
      await openExercice(7)

      await publish(CONTEXT, OFFERS)

      expect(retainedKeyOf('synthese')).toBe('')
    })

    /**
     * A publication of the exercice froze Marie Leroy's reading, and nobody
     * retained anything since. Reading that back as an arbitration would star a
     * choice nobody made.
     */
    it('should never read a publication as an arbitration', async () => {
      const { openExercice, retainedKeyOf } = buildComments()

      await openExercice(7)

      expect(vi.mocked(KeyMomentsService.getPublication)).toHaveBeenCalledWith(42, 99)
      expect(retainedKeyOf('synthese')).toBe('')
    })

  })

  describe('unpublishing', () => {

    beforeEach(() => {
      vi.spyOn(KeyMomentsService, 'unpublish').mockResolvedValue()
      vi.spyOn(KeyMomentsService, 'getPublications').mockResolvedValue(PUBLICATIONS)
    })

    /**
     * Unpublishing says that nothing is published any more, not that the
     * readings retained were wrong: the arbitration on screen stays. What
     * unpublishing does to the published state is covered where it now lives,
     * in `publication.composable.spec.ts`.
     */
    it('should leave the arbitration where it is', async () => {
      retainInBase('synthese', '456', null)
      const { openExercice, unpublish, retainedKeyOf } = buildComments()
      await openExercice(7)

      await unpublish(99)

      expect(retainedKeyOf('synthese')).toBe('456')
    })
  })
})
