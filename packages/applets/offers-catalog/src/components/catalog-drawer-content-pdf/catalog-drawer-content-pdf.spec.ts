import { shallowMount } from '@vue/test-utils'
import type { CatalogDrawerContentPdfProps } from './catalog-drawer-content-pdf.types'
import { getOffersMock } from '../../mocks/offers-catalog.service.mocks'
import { APICallStatus } from '@pulse/common/enums'

import CatalogDrawerContentPdfList from './catalog-drawer-content-pdf.vue'

const offersMock = getOffersMock()
const offerMock = offersMock[0]

const defaultProps: CatalogDrawerContentPdfProps = {
  offer: offerMock,
  apiCallStatus: APICallStatus.IDLE,
  offerPdf: '',
}

function createWrapper(override: Partial<CatalogDrawerContentPdfProps> = {}) {
  const props = {
    ...defaultProps,
    ...override,
  }

  return shallowMount(CatalogDrawerContentPdfList, {
    props,
    global: {
      stubs: {
        POverlay: {
          name: 'POverlay',
          template: '<div><slot /></div>',
        },
        PButton: {
          name: 'PButton',
          template: '<div><slot /></div>',
        },
      },
    },
  })
}

const offerPdfMock = 'https://example.com/path/to/pdf'
describe('catalog-drawer-content-pdf', () => {
  const tests = [{
    apiCallStatus: APICallStatus.IDLE,
    offerPdf: '',
    description: 'idleEmptyPdf',
  }, {
    apiCallStatus: APICallStatus.LOADING,
    offerPdf: '',
    description: 'loadingEmptyPdf',
  }, {
    apiCallStatus: APICallStatus.LOADING,
    offerPdf: offerPdfMock,
    description: 'loadingWithPdf',
  }, {
    apiCallStatus: APICallStatus.SUCCESS,
    offerPdf: offerPdfMock,
    description: 'successWithPdf',
  }, {
    apiCallStatus: APICallStatus.ERROR,
    offerPdf: offerPdfMock,
    description: 'errorWithPdf',
  }]
  it.each(tests)('should display properly when $description', async ({
    apiCallStatus,
    offerPdf,
    description,
  }) => {
    const wrapper = createWrapper({
      apiCallStatus,
      offerPdf,
    })

    const snapFilePath = `__snap__/catalog-drawer-content-pdf.${description}.html`
    await expect(wrapper.html()).toMatchFileSnapshot(snapFilePath)
  })

  it('should', async () => {
    const expectedEmitted: void[] = []
    const wrapper = createWrapper({
      apiCallStatus: APICallStatus.SUCCESS,
      offerPdf: offerPdfMock,
    })
    const openPdfButton = wrapper.findComponent('[data-testid="open-pdf-button"]')

    openPdfButton.trigger('click')
    expect(wrapper.emitted('open-pdf')).toStrictEqual([expectedEmitted])
  })
})
