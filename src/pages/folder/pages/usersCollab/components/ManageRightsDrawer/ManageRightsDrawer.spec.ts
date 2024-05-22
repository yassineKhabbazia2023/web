import { expect, beforeEach, describe, it } from 'vitest'
import { type VueWrapper, mount, flushPromises } from '@vue/test-utils'
import { dataFromApi } from '../../mockData'
import ManageRightsDrawer from '.'

const mockedUser = {
  ...dataFromApi.data.items[0],
  fullName: "Johnny's Pizza",
  initials: 'JP',
}

const createWrapper = (): VueWrapper => {
  return mount(ManageRightsDrawer, {
    props: {
      modelValue: true,
      userInfo: mockedUser,
    },
  })
}

describe('modifyRightsUser', () => {
  let wrapper: VueWrapper<any>
  beforeEach(async () => {
    wrapper = createWrapper()
    await flushPromises()
  })
  describe('display', () => {
    it("should correctly display the drawer header with the user's information", () => {
      const userRoleTag = wrapper.findComponent({ name: 'PTag' })
      const userCard = wrapper.findComponent({ name: 'PUserCard' })

      const expectedUserCardProps = {
        pTitle: mockedUser.fullName,
        pSubtitle: mockedUser.email,
      }
      const expectedUserRoleTagProps = {
        pContent: mockedUser.role,
      }

      expect(userRoleTag.exists()).toBeTruthy()
      expect(userCard.exists()).toBeTruthy()
      expect(userRoleTag.props()).toMatchObject(expectedUserRoleTagProps)
      expect(userCard.props()).toMatchObject(expectedUserCardProps)
      expect(wrapper.props('modelValue')).toBeTruthy()
    })
  })
  describe('events', () => {
    it('should close modify rights drawer when clicking on close buton', async () => {
      await wrapper.find('.p-drawer__close-button').trigger('click')

      expect(wrapper.emitted('update:modelValue')).toStrictEqual([[false]])
    })
  })
})
