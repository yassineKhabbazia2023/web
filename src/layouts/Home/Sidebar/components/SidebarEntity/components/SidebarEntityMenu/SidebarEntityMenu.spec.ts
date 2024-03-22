import { describe, it, expect, beforeEach } from 'vitest'
import type { VueWrapper } from '@vue/test-utils'
import { mount } from '@vue/test-utils'
import { getMockedFavoriteEntities } from '../../MockedFavoriteEntities'
import SidebarEntityMenu from '.'

const favoriteEntityId: string = getMockedFavoriteEntities()[0].idAccount

const defaultProps = {
  selectedEntityId: favoriteEntityId,
}

const createWrapper = (props = defaultProps) => {
  const wrapper = mount(SidebarEntityMenu, {
    props,
  })

  return wrapper
}

describe('sidebarEntityMenu', () => {
  let wrapper: VueWrapper
  beforeEach(() => {
    wrapper = createWrapper()
  })
  describe('display', () => {
    it('should display the sidebar entity menu correctly', () => {
      const sidebarEntityMenu = wrapper.find(
        '[data-testid=sidenav-menu]',
      )

      expect(sidebarEntityMenu.exists()).toBeTruthy()
    })
  })
  describe('events', () => {
    it("should expand the sidebar entity menu on 'mouseover' and collapse it on 'mouseleave'", async () => {
      expect(wrapper.classes()).toContain('sidenav-entity-menu--collapsed')

      await wrapper.trigger('mouseover')

      expect(wrapper.classes()).not.toContain('sidenav-entity-menu--collapsed')

      await wrapper.trigger('mouseleave')

      expect(wrapper.classes()).toContain('sidenav-entity-menu--collapsed')
    })
  })
})
