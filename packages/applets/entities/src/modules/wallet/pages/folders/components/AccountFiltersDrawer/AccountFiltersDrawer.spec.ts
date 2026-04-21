import { nextTick } from 'vue'
import { shallowMount } from '@vue/test-utils'
import type { AccountFiltersDrawerProps } from './account-filters-drawer.types'
import { useUserStore } from '@pulse/common/stores'

import AccountFiltersDrawer from './AccountFiltersDrawer.vue'
import { AccountFilters } from '@entities/types'
import { getStoreMock } from '@pulse/common/mocks/vitest'

const loggerErrorSpy = vi.hoisted(() => vi.fn())
const userStoreMock = getStoreMock(useUserStore)

vi.mock('@pulse/toolbox', () => ({
  logger: {
    error: loggerErrorSpy,
  },
}))

const stubs = {
  PDrawer: {
    name: 'PDrawer',
    template: '<div><slot /> <slot name="footer" /></div>',
    props: ['modelValue', 'pSize', 'pTitle', 'destroyOnClose'],
    emits: ['update:modelValue', 'close', 'open', 'close-drawer-button'],
  },
  PForm: { name: 'PForm', template: '<form><slot /></form>', props: ['pModel', 'pLabelPosition'] },
  PFormItem: { name: 'PFormItem', template: '<div><slot /></div>', props: ['pLabel'] },
  PSwitch: {
    name: 'PSwitch',
    template: '<div></div>',
    props: ['modelValue', 'pActiveText', 'pActiveColor'],
    emits: ['update:modelValue'],
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
    },
  }

  return shallowMount(AccountFiltersDrawer, {
    props: { ...defaultProps, ...props },
    global: { stubs },
  })
}

describe('AccountFiltersDrawer.vue', () => {
  it('initializes internal filters when the drawer opens', async () => {
    const filters: AccountFilters = {
      isFavoriteFilter: true,
      isCustomerRelationFilter: false,
    }
    const wrapper = createWrapper({ accountFilters: filters })

    wrapper.findComponent({ name: 'PDrawer' }).vm.$emit('open')
    await nextTick()

    const switches = wrapper.findAllComponents({ name: 'PSwitch' })
    const isFavoriteFilterSwitch = switches[0]
    const isCustomerRelationFilterSwitch = switches[1]

    expect(isFavoriteFilterSwitch.props('modelValue')).toBe(true)
    expect(isCustomerRelationFilterSwitch.props('modelValue')).toBe(false)
  })

  it('emits "reset-filters" when reset is clicked', async () => {
    const filters: AccountFilters = {
      isFavoriteFilter: true,
      isCustomerRelationFilter: false,
    }

    const wrapper = createWrapper({ accountFilters: filters, hasActiveFilters: true })

    const drawerActions = wrapper.findComponent({ name: 'PDrawerActions' })
    expect(drawerActions.props('pBackCTA').pDisabled).toBe(false)

    await drawerActions.vm.$emit('click-back-cta')
    expect(wrapper.emitted('reset-filters')).toBeTruthy()
  })

  it('emits "apply-filters" with updated values when apply button is clicked', async () => {
    const wrapper = createWrapper()

    const switches = wrapper.findAllComponents({ name: 'PSwitch' })
    const isFavoriteFilterSwitch = switches[0]
    const isCustomerRelationFilterSwitch = switches[1]

    await isFavoriteFilterSwitch.vm.$emit('update:modelValue', true)
    await isCustomerRelationFilterSwitch.vm.$emit('update:modelValue', true)

    const drawerActions = wrapper.findComponent({ name: 'PDrawerActions' })
    await drawerActions.vm.$emit('click-primary-cta')

    expect(wrapper.emitted('apply-filters')).toBeTruthy()
    expect(wrapper.emitted('apply-filters')![0][0]).toEqual({
      isFavoriteFilter: true,
      isCustomerRelationFilter: true,
    })
  })

  it('resets filters on close when no active filters', async () => {
    const wrapper = createWrapper()

    wrapper.findComponent({ name: 'PDrawer' }).vm.$emit('close')
    await nextTick()

    const switches = wrapper.findAllComponents({ name: 'PSwitch' })
    const isFavoriteFilterSwitch = switches[0]
    const isCustomerRelationFilterSwitch = switches[1]

    expect(isFavoriteFilterSwitch.props('modelValue')).toBe(false)
    expect(isCustomerRelationFilterSwitch.props('modelValue')).toBe(false)
  })
})
