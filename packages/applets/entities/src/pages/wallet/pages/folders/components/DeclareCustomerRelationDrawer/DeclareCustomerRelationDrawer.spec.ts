import { describe, it, expect, vi, beforeEach } from 'vitest'
import { shallowMount } from '@vue/test-utils'
import { getStoreMock, getMockedUserInfo } from '@pulse/common/mocks'
import { useUserStore } from '@pulse/common/stores'
import { displayNotification } from '@entities/common/utils'
import type { DeclareCustomerRelationDrawerProps } from './DeclareCustomerRelationDrawer.types'

import DeclareCustomerRelationDrawer from '.'
import { nextTick } from 'vue'

const userStoreMock = getStoreMock(useUserStore)
const userMock = getMockedUserInfo({ id: 1 })
const displayNotificationMock = vi.hoisted(() => vi.fn())
const updateCustomerRelationMock = vi.hoisted(() => vi.fn())

vi.mock('@entities/services/account', () => ({
  updateCustomerRelation: updateCustomerRelationMock,
}))

vi.mock('@entities/common/utils', () => ({
  displayNotification: displayNotificationMock,
}))

const defaultProps = {
  modelValue: true,
  isCustomerRelated: false,
  selectedAccount: {
    name: 'Acme Corp',
    accountNumber: '123456',
    accountId: 1,
  },
}

const createWrapper = (props?: DeclareCustomerRelationDrawerProps) => {
  return shallowMount(DeclareCustomerRelationDrawer, {
    props: { ...defaultProps, ...props },
    global: {
      stubs: {
        PDrawer: {
          name: 'PDrawer',
          template: '<div><slot/><slot name="footer"/></div>',
          props: ['modelValue'],
          events: ['close-drawer-button'],
        },
        DrawerActionButtons: {
          name: 'DrawerActionButtons',
          template: '<button></button>',
          props: ['submitDisabled'],
          events: ['submit-action'],
        },
      },
    },
  })
}

describe('DeclareCustomerRelationDrawer', () => {
  let wrapper: ReturnType<typeof createWrapper>
  beforeEach(() => {
    wrapper = createWrapper()
    userStoreMock.user = userMock
  })

  it('should render correctly with props', () => {
    expect(wrapper.find('[data-testid="declare-customer-relation-entity-card"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="declare-customer-relation-switch"]').exists()).toBe(true)
  })

  it('should emit close event when handleCloseDrawer is triggered', async () => {
    const declareCustomerRelationDrawer = wrapper.findComponent({ name: 'PDrawer' })
    declareCustomerRelationDrawer.vm.$emit('close-drawer-button')

    await nextTick()

    expect(declareCustomerRelationDrawer.props('modelValue')).toBe(false)
  })

  it('should call updateCustomerRelation and emit event on successful submit', async () => {
    const drawerActions = wrapper.findComponent({ name: 'DrawerActionButtons' })
    drawerActions.vm.$emit('submit-action')

    await nextTick()

    expect(updateCustomerRelationMock).toHaveBeenCalledOnce()
    expect(updateCustomerRelationMock).toHaveBeenCalledWith(defaultProps.selectedAccount.accountId, userMock.id, false)
    expect(displayNotification).toHaveBeenCalledWith('success', expect.any(String))
    expect(wrapper.emitted('update-account-table')).toBeTruthy()
  })

  it('should display error notification on failed update', async () => {
    updateCustomerRelationMock.mockRejectedValue(new Error('Error API'))
    const drawerActions = wrapper.findComponent({ name: 'DrawerActionButtons' })
    drawerActions.vm.$emit('submit-action')

    await nextTick()

    expect(displayNotification).toHaveBeenCalledWith('error', expect.any(String))
  })

  it('should disable submit button if status did not change', async () => {
    const drawerActions = wrapper.findComponent({ name: 'DrawerActionButtons' })
    await nextTick()

    expect(drawerActions.props('submitDisabled')).toBe(true)
  })
})
