import { ref } from 'vue'
import { flushPromises, shallowMount } from '@vue/test-utils'
import { getOffersCatalogResponseMock } from '../../mocks/offers-catalog.service.mock'
import { APICallStatus } from '@pulse/common/enums'
import { amplitudeServiceMock } from '@pulse/common/mocks'
import { loggerMock } from '@pulse/core/mocks'

import OffersCatalog from './offers-catalog.vue'

const offersCatalogResponseMock = getOffersCatalogResponseMock()
const useOffersCatalogMock = vi.hoisted(() => vi.fn())

vi.mock('./offers-catalog.composable', () => ({
  useOffersCatalog: useOffersCatalogMock,
}))

vi.mock('@pulse/common', () => ({
  amplitudeService: amplitudeServiceMock,
}))

vi.mock('@pulse/core', () => ({
  logger: loggerMock,
}))

async function createWrapper() {
  const wrapper = shallowMount(OffersCatalog)
  await flushPromises()

  return wrapper
}

const offerPdfMock = 'offer pdf mock'
const offersMock = offersCatalogResponseMock.offers
const offerMock = offersCatalogResponseMock.offers[0]

const loadOffersCatalogMock = vi.hoisted(() => vi.fn())
const setSelectedOfferMock = vi.hoisted(() => vi.fn())
const loadOfferPdfMock = vi.hoisted(() => vi.fn())

describe('offers-catalog', () => {
  const tests = [{
    offer: undefined,
    offerPdf: '',
    catalogDrawerIsOpened: false,
    catalogDocumentViewerIsOpened: false,
    catalogLoadingStatus: APICallStatus.IDLE,
    description: 'drawerIsClosedWithoutOffer',
  }, {
    offer: undefined,
    offerPdf: '',
    catalogDrawerIsOpened: false,
    catalogDocumentViewerIsOpened: false,
    catalogLoadingStatus: APICallStatus.LOADING,
    description: 'catalogLoadingDrawerIsClosedWithoutOffer',
  }, {
    offer: offerMock,
    offerPdf: '',
    catalogDrawerIsOpened: false,
    catalogDocumentViewerIsOpened: false,
    catalogLoadingStatus: APICallStatus.SUCCESS,
    description: 'drawerIsClosedWithOffer',
  }, {
    offer: offerMock,
    offerPdf: '',
    catalogDrawerIsOpened: true,
    catalogDocumentViewerIsOpened: false,
    catalogLoadingStatus: APICallStatus.SUCCESS,
    description: 'drawerIsOpenedWithoutPdf',
  }, {
    offer: offerMock,
    offerPdf: offerPdfMock,
    catalogDrawerIsOpened: true,
    catalogDocumentViewerIsOpened: false,
    catalogLoadingStatus: APICallStatus.SUCCESS,
    description: 'drawerIsOpenedWithPdf',
  }, {
    offer: offerMock,
    offerPdf: offerPdfMock,
    catalogDrawerIsOpened: true,
    catalogDocumentViewerIsOpened: true,
    catalogLoadingStatus: APICallStatus.SUCCESS,
    description: 'drawerIsOpenedWithPdfAndWithDocumentViewerOpened',
  }]
  it.each(tests)('should display properly when $description', async ({
    offer,
    offerPdf,
    catalogDrawerIsOpened,
    catalogDocumentViewerIsOpened,
    description,
  }) => {
    useOffersCatalogMock.mockReturnValue({
      offers: ref(offersMock),
      offer: ref(offer),
      offerPdf: ref(offerPdf),
      catalogDrawerIsOpened: ref(catalogDrawerIsOpened),
      catalogDocumentViewerIsOpened: ref(catalogDocumentViewerIsOpened),
      loadOffersCatalog: loadOffersCatalogMock,
      setSelectedOffer: setSelectedOfferMock,
      loadOfferPdf: loadOfferPdfMock,
    })
    const wrapper = await createWrapper()

    const snapFilePath = `__snap__/offers-catalog.${description}.html`
    await expect(wrapper.html()).toMatchFileSnapshot(snapFilePath)

    expect(loadOffersCatalogMock).toHaveBeenCalledOnce()
    expect(loadOffersCatalogMock).toHaveBeenCalledWith(/* no parameters */)
  })

  it('should select offer when CatalogCard emits selectOffer', async () => {
    const catalogDrawerIsOpenedMock = false
    useOffersCatalogMock.mockReturnValue({
      offers: ref(offersMock),
      offer: ref(offerMock),
      offerPdf: ref(offerPdfMock),
      catalogDrawerIsOpened: ref(catalogDrawerIsOpenedMock),
      pdfLoadingStatus: ref(APICallStatus.IDLE),
      catalogLoadingStatus: ref(APICallStatus.IDLE),
      loadOffersCatalog: loadOffersCatalogMock,
      setSelectedOffer: setSelectedOfferMock,
      loadOfferPdf: loadOfferPdfMock,
    })

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

    expect(amplitudeServiceMock.track).toHaveBeenCalledOnce()
    expect(amplitudeServiceMock.track).toHaveBeenCalledWith(...expectedAmplitudeParameters)
  })

  it('should call logger.error when select unkown offer', async () => {
    const catalogDrawerIsOpenedMock = false
    useOffersCatalogMock.mockReturnValue({
      offers: ref(offersMock),
      offer: ref(offerMock),
      offerPdf: ref(offerPdfMock),
      catalogDrawerIsOpened: ref(catalogDrawerIsOpenedMock),
      pdfLoadingStatus: ref(APICallStatus.IDLE),
      catalogLoadingStatus: ref(APICallStatus.IDLE),
      loadOffersCatalog: loadOffersCatalogMock,
      setSelectedOffer: setSelectedOfferMock,
      loadOfferPdf: loadOfferPdfMock,
    })

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

    expect(amplitudeServiceMock.track).not.toHaveBeenCalled()

    expect(loggerMock.error).toHaveBeenCalledOnce()
    expect(loggerMock.error).toHaveBeenCalledWith(expectedLoggerErrorParameters)
  })

  describe('interactions', () => {
    const catalogDrawerIsOpenedMock = ref(false)
    const catalogDocumentViewerIsOpenedMock = ref(false)
    beforeEach(() => {
      catalogDocumentViewerIsOpenedMock.value = false
      useOffersCatalogMock.mockReturnValue({
        offers: ref(offersMock),
        offer: ref(offerMock),
        offerPdf: ref(offerPdfMock),
        catalogDrawerIsOpened: catalogDrawerIsOpenedMock,
        catalogDocumentViewerIsOpened: catalogDocumentViewerIsOpenedMock,
        pdfLoadingStatus: ref(APICallStatus.IDLE),
        catalogLoadingStatus: ref(APICallStatus.IDLE),
        loadOffersCatalog: loadOffersCatalogMock,
        setSelectedOffer: setSelectedOfferMock,
        loadOfferPdf: loadOfferPdfMock,
      })
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

      catalogDrawer.vm.$emit('open-pdf')
      expect(catalogDocumentViewerIsOpenedMock.value).toBe(true)
    })
  })

})
