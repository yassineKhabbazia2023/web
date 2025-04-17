import { flushPromises, mount, type VueWrapper } from '@vue/test-utils'
import { beforeEach, describe, it, expect, vi } from 'vitest'
import { loggerErrorSpy, loggerMock } from '@pulse/core/mocks'
import { nextTick } from 'vue'
import { mockCollabsData } from './mockData'
import * as walletServices from '@entities/services/wallet'
import * as contactServices from '@entities/services/contact'
import type { ComponentWrapper } from '@entities/common/types'
import { CurrentUserManagerMock, getStoreMock } from '@pulse/common/mocks'
import { useUserStore } from '@pulse/common/stores'

import Collaborators from '.'

const userStoreMock = getStoreMock(useUserStore)

const ENTITY_ID = 42
vi.mock('@pulse/core', () => ({ logger: loggerMock }))

vi.mock('vue-router', () => ({
  useRoute: () => ({
    params: {
      id: ENTITY_ID,
    },
  }),
}))

vi.mock('@pulse/common', () => ({
  debounce: (callback: Function) => callback,
}))

vi.mock('@pulse/common/managers', () => ({
  CurrentUserManager: CurrentUserManagerMock,
}))

vi.mock('@entities/services/account', () => ({
  deleteContactFromAccount: vi.fn(() => Promise.resolve()),
  fetchContactsFromSameHub: vi.fn(() => Promise.resolve([])),
}))

vi.mock('@entities/services/contact', () => ({
  getContactById: vi.fn(() => Promise.resolve({})),
}))

vi.mock('@entities/services/wallet', () => ({
  getCollaboratorsByIdEntity: vi.fn(() =>
    Promise.resolve({
      items: mockCollabsData,
      currentPage: 1,
      totalPage: 1,
      totalItems: mockCollabsData.length,
    }),
  ),
}))

const createWrapper = (): ComponentWrapper<
  InstanceType<typeof Collaborators>
> =>
  mount(Collaborators, {
    attachTo: document.body,
    global: {
      stubs: {
        AddCollaboratorsDrawer: true,
        CollabDetailsDrawer: true,
        FormSearch: true,
        PButton: true,
        PIcon: true,
        PLoader: true,
        PAvatar: true,
        PToolbox: true,
        NoResult: true,
      },
    },
  })

describe('collaborators', () => {
  let wrapper: ReturnType<typeof createWrapper>
  const expectedErrorMessage = 'API Error: 503 Service Unavailable'

  const getAddCollaboratorDrawer = () =>
    wrapper.findComponent({ name: 'AddCollaboratorsDrawer' })
  const getAddCollaboratorButton = () =>
    document.querySelector(
      '[data-testid=add-collaborator-button]',
    ) as HTMLButtonElement
  const getToolboxAction = () =>
    wrapper.findComponent('[data-testid=toolbox-action]') as VueWrapper

  beforeEach(() => {
    userStoreMock.isCollab = true
    vi.spyOn(contactServices, 'getContactById').mockRejectedValue(
      expectedErrorMessage,
    )

    wrapper = createWrapper()
  })

  it('can display the add-collaborator drawer', async () => {
    expect(getAddCollaboratorDrawer().exists()).toBeFalsy()

    await getAddCollaboratorButton().click()

    expect(getAddCollaboratorDrawer().exists()).toBeTruthy()
    expect(getAddCollaboratorDrawer().props('entityId')).toBe(ENTITY_ID)

    const getCollaboratorsSpy = vi.spyOn(
      walletServices,
      'getCollaboratorsByIdEntity',
    )

    getAddCollaboratorDrawer().vm.$emit('refresh-collaborators-list')
    await flushPromises()
    expect(getCollaboratorsSpy).toHaveBeenCalledOnce()
  })

  it('should display a console error if the request to fetch collaborators for a specific entity fails', async () => {
    vi.spyOn(walletServices, 'getCollaboratorsByIdEntity').mockRejectedValue(
      expectedErrorMessage,
    )
    wrapper = createWrapper()
    await flushPromises()

    expect(loggerErrorSpy).toHaveBeenCalledOnce()
    expect(loggerErrorSpy).toHaveBeenCalledWith(expectedErrorMessage)
  })

  it('should display the table with the list of collaborator', () => {
    const rows = wrapper.findAll('tr.el-table__row')
    expect(rows).toHaveLength(mockCollabsData.length)
  })

  it("should emit an 'accessSwitched' event when the table changes", () => {
    const collaboratorsTable = wrapper.findComponent({ name: 'PTable' })
    collaboratorsTable.vm.$emit('current-change', mockCollabsData[0])

    expect(wrapper.emitted('accessSwitched')).toStrictEqual([
      [mockCollabsData[0]],
    ])
  })

  it('can display the detail of the collaborator', async () => {
    const getCollabDetailsDrawer = () =>
      wrapper.findComponent({ name: 'CollabDetailsDrawer' })

    expect(getCollabDetailsDrawer().exists()).toBeFalsy()

    getToolboxAction().vm.$emit(
      'p-toolbox-item-clicked',
      'collaboratorInformation',
    )
    await flushPromises()

    expect(getCollabDetailsDrawer().exists()).toBeTruthy()
    expect(loggerErrorSpy).toHaveBeenCalledOnce()
    expect(loggerErrorSpy).toHaveBeenCalledWith(expectedErrorMessage)
  })

  it("should display a console error if the request to fetch the contact's phone number fails", async () => {
    getToolboxAction().vm.$emit(
      'p-toolbox-item-clicked',
      'collaboratorInformation',
    )
    await flushPromises()

    expect(loggerErrorSpy).toHaveBeenCalledOnce()
    expect(loggerErrorSpy).toHaveBeenCalledWith(expectedErrorMessage)
  })

  it('can delete a collaborator from an entity and see a success notification', async () => {
    const getNotificationSuccess = () =>
      document.body.getElementsByClassName('el-notification success')
    expect(getNotificationSuccess()).toHaveLength(0)

    getToolboxAction().vm.$emit(
      'p-toolbox-item-clicked',
      'removeCollaborator',
    )
    await flushPromises()

    expect(getNotificationSuccess()).toHaveLength(1)
  })

  it('has a pagination', () => {
    const pages = wrapper.findAll('.el-pager li')
    const pagination = wrapper.findComponent({ name: 'PPagination' })
    const totalItems = wrapper.find(
      '[data-testid=ppagination-pagination-counter]',
    )

    expect(pages).toHaveLength(1)
    expect(pagination.exists()).toBeTruthy()
    expect(pagination.props('pCurrentPage')).toBe(1)
    expect(pagination.props('pPageSize')).toBe(15)
    expect(totalItems.text()).toContain(mockCollabsData.length)
  })

  it('should not display actions when is NOT Collab', async () => {
    userStoreMock.isCollab = false
    await nextTick()

    const collaboratorsAction = wrapper.find(
      '[data-testid="collaborators-action"]',
    )

    const addCollaboratorButton = getAddCollaboratorButton()

    expect(collaboratorsAction.exists()).toBeFalsy()
    expect(addCollaboratorButton).toBeFalsy()
  })
})
