import { flushPromises, mount, type VueWrapper } from '@vue/test-utils'
import { nextTick, ref, h, defineComponent } from 'vue'
import { mockTableData } from '@entities/__mocks__/table-data.mocks'
import { getMockedUserInfo, getMockedEntitySummary } from '@pulse/common/mocks'
import {
  AmplitudeServiceMock,
  CurrentEntityManagerMock,
  getStoreMock,
  CurrentUserManagerMock,
  TrackingCenterMock,
} from '@pulse/common/mocks/vitest'
import { useCurrentEntityStore, useUserStore } from '@pulse/common/stores'
import { AmplitudeFeatureLocalisation } from '@pulse/common/enums'

import EntitiesList from '.'

vi.mock('@pulse/styleguide', async (importOriginal) => {
  const original = await importOriginal<typeof import('@pulse/styleguide')>()
  return {
    ...original,
    PNotification: vi.fn(),
    AvatarRoles: { CLIENT: 'client' },
    useResponsive: () => ({
      isDesktop: ref(true),
      isMobile: ref(false),
      width: ref(1024),
      currentBreakpoint: ref('md'),
    }),
  }
})

const currentEntityStoreMock = getStoreMock(useCurrentEntityStore)
const userStoreMock = getStoreMock(useUserStore)

const handleFavorites = vi.fn()
const postMock = vi.hoisted(() => vi.fn())
const testEntity = {
  accountId: mockTableData[0].accountId,
  legalName: mockTableData[0].name,
  accountNumber: mockTableData[0].accountNumber,
}

vi.mock('@pulse/common/api', () => ({
  api: ({
    gateway: {
      post: postMock,
    },
  }),
}))

vi.mock('@pulse/common/services/amplitude', () => ({
  AmplitudeService: AmplitudeServiceMock,
  TrackingCenter: TrackingCenterMock,
}))

vi.mock('@pulse/common/managers', () => ({
  CurrentEntityManager: CurrentEntityManagerMock,
  CurrentUserManager: CurrentUserManagerMock,
}))

const walletTrackingManagerMock = vi.hoisted(() => ({
  trackFavoriteRequest: vi.fn(),
  trackColumnSortRequested: vi.fn(),
  trackFolderMenuAction: vi.fn(),
}))

vi.mock('@entities/managers/wallet-tracking/wallet-tracking.manager', () => ({
  WalletTrackingManager: walletTrackingManagerMock,
}))

// Create a stub for PResponsiveTable that renders content in desktop mode
const PResponsiveTableStub = defineComponent({
  name: 'PResponsiveTable',
  inheritAttrs: false,
  props: {
    pData: { type: Array, default: () => [] },
    pStripe: { type: Boolean, default: false },
    pFit: { type: Boolean, default: true },
    pHeaderCellStyle: { type: [Object, Function], default: undefined },
    pCellStyle: { type: [Object, Function], default: undefined },
    pCardClickable: { type: Boolean, default: false },
  },
  emits: ['row-click', 'sort-change'],
  setup(_props, { slots, attrs, emit }) {
    return () => h('div', {
      class: 'p-responsive-table',
      ...attrs,
      onSortChange: (data: any) => emit('sort-change', data),
    }, slots.default?.())
  },
})

const createWrapper = (isAccountManagement: boolean = false): VueWrapper<any> =>
  mount(EntitiesList, {
    props: {
      data: mockTableData,
      handleAddFavorite: handleFavorites,
      isAccountManagement,
    },
    global: {
      stubs: {
        PResponsiveTable: PResponsiveTableStub,
        PToolbox: {
          name: 'PToolbox',
          template: '<button @click="$emit(\'p-toolbox-item-clicked\', \'deploy\')"><slot/></button>',
        },
        PCheckbox: {
          name: 'PCheckbox',
          template: '<input type="checkbox" @change="$emit(\'change\')" />',
        },
        PTableColumn: {
          name: 'PTableColumn',
          template: '<div class="p-table-column" :data-label="pLabel"><slot v-for="row in rows" :key="row.accountId" :row="row" /></div>',
          props: ['pLabel', 'pProp', 'pSortable', 'pSortOrders', 'pWidth', 'pMinWidth', 'pAlign', 'pShowOverflowTooltip'],
          computed: {
            rows() {
              return mockTableData
            },
          },
        },
        PAvatar: true,
        PIcon: true,
        PButton: {
          name: 'PButton',
          template: '<button v-bind="$attrs"><slot/></button>',
        },
        PTag: {
          name: 'PTag',
          template: '<span class="el-tag"><span class="el-tag__content">{{ pContent }}</span></span>',
          props: ['pContent', 'pColor', 'pIconLeftName'],
        },
      },
    },
  })

const userMock = getMockedUserInfo()
const entitySummaryMock = getMockedEntitySummary(testEntity)

describe('entities-list', () => {
  let wrapper: VueWrapper<any>

  beforeEach(async () => {
    vi.useFakeTimers()
    currentEntityStoreMock.currentEntity = entitySummaryMock
    userStoreMock.user = userMock
    userStoreMock.isCollab = true
    wrapper = createWrapper()

    await flushPromises()
  })

  afterEach(() => {
    postMock.mockReset()
    postMock.mockClear()
    walletTrackingManagerMock.trackFavoriteRequest.mockClear()
    walletTrackingManagerMock.trackColumnSortRequested.mockClear()
    walletTrackingManagerMock.trackFolderMenuAction.mockClear()
    TrackingCenterMock.trackHomepageConsulted.mockClear()
    if (wrapper) {
      wrapper.unmount()
    }
  })

  it('renders the component', () => {
    expect(wrapper.findComponent({ name: 'PResponsiveTable' }).exists()).toBe(true)
  })

  it('calls handleAddFavorite and tracks favorite request when favorite button is clicked', async () => {
    const btnFavorite = wrapper.find('[data-testid="wallet-remove-favorite"]')
    expect(btnFavorite.exists()).toBe(true)
    await btnFavorite.trigger('click')
    expect(handleFavorites).toHaveBeenCalled()
    expect(walletTrackingManagerMock.trackFavoriteRequest).toHaveBeenCalledExactlyOnceWith(true)
  })

  it('emits click-deploy when toolbox deploy action is triggered', async () => {
    const walletToolbox = wrapper.findComponent({ name: 'PToolbox' })
    expect(walletToolbox.exists()).toBe(true)
    walletToolbox.vm.$emit('p-toolbox-item-clicked', 'deploy')
    await nextTick()

    const { accountId, accountNumber, name } = mockTableData[0]
    expect(wrapper.emitted('click-deploy')).toStrictEqual([
      [accountId, accountNumber, name],
    ])
  })

  it('emits access when toolbox access action is triggered without Feature Consulted tracking', async () => {
    const walletToolbox = wrapper.findComponent({ name: 'PToolbox' })
    expect(walletToolbox.exists()).toBe(true)
    walletToolbox.vm.$emit('p-toolbox-item-clicked', 'access')
    await nextTick()

    const { accountId } = mockTableData[0]
    expect(wrapper.emitted('access')).toStrictEqual([[accountId]])
    expect(TrackingCenterMock.trackHomepageConsulted).not.toHaveBeenCalled()
    expect(walletTrackingManagerMock.trackFolderMenuAction).toHaveBeenCalledOnce()
  })

  it('emits access and tracks Feature Consulted when company name link is clicked', async () => {
    const accessLink = wrapper.find('[data-testid=account-access-link]')
    expect(accessLink.exists()).toBe(true)
    await accessLink.trigger('click')
    expect(wrapper.emitted('access')).toStrictEqual([[testEntity.accountId]])
    expect(TrackingCenterMock.trackHomepageConsulted).toHaveBeenCalledExactlyOnceWith(AmplitudeFeatureLocalisation.PORTEFEUILLE)
  })

  it('emits selectedFolder when checkbox is changed', async () => {
    const checkboxes = wrapper.findAllComponents({ name: 'PCheckbox' })
    expect(checkboxes.length).toBeGreaterThan(0)
    await checkboxes[0].trigger('change')
    await nextTick()

    expect(wrapper.emitted('selectedFolder')).toBeTruthy()
  })

  it('emits displayAccountRightsDrawer when manage rights action is triggered', async () => {
    wrapper = createWrapper(true)
    await flushPromises()

    const walletToolbox = wrapper.findComponent({ name: 'PToolbox' })
    expect(walletToolbox.exists()).toBe(true)
    walletToolbox.vm.$emit('p-toolbox-item-clicked', 'manageAccountRights')
    await nextTick()

    const { accountId, accountNumber, name } = mockTableData[0]
    expect(wrapper.emitted('displayAccountRightsDrawer')).toStrictEqual([
      [{ accountId, name, accountNumber }],
    ])
  })

  it('emits displayResendActivationEmailDrawer when resend email action is triggered', async () => {
    wrapper = createWrapper(true)
    await flushPromises()

    const walletToolbox = wrapper.findComponent({ name: 'PToolbox' })
    expect(walletToolbox.exists()).toBe(true)
    walletToolbox.vm.$emit('p-toolbox-item-clicked', 'retryMassActivationEmail')
    await nextTick()

    const { accountId, accountNumber, name } = mockTableData[0]
    expect(wrapper.emitted('displayResendActivationEmailDrawer')).toStrictEqual([
      [{ accountId, name, accountNumber }],
    ])
  })
})
