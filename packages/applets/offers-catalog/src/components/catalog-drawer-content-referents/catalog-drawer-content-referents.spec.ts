import { shallowMount } from '@vue/test-utils'
import type { CatalogDrawerContentReferentsProps } from './catalog-drawer-content-referents.types'
import { getOfferCatalogReferentListMock } from '../../mocks/offers-catalog.service.mocks'
import { APICallStatus } from '@pulse/common/enums'

import CatalogDrawerContentReferentsList from './catalog-drawer-content-referents.vue'

const offerReferentsMock = getOfferCatalogReferentListMock()

const defaultProps: CatalogDrawerContentReferentsProps = {
  offerReferents: offerReferentsMock,
  apiCallStatus: APICallStatus.IDLE,
}

const firstReferentMock = offerReferentsMock[0]

const copyColumnContentMock = vi.hoisted(() => vi.fn())
vi.mock('./catalog-drawer-content-referents.utils', async (importActual) => {
  const actual = await importActual() as Record<string, any>

  return {
    ...actual,
    copyColumnContent: copyColumnContentMock,
  }
})

function createWrapper(override: Partial<CatalogDrawerContentReferentsProps> = {}) {
  const props = {
    ...defaultProps,
    ...override,
  }

  return shallowMount(CatalogDrawerContentReferentsList, {
    props,
    global: {
      stubs: {
        PTooltip: {
          name: 'PTooltip',
          template: '<div><slot /></div>',
        },
        POverlay: {
          name: 'POverlay',
          template: '<div><slot /></div>',
        },
        PTable: {
          name: 'PTable',
          template: '<div><slot /></div>',
        },
        PTableColumn: {
          name: 'PTableColumn',
          template: '<div><slot :row="row" :column="column" /></div>',
          data() {
            const column = {
              property: 'email',
            }

            return {
              row: firstReferentMock,
              column,
            }
          },
        },
      },
    },
  })
}

describe('catalog-drawer-content-referents', () => {
  const tests = [{
    apiCallStatus: APICallStatus.IDLE,
    hasResults: true,
  }, {
    apiCallStatus: APICallStatus.SUCCESS,
    hasResults: true,
  }, {
    apiCallStatus: APICallStatus.LOADING,
    hasResults: true,
  }, {
    apiCallStatus: APICallStatus.ERROR,
    hasResults: true,
  }, {
    apiCallStatus: APICallStatus.SUCCESS,
    hasResults: false,
  }]
  it.each(tests)('should display properly when apiCallStatus equals $apiCallStatus and hasResults equals $hasResults', async ({
    apiCallStatus,
    hasResults,
  }) => {
    const offerReferents = hasResults
      ? offerReferentsMock
      : []
    const wrapper = createWrapper({
      apiCallStatus,
      offerReferents,
    })

    const suffix = hasResults ? '' : '.noResult'
    const snapFilePath = `__snap__/catalog-drawer-content-referents.${apiCallStatus}${suffix}.html`
    await expect(wrapper.html()).toMatchFileSnapshot(snapFilePath)
  })

  describe('interaction', () => {
    it('should call copyColumnContent when click on copy button', () => {
      const expectedParams = [
        firstReferentMock.email,
        'The email address has been successfully copied.',
        'Failed to copy the email address.',
      ]
      const wrapper = createWrapper({
        apiCallStatus: APICallStatus.SUCCESS,
      })

      const pButton = wrapper.find('[data-testid="copy-content"]')
      pButton.trigger('click')

      expect(copyColumnContentMock).toHaveBeenCalledOnce()
      expect(copyColumnContentMock).toHaveBeenCalledWith(...expectedParams)
    })
  })
})
