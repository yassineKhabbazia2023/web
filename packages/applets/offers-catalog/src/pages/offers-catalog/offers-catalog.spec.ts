import { ref, type Ref } from 'vue'
import { flushPromises, shallowMount } from '@vue/test-utils'
import { getOfferCatalogReferentListMock, getOfferCatalogDocumentListMock, getOffersCatalogResponseMock } from '../../mocks/offers-catalog.service.mocks'
import { APICallStatus } from '@pulse/common/enums'
import { AmplitudeServiceMock } from '@pulse/common/mocks'
import { loggerMock } from '@pulse/core/mocks'
import type { OfferDescription, OfferCatalogReferent, OfferCatalogDocument } from '@offers-catalog/types/offers-catalog.types'

import OffersCatalog from './offers-catalog.vue'

const offersCatalogResponseMock = getOffersCatalogResponseMock()
const useOffersCatalogMock = vi.hoisted(() => vi.fn())

vi.mock('./offers-catalog.composable', () => ({
  useOffersCatalog: useOffersCatalogMock,
}))

vi.mock('@pulse/common/services/amplitude', () => ({
  AmplitudeService: AmplitudeServiceMock,
}))

vi.mock('@pulse/core', () => ({
  logger: loggerMock,
}))

const openFirstTabMock = vi.hoisted(() => vi.fn())
async function createWrapper() {
  const wrapper = shallowMount(OffersCatalog, {
    global: {
      stubs: {
        CatalogDrawer: {
          name: 'CatalogDrawer',
          template: '<div><slot /></div>',
          methods: {
            openFirstTab: openFirstTabMock,
          },
        },
      },
    },
  },
  )
  await flushPromises()

  return wrapper
}

const offerPdfMock = 'offer pdf mock'
const offersMock = offersCatalogResponseMock.offers
const offerMock = offersCatalogResponseMock.offers[0]
const offerReferentsMock = getOfferCatalogReferentListMock()
const offerDocumentsMock = getOfferCatalogDocumentListMock()

const loadOffersCatalogMock = vi.hoisted(() => vi.fn())
const filterOffersCatalogMock = vi.hoisted(() => vi.fn())
const setSelectedOfferMock = vi.hoisted(() => vi.fn())
const loadOfferPdfMock = vi.hoisted(() => vi.fn())
const loadOfferReferentsMock = vi.hoisted(() => vi.fn())

function getUseOffersCatalogMock(overiddenOptions: Partial<{
  searchTerm: Ref<string>
  catalogDrawerIsOpened: Ref<boolean>
  catalogDocumentViewerIsOpened: Ref<boolean>
  offer: Ref<OfferDescription | undefined>,
  filteredOffers: Ref<OfferDescription[]>,
  offerPdf: Ref<string>,
  offerReferents: Ref<OfferCatalogReferent[]>,
  offerDocuments: Ref<OfferCatalogDocument[]>,
  pdfApiCallStatus: Ref<APICallStatus>,
  catalogApiCallStatus: Ref<APICallStatus>,
}> = {}) {
  const defaultOptions = {
    searchTerm: ref(''),
    catalogDrawerIsOpened: ref(false),
    catalogDocumentViewerIsOpened: ref(false),
    offer: ref(offerMock),
    offerReferents: ref(offerReferentsMock),
    offerDocuments: ref(offerDocumentsMock),
    filteredOffers: ref(offersMock),
    offerPdf: ref(offerPdfMock),
    pdfApiCallStatus: ref(APICallStatus.IDLE),
    catalogApiCallStatus: ref(APICallStatus.IDLE),
  }
  return {
    ...defaultOptions,
    ...overiddenOptions,
    loadOffersCatalog: loadOffersCatalogMock,
    filterOffersCatalog: filterOffersCatalogMock,
    setSelectedOffer: setSelectedOfferMock,
    loadOfferPdf: loadOfferPdfMock,
    loadOfferReferents: loadOfferReferentsMock,
  }
}

describe('offers-catalog', () => {
  const tests = [{
    offer: undefined,
    offerPdf: '',
    catalogDrawerIsOpened: false,
    catalogDocumentViewerIsOpened: false,
    catalogApiCallStatus: APICallStatus.IDLE,
    description: 'drawerIsClosedWithoutOffer',
  }, {
    offer: undefined,
    offerPdf: '',
    catalogDrawerIsOpened: false,
    catalogDocumentViewerIsOpened: false,
    catalogApiCallStatus: APICallStatus.LOADING,
    description: 'catalogLoadingDrawerIsClosedWithoutOffer',
  }, {
    offer: offerMock,
    offerPdf: '',
    catalogDrawerIsOpened: false,
    catalogDocumentViewerIsOpened: false,
    catalogApiCallStatus: APICallStatus.SUCCESS,
    description: 'drawerIsClosedWithOffer',
  }, {
    offer: offerMock,
    offerPdf: '',
    catalogDrawerIsOpened: true,
    catalogDocumentViewerIsOpened: false,
    catalogApiCallStatus: APICallStatus.SUCCESS,
    description: 'drawerIsOpenedWithoutPdf',
  }, {
    offer: offerMock,
    offerPdf: offerPdfMock,
    catalogDrawerIsOpened: true,
    catalogDocumentViewerIsOpened: false,
    catalogApiCallStatus: APICallStatus.SUCCESS,
    description: 'drawerIsOpenedWithPdf',
  }, {
    offer: offerMock,
    offerPdf: offerPdfMock,
    catalogDrawerIsOpened: true,
    catalogDocumentViewerIsOpened: true,
    catalogApiCallStatus: APICallStatus.SUCCESS,
    description: 'drawerIsOpenedWithPdfAndWithDocumentViewerOpened',
  }]
  it.each(tests)('should display properly when $description', async ({
    offer,
    offerPdf,
    catalogDrawerIsOpened,
    catalogDocumentViewerIsOpened,
    description,
  }) => {
    useOffersCatalogMock.mockReturnValue(getUseOffersCatalogMock({
      offer: ref(offer),
      offerPdf: ref(offerPdf),
      catalogDrawerIsOpened: ref(catalogDrawerIsOpened),
      catalogDocumentViewerIsOpened: ref(catalogDocumentViewerIsOpened),
    }))
    const wrapper = await createWrapper()

    const snapFilePath = `__snap__/offers-catalog.${description}.html`
    await expect(wrapper.html()).toMatchFileSnapshot(snapFilePath)

    expect(loadOffersCatalogMock).toHaveBeenCalledOnce()
    expect(loadOffersCatalogMock).toHaveBeenCalledWith(/* no parameters */)

    expect(filterOffersCatalogMock).toHaveBeenCalledOnce()
    expect(filterOffersCatalogMock).toHaveBeenCalledWith(/* no parameters */)
  })

  it('should select offer when CatalogCard emits selectOffer', async () => {
    useOffersCatalogMock.mockReturnValue(getUseOffersCatalogMock())

    const selectedOfferMock = offersMock[1]
    const offerIdMock = selectedOfferMock.id
    const expectedParameters = [selectedOfferMock]
    const expectedAmplitudeParameters = [
      'Offer Consulted', {
        'offer_name': 'Comptabilité',
      },
    ]

    const wrapper = await createWrapper()
    const catalogCardList = wrapper.findComponent({ name: 'CatalogCardList' })

    catalogCardList.vm.$emit('select-offer', offerIdMock)

    expect(setSelectedOfferMock).toHaveBeenCalledOnce()
    expect(setSelectedOfferMock).toHaveBeenCalledWith(...expectedParameters)

    expect(loadOfferPdfMock).toHaveBeenCalledOnce()
    expect(loadOfferPdfMock).toHaveBeenCalledWith(/* no parameters */)

    expect(loadOfferReferentsMock).toHaveBeenCalledOnce()
    expect(loadOfferReferentsMock).toHaveBeenCalledWith(/* no parameters */)

    expect(openFirstTabMock).toHaveBeenCalledOnce()
    expect(openFirstTabMock).toHaveBeenCalledWith(/* no parameters */)

    expect(AmplitudeServiceMock.track).toHaveBeenCalledOnce()
    expect(AmplitudeServiceMock.track).toHaveBeenCalledWith(...expectedAmplitudeParameters)
  })

  it('should call logger.error when select unkown offer', async () => {
    useOffersCatalogMock.mockReturnValue(getUseOffersCatalogMock())

    const offerIdMock = 777 // an unknown offer ID
    const expectedParameters = [undefined]
    const expectedLoggerErrorParameters = `Offer not found ${offerIdMock}`

    const wrapper = await createWrapper()
    const catalogCardList = wrapper.findComponent({ name: 'CatalogCardList' })

    catalogCardList.vm.$emit('select-offer', offerIdMock)

    expect(setSelectedOfferMock).toHaveBeenCalledOnce()
    expect(setSelectedOfferMock).toHaveBeenCalledWith(...expectedParameters)

    expect(loadOfferPdfMock).toHaveBeenCalledOnce()
    expect(loadOfferPdfMock).toHaveBeenCalledWith(/* no parameters */)

    expect(loadOfferReferentsMock).toHaveBeenCalledOnce()
    expect(loadOfferReferentsMock).toHaveBeenCalledWith(/* no parameters */)

    expect(filterOffersCatalogMock).toHaveBeenCalledOnce()
    expect(filterOffersCatalogMock).toHaveBeenCalledWith(/* no parameters */)

    expect(AmplitudeServiceMock.track).not.toHaveBeenCalled()

    expect(loggerMock.error).toHaveBeenCalledOnce()
    expect(loggerMock.error).toHaveBeenCalledWith(expectedLoggerErrorParameters)
  })

  describe('interactions', () => {
    const catalogDrawerIsOpenedMock = ref(false)
    const catalogDocumentViewerIsOpenedMock = ref(false)
    beforeEach(() => {
      catalogDocumentViewerIsOpenedMock.value = false
      useOffersCatalogMock.mockReturnValue(getUseOffersCatalogMock({
        catalogDrawerIsOpened: catalogDrawerIsOpenedMock,
        catalogDocumentViewerIsOpened: catalogDocumentViewerIsOpenedMock,
      }))
    })

    it('should toggle catalogDocumentViewerIsOpened when CatalogDocumentViewer emit update:is-opened', async () => {
      const wrapper = await createWrapper()
      const catalogDocumentViewer = wrapper.findComponent({ name: 'CatalogDocumentViewer' })

      catalogDocumentViewer.vm.$emit('update:is-opened', true)
      expect(catalogDocumentViewerIsOpenedMock.value).toBe(true)

      catalogDocumentViewer.vm.$emit('update:is-opened', false)
      expect(catalogDocumentViewerIsOpenedMock.value).toBe(false)
    })

    it('should toggle catalogDrawerIsOpened when CatalogDrawer emit update:is-opened', async () => {
      const wrapper = await createWrapper()
      const catalogDrawer = wrapper.findComponent({ name: 'CatalogDrawer' })

      catalogDrawer.vm.$emit('update:is-opened', true)
      expect(catalogDrawerIsOpenedMock.value).toBe(true)

      catalogDrawer.vm.$emit('update:is-opened', false)
      expect(catalogDrawerIsOpenedMock.value).toBe(false)
    })

    it('should make catalogDocumentViewerIsOpened true when CatalogDrawer emits open-pdf', async () => {
      const wrapper = await createWrapper()
      const catalogDrawer = wrapper.findComponent({ name: 'CatalogDrawer' })

      expect(catalogDocumentViewerIsOpenedMock.value).toBe(false)
      catalogDrawer.vm.$emit('open-pdf')
      expect(catalogDocumentViewerIsOpenedMock.value).toBe(true)
    })
  })
})
