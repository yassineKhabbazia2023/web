import { it, describe, expect, beforeEach } from 'vitest'
import { VueWrapper, mount } from '@vue/test-utils'
import { getMockedUser } from '@/pages/entities/mocks'
import { getInitials } from '@/helper'
import type { UserInfo } from '@kpmg/common'
import ManageCollaborators from '.'

const defaultCollaborator: UserInfo = getMockedUser()
const expectedSearchText = 'Please search for a collaborator :'
const expectedUserActionProps = {
  pProfile: getInitials(
    defaultCollaborator.firstName,
    defaultCollaborator.lastName
  ),
  pTitle: `${defaultCollaborator.firstName} ${defaultCollaborator.lastName}`,
  pDescription: defaultCollaborator.email,
  pRole: defaultCollaborator.occupation
}

const createWrapper = () => {
  const wrapper = mount(ManageCollaborators, {
    props: {
      defaultCollaborator
    }
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
      const searchText = wrapper.find('[data-testid=search-collaborator]')
      const blockHeader = wrapper.findComponent({ name: 'PBlockHeader' })
      const userAction = wrapper.findComponent({
        name: 'PUserAction'
      })

      expect(userAction.props()).toMatchObject(expectedUserActionProps)
      expect(searchText.text()).toBe(expectedSearchText)
      expect(userAction.exists()).toBeTruthy()
      expect(blockHeader.exists()).toBeTruthy()
    })
  })
})
