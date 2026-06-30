import { describe, it, expect, vi, beforeEach } from 'vitest'
import { flushPromises, shallowMount } from '@vue/test-utils'
import * as styleguide from '@pulse/styleguide'
import type { DeclareCustomerRelationDrawerProps } from './DeclareCustomerRelationDrawer.types'

import DeclareCustomerRelationDrawer from '.'
import { nextTick } from 'vue'

const updateCustomerRelationMock = vi.hoisted(() => vi.fn())

vi.mock('@entities/services/account', () => ({
  updateCustomerRelation: updateCustomerRelationMock,
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
        PDrawerActions: {
          name: 'PDrawerActions',
          template: '<button></button>',
          props: ['pBackCTA', 'pPrimaryCTA'],
          emits: ['click-back-cta', 'click-primary-cta'],
        },
      },
    },
  })
}

describe('DeclareCustomerRelationDrawer', () => {
  let wrapper: ReturnType<typeof createWrapper>
  beforeEach(() => {
    wrapper = createWrapper()
    updateCustomerRelationMock.mockResolvedValue({
      succeeded: [{ accountId: defaultProps.selectedAccount.accountId }],
      failed: [],
    })
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
    const displayNotificationMock = vi.spyOn(styleguide, 'displayNotification').mockImplementation(() => { })
    const drawerActions = wrapper.findComponent({ name: 'PDrawerActions' })
    drawerActions.vm.$emit('click-primary-cta')

    await flushPromises()

    expect(updateCustomerRelationMock).toHaveBeenCalledExactlyOnceWith([defaultProps.selectedAccount.accountId], false)
    expect(displayNotificationMock).toHaveBeenCalledWith('success', expect.any(String))
    expect(wrapper.emitted('update-account-table')).toBeTruthy()
  })

  it('should display error notification on failed update', async () => {
    const displayNotificationMock = vi.spyOn(styleguide, 'displayNotification').mockImplementation(() => { })
    updateCustomerRelationMock.mockRejectedValue(new Error('Error API'))
    const drawerActions = wrapper.findComponent({ name: 'PDrawerActions' })
    drawerActions.vm.$emit('click-primary-cta')

    await flushPromises()

    expect(displayNotificationMock).toHaveBeenCalledWith('error', expect.any(String))
  })

  it('should display error notification when the account update fails in the response', async () => {
    const displayNotificationMock = vi.spyOn(styleguide, 'displayNotification').mockImplementation(() => { })
    updateCustomerRelationMock.mockResolvedValueOnce({
      succeeded: [],
      failed: [{
        accountId: defaultProps.selectedAccount.accountId,
        errorCode: 'ACC004',
        errorMessage: 'The contact has no role on the account',
      }],
    })
    const drawerActions = wrapper.findComponent({ name: 'PDrawerActions' })
    drawerActions.vm.$emit('click-primary-cta')

    await flushPromises()

    expect(displayNotificationMock).toHaveBeenCalledWith('error', expect.any(String))
    expect(wrapper.emitted('update-account-table')).toBeUndefined()
  })

  it('should disable submit button if status did not change', async () => {
    const drawerActions = wrapper.findComponent({ name: 'PDrawerActions' })
    await nextTick()

    expect(drawerActions.props('pPrimaryCTA').pDisabled).toBe(true)
  })
})
