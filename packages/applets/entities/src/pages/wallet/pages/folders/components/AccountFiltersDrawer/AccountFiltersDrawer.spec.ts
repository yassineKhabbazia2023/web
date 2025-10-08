import { nextTick } from 'vue'
import { shallowMount } from '@vue/test-utils'
import type { AccountFiltersDrawerProps } from './account-filters-drawer.types'

import AccountFiltersDrawer from './AccountFiltersDrawer.vue'
import { AccountFilters } from '@entities/common/types'

const loggerErrorSpy = vi.hoisted(() => vi.fn())

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
  PButton: {
    name: 'PButton',
    template: '<button><slot /></button>',
    props: ['pType', 'pPlain', 'pDisabled'],
  },
}

function createWrapper(props: Partial<AccountFiltersDrawerProps> = {}) {
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

  it('emits "reset-filters" and disables reset button if no active filters', async () => {
    const filters: AccountFilters = {
      isFavoriteFilter: true,
      isCustomerRelationFilter: false,
    }

    const wrapper = createWrapper({ accountFilters: filters, hasActiveFilters: true })

    const resetBtn = wrapper.findComponent({ name: 'PButton' })
    expect(resetBtn.props('pDisabled')).toBe(false)

    await resetBtn.trigger('click')
    expect(wrapper.emitted('reset-filters')).toBeTruthy()
  })

  it('emits "apply-filters" with updated values when apply button is clicked', async () => {
    const wrapper = createWrapper()

    const switches = wrapper.findAllComponents({ name: 'PSwitch' })
    const isFavoriteFilterSwitch = switches[0]
    const isCustomerRelationFilterSwitch = switches[1]

    await isFavoriteFilterSwitch.vm.$emit('update:modelValue', true)
    await isCustomerRelationFilterSwitch.vm.$emit('update:modelValue', true)

    const applyBtn = wrapper.find('[data-testid="account-filters-drawer__apply-button"]')
    await applyBtn.trigger('click')

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
