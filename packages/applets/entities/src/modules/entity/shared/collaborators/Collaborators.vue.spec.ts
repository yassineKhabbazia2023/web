import { flushPromises, shallowMount } from '@vue/test-utils'
import { nextTick } from 'vue'
import { mockCollabsData } from '@entities/__mocks__/collab-data.mocks'
import type { ComponentWrapper } from '@pulse/toolbox/utils/test'
import { getStoreMock } from '@pulse/common/mocks/vitest'
import { armCurrentUserPermissions } from '@pulse/common/mocks/vitest/current-user.permissions.helper'
import { useUserStore } from '@pulse/common/stores'
import { RouteParam } from '@pulse/common/enums'
import { useRoute } from 'vue-router'
import type { RouteLocationNormalizedLoaded } from 'vue-router'
import { getCollaboratorsByIdEntity } from '@entities/services/collaborator'
import { getContactById } from '@entities/services/contact'
import type { Contact } from '@entities/services/contact/contactTypes'

import Collaborators from './Collaborators.vue'

const userStoreMock = getStoreMock(useUserStore)

const ENTITY_ID = 42

beforeEach(() => {
  armCurrentUserPermissions(false)
  vi.mocked(useRoute).mockReturnValue({
    params: {
      [RouteParam.ENTITY_ID]: ENTITY_ID,
    },
  } as unknown as RouteLocationNormalizedLoaded)
  vi.mocked(getContactById).mockResolvedValue({} as Contact)
  vi.mocked(getCollaboratorsByIdEntity).mockResolvedValue({
    items: mockCollabsData,
    currentPage: 1,
    totalPage: 1,
    totalItems: mockCollabsData.length,
  })
})

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

  const getAddCollaboratorDrawer = () =>
    wrapper.findComponent({ name: 'AddCollaboratorsDrawer' })
  const getAddCollaboratorButton = () =>
    document.querySelector(
      '[data-testid=add-collaborator-button]',
    ) as HTMLButtonElement

  beforeEach(async () => {
    userStoreMock.isCollab = true

    wrapper = createWrapper()
    await flushPromises()
  })

  it('can display the add-collaborator drawer', async () => {
    expect(getAddCollaboratorDrawer().exists()).toBe(false)

    await getAddCollaboratorButton().click()

    expect(getAddCollaboratorDrawer().exists()).toBe(true)
    expect(getAddCollaboratorDrawer().props('entityId')).toBe(ENTITY_ID)

    // Clear previous calls (from component mount in beforeEach)
    vi.mocked(getCollaboratorsByIdEntity).mockClear()

    getAddCollaboratorDrawer().vm.$emit('refresh-collaborators-list')
    await flushPromises()
    expect(vi.mocked(getCollaboratorsByIdEntity)).toHaveBeenCalledOnce()
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

    expect(collaboratorsAction.exists()).toBe(false)
    expect(addCollaboratorButton).toBeNull()
  })
})
