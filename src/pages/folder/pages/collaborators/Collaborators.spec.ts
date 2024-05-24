import { createTestingPinia } from '@pinia/testing'
import type { VueWrapper } from '@vue/test-utils'
import { flushPromises, mount } from '@vue/test-utils'
import { beforeEach, describe, it, expect, vi } from 'vitest'
import { defineStore } from 'pinia'
import { mockCollabsData } from './mockData'
import { mockedEntity } from '@/pages/wallet/components/TableData/mockData'
import * as walletServices from '@/services/wallet'
import Collaborators from '.'

vi.mock('@kpmg/common', () => ({
  commonStore: defineStore('common', {
    state: () => ({
      user: {},
    }),
    getters: {
      defaultEntity: () => mockedEntity,
    },
  }),
  userPermissions: () => ({
    hasPermission: () => true,
  }),
}))

vi.mock('@/services/account', () => ({
  deleteContactFromAccount: vi.fn(() => Promise.resolve()),
  fetchContactsFromSameHub: vi.fn(() => Promise.resolve([])),
}))

vi.mock('@/services/contact', () => ({
  getContactById: vi.fn(() => Promise.resolve({})),
}))

vi.mock('@/services/wallet', () => ({
  getCollaboratorsByIdEntity: vi.fn(() => Promise.resolve({
    items: mockCollabsData,
    currentPage: 1,
    totalPage: 1,
    totalItems: mockCollabsData.length,
  })),
}))

const pinia = createTestingPinia()

const createWrapper = (): VueWrapper =>
  mount(Collaborators, {
    attachTo: document.body,
    global: {
      plugins: [pinia],
      stubs: {
        AddCollaboratorsDrawer: {
          name: 'AddCollaboratorsDrawer',
          template: '<div />',
        },
      },
    },
  })

describe('collaborators', () => {
  let wrapper: VueWrapper
  const getAddCollaboratorDrawer = () => wrapper.findComponent({ name: 'AddCollaboratorsDrawer' })
  const getAddCollaboratorButton = () =>
    document.querySelector('[data-testid=add-collaborator-button]') as HTMLButtonElement
  const getToolboxAction = () => wrapper.findComponent('[data-testid=toolbox-action]') as VueWrapper

  beforeEach(async () => {
    const folderWrapperForBtn = document.createElement('div')
    folderWrapperForBtn.classList.add('folder__collab__teleported-content')
    document.body.appendChild(folderWrapperForBtn)

    wrapper = createWrapper()
    await flushPromises()
  })

  it('can display the add-collaborator drawer', async () => {
    expect(getAddCollaboratorDrawer().exists()).toBeFalsy()

    await getAddCollaboratorButton().click()

    expect(getAddCollaboratorDrawer().exists()).toBeTruthy()

    const getCollaboratorsSpy = vi.spyOn(
      walletServices,
      'getCollaboratorsByIdEntity',
    )

    getAddCollaboratorDrawer().vm.$emit('refresh-collaborators-list')
    await flushPromises()
    expect(getCollaboratorsSpy).toHaveBeenCalledOnce()
  })

  it('should display the table with the list of collaborator', () => {
    const rows = wrapper.findAll('tr.el-table__row')
    expect(rows).toHaveLength(mockCollabsData.length)
  })

  it('can display the detail of the collaborator', async () => {
    const getDrawerCollabDetails = () => wrapper.findComponent({ name: 'DrawerCollabDetails' })

    expect(getDrawerCollabDetails().exists()).toBeFalsy()

    await getToolboxAction().vm.$emit('p-toolbox-item-clicked', 'collaboratorInformation')
    await flushPromises()

    expect(getDrawerCollabDetails().exists()).toBeTruthy()
  })

  it('can delete a collaborator from an entity and see a success notification', async () => {
    const getNotificationSuccess = () => document.body.getElementsByClassName('el-notification success')
    expect(getNotificationSuccess()).toHaveLength(0)

    await getToolboxAction().vm.$emit('p-toolbox-item-clicked', 'removeCollaborator')
    await flushPromises()

    expect(getNotificationSuccess()).toHaveLength(1)
  })

  it('has a pagination', () => {
    const pages = wrapper.findAll('.el-pager li')
    const pagination = wrapper.findComponent({ name: 'PPagination' })
    const totalItems = wrapper.find('[data-testid=ppagination-pagination-counter]')

    expect(pages).toHaveLength(1)
    expect(pagination.exists()).toBeTruthy()
    expect(pagination.props('pCurrentPage')).toBe(1)
    expect(pagination.props('pPageSize')).toBe(15)
    expect(totalItems.text()).toContain(mockCollabsData.length)
  })
})
