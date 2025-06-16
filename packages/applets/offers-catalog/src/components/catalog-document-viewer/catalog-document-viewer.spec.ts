import { shallowMount } from '@vue/test-utils'
import type { CatalogDocumentViewerProps } from './catalog-document-viewer.types'
import { getOffersMock } from '../../mocks/offers-catalog.service.mocks'

import CatalogDocumentViewerList from './catalog-document-viewer.vue'

const offersMock = getOffersMock()
const offerMock = offersMock[0]

const defaultProps: CatalogDocumentViewerProps = {
  offer: offerMock,
  isOpened: true,
  offerPdf: '',
}

function createWrapper(override: Partial<CatalogDocumentViewerProps> = {}) {
  const props = {
    ...defaultProps,
    ...override,
  }

  return shallowMount(CatalogDocumentViewerList, {
    props,
    global: {
      stubs: {
        PDocumentViewer: {
          name: 'PDocumentViewer',
          template: '<div><slot /><slot name="iconDocument" /></div>',
          emits: [
            'update:modelValue',
          ],
        },
      },
    },
  })
}

describe('catalog-document-viewer', () => {
  it('should display properly', async () => {
    const wrapper = createWrapper()

    await expect(wrapper.html()).toMatchFileSnapshot('__snap__/catalog-document-viewer.withoutPdf.html')
  })

  it('should display properly when offerPdf is not empty', async () => {
    const offerPdfMock = 'https://example.com/path/to/pdf'
    const wrapper = createWrapper({
      offerPdf: offerPdfMock,
    })

    await expect(wrapper.html()).toMatchFileSnapshot('__snap__/catalog-document-viewer.withPdf.html')
  })

  it('should emit update:is-opened properly when PDocumentViewer is closed', () => {
    const expectedEmitted = [
      false,
    ]
    const wrapper = createWrapper()
    const pDocumentViewer = wrapper.findComponent({ name: 'PDocumentViewer' })

    pDocumentViewer.vm.$emit('update:modelValue', false)
    expect(wrapper.emitted('update:is-opened')).toStrictEqual([expectedEmitted])
  })
})
