import { describe, it, expect, vi } from 'vitest'
import { shallowMount } from '@vue/test-utils'
import { getMockedFavoriteEntities } from '@app/__mocks__/entities.mocks'
import type { Entity } from '@pulse/common/types'

import EntityAvatar from '.'

vi.mock('vue-router', () => ({
  useRouter: () => ({
    push: vi.fn(),
  }),
}))

const entities: Entity[] = getMockedFavoriteEntities()

const defaultProps = {
  entity: entities[0],
  hideTooltip: false,
  selected: false,
}

const createWrapper = (props = defaultProps) => {
  const wrapper = shallowMount(EntityAvatar, {
    props,
    global: {
      stubs: {
        SidebarEntityItem: {
          name: 'SidebarEntityItem',
          template: '<sidebar-entity-item-stub><slot /><slot name="suffix-content" /></sidebar-entity-item-stub>',
        },
      },
    },
  })

  return wrapper
}

describe('entityAvatar', () => {
  describe('display', () => {
    it('should display the entity avatar with all details correctly', () => {
      const wrapper = createWrapper()
      const entityName = wrapper.find('.entity-wrapper__details-name')
      const entityIbs = wrapper.find('.entity-wrapper__details-ibs')

      expect(entityName.text()).toBe(entities[0].legalName)
      expect(entityIbs.text()).toBe(entities[0].accountNumber)
    })
    it('should display the entity avatar with check icon when it is selected', () => {
      const wrapper = createWrapper({ ...defaultProps, selected: true })
      const entityAvatar = wrapper.findComponent({ name: 'PAvatar' })

      expect(entityAvatar.props('pSelected')).toBe(true)
    })
  })
  describe('events', () => {
    it("should emit 'entity-selected' when clicked on an entity", async () => {
      const wrapper = createWrapper()
      const entityAvatarButton = wrapper.findComponent({ name: 'SidebarEntityItem' })

      await entityAvatarButton.vm.$emit('item-clicked')

      expect(wrapper.emitted()).toHaveProperty('entity-selected')
    })
  })
})
