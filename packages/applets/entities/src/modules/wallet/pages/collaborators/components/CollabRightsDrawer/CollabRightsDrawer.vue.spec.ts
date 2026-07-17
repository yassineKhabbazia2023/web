import { mockedPermissionCodes } from '@entities/__mocks__/permissions.mocks'
import {
  armAuthorizationServiceMocks,
  armRightDrawerUtilsMocks,
  updateUserPermissionsMock,
} from '@entities/__mocks__/vitest'
import { loggerErrorSpy } from '@pulse/toolbox/mocks'
import { restoreRealUseI18n } from '@pulse/common/mocks/vitest'
import { mockedAccountId } from '@entities/__mocks__/account.mocks'
import { mockedCollaboratorsList1 } from '@entities/__mocks__/collaborators.mocks'
import { getMockedCollabRoles } from '@entities/__mocks__/collab-roles.mocks'
import { flushPromises, mount, type VueWrapper } from '@vue/test-utils'
import { nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import type { RouteLocationNormalizedLoaded, Router } from 'vue-router'
import * as collaboratorServices from '@entities/services/collaborator'
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

beforeEach(() => {
  restoreRealUseI18n()
  armAuthorizationServiceMocks()
  armRightDrawerUtilsMocks()
  vi.mocked(collaboratorServices.updateCollaborator).mockResolvedValue(
    undefined as unknown as Awaited<ReturnType<typeof collaboratorServices.updateCollaborator>>,
  )
  vi.mocked(useRoute).mockReturnValue({
    params: {
      id: mockedAccountId,
    },
  } as unknown as RouteLocationNormalizedLoaded)
  vi.mocked(useRouter).mockReturnValue({
    go: vi.fn(),
  } as unknown as Router)
})

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
    vi.mocked(collaboratorServices.fetchContactRoles).mockResolvedValue(getMockedCollabRoles())
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
        name: 'PDrawerActions',
      })

      expect(collabRoles.props('selectedRoleId')).toBe(mockedSelectedRoleId)
      expect(nextPreviousButtons.props('pPrimaryCTA').pDisabled).toBeTruthy()
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
        name: 'PDrawerActions',
      })
      nextPreviousButtons.vm.$emit('click-back-cta')
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
        name: 'PDrawerActions',
      })

      expect(nextPreviousButtons.props('pPrimaryCTA').pDisabled).toBeFalsy()
      expect(collabRoles.props('selectedRoleId')).toBe(mockedCollabRoles[0].id)
    })
    it('should call the auth API with the correct parameters to update collaborator permissions', () => {
      const collabRoles = wrapper.findComponent({ name: 'CollabRoles' })
      collabRoles.vm.$emit('display-manage-rights')

      const nextPreviousButtons = wrapper.findComponent({
        name: 'PDrawerActions',
      })
      nextPreviousButtons.vm.$emit('click-primary-cta')

      expect(updateUserPermissionsMock).toHaveBeenCalledExactlyOnceWith(1, null, mockedPermissionCodes)
    })
    it('should display a console error if the request to update permissions fails', async () => {

      const expectedErrorMessage = 'API Error: 503 Service Unavailable'
      updateUserPermissionsMock.mockRejectedValue(expectedErrorMessage)
      wrapper = createWrapper()
      await flushPromises()

      const collabRoles = wrapper.findComponent({ name: 'CollabRoles' })
      collabRoles.vm.$emit('display-manage-rights')

      const nextPreviousButtons = wrapper.findComponent({
        name: 'PDrawerActions',
      })
      nextPreviousButtons.vm.$emit('click-primary-cta')
      await flushPromises()

      expect(loggerErrorSpy).toHaveBeenCalledExactlyOnceWith('Permission update unsuccessful: ', expectedErrorMessage)
    })
    it('should call the wallet API with the correct parameters to update collaborator role', () => {
      const spyUpdateCollaborator = vi.spyOn(
        collaboratorServices,
        'updateCollaborator',
      )

      const collabRoles = wrapper.findComponent({ name: 'CollabRoles' })
      collabRoles.vm.$emit('update:selectedRoleId', mockedCollabRoles[0].id)

      const nextPreviousButtons = wrapper.findComponent({
        name: 'PDrawerActions',
      })
      nextPreviousButtons.vm.$emit('click-primary-cta')

      expect(spyUpdateCollaborator).toHaveBeenCalledExactlyOnceWith(1, {
        personaId: mockedCollabRoles[0].id,
      })
    })
    it('should display a console error if the request to fetch collaborator roles fails', async () => {
      vi.clearAllMocks()

      const expectedErrorMessage = 'API Error: 503 Service Unavailable'
      vi.spyOn(collaboratorServices, 'fetchContactRoles').mockRejectedValue(
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
