import { flushPromises } from '@vue/test-utils'
import { logger } from '@pulse/toolbox'
import { displayNotification } from '@pulse/styleguide'
import { armCurrentUserPermissions } from '@pulse/common/mocks/vitest/current-user.permissions.helper'
import { useOffers } from './offers.composable'
import { OffersService } from '../../services/offers.service'
import { OfferPriority } from '../../enums/key-moments.enums'
import { OFFERS_CAP } from '../../const/key-moments.consts'
import type { CatalogOfferPayload, LinkedOfferPayload } from '../../services/offers.service.types'

const ACCOUNT_ID = 42
const EXERCICE_ID = 7

function catalogOffer(overrides: Partial<CatalogOfferPayload> = {}): CatalogOfferPayload {
  return {
    id: 128,
    title: 'Pack Prévoyance TNS',
    shortDescription: 'Couverture des indépendants',
    subCategory: {
      subCategoryId: 3,
      name: 'Prévoyance',
      category: { categoryId: 1, name: 'Protection sociale' },
    },
    ...overrides,
  }
}

function linkedOffer(overrides: Partial<LinkedOfferPayload> = {}): LinkedOfferPayload {
  return {
    offerId: 128,
    title: 'Pack Prévoyance TNS',
    isPriorityVisible: false,
    isHidden: false,
    ...overrides,
  }
}

/** The reading of an exercice, armed with what each route answers. */
function serve(linked: LinkedOfferPayload[], catalog: CatalogOfferPayload[] = [catalogOffer()]) {
  vi.spyOn(OffersService, 'getLinkedOffers').mockResolvedValue(linked)
  vi.spyOn(OffersService, 'getOffersCatalog').mockResolvedValue({
    offers: catalog,
    categories: [{ categoryId: 1, name: 'Protection sociale' }],
  })
}

beforeEach(() => {
  armCurrentUserPermissions(true)
  // every route is a spy by default, so that a test asserting one was never
  // called does not have to arm it first
  vi.spyOn(OffersService, 'getLinkedOffers').mockResolvedValue([])
  vi.spyOn(OffersService, 'getOffersCatalog').mockResolvedValue({ offers: [], categories: [] })
  vi.spyOn(OffersService, 'saveLinkedOffers').mockResolvedValue()
})

describe('useOffers', () => {

  describe('reading the exercice', () => {

    it('should join the attached list with the catalogue', async () => {
      serve([linkedOffer()])

      const { linkedOffers, loadOffers } = useOffers(ACCOUNT_ID)
      await loadOffers(EXERCICE_ID)

      expect(linkedOffers.value).toEqual([expect.objectContaining({
        offerId: 128,
        title: 'Pack Prévoyance TNS',
        isRetired: false,
      })])
    })

    /**
     * The guard the whole permission design rests on: not reading the attached
     * list would have the diff announce every recommendation as detached.
     */
    it('should always read the attached list, even without the offer permission', async () => {
      armCurrentUserPermissions(false)
      serve([linkedOffer()])

      const { canSeeOffers, publishableSelection, loadOffers } = useOffers(ACCOUNT_ID)
      await loadOffers(EXERCICE_ID)

      expect(canSeeOffers.value).toBe(false)
      expect(vi.mocked(OffersService.getLinkedOffers)).toHaveBeenCalledOnce()
      expect(publishableSelection.value).toHaveLength(1)
    })

    /**
     * The permission guards the catalogue as a place to pick from, never the
     * content of an exercice: publishing has to hand the microservice the
     * wording of every recommendation, which only the catalogue carries.
     */
    it('should read the catalogue whatever the permission', async () => {
      armCurrentUserPermissions(false)
      serve([linkedOffer()])

      const { publishedSnapshots, loadOffers } = useOffers(ACCOUNT_ID)
      await loadOffers(EXERCICE_ID)

      expect(vi.mocked(OffersService.getOffersCatalog)).toHaveBeenCalledOnce()
      expect(publishedSnapshots.value).toHaveLength(1)
    })

    /** Without the catalogue, the stored title is all a row still has. */
    it('should read an offer on its snapshot when the catalogue cannot be read', async () => {
      serve([linkedOffer({ title: 'Titre stocké' })])
      vi.spyOn(OffersService, 'getOffersCatalog').mockRejectedValue(new Error('down'))

      const { linkedOffers, loadOffers } = useOffers(ACCOUNT_ID)
      await loadOffers(EXERCICE_ID)

      expect(linkedOffers.value[0]).toMatchObject({ title: 'Titre stocké', isRetired: true })
      expect(vi.mocked(logger.error)).toHaveBeenCalled()
    })

    /**
     * A recommendation nothing describes any more cannot be published at all:
     * the microservice refuses the whole publication rather than dropping it.
     */
    it('should name the recommendations the catalogue no longer describes', async () => {
      serve([linkedOffer(), linkedOffer({ offerId: 512, title: 'Offre retirée' })])

      const { publishedSnapshots, unresolvedIds, loadOffers } = useOffers(ACCOUNT_ID)
      await loadOffers(EXERCICE_ID)

      expect(unresolvedIds.value).toEqual([512])
      expect(publishedSnapshots.value.map(offer => offer.offerId)).toEqual([128])
    })

    /** A hidden row never goes out, so it never blocks the publication either. */
    it('should ignore a hidden recommendation the catalogue no longer describes', async () => {
      serve([linkedOffer({ offerId: 512, title: 'Offre retirée', isHidden: true })])

      const { unresolvedIds, loadOffers } = useOffers(ACCOUNT_ID)
      await loadOffers(EXERCICE_ID)

      expect(unresolvedIds.value).toEqual([])
    })

    it('should empty rather than fail when the recommendations cannot be read', async () => {
      vi.spyOn(OffersService, 'getLinkedOffers').mockRejectedValue(new Error('down'))

      const { linkedOffers, loadOffers } = useOffers(ACCOUNT_ID)
      await loadOffers(EXERCICE_ID)

      expect(linkedOffers.value).toEqual([])
      expect(vi.mocked(logger.error)).toHaveBeenCalled()
    })

    /**
     * An exercice nothing was attached to and a microservice not serving the
     * route yet answer the same way, and neither is anything the reader could
     * act on.
     */
    it('should read a 404 as an absence rather than as a failure', async () => {
      vi.spyOn(OffersService, 'getLinkedOffers')
        .mockRejectedValue({ response: { status: 404 } })

      const { linkedOffers, loadOffers } = useOffers(ACCOUNT_ID)
      await loadOffers(EXERCICE_ID)

      expect(linkedOffers.value).toEqual([])
      expect(vi.mocked(logger.warn)).toHaveBeenCalled()
      expect(vi.mocked(logger.error)).not.toHaveBeenCalled()
    })

    /** One domain being down must never blank what the other answered. */
    it('should keep the attached list when the catalogue is the one that failed', async () => {
      vi.spyOn(OffersService, 'getLinkedOffers').mockResolvedValue([linkedOffer()])
      vi.spyOn(OffersService, 'getOffersCatalog').mockRejectedValue(new Error('down'))

      const { linkedOffers, loadOffers } = useOffers(ACCOUNT_ID)
      await loadOffers(EXERCICE_ID)

      expect(linkedOffers.value).toHaveLength(1)
      expect(linkedOffers.value[0].isRetired).toBe(true)
    })

    it('should keep the catalogue when the attached list is the one that failed', async () => {
      vi.spyOn(OffersService, 'getLinkedOffers').mockRejectedValue(new Error('down'))
      vi.spyOn(OffersService, 'getOffersCatalog')
        .mockResolvedValue({ offers: [catalogOffer()], categories: [] })

      const { catalog, loadOffers } = useOffers(ACCOUNT_ID)
      await loadOffers(EXERCICE_ID)

      expect(catalog.value).toHaveLength(1)
    })
  })

  describe('attaching', () => {

    it('should write the whole list with the offer at its end', async () => {
      serve([linkedOffer({ offerId: 300 })])

      const { attachOffer, loadOffers } = useOffers(ACCOUNT_ID)
      await loadOffers(EXERCICE_ID)
      await attachOffer(EXERCICE_ID, catalogOffer())

      expect(vi.mocked(OffersService.saveLinkedOffers)).toHaveBeenCalledWith(
        ACCOUNT_ID,
        EXERCICE_ID,
        [expect.objectContaining({ offerId: 300 }), expect.objectContaining({ offerId: 128 })],
      )
    })

    /** A duplicate is made impossible here rather than caught on the way out. */
    it('should refuse an offer already attached, without calling the microservice', async () => {
      serve([linkedOffer()])

      const { attachOffer, loadOffers } = useOffers(ACCOUNT_ID)
      await loadOffers(EXERCICE_ID)
      await attachOffer(EXERCICE_ID, catalogOffer())

      expect(vi.mocked(OffersService.saveLinkedOffers)).not.toHaveBeenCalled()
    })

    it('should refuse the twenty-first, without calling the microservice', async () => {
      serve(Array.from({ length: OFFERS_CAP }, (_, rank) => linkedOffer({ offerId: rank + 1 })))

      const { attachOffer, isAtCap, loadOffers } = useOffers(ACCOUNT_ID)
      await loadOffers(EXERCICE_ID)

      expect(isAtCap.value).toBe(true)

      await attachOffer(EXERCICE_ID, catalogOffer({ id: 999 }))

      expect(vi.mocked(OffersService.saveLinkedOffers)).not.toHaveBeenCalled()
    })

    /** The cap bounds what is stored, so a hidden offer takes a place. */
    it('should count the hidden ones against the cap', async () => {
      serve(Array.from(
        { length: OFFERS_CAP },
        (_, rank) => linkedOffer({ offerId: rank + 1, isHidden: true }),
      ))

      const { isAtCap, loadOffers } = useOffers(ACCOUNT_ID)
      await loadOffers(EXERCICE_ID)

      expect(isAtCap.value).toBe(true)
    })
  })

  describe('detaching and settling', () => {

    it('should write the list without the offer', async () => {
      serve([linkedOffer(), linkedOffer({ offerId: 300 })])

      const { detachOffer, loadOffers } = useOffers(ACCOUNT_ID)
      await loadOffers(EXERCICE_ID)
      await detachOffer(EXERCICE_ID, 128)

      expect(vi.mocked(OffersService.saveLinkedOffers)).toHaveBeenCalledWith(
        ACCOUNT_ID,
        EXERCICE_ID,
        [expect.objectContaining({ offerId: 300 })],
      )
    })

    it('should settle one decision without touching the others', async () => {
      serve([linkedOffer(), linkedOffer({ offerId: 300 })])

      const { updateOffer, loadOffers } = useOffers(ACCOUNT_ID)
      await loadOffers(EXERCICE_ID)
      await updateOffer(EXERCICE_ID, 128, { comment: 'Mon accroche' })

      const [, , written] = vi.mocked(OffersService.saveLinkedOffers).mock.calls[0]

      expect(written[0]).toMatchObject({ offerId: 128, comment: 'Mon accroche' })
      expect(written[1].offerId).toBe(300)
      expect(written[1].comment).toBeUndefined()
    })

    /**
     * A degree is posed to be read: keeping it internal is the deliberate
     * gesture, which is why the checkbox that offers it starts empty.
     */
    it('should show a degree that has just been set', async () => {
      serve([linkedOffer()])

      const { updateOffer, loadOffers } = useOffers(ACCOUNT_ID)
      await loadOffers(EXERCICE_ID)
      await updateOffer(EXERCICE_ID, 128, { priority: OfferPriority.PRIMARY })

      const [, , written] = vi.mocked(OffersService.saveLinkedOffers).mock.calls[0]

      expect(written[0].priority).toBe(OfferPriority.PRIMARY)
      expect(written[0].isPriorityVisible).toBe(true)
    })

    it('should leave a degree kept back alone when another one replaces it', async () => {
      serve([linkedOffer({ priority: OfferPriority.PRIMARY, isPriorityVisible: false })])

      const { updateOffer, loadOffers } = useOffers(ACCOUNT_ID)
      await loadOffers(EXERCICE_ID)
      await updateOffer(EXERCICE_ID, 128, { priority: OfferPriority.INFORMATIVE })

      const [, , written] = vi.mocked(OffersService.saveLinkedOffers).mock.calls[0]

      expect(written[0].isPriorityVisible).toBe(false)
    })

    it('should obey the firm when it sets a degree and keeps it back at once', async () => {
      serve([linkedOffer()])

      const { updateOffer, loadOffers } = useOffers(ACCOUNT_ID)
      await loadOffers(EXERCICE_ID)
      await updateOffer(EXERCICE_ID, 128, {
        priority: OfferPriority.PRIMARY,
        isPriorityVisible: false,
      })

      const [, , written] = vi.mocked(OffersService.saveLinkedOffers).mock.calls[0]

      expect(written[0].isPriorityVisible).toBe(false)
    })

    /**
     * A visible priority with no priority is the one 400 the screen could
     * trigger on its own, and it is made unreachable here.
     */
    it('should drop the visibility with the degree it showed', async () => {
      serve([linkedOffer({ priority: OfferPriority.PRIMARY, isPriorityVisible: true })])

      const { updateOffer, loadOffers } = useOffers(ACCOUNT_ID)
      await loadOffers(EXERCICE_ID)
      await updateOffer(EXERCICE_ID, 128, { priority: undefined })

      const [, , written] = vi.mocked(OffersService.saveLinkedOffers).mock.calls[0]

      expect(written[0].priority).toBeUndefined()
      expect(written[0].isPriorityVisible).toBe(false)
    })

    it('should hide an offer without detaching it', async () => {
      serve([linkedOffer({ comment: 'Mon accroche' })])

      const { linkedOffers, publishableSelection, updateOffer, loadOffers } = useOffers(ACCOUNT_ID)
      await loadOffers(EXERCICE_ID)
      await updateOffer(EXERCICE_ID, 128, { isHidden: true })
      await flushPromises()

      expect(linkedOffers.value[0]).toMatchObject({ isHidden: true, comment: 'Mon accroche' })
      expect(publishableSelection.value).toEqual([])
    })

    it('should restore exactly what a publication froze', async () => {
      serve([linkedOffer({ comment: 'Réécrit depuis' })])
      const frozen = [linkedOffer({ comment: 'Ce que le client lit' })]

      const { restoreOffers, loadOffers } = useOffers(ACCOUNT_ID)
      await loadOffers(EXERCICE_ID)
      await restoreOffers(EXERCICE_ID, frozen)

      expect(vi.mocked(OffersService.saveLinkedOffers))
        .toHaveBeenCalledWith(ACCOUNT_ID, EXERCICE_ID, frozen)
    })
  })

  describe('restoring what the publication froze', () => {

    /**
     * Hiding and detaching are two gestures: taking the recommendations back to
     * the published reading must not detach what the firm merely put aside.
     */
    it('should carry the hidden offers over rather than detach them', async () => {
      const hidden = linkedOffer({
        offerId: 300,
        comment: 'Pour plus tard',
        priority: OfferPriority.SIGNIFICANT,
        isHidden: true,
      })
      serve([linkedOffer(), hidden, linkedOffer({ offerId: 500 })])

      const { restoreOffers, loadOffers } = useOffers(ACCOUNT_ID)
      await loadOffers(EXERCICE_ID)
      await restoreOffers(EXERCICE_ID, [linkedOffer()])

      expect(vi.mocked(OffersService.saveLinkedOffers)).toHaveBeenCalledWith(
        ACCOUNT_ID,
        EXERCICE_ID,
        [expect.objectContaining({ offerId: 128 }), hidden],
      )
    })

    it('should restore a published offer hidden since, back into the reading', async () => {
      serve([linkedOffer({ comment: 'Accroche revue', isHidden: true })])

      const { restoreOffers, loadOffers } = useOffers(ACCOUNT_ID)
      await loadOffers(EXERCICE_ID)
      await restoreOffers(EXERCICE_ID, [linkedOffer({ comment: 'Accroche publiée' })])

      expect(vi.mocked(OffersService.saveLinkedOffers)).toHaveBeenCalledWith(
        ACCOUNT_ID,
        EXERCICE_ID,
        [expect.objectContaining({ comment: 'Accroche publiée', isHidden: false })],
      )
    })
  })

  describe('while a write is in flight', () => {

    /**
     * A gesture made while the previous one is still out is neither dropped
     * nor composed on the same state: it waits, then composes on the list the
     * first one settled — so both land, and the second overwrites nothing.
     */
    it('should queue a second gesture on what the first one settled', async () => {
      serve([linkedOffer(), linkedOffer({ offerId: 300 })])

      let acceptWrite = (): void => undefined
      vi.spyOn(OffersService, 'saveLinkedOffers').mockReturnValueOnce(
        new Promise<void>((resolve) => {
          acceptWrite = resolve
        }),
      )

      const { linkedOffers, isSaving, detachOffer, updateOffer, loadOffers } = useOffers(ACCOUNT_ID)
      await loadOffers(EXERCICE_ID)

      const first = detachOffer(EXERCICE_ID, 128)
      const second = updateOffer(EXERCICE_ID, 300, { comment: 'Une note' })
      await flushPromises()

      expect(vi.mocked(OffersService.saveLinkedOffers)).toHaveBeenCalledOnce()
      expect(isSaving.value).toBe(true)

      acceptWrite()
      await first
      await second

      expect(vi.mocked(OffersService.saveLinkedOffers)).toHaveBeenCalledTimes(2)
      expect(vi.mocked(OffersService.saveLinkedOffers)).toHaveBeenLastCalledWith(
        ACCOUNT_ID,
        EXERCICE_ID,
        [expect.objectContaining({ offerId: 300, comment: 'Une note' })],
      )
      expect(linkedOffers.value).toEqual([
        expect.objectContaining({ offerId: 300, comment: 'Une note' }),
      ])
      expect(isSaving.value).toBe(false)
    })

    it('should judge the cap and the duplicates on the list of the moment it runs', async () => {
      serve([linkedOffer()])

      let acceptWrite = (): void => undefined
      vi.spyOn(OffersService, 'saveLinkedOffers').mockReturnValueOnce(
        new Promise<void>((resolve) => {
          acceptWrite = resolve
        }),
      )

      const { attachOffer, loadOffers } = useOffers(ACCOUNT_ID)
      await loadOffers(EXERCICE_ID)

      const first = attachOffer(EXERCICE_ID, catalogOffer({ id: 300 }))
      const second = attachOffer(EXERCICE_ID, catalogOffer({ id: 300 }))

      acceptWrite()
      await first
      await second

      expect(vi.mocked(OffersService.saveLinkedOffers)).toHaveBeenCalledOnce()
    })

    it('should drop a gesture whose exercice was left meanwhile', async () => {
      serve([linkedOffer()])

      let acceptWrite = (): void => undefined
      vi.spyOn(OffersService, 'saveLinkedOffers').mockReturnValueOnce(
        new Promise<void>((resolve) => {
          acceptWrite = resolve
        }),
      )

      const { linkedOffers, detachOffer, loadOffers } = useOffers(ACCOUNT_ID)
      await loadOffers(EXERCICE_ID)

      const first = detachOffer(EXERCICE_ID, 128)
      // the first write is out; the second waits behind it
      await flushPromises()
      const second = detachOffer(EXERCICE_ID, 128)
      await loadOffers(8)

      acceptWrite()
      await first
      await second

      expect(vi.mocked(OffersService.saveLinkedOffers)).toHaveBeenCalledOnce()
      expect(vi.mocked(logger.warn)).toHaveBeenCalled()
      // the write of the exercice left never lands on the one now on screen
      expect(linkedOffers.value).toEqual([expect.objectContaining({ offerId: 128 })])
    })
  })

  describe('while the attached list could not be read', () => {

    /**
     * Writing on a list that was never read would hand the microservice a list
     * missing everything it holds: the first gesture would detach every
     * recommendation of the exercice.
     */
    it('should refuse every gesture and say so', async () => {
      vi.spyOn(OffersService, 'getLinkedOffers').mockRejectedValue(new Error('down'))

      const { attachOffer, updateOffer, loadOffers } = useOffers(ACCOUNT_ID)
      await loadOffers(EXERCICE_ID)
      await attachOffer(EXERCICE_ID, catalogOffer())

      expect(vi.mocked(OffersService.saveLinkedOffers)).not.toHaveBeenCalled()
      expect(vi.mocked(displayNotification))
        .toHaveBeenCalledWith('error', 'keyMoments.offers.readError')
      expect(await updateOffer(EXERCICE_ID, 128, { comment: 'Refusée.' })).toBe(false)
    })

    it('should take the gestures again once a read succeeded', async () => {
      vi.spyOn(OffersService, 'getLinkedOffers').mockRejectedValueOnce(new Error('down'))

      const { attachOffer, loadOffers } = useOffers(ACCOUNT_ID)
      await loadOffers(EXERCICE_ID)
      await loadOffers(EXERCICE_ID)
      await attachOffer(EXERCICE_ID, catalogOffer())

      expect(vi.mocked(OffersService.saveLinkedOffers)).toHaveBeenCalledOnce()
    })

    it('should still write after a 404, which is an absence', async () => {
      vi.spyOn(OffersService, 'getLinkedOffers').mockRejectedValue({ response: { status: 404 } })

      const { attachOffer, loadOffers } = useOffers(ACCOUNT_ID)
      await loadOffers(EXERCICE_ID)
      await attachOffer(EXERCICE_ID, catalogOffer())

      expect(vi.mocked(OffersService.saveLinkedOffers)).toHaveBeenCalledOnce()
    })
  })

  describe('when the exercice changes while it is being read', () => {

    it('should keep the list of the exercice asked for last', async () => {
      let answerFirst = (): void => undefined
      vi.spyOn(OffersService, 'getLinkedOffers')
        .mockReturnValueOnce(new Promise<LinkedOfferPayload[]>((resolve) => {
          answerFirst = () => resolve([linkedOffer({ offerId: 1 })])
        }))
        .mockResolvedValueOnce([linkedOffer({ offerId: 2 })])

      const { linkedOffers, loadOffers } = useOffers(ACCOUNT_ID)
      const first = loadOffers(EXERCICE_ID)
      await loadOffers(8)

      answerFirst()
      await first

      expect(linkedOffers.value).toEqual([expect.objectContaining({ offerId: 2 })])
    })

    it('should take the next gesture once the microservice answered', async () => {
      serve([linkedOffer(), linkedOffer({ offerId: 300 })])

      const { detachOffer, loadOffers } = useOffers(ACCOUNT_ID)
      await loadOffers(EXERCICE_ID)
      await detachOffer(EXERCICE_ID, 128)
      await detachOffer(EXERCICE_ID, 300)

      expect(vi.mocked(OffersService.saveLinkedOffers)).toHaveBeenLastCalledWith(
        ACCOUNT_ID,
        EXERCICE_ID,
        [],
      )
    })
  })

  describe('when the write fails', () => {

    it('should leave the screen on what the base still holds', async () => {
      serve([linkedOffer()])
      vi.spyOn(OffersService, 'saveLinkedOffers').mockRejectedValue(new Error('refused'))

      const { linkedOffers, detachOffer, loadOffers } = useOffers(ACCOUNT_ID)
      await loadOffers(EXERCICE_ID)
      await detachOffer(EXERCICE_ID, 128)

      expect(linkedOffers.value).toHaveLength(1)
      expect(vi.mocked(logger.error)).toHaveBeenCalled()
    })

    /** The encart waiting on a note only closes on a text the base holds. */
    it('should say a note was not taken', async () => {
      serve([linkedOffer()])
      vi.spyOn(OffersService, 'saveLinkedOffers').mockRejectedValue(new Error('refused'))

      const { updateOffer, loadOffers } = useOffers(ACCOUNT_ID)
      await loadOffers(EXERCICE_ID)

      expect(await updateOffer(EXERCICE_ID, 128, { comment: 'Perdu.' })).toBe(false)
    })

    it('should say a note was taken once the microservice answered', async () => {
      serve([linkedOffer()])

      const { updateOffer, loadOffers } = useOffers(ACCOUNT_ID)
      await loadOffers(EXERCICE_ID)

      expect(await updateOffer(EXERCICE_ID, 128, { comment: 'Une note.' })).toBe(true)
    })
  })

  describe('without an account', () => {

    it('should ask nothing of either domain', async () => {
      const { loadOffers } = useOffers(null)
      await loadOffers(EXERCICE_ID)

      expect(vi.mocked(OffersService.getLinkedOffers)).not.toHaveBeenCalled()
    })
  })
})
