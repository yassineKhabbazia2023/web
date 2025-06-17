import { beforeEach, describe, expect, it, vi } from 'vitest'
import '@entities/__mocks__/common.import.mocks'
import { mockedPermissionCodes, mockUpdateUserPermission } from '@entities/__mocks__/permissions.mocks'
import { loggerErrorSpy, loggerMock } from '@pulse/core/mocks'
import { authorizationServiceMock } from '@entities/__mocks__/authorization.service.mocks'
import { mockedAccountId } from '@entities/__mocks__/account.mocks'
import { walletServiceMock } from '@entities/__mocks__/wallet.service.mocks'
import { rightDrawerUtilsMocks } from '@entities/__mocks__/utils.mocks'
import { mockedCollaboratorsList1 } from '@entities/__mocks__/collaborators.mocks'
import { getMockedCollabRoles } from '@entities/__mocks__/collab-roles.mocks'
import { flushPromises, mount, type VueWrapper } from '@vue/test-utils'
import { nextTick } from 'vue'
import * as walletServices from '@entities/services/wallet'
import type { CollabRightsDrawerProps } from './CollabRightsDrawerTypes'
import CollabRightsDrawer from '.'

// Mocks
const mockedCollabRoles = getMockedCollabRoles()
const { firstName, lastName } = mockedCollaboratorsList1.data.items[0]
const rowData = {
  ...mockedCollaboratorsList1.data.items[0],
  fullName: `${firstName} ${lastName}`,
  initials: `${firstName[0].toUpperCase()}${lastName[0].toUpperCase()}`,
}
const mockedSelectedRoleId = mockedCollabRoles.find(
  (r) => r.name === rowData.role,
)?.id

vi.mock('@entities/services/authorization', () => authorizationServiceMock)
vi.mock('@pulse/core', () => ({ logger: loggerMock }))
vi.mock('@entities/services/wallet', () => walletServiceMock)
vi.mock('@entities/common/components/ManageRightsDrawer/utils', () => rightDrawerUtilsMocks)

vi.mock('vue-router', () => ({
  useRoute: () => ({
    params: {
      id: mockedAccountId,
    },
  }),
  useRouter: () => ({
    go: vi.fn(),
  }),
}))

const defaultProps = {
  rowData,
  hasDrawerOpened: true,
}

const createWrapper = (
  props: CollabRightsDrawerProps = defaultProps,
): VueWrapper<any> =>
  mount(CollabRightsDrawer, {
    props: {
      ...props,
    },
  })

describe('collabRightsDrawer', () => {
  let wrapper: VueWrapper<any>
  beforeEach(async () => {
    wrapper = createWrapper()
    await flushPromises()
  })
  describe('display', () => {
    it("should correctly display the drawer with the user's information and collaborator roles", () => {
      const userRoleTag = wrapper.findComponent({ name: 'PTag' })
      const userCard = wrapper.findComponent({ name: 'PUserCard' })
      const collabRoles = wrapper.findComponent({ name: 'CollabRoles' })
      const rightsList = wrapper.findComponent({
        name: 'RightsList',
      })

      const expectedUserCardProps = {
        pTitle: rowData.fullName,
        pSubtitle: rowData.email,
      }

      const expectedUserRoleTagProps = {
        pContent: rowData.role,
      }

      expect(rightsList.exists()).toBeFalsy()
      expect(collabRoles.exists()).toBeTruthy()
      expect(userCard.props()).toMatchObject(expectedUserCardProps)
      expect(userRoleTag.props()).toMatchObject(expectedUserRoleTagProps)
    })
    it("should display the rights list when clicking 'Personalize' button", async () => {
      const collabRoles = wrapper.findComponent({ name: 'CollabRoles' })
      collabRoles.vm.$emit('display-manage-rights')
      await nextTick()
      const rightsList = wrapper.findComponent({
        name: 'RightsList',
      })

      expect(rightsList.exists()).toBeTruthy()
    })
  })
  describe('events', () => {
    it('should close the collab rights drawer when clicking the close button', async () => {
      const collabRightsDrawer = wrapper.findComponent({ name: 'PDrawer' })
      collabRightsDrawer.vm.$emit('close-drawer-button')
      await nextTick()

      expect(collabRightsDrawer.emitted('close-drawer-button')).toBeTruthy()
    })
    it('should have a preselected role ID, and the validate button should be disabled', () => {
      const collabRoles = wrapper.findComponent({ name: 'CollabRoles' })
      const nextPreviousButtons = wrapper.findComponent({
        name: 'NextPreviousButtons',
      })

      expect(collabRoles.props('selectedRoleId')).toBe(mockedSelectedRoleId)
      expect(nextPreviousButtons.props('isNextButtonDisabled')).toBeTruthy()
    })
    it("should show caollaborator roles when viewing the rights list and clicking 'Previous'", async () => {
      let collabRoles = wrapper.findComponent({ name: 'CollabRoles' })
      collabRoles.vm.$emit('display-manage-rights')
      await nextTick()
      const rightsList = wrapper.findComponent({
        name: 'RightsList',
      })

      expect(collabRoles.exists()).toBeFalsy()
      expect(rightsList.exists()).toBeTruthy()

      const nextPreviousButtons = wrapper.findComponent({
        name: 'NextPreviousButtons',
      })
      nextPreviousButtons.vm.$emit('click-previous')
      await nextTick()
      collabRoles = wrapper.findComponent({ name: 'CollabRoles' })

      expect(collabRoles.exists()).toBeTruthy()
      expect(rightsList.exists()).toBeFalsy()
    })
    it('should enable the validate button when another role is selected', async () => {
      const collabRoles = wrapper.findComponent({ name: 'CollabRoles' })
      collabRoles.vm.$emit('update:selectedRoleId', mockedCollabRoles[0].id)
      await nextTick()
      const nextPreviousButtons = wrapper.findComponent({
        name: 'NextPreviousButtons',
      })

      expect(nextPreviousButtons.props('isNextButtonDisabled')).toBeFalsy()
      expect(collabRoles.props('selectedRoleId')).toBe(mockedCollabRoles[0].id)
    })
    it('should call the auth API with the correct parameters to update collaborator permissions', () => {
      const collabRoles = wrapper.findComponent({ name: 'CollabRoles' })
      collabRoles.vm.$emit('display-manage-rights')

      const nextPreviousButtons = wrapper.findComponent({
        name: 'NextPreviousButtons',
      })
      nextPreviousButtons.vm.$emit('click-next')

      expect(mockUpdateUserPermission).toHaveBeenCalledOnce()
      expect(mockUpdateUserPermission).toHaveBeenCalledWith(
        1,
        null,
        mockedPermissionCodes,
      )
    })
    it('should display a console error if the request to update permissions fails', async () => {

      const expectedErrorMessage = 'API Error: 503 Service Unavailable'
      mockUpdateUserPermission.mockRejectedValue(expectedErrorMessage)
      wrapper = createWrapper()
      await flushPromises()

      const collabRoles = wrapper.findComponent({ name: 'CollabRoles' })
      collabRoles.vm.$emit('display-manage-rights')

      const nextPreviousButtons = wrapper.findComponent({
        name: 'NextPreviousButtons',
      })
      nextPreviousButtons.vm.$emit('click-next')
      await flushPromises()

      expect(loggerErrorSpy).toHaveBeenCalledOnce()
      expect(loggerErrorSpy).toHaveBeenCalledWith(
        'Permission update unsuccessful: ',
        expectedErrorMessage,
      )
    })
    it('should call the wallet API with the correct parameters to update collaborator role', () => {
      const spyUpdateCollaborator = vi.spyOn(
        walletServices,
        'updateCollaborator',
      )

      const collabRoles = wrapper.findComponent({ name: 'CollabRoles' })
      collabRoles.vm.$emit('update:selectedRoleId', mockedCollabRoles[0].id)

      const nextPreviousButtons = wrapper.findComponent({
        name: 'NextPreviousButtons',
      })
      nextPreviousButtons.vm.$emit('click-next')

      expect(spyUpdateCollaborator).toHaveBeenCalledOnce()
      expect(spyUpdateCollaborator).toHaveBeenCalledWith(1, {
        personaId: mockedCollabRoles[0].id,
      })
    })
    it('should display a console error if the request to fetch collaborator roles fails', async () => {
      vi.clearAllMocks()

      const expectedErrorMessage = 'API Error: 503 Service Unavailable'
      vi.spyOn(walletServices, 'fetchContactRoles').mockRejectedValue(
        expectedErrorMessage,
      )
      createWrapper()
      await flushPromises()

      expect(loggerErrorSpy).toHaveBeenCalledWith(
        'Unable to fetch collaborator roles: ',
        expectedErrorMessage,
      )
    })
  })
})
