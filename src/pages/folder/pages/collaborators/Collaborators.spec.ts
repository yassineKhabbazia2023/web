import { createTestingPinia } from '@pinia/testing'
import type { VueWrapper } from '@vue/test-utils'
import { flushPromises, mount } from '@vue/test-utils'
import { beforeEach, describe, it, expect, vi } from 'vitest'
import { defineStore } from 'pinia'
import { mockCollabsData } from './mockData'
import { mockedEntity } from '@/pages/wallet/components/TableData/mockData'
import type { Collab } from './types'
import Collaborators from '.'
import AddCollaboratorDrawer from './sections/AddCollaboratorDrawer'
import * as walletServices from '@/services/wallet'

vi.mock('@kpmg/common', () => ({
  commonStore: defineStore('common', {
    state: () => ({
      user: {},
    }),
    getters: {
      defaultEntity: () => mockedEntity,
    },
  }),
}))

vi.mock('@/services/wallet', () => ({
  getCollaboratorsByIdEntity: vi.fn(() => {
    return mockCollabsData
  }),
}))

const pinia = createTestingPinia()

const createWrapper = (): VueWrapper =>
  mount(Collaborators, {
    attachTo: document.body,
    global: {
      plugins: [pinia],
      stubs: ['AddCollaboratorsDrawer'],
    },
  })

describe('collaborators', () => {
  let wrapper: VueWrapper

  beforeEach(() => {
    wrapper = createWrapper()
  })

  it('should call add-collaborator event when click on add collaborator button', async () => {
    const addCollabButton = wrapper.find('[data-testid=add-collaborator-button]')
    await addCollabButton.trigger('click')

    const addCollaboratorDrawerWrapper = wrapper.findComponent(AddCollaboratorDrawer)
    expect(addCollaboratorDrawerWrapper.isVisible).toBeTruthy()
  })

  it('should refresh list on collaborators add', async () => {
    const addCollabButton = wrapper.find('[data-testid=add-collaborator-button]')
    await addCollabButton.trigger('click')

    const getCollaboratorsSpy = vi.spyOn(
      walletServices,
      'getCollaboratorsByIdEntity',
    )

    const addCollaboratorDrawerWrapper = wrapper.findComponent(AddCollaboratorDrawer)
    addCollaboratorDrawerWrapper.vm.$emit('refresh-collaborators-list')
    await flushPromises()
    expect(getCollaboratorsSpy).toHaveBeenCalledOnce()
  })

  it('should display the table with the list of collaborator', () => {
    const rows = wrapper.findAll('tr.el-table__row')
    expect(rows).toHaveLength(mockCollabsData.length)
  })

  it('should call the event accessSwitched with the correct params and the access value should be false', async () => {
    const firstRow = wrapper.findAll('tr.el-table__row')[0]
    const switchComponent = firstRow.find('[data-testid=switch]')
    const expectedCollab = mockCollabsData[0]
    expectedCollab.hasAccess = true
    await switchComponent.trigger('click')
    const v = wrapper.emitted('accessSwitched')?.at(0)?.at(0) as Collab
    expect(v.globalContactId).toBe(expectedCollab.globalContactId)
  })
})
