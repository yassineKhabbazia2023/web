import { vi, it, describe, expect, beforeEach } from 'vitest'
import { nextTick } from 'vue'
import { mount, type VueWrapper } from '@vue/test-utils'
import { getMockedCollaborators } from '@entities/services/contact/contactMocks'
import { getInitials } from '@entities/helper'
import type { ComponentWrapper } from '@entities/common/types'
import { getMockedUser } from '@entities/pages/entities/mocks'
import type { UserInfo } from '@pulse/common/types'
import ManageCollaborators from '.'

const mockCurrentUser: UserInfo = getMockedUser()

const loggerDebugSpy = vi.hoisted(() => vi.fn())
const loggerWarnSpy = vi.hoisted(() => vi.fn())
const loggerErrorSpy = vi.hoisted(() => vi.fn())

vi.mock('@pulse/core', () => ({
  logger: {
    debug: loggerDebugSpy,
    warn: loggerWarnSpy,
    error: loggerErrorSpy,
  },
}))

vi.mock('@entities/services/contact', () => ({
  getCollaborators: vi.fn(() => Promise.resolve([])),
}))

const mockedCollaborators = getMockedCollaborators()

vi.mock('@entities/services/contact', () => ({
  getCollaborators: vi.fn(() => Promise.resolve(mockedCollaborators)),
}))

const expectedSearchText = 'Please search for a collaborator :'
const defaultCollaborator = mockedCollaborators[0]
function getExpectedUserActionProps(pShowDelete: boolean) {
  return {
    pProfile: getInitials(
      defaultCollaborator.firstName,
      defaultCollaborator.lastName,
    ),
    pTitle: `${defaultCollaborator.firstName} ${defaultCollaborator.lastName}`,
    pDescription: defaultCollaborator.email,
    pRole: defaultCollaborator.persona?.name,
    pShowDelete,
  }
}
async function createWrapper(allCollaborators = false) {
  const collaborators = allCollaborators
    ? mockedCollaborators
    : mockedCollaborators.slice(0, 1)

  const wrapper = mount(ManageCollaborators, {
    props: {
      collaborators,
      defaultCollaborator: mockCurrentUser,
    },
    global: {
      stubs: {
        CollaboratorAutocomplete: true,
      },
    },
  })
  await nextTick()

  return wrapper
}

function getComponentsInWrapper(wrapper: VueWrapper) {
  const pFormItem = wrapper.findComponent({ name: 'PFormItem' })
  const blockHeader = wrapper.findComponent({ name: 'PBlockHeader' })
  const userActions = wrapper.findAllComponents({
    name: 'PUserAction',
  })
  const userAction = userActions[0]

  return {
    pFormItem,
    blockHeader,
    userActions,
    userAction,
  }
}

describe('manageCollaborators', () => {
  let wrapper: ComponentWrapper<InstanceType<typeof ManageCollaborators>>
  beforeEach(async () => {
    wrapper = await createWrapper()
  })
  describe('display', () => {
    it('should display properly, WITHOUT delete button, when only one collaborator is selected', () => {
      const pShowDelete = false
      const expectedUserActionProps = getExpectedUserActionProps(pShowDelete)
      const {
        pFormItem,
        blockHeader,
        userActions,
        userAction,
      } = getComponentsInWrapper(wrapper)

      expect(pFormItem.text()).toBe(expectedSearchText)
      expect(userActions).toHaveLength(1)
      expect(userAction.props()).toMatchObject(expectedUserActionProps)
      expect(blockHeader.exists()).toBeTruthy()
    })

    it('should display properly, WITH delete button, when several collaborators are selected', async () => {
      const wrapper = await createWrapper(true)
      const pShowDelete = true
      const expectedUserActionProps = getExpectedUserActionProps(pShowDelete)
      const {
        pFormItem,
        blockHeader,
        userActions,
        userAction,
      } = getComponentsInWrapper(wrapper)

      expect(pFormItem.text()).toBe(expectedSearchText)
      expect(userActions).toHaveLength(mockedCollaborators.length)
      expect(userAction.props()).toMatchObject(expectedUserActionProps)
      expect(blockHeader.exists()).toBeTruthy()
    })
  })

  describe('event', () => {
    it('should add collaborator when emits add-contact', async () => {
      const pUserActionBefore = wrapper.findAllComponents({ name: 'PUserAction' })
      const countBefore = pUserActionBefore.length

      const collaboratorAutocomplete = wrapper.findComponent({ name: 'CollaboratorAutocomplete' })
      const collaborator = mockedCollaborators.at(-1)
      collaboratorAutocomplete.vm.$emit('add-contact', collaborator)
      await nextTick()
      const pUserActionAfter = wrapper.findAllComponents({ name: 'PUserAction' })

      expect(pUserActionAfter).toHaveLength(countBefore + 1)
    })
    describe('when click on delete', () => {
      beforeEach(() => {

      })
      it('should not emit update:collaborators when only one collaborator', () => {
        const { userAction } = getComponentsInWrapper(wrapper)
        userAction.vm.$emit('click-delete', 0)

        expect(loggerWarnSpy).toHaveBeenLastCalledWith('Can not delete collaborator')
        expect(wrapper.emitted('update:collaborator')).toBeFalsy()
      })
      it('should emit update:collaborators when several collaborators', async () => {
        const wrapper = await createWrapper(true)
        const { userAction } = getComponentsInWrapper(wrapper)
        userAction.vm.$emit('click-delete', 0)
        const otherCollaborators = mockedCollaborators.splice(1)

        expect(loggerWarnSpy).not.toHaveBeenCalled()
        expect(wrapper.emitted('update:collaborators')).toStrictEqual([[otherCollaborators]])
      })
    })
  })
})
