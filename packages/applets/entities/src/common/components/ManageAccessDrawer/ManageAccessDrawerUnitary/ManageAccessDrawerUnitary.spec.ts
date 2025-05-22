import { nextTick } from 'vue'
import { shallowMount } from '@vue/test-utils'
import type { ManageAccessDrawerUnitaryProps } from './ManageAccessDrawerUnitary.types'
import { getAccountOperationsListMock } from '@entities/__mocks__/operations.mocks'
import { TrackingLocalisation } from '@entities/pages/folder/enums/tracking.enums'
import { getMockedEntity } from '@pulse/common/mocks'

import ManageAccessDrawerUnitary from '.'

// Mocks
const trackingLocalisationMock = TrackingLocalisation.WALLET
const currentEntityMock = getMockedEntity({
  accountId: 1,
  legalName: 'Entity Test',
  accountNumber: 'IBS544G45F345F',
  color: 'orange',
})

const accountOperationsListMock = getAccountOperationsListMock()
const defaultProps: ManageAccessDrawerUnitaryProps = {
  modelValue: true,
  trackingLocalisation: trackingLocalisationMock,
  currentEntity: currentEntityMock,
  accountOperationsList: accountOperationsListMock,
}

const createWrapper = (overrideProps: Partial<ManageAccessDrawerUnitaryProps> = {}) => {
  const props = {
    ...defaultProps,
    ...overrideProps,
  }

  return shallowMount(ManageAccessDrawerUnitary, {
    props,
    global: {
      stubs: {
        PDrawer: {
          name: 'PDrawer',
          template: '<div><slot /><slot name="footer" /></div>',
          events: ['close-drawer-button'],
        },
      },
    },
  })
}

describe('manageAccessDrawer Component - Drawer containing a table of pending operations', () => {
  let wrapper: ReturnType<typeof createWrapper>
  beforeEach(async () => {
    wrapper = createWrapper()
  })

  describe('display', () => {
    it('should display the drawer header with account information and the pending operations table correctly', async () => {
      const userCard = wrapper.findComponent({ name: 'PUserCard' })

      const expectedUserCardProps = {
        pTitle: currentEntityMock.legalName,
        pSubtitle: currentEntityMock.accountNumber,
      }
      expect(userCard.props()).toMatchObject(expectedUserCardProps)

      await expect(wrapper.html()).toMatchFileSnapshot('__snap__/manageAccessDrawerUnitary.html')
    })
  })

  describe('events', () => {
    it("should emit 'update:modelValue' event when the drawer is closed", async () => {
      const pDrawer = wrapper.findComponent({ name: 'PDrawer' })
      pDrawer.vm.$emit('update:modelValue', false)
      await nextTick()

      expect(wrapper.emitted('update:modelValue')).toStrictEqual([[false]])
    })
    it("should emit 'update-operation-table' event when received event from PendingOperations", async () => {
      const pendingOperations = wrapper.findComponent({ name: 'PendingOperations' })
      pendingOperations.vm.$emit('update-operation-table')
      await nextTick()

      expect(wrapper.emitted('update-operation-table')).toBeTruthy()
    })
    it('should close manage access drawer when clicking on close buton', async () => {
      const manageAccessDrawer = wrapper.findComponent({ name: 'PDrawer' })
      manageAccessDrawer.vm.$emit('close-drawer-button')
      await nextTick()

      expect(wrapper.emitted('update:modelValue')).toStrictEqual([[false]])
    })
  })

  describe('when noOperation', () => {
    beforeEach(() => {
      wrapper = createWrapper({
        accountOperationsList: [],
      })
    })

    it('should display properly the noOperation component', () => {
      const noOperation = wrapper.findComponent({ name: 'NoOperation' })
      const pendingOperations = wrapper.findComponent({ name: 'PendingOperations' })

      expect(noOperation.exists()).toBe(true)
      expect(pendingOperations.exists()).toBe(false)
    })
  })
})
