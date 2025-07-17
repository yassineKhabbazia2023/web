import { flushPromises, shallowMount } from '@vue/test-utils'
import { nextTick } from 'vue'
import { mockCollabsData } from './collab-data.mocks'
import * as walletServices from '@entities/services/wallet'
import * as contactServices from '@entities/services/contact'
import type { ComponentWrapper } from '@entities/common/types'
import { CurrentUserManagerMock, getStoreMock } from '@pulse/common/mocks'
import { useUserStore } from '@pulse/common/stores'
import { RouteParam } from '@pulse/common/enums'

import Collaborators from '.'

const userStoreMock = getStoreMock(useUserStore)

const ENTITY_ID = 42

vi.mock('vue-router', () => ({
  useRoute: () => ({
    params: {
      [RouteParam.ENTITY_ID]: ENTITY_ID,
    },
  }),
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
  shallowMount(Collaborators, {
    attachTo: document.body,
    global: {
      stubs: {
        PToolbox: {
          name: 'PToolbox',
          template: '<div><slot /></div>',
        },
        PTooltip: {
          name: 'PTooltip',
          template: '<div><slot /></div>',
        },
        PTable: {
          name: 'PTable',
          template: '<div><slot /></div>',
          props: ['pData'],
        },
        PTableColumn: {
          name: 'PTableColumn',
          template: '<div><slot :row="row" /></div>',
          data() {
            const row = mockCollabsData[0]

            return {
              row,
            }
          },
        },
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

  beforeEach(async () => {
    userStoreMock.isCollab = true
    vi.spyOn(contactServices, 'getContactById').mockRejectedValue(
      expectedErrorMessage,
    )

    wrapper = createWrapper()
    await flushPromises()
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

  it("should emit an 'accessSwitched' event when the table changes", () => {
    const collaboratorsTable = wrapper.findComponent({ name: 'PTable' })
    collaboratorsTable.vm.$emit('current-change', mockCollabsData[0])

    expect(wrapper.emitted('accessSwitched')).toStrictEqual([
      [mockCollabsData[0]],
    ])
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
