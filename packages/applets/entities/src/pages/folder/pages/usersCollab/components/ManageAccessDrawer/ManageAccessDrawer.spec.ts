import { nextTick } from 'vue'
import { createTestingPinia } from '@pinia/testing'
import { expect, beforeEach, describe, it } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { commonStore } from '@pulse/common'
import type { ComponentWrapper } from '@entities/common/types'
import { setActivePinia } from 'pinia'
import ManageAccessDrawer from '.'

// Mocks
const mockedAccount = {
  accountId: 1,
  legalName: 'Entity Test',
  accountNumber: 'IBS544G45F345F',
  color: 'orange',
}

const createWrapper = () => {
  return mount(ManageAccessDrawer, {
    props: {
      modelValue: true,
    },
  })
}

describe('manageAccessDrawer Component - Drawer containing a table of pending operations', () => {
  let wrapper: ComponentWrapper<InstanceType<typeof ManageAccessDrawer>>
  beforeEach(async () => {
    setActivePinia(createTestingPinia())
    wrapper = createWrapper()
    await flushPromises()
  })
  describe('display', () => {
    it('should display the drawer header with account information and the pending operations table correctly', () => {
      const userCard = wrapper.findComponent({ name: 'PUserCard' })
      const pendingOperationsTable = wrapper.findComponent({
        name: 'PendingOperationsTable',
      })

      const expectedUserCardProps = {
        pTitle: mockedAccount.legalName,
        pSubtitle: mockedAccount.accountNumber,
      }

      expect(pendingOperationsTable.exists()).toBeTruthy()
      expect(userCard.props()).toMatchObject(expectedUserCardProps)
    })
    it('should not display the user card component if defaultEntity is empty', async () => {
      await flushPromises()
      const store = commonStore()
      // We should implement the pinia store correctly to avoid this @ts-expect-error
      // @ts-expect-error: Getter is read only
      store.defaultEntity = {}
      await flushPromises()
      const userCard = wrapper.findComponent({ name: 'PUserCard' })

      expect(userCard.exists()).toBeFalsy()
    })
  })
  describe('events', () => {
    it("should emit 'update:modelValue' event when the drawer is closed", async () => {
      const pDrawer = wrapper.findComponent({ name: 'PDrawer' })
      pDrawer.vm.$emit('update:model-value', false)
      await nextTick()

      expect(wrapper.emitted('update:modelValue')).toStrictEqual([[false]])
    })
    it("should emit 'update-operation-table' event when recevied event from PendingOperationsTable", async () => {
      const pendingOperationsTable = wrapper.findComponent({
        name: 'PendingOperationsTable',
      })
      pendingOperationsTable.vm.$emit('update-operation-table')
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
})
