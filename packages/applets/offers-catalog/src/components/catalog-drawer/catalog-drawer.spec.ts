import { shallowMount } from '@vue/test-utils'
import type { CatalogDrawerProps } from './catalog-drawer.types'
import { getOffersMock } from '../../mocks/offers-catalog.service.mock'
import { APICallStatus } from '@pulse/common/enums'

import CatalogDrawerList from './catalog-drawer.vue'

const offersMock = getOffersMock()
const offerMock = offersMock[0]

const defaultProps: CatalogDrawerProps = {
  offer: offerMock,
  loadingStatus: APICallStatus.IDLE,
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
describe('catalog-drawer', () => {
  const tests = [{
    loadingStatus: APICallStatus.IDLE,
    offerPdf: '',
    description: 'idleEmptyPdf',
  }, {
    loadingStatus: APICallStatus.LOADING,
    offerPdf: '',
    description: 'loadingEmptyPdf',
  }, {
    loadingStatus: APICallStatus.LOADING,
    offerPdf: offerPdfMock,
    description: 'loadingWithPdf',
  }, {
    loadingStatus: APICallStatus.SUCCESS,
    offerPdf: offerPdfMock,
    description: 'successWithPdf',
  }, {
    loadingStatus: APICallStatus.ERROR,
    offerPdf: offerPdfMock,
    description: 'errorWithPdf',
  }]
  it.each(tests)('should display properly when $description', async ({
    loadingStatus,
    offerPdf,
    description,
  }) => {
    const wrapper = createWrapper({
      loadingStatus,
      offerPdf,
    })

    const snapFilePath = `__snap__/catalog-drawer.${description}.html`
    await expect(wrapper.html()).toMatchFileSnapshot(snapFilePath)
  })

  it('should', async () => {
    const expectedEmitted: void[] = []
    const wrapper = createWrapper({
      loadingStatus: APICallStatus.SUCCESS,
      offerPdf: offerPdfMock,
    })
    const openPdfButton = wrapper.findComponent('[data-testid="open-pdf-button"]')

    openPdfButton.trigger('click')
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
})
