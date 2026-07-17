import { nextTick } from 'vue'
import { shallowMount } from '@vue/test-utils'
import type { AccountFiltersDrawerProps } from './account-filters-drawer.types'
import { useUserStore } from '@pulse/common/stores'

import AccountFiltersDrawer from './AccountFiltersDrawer.vue'
import type { AccountFilters } from '@entities/types'
import { getStoreMock } from '@pulse/common/mocks/vitest'
import { MISSION_TYPE } from '@entities/constants'
import { EntityStatus } from '@entities/modules/wallet/enums'
import { LastActivityPeriodInDays } from '@entities/enums'

const userStoreMock = getStoreMock(useUserStore)

const stubs = {
  PDrawer: {
    name: 'PDrawer',
    template: '<div><slot /> <slot name="footer" /></div>',
    props: ['modelValue', 'pSize', 'pTitle', 'destroyOnClose'],
    emits: ['update:modelValue', 'close', 'open', 'close-drawer-button'],
  },
  PForm: { name: 'PForm', template: '<form><slot /></form>', props: ['pModel', 'pLabelPosition'] },
  PFormItem: { name: 'PFormItem', template: '<div><slot /></div>', props: ['pLabel'] },
  PFilterOption: {
    name: 'PFilterOption',
    template: '<button></button>',
    props: ['pContent', 'pColor', 'pIconName', 'pSelected'],
    emits: ['update:p-selected'],
  },
  PDrawerActions: {
    name: 'PDrawerActions',
    template: '<div></div>',
    props: ['pBackCTA', 'pPrimaryCTA'],
    emits: ['click-back-cta', 'click-primary-cta'],
  },
}

function createWrapper(props: Partial<AccountFiltersDrawerProps> = {}) {
  userStoreMock.isCollab = true
  const defaultProps: AccountFiltersDrawerProps = {
    modelValue: true,
    hasActiveFilters: false,
    accountFilters: {
      isFavoriteFilter: false,
      isCustomerRelationFilter: false,
      missionTypeFilter: undefined,
      deploymentStatusFilter: undefined,
    },
  }

  return shallowMount(AccountFiltersDrawer, {
    props: { ...defaultProps, ...props },
    global: { stubs },
  })
}

function findFilterOptionByTestId(wrapper: ReturnType<typeof createWrapper>, testId: string) {
  return wrapper.findAllComponents({ name: 'PFilterOption' })
    .find(c => c.attributes('data-testid') === testId)
}

describe('AccountFiltersDrawer.vue', () => {
  it('reflects prop filters as selected checkboxes when the drawer opens', async () => {
    const filters: AccountFilters = {
      isFavoriteFilter: true,
      isCustomerRelationFilter: false,
      missionTypeFilter: [MISSION_TYPE.TENUE],
      deploymentStatusFilter: ['3', '2'],
    }
    const wrapper = createWrapper({ accountFilters: filters })

    wrapper.findComponent({ name: 'PDrawer' }).vm.$emit('open')
    await nextTick()

    expect(findFilterOptionByTestId(wrapper, 'filter-Favorites')?.props('pSelected')).toBe(true)
    expect(findFilterOptionByTestId(wrapper, `filter-${MISSION_TYPE.TENUE}`)?.props('pSelected')).toBe(true)
    expect(findFilterOptionByTestId(wrapper, `filter-${MISSION_TYPE.REVISION}`)?.props('pSelected')).toBe(false)
    expect(findFilterOptionByTestId(wrapper, `filter-${MISSION_TYPE.NOT_SPECIFIED}`)?.props('pSelected')).toBe(false)
  })

  it('emits "reset-filters" when reset is clicked', async () => {
    const filters: AccountFilters = {
      isFavoriteFilter: true,
      isCustomerRelationFilter: false,
      missionTypeFilter: undefined,
      deploymentStatusFilter: undefined,
    }

    const wrapper = createWrapper({ accountFilters: filters, hasActiveFilters: true })

    const drawerActions = wrapper.findComponent({ name: 'PDrawerActions' })
    expect(drawerActions.props('pBackCTA').pDisabled).toBe(false)

    await drawerActions.vm.$emit('click-back-cta')
    expect(wrapper.emitted('reset-filters')).toBeTruthy()
  })

  it('emits "apply-filters" with updated values when apply button is clicked', async () => {
    const wrapper = createWrapper()

    await findFilterOptionByTestId(wrapper, 'filter-Favorites')!.vm.$emit('update:p-selected', true)
    await findFilterOptionByTestId(wrapper, 'filter-CustomerRelationship')!.vm.$emit('update:p-selected', true)
    await findFilterOptionByTestId(wrapper, `filter-${MISSION_TYPE.TENUE}`)!.vm.$emit('update:p-selected', true)
    await findFilterOptionByTestId(wrapper, `filter-${MISSION_TYPE.NOT_SPECIFIED}`)!.vm.$emit('update:p-selected', true)
    await findFilterOptionByTestId(wrapper, `filter-${EntityStatus.TO_DEPLOY.toString()}`)!.vm.$emit('update:p-selected', true)

    const drawerActions = wrapper.findComponent({ name: 'PDrawerActions' })
    await drawerActions.vm.$emit('click-primary-cta')

    expect(wrapper.emitted('apply-filters')).toBeTruthy()
    expect(wrapper.emitted('apply-filters')![0][0]).toEqual({
      isFavoriteFilter: true,
      isCustomerRelationFilter: true,
      missionTypeFilter: [MISSION_TYPE.TENUE, MISSION_TYPE.NOT_SPECIFIED],
      deploymentStatusFilter: [EntityStatus.TO_DEPLOY.toString()],
    })
  })

  it('keeps only the latest selected last activity period', async () => {
    const wrapper = createWrapper()

    await findFilterOptionByTestId(wrapper, `filter-last-activity-period-${LastActivityPeriodInDays.LAST_TWO_WEEKS}`)!.vm.$emit('update:p-selected', true)
    await findFilterOptionByTestId(wrapper, `filter-last-activity-period-${LastActivityPeriodInDays.LAST_NINETY_DAYS}`)!.vm.$emit('update:p-selected', true)

    expect(findFilterOptionByTestId(wrapper, `filter-last-activity-period-${LastActivityPeriodInDays.LAST_TWO_WEEKS}`)?.props('pSelected')).toBe(false)
    expect(findFilterOptionByTestId(wrapper, `filter-last-activity-period-${LastActivityPeriodInDays.LAST_NINETY_DAYS}`)?.props('pSelected')).toBe(true)

    const drawerActions = wrapper.findComponent({ name: 'PDrawerActions' })
    await drawerActions.vm.$emit('click-primary-cta')

    expect(wrapper.emitted('apply-filters')![0][0]).toEqual({
      isFavoriteFilter: false,
      isCustomerRelationFilter: false,
      missionTypeFilter: undefined,
      deploymentStatusFilter: undefined,
      lastActivityPeriodFilter: LastActivityPeriodInDays.LAST_NINETY_DAYS,
    })
  })

  it('clears the last activity period when "all" is selected', async () => {
    const wrapper = createWrapper()

    await findFilterOptionByTestId(wrapper, `filter-last-activity-period-${LastActivityPeriodInDays.LAST_THIRTY_DAYS}`)!.vm.$emit('update:p-selected', true)
    expect(findFilterOptionByTestId(wrapper, 'filter-last-activity-period-all')?.props('pSelected')).toBe(false)

    await findFilterOptionByTestId(wrapper, 'filter-last-activity-period-all')!.vm.$emit('update:p-selected', true)

    expect(findFilterOptionByTestId(wrapper, 'filter-last-activity-period-all')?.props('pSelected')).toBe(true)
    expect(findFilterOptionByTestId(wrapper, `filter-last-activity-period-${LastActivityPeriodInDays.LAST_THIRTY_DAYS}`)?.props('pSelected')).toBe(false)
  })

  it('deselects all filter checkboxes on close when no active filters', async () => {
    const wrapper = createWrapper()

    await findFilterOptionByTestId(wrapper, 'filter-Favorites')!.vm.$emit('update:p-selected', true)

    wrapper.findComponent({ name: 'PDrawer' }).vm.$emit('close')
    await nextTick()

    // the last activity period "all" option is selected when no period filter is set
    const childFilterOptions = wrapper.findAllComponents({ name: 'PFilterOption' })
      .filter(c => c.attributes('data-testid') !== undefined
        && c.attributes('data-testid') !== 'filter-last-activity-period-all')
    childFilterOptions.forEach((option) => {
      expect(option.props('pSelected')).toBe(false)
    })
  })
})
