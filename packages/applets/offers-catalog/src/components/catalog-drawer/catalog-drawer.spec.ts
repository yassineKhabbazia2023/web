import { shallowMount } from '@vue/test-utils'
import type { CatalogDrawerProps } from './catalog-drawer.types'
import { getOffersMock, getOfferCatalogDocumentListMock, getOfferCatalogReferentListMock } from '../../mocks/offers-catalog.service.mocks'
import { APICallStatus } from '@pulse/common/enums'
import { CatalogDrawerTabs } from './catalog-drawer.enums'

import CatalogDrawerList from './catalog-drawer.vue'

const offerReferentsMock = getOfferCatalogReferentListMock()
const offerDocumentsMock = getOfferCatalogDocumentListMock()

const offersMock = getOffersMock()
const offerMock = offersMock[0]

const defaultProps: CatalogDrawerProps = {
  offer: offerMock,
  pdfApiCallStatus: APICallStatus.IDLE,
  offerReferentsApiCallStatus: APICallStatus.IDLE,
  isOpened: true,
  offerPdf: '',
}

function createWrapper(override: Partial<CatalogDrawerProps> = {}) {
  const props = {
    ...defaultProps,
    ...override,
  }

  return shallowMount(CatalogDrawerList, {
    props,
    global: {
      stubs: {
        PDrawer: {
          name: 'PDrawer',
          template: '<PDrawer-stub><slot name="header-prefix" /><slot /><slot name="footer" /></PDrawer-stub>',
          emits: [
            'close-drawer-button',
          ],
        },
        PButton: {
          name: 'PButton',
          template: '<PButton-stub><slot /></PButton-stub>',
        },
        PTabs: {
          name: 'PTabs',
          template: '<PTabs-stub :modelValue="modelValue"><slot /></PTabs-stub>',
          props: ['modelValue'],
        },
        PTabPane: {
          name: 'PTabPane',
          template: '<PTabPane-stub><slot /><slot name="label" /></PTabPane-stub>',
        },
      },
    },
  })
}

const offerPdfMock = 'https://example.com/path/to/pdf'
describe('catalog-drawer', () => {
  it('should display properly when $description', async () => {
    const pdfApiCallStatus = APICallStatus.SUCCESS
    const offerReferentsApiCallStatus = APICallStatus.IDLE
    const offerPdf = offerPdfMock
    const wrapper = createWrapper({
      pdfApiCallStatus,
      offerReferentsApiCallStatus,
      offerPdf,
    })

    const snapFilePath = '__snap__/catalog-drawer.pdf-tab.html'
    await expect(wrapper.html()).toMatchFileSnapshot(snapFilePath)
  })

  it('should emit "open-pdf" when CatalogDrawerContentPdf emits "open-pdf"', async () => {
    const expectedEmitted: void[] = []
    const wrapper = createWrapper({
      pdfApiCallStatus: APICallStatus.SUCCESS,
      offerPdf: offerPdfMock,
    })
    const catalogDrawerContentPdf = wrapper.findComponent({ name: 'CatalogDrawerContentPdf' })

    catalogDrawerContentPdf.vm.$emit('open-pdf')
    expect(wrapper.emitted('open-pdf')).toStrictEqual([expectedEmitted])
  })

  it('should emit update:is-opened when PDrawer is closed', async () => {
    const wrapper = createWrapper()
    const expectedEmitted = [
      [false],
      [true],
      [false],
    ]

    const pDrawer = wrapper.findComponent({ name: 'PDrawer' })
    await pDrawer.vm.$emit('close-drawer-button')
    await pDrawer.vm.$emit('update:modelValue', true)
    await pDrawer.vm.$emit('update:modelValue', false)

    expect(wrapper.emitted('update:is-opened')).toStrictEqual(expectedEmitted)
  })

  it('should change current tab', async () => {
    const wrapper = createWrapper({
      offerReferents: offerReferentsMock,
    })
    const pTabs = wrapper.findComponent({ name: 'PTabs' })

    expect(pTabs.props('modelValue')).toBe(CatalogDrawerTabs.PDF)
    await pTabs.vm.$emit('update:modelValue', CatalogDrawerTabs.CONTACTS)
    expect(pTabs.props('modelValue')).toBe(CatalogDrawerTabs.CONTACTS)

    const snapFilePath = '__snap__/catalog-drawer.referent-tab.html'
    await expect(wrapper.html()).toMatchFileSnapshot(snapFilePath)

    await wrapper.vm.openFirstTab()
    expect(pTabs.props('modelValue')).toBe(CatalogDrawerTabs.PDF)
  })

  it('should open documents tab when click on document tab', async () => {
    const wrapper = createWrapper({
      offerDocuments: offerDocumentsMock,
    })
    const pTabs = wrapper.findComponent({ name: 'PTabs' })

    expect(pTabs.props('modelValue')).toBe(CatalogDrawerTabs.PDF)
    await pTabs.vm.$emit('update:modelValue', CatalogDrawerTabs.DOCUMENTS)
    expect(pTabs.props('modelValue')).toBe(CatalogDrawerTabs.DOCUMENTS)

    const snapFilePath = '__snap__/catalog-drawer.documents-tab.html'
    await expect(wrapper.html()).toMatchFileSnapshot(snapFilePath)
  })
})
