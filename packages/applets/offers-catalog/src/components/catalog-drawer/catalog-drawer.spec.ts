import { shallowMount } from '@vue/test-utils'
import type { CatalogDrawerProps } from './catalog-drawer.types'
import { getOffersMock } from '../../mocks/offers-catalog.service.mocks'
import { APICallStatus } from '@pulse/common/enums'
import { CatalogDrawerTabs } from './catalog-drawer.enums'

import CatalogDrawerList from './catalog-drawer.vue'

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
          template: '<div><slot name="header-prefix" /><slot /><slot name="footer" /></div>',
          emits: [
            'close-drawer-button',
          ],
        },
        PButton: {
          name: 'PButton',
          template: '<div><slot /></div>',
        },
        PTabs: {
          name: 'PTabs',
          template: '<div :modelValue="modelValue"><slot /></div>',
          props: ['modelValue'],
        },
        PTabPane: {
          name: 'PTabPane',
          template: '<div><slot /><slot name="label" /></div>',
        },
      },
    },
  })
}

const offerPdfMock = 'https://example.com/path/to/pdf'
describe('catalog-drawer', () => {
  const tests = [{
    pdfApiCallStatus: APICallStatus.IDLE,
    offerReferentsApiCallStatus: APICallStatus.IDLE,
    offerPdf: '',
    description: 'idleEmptyPdf',
  }, {
    pdfApiCallStatus: APICallStatus.LOADING,
    offerReferentsApiCallStatus: APICallStatus.LOADING,
    offerPdf: '',
    description: 'loadingEmptyPdf',
  }, {
    pdfApiCallStatus: APICallStatus.LOADING,
    offerReferentsApiCallStatus: APICallStatus.LOADING,
    offerPdf: offerPdfMock,
    description: 'loadingWithPdf',
  }, {
    pdfApiCallStatus: APICallStatus.SUCCESS,
    offerReferentsApiCallStatus: APICallStatus.SUCCESS,
    offerPdf: offerPdfMock,
    description: 'successWithPdf',
  }, {
    pdfApiCallStatus: APICallStatus.ERROR,
    offerReferentsApiCallStatus: APICallStatus.ERROR,
    offerPdf: offerPdfMock,
    description: 'errorWithPdf',
  }]
  it.each(tests)('should display properly when $description', async ({
    pdfApiCallStatus,
    offerReferentsApiCallStatus,
    offerPdf,
    description,
  }) => {
    const wrapper = createWrapper({
      pdfApiCallStatus,
      offerReferentsApiCallStatus,
      offerPdf,
    })

    const snapFilePath = `__snap__/catalog-drawer.${description}.html`
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
    const wrapper = createWrapper()
    const pTabs = wrapper.findComponent({ name: 'PTabs' })

    expect(pTabs.props('modelValue')).toBe(CatalogDrawerTabs.PDF)
    await pTabs.vm.$emit('update:modelValue', CatalogDrawerTabs.CONTACTS)
    expect(pTabs.props('modelValue')).toBe(CatalogDrawerTabs.CONTACTS)

    await wrapper.vm.openFirstTab()
    expect(pTabs.props('modelValue')).toBe(CatalogDrawerTabs.PDF)
  })
})
