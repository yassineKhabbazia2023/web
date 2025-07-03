import { shallowMount } from '@vue/test-utils'
import type { CatalogDrawerContentDocumentsProps } from './catalog-drawer-content-documents.types'
import { getOfferCatalogDocumentListMock } from '../../mocks/offers-catalog.service.mocks'
import { APICallStatus } from '@pulse/common/enums'

import CatalogDrawerContentDocumentsList from './catalog-drawer-content-documents.vue'

const offerDocumentsMock = getOfferCatalogDocumentListMock()

const defaultProps: CatalogDrawerContentDocumentsProps = {
  offerDocuments: offerDocumentsMock,
  apiCallStatus: APICallStatus.IDLE,
}

function createWrapper(override: Partial<CatalogDrawerContentDocumentsProps> = {}) {
  const props = {
    ...defaultProps,
    ...override,
  }

  return shallowMount(CatalogDrawerContentDocumentsList, {
    props,
  })
}

describe('catalog-drawer-content-documents', () => {
  it('should display properly', async () => {
    const apiCallStatus = APICallStatus.SUCCESS
    const offerDocuments = offerDocumentsMock

    const wrapper = createWrapper({
      apiCallStatus,
      offerDocuments,
    })

    const snapFilePath = '__snap__/catalog-drawer-content-documents.html'
    await expect(wrapper.html()).toMatchFileSnapshot(snapFilePath)
  })
})
