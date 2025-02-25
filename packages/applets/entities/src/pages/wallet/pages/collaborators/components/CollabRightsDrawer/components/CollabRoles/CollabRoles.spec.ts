import { mount, type VueWrapper } from '@vue/test-utils'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { nextTick } from 'vue'
import { getMockedCollabRoles } from '@entities/__mocks__/collab-roles.mocks'
import { PRadioGroup } from '@pulse/styleguide/components'
import CollabRoles from '.'

// Mocks
const mockedCollabRoles = getMockedCollabRoles()
const selectedRoleId = mockedCollabRoles[0].id
vi.mock('@pulse/common', () => ({
  commonStore: () => ({
    $patch: vi.fn(),
  }),
}))

const createWrapper = (): VueWrapper<any> =>
  mount(CollabRoles, {
    props: {
      selectedRoleId,
      roles: mockedCollabRoles,
      preSelectedRoleId: selectedRoleId,
      currentRole: mockedCollabRoles[0].name,
    },
  })

describe('collabRoles', () => {
  let wrapper: VueWrapper<any>
  beforeEach(() => {
    wrapper = createWrapper()
  })
  describe('display', () => {
    it('should display all available collaborator roles accurately', () => {
      const roleCards = wrapper.findAllComponents({ name: 'PRadioCard' })

      expect(roleCards).toHaveLength(mockedCollabRoles.length)
    })
    it('should a default role ID be preselected', async () => {
      const roleCardsGroup = wrapper.findComponent(PRadioGroup)
      await nextTick()

      expect(roleCardsGroup.props('modelValue')).toBe(selectedRoleId)
    })
  })

  describe('events', () => {
    it("should emit 'display-manage-rights' when click on personalize button", async () => {
      const personalizeButton = wrapper.find(
        '[data-testid=collab-roles-personalize-button]',
      )

      await personalizeButton.trigger('click')

      expect(wrapper.emitted('display-manage-rights')).toBeTruthy()
    })
    it("should emit a 'update:selectedRoleId' event when the selected role ID changes", async () => {
      const roleCardsGroup = wrapper.findComponent(PRadioGroup)

      roleCardsGroup.vm.$emit(
        'update:modelValue',
        mockedCollabRoles[1].id,
      )
      await nextTick()

      expect(wrapper.emitted('update:selectedRoleId')).toStrictEqual([
        [mockedCollabRoles[1].id],
      ])
    })
  })
})
