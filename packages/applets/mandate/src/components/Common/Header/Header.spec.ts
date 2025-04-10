import wrapperFactory from '@mandate/__mocks__/wrapper.factory'
import { amplitudeServiceMock, amplitudeServiceTrackMock } from '@pulse/common/mocks'
import { commonStoreMock } from '@mandate/__mocks__/common.mocks'
import { expect, describe, it, vi } from 'vitest'
import Drawer from '@mandate/components/CreateMandate/Drawer'
import { nextTick } from 'vue'
import type { VueWrapper } from '@vue/test-utils'
import Header from '.'

const createWrapper = () =>
  wrapperFactory(Header)

vi.mock('@pulse/common', () => ({
  commonStore: commonStoreMock,
  amplitudeService: amplitudeServiceMock,
}))

function getDrawerOpenButton(wrapper: VueWrapper) {
  return wrapper.find('.header__create-mandate-button')
}

describe('header.vue', () => {
  const wrapper = createWrapper()
  it('renders translations correctly', () => {
    expect(wrapper.find('[data-testid="mandate-header-title"]').text()).toBe('Collection Status')
    expect(wrapper.find('.header__create-mandate-button').text()).toContain('New mandate')
  })

  it('show drawer when button is clicked', async () => {
    expect(wrapper.find('.drawer-create-mandate').exists()).toBeFalsy()
    await wrapper.find('.header__create-mandate-button').trigger('click')
    expect(wrapper.find('.drawer-create-mandate').exists()).toBeTruthy()
  })

  it('tracks mandate creation flow trigger', () => {
    const drawerOpenButton = getDrawerOpenButton(wrapper)
    drawerOpenButton.trigger('click')
    expect(amplitudeServiceTrackMock).toHaveBeenCalledWith('Bank Mandate Creation Started', {
      bank_mandate_creation_start: '',
    })
  })

  it('show emit refresh-mandate-collection', async () => {
    await wrapper.find('.header__create-mandate-button').trigger('click')
    wrapper.findComponent(Drawer).vm.$emit('new-mandate-created')
    const refreshMandateCollectionEvent: any = wrapper.emitted('refresh-mandate-collection')
    expect(refreshMandateCollectionEvent).toBeDefined()
  })

  describe('interactions with PFilterGroup', () => {
    it('show emit when click on PFilterGroup', async () => {
      const activeFilters = [20]
      const expectedFilters = [
        {
          pContent: 'Incident',
          pCode: 10,
          pColor: 'danger',
          pIconName: 'exclamationTriangle',
        },
        {
          pContent: 'To do',
          pCode: 20,
          pColor: 'warning',
          pIconName: 'arrowUpCircle',
        },
        {
          pContent: 'In progress',
          pCode: 30,
          pColor: 'fuschia',
          pIconName: 'arrowRepeat',
        },
        {
          pContent: 'Active',
          pCode: 40,
          pColor: 'success',
          pIconName: 'checkCircle',
        },
        {
          pContent: 'Inactive',
          pCode: 50,
          pColor: 'gray-900',
          pIconName: 'xCircle',
        },
      ]
      const expectedRefreshMandateCollectionEvent = [
        [{
          currentPage: 1,
          statusCodes: [],
        }],
        [{
          currentPage: 1,
          statusCodes: activeFilters,
        }],
      ]

      const pFilterGroup = wrapper.findComponent({ name: 'PFilterGroup' })
      expect(pFilterGroup.props('modelValue')).toStrictEqual([])

      pFilterGroup.vm.$emit('update:model-value', activeFilters)
      await nextTick()

      expect(pFilterGroup.props('modelValue')).toStrictEqual(activeFilters)
      expect(pFilterGroup.props('pFilters')).toStrictEqual(expectedFilters)

      expect(wrapper.emitted('refresh-mandate-collection')).toStrictEqual(expectedRefreshMandateCollectionEvent)
    })
  })
})
