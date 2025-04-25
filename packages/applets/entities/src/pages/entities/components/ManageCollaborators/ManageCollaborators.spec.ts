import { vi, it, describe, expect, beforeEach } from 'vitest'
import { nextTick } from 'vue'
import { shallowMount, type VueWrapper } from '@vue/test-utils'
import { getMockedCollaborators } from '@entities/__mocks__/collaborators.mocks'
import { loggerMock, loggerWarnSpy } from '@pulse/core/mocks'
import { getInitials } from '@entities/helper'
import type { ComponentWrapper } from '@entities/common/types'
import { getCollaboratorRoleMock } from '@entities/__mocks__/offer-subscription.mocks'

import ManageCollaborators from '.'

const mockedCollaborators = getMockedCollaborators()

vi.mock('@pulse/core', () => ({ logger: loggerMock }))
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
    pOptions: [],
  }
}
const collaboratorRoleMock = getCollaboratorRoleMock()
const collaboratorRolesMock = [
  collaboratorRoleMock,
]

async function createWrapper(allCollaborators = false, hasCollaboratorRoles = false) {
  const collaborators = allCollaborators
    ? mockedCollaborators
    : mockedCollaborators.slice(0, 1)
  const selectedCollaboratorsWithRoles = collaborators.map(({ id }) => ({
    contactId: id,
    roleIds: [],
  }))
  const collaboratorRoles = hasCollaboratorRoles
    ? collaboratorRolesMock
    : []

  const wrapper = shallowMount(ManageCollaborators, {
    props: {
      knownCollaborators: collaborators,
      selectedCollaboratorsWithRoles,
      collaboratorRoles,
    },
    global: {
      stubs: {
        CollaboratorAutocomplete: true,
        PBlockHeader: {
          name: 'PBlockHeader',
          template: '<div><slot /><slot name="subtitle"><slot name="suffix"></div>',
        },
        PForm: {
          name: 'PForm',
          template: '<div><slot /></div>',
        },
        PFormItem: {
          name: 'PFormItem',
          template: '<div><slot /></div>',
          props: ['pLabel'],
        },
        PUserActionWithOptionsNumbers: {
          name: 'PUserActionWithOptionsNumbers',
          template: '<div />',
          props: [
            'pProfile',
            'pTitle',
            'pDescription',
            'pRole',
            'pShowDelete',
            'pOptions',
          ],
        },
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
    name: 'PUserActionWithOptionsNumbers',
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
  describe('display', () => {
    beforeEach(async () => {
      wrapper = await createWrapper()
    })
    it('should display properly, WITHOUT delete button, when only one collaborator is selected', () => {
      const pShowDelete = false
      const expectedUserActionProps = getExpectedUserActionProps(pShowDelete)
      const {
        pFormItem,
        blockHeader,
        userActions,
        userAction,
      } = getComponentsInWrapper(wrapper)

      expect(pFormItem.props('pLabel')).toBe(expectedSearchText)
      expect(userActions).toHaveLength(1)
      expect(userAction.props()).toStrictEqual(expectedUserActionProps)
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

      expect(pFormItem.props('pLabel')).toBe(expectedSearchText)
      expect(userActions).toHaveLength(mockedCollaborators.length)
      expect(userAction.props()).toStrictEqual(expectedUserActionProps)
      expect(blockHeader.exists()).toBeTruthy()
    })
  })

  describe('event', () => {
    beforeEach(async () => {
      wrapper = await createWrapper()
    })
    it('should add collaborator when emits add-contact', async () => {
      const collaborator = mockedCollaborators.at(-1)!
      const expectedKnownCollaborators = [
        mockedCollaborators.at(0)!,
        collaborator,
      ]

      const collaboratorAutocomplete = wrapper.findComponent({ name: 'CollaboratorAutocomplete' })

      const expectedCollaboratorIds = expectedKnownCollaborators.map(({ id: contactId }) => ({
        contactId,
        roleIds: [],
      }))

      collaboratorAutocomplete.vm.$emit('add-contact', collaborator)
      await nextTick()

      expect(wrapper.emitted('update:knownCollaborators')).toStrictEqual([[expectedKnownCollaborators]])
      expect(wrapper.emitted('update:selectedCollaboratorsWithRoles')).toStrictEqual([[expectedCollaboratorIds]])
    })
    describe('when click on delete', () => {
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
        const otherCollaboratorIds = otherCollaborators.map(({ id: contactId }) => ({
          contactId,
          roleIds: [],
        }))

        expect(loggerWarnSpy).not.toHaveBeenCalled()
        expect(wrapper.emitted('update:selectedCollaboratorsWithRoles')).toStrictEqual([[otherCollaboratorIds]])
      })
    })
  })

  describe('show display', () => {
    const tests = [{
      allCollaborators: false,
      hasCollaboratorRoles: false,
    }, {
      allCollaborators: true,
      hasCollaboratorRoles: false,
    }, {
      allCollaborators: false,
      hasCollaboratorRoles: true,
    }, {
      allCollaborators: true,
      hasCollaboratorRoles: true,
    }]
    it.each(tests)('should render correctly when allCollaborators is $allCollaborators and  hasCollaboratorRoles is $hasCollaboratorRoles', async ({
      allCollaborators,
      hasCollaboratorRoles,
    }) => {
      const wrapper = await createWrapper(allCollaborators, hasCollaboratorRoles)
      const snapFilepath =
        `__snap__/ManageCollaborators.allCollaborators.${allCollaborators ? 'true' : 'false'}.hasCollaboratorRoles.${hasCollaboratorRoles ? 'true' : 'false'}.html`

      await expect(wrapper.html()).toMatchFileSnapshot(snapFilepath)
    })
  })
})
