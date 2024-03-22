import { vi, it, describe, expect, beforeEach } from 'vitest'
import { nextTick } from 'vue'
import type { VueWrapper } from '@vue/test-utils'
import { mount } from '@vue/test-utils'
import { getMockedCollaborators } from '@/services/contact/contactMocks'
import { getInitials } from '@/helper'
import ManageCollaborators from '.'

vi.mock('@/services/contact', () => ({
  getCollaborators: vi.fn(() => Promise.resolve([])),
}))

const mockedCollaborators = getMockedCollaborators()

vi.mock('@/services/contact', () => ({
  getCollaborators: vi.fn(() => Promise.resolve(mockedCollaborators)),
}))

const expectedSearchText = 'Please search for a collaborator :'
const defaultCollaborator = mockedCollaborators[0]
const expectedUserActionProps = {
  pProfile: getInitials(
    defaultCollaborator.firstName,
    defaultCollaborator.lastName,
  ),
  pTitle: `${defaultCollaborator.firstName} ${defaultCollaborator.lastName}`,
  pDescription: defaultCollaborator.email,
  pRole: defaultCollaborator.office,
}

const createWrapper = () => {
  const wrapper = mount(ManageCollaborators, {
    props: {
      collaborators: [mockedCollaborators[0]],
    },
    global: {
      stubs: {
        CollaboratorAutocomplete: true,
      },
    },
  })

  return wrapper
}

describe('manageCollaborators', () => {
  let wrapper: VueWrapper
  beforeEach(() => {
    wrapper = createWrapper()
  })
  describe('display', () => {
    it('should correctly display the manage collaborators page', () => {
      const pFormItem = wrapper.findComponent({ name: 'PFormItem' })
      const blockHeader = wrapper.findComponent({ name: 'PBlockHeader' })
      const userAction = wrapper.findComponent({
        name: 'PUserAction',
      })

      expect(pFormItem.text()).toBe(expectedSearchText)
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
  })
})
