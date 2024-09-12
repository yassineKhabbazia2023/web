import { describe, it, expect, vi, beforeEach } from 'vitest'
import type { VueWrapper } from '@vue/test-utils'
import { mount } from '@vue/test-utils'
import SidebarEntityItem from '.'

vi.mock('vue-router', () => ({
  useRouter: () => ({
    push: vi.fn(),
  }),
  useRoute: () => ({
    fullPath: '/portefeuille/3',
  }),
}))

const defaultProps = {
  tooltipContent: 'Entity Item Test',
  tooltipDisabled: true,
  path: '/portefeuille/3',
}

const createWrapper = (props = defaultProps) => {
  const wrapper = mount(SidebarEntityItem, {
    props,
    slots: {
      default: '<p>Entity Item Test</p>',
      'suffix-content': "<p data-testid='suffix-slot'>Entity Item Suffix</p>",
    },
  })

  return wrapper
}

describe('sidebarEntityItem', () => {
  let wrapper:VueWrapper
  beforeEach(() => {
    wrapper = createWrapper()
  })
  describe('display', () => {
    it('should display the sidebar entity item correctly', () => {
      const entityItemButton = wrapper.find('button')

      expect(entityItemButton.exists()).toBeTruthy()
    })
  })
  describe('events', () => {
    it("should emit 'item-clicked' when clicking on the entity item", async () => {
      const entityItemButton = wrapper.findComponent('button')

      await entityItemButton.trigger('click')

      expect(wrapper.emitted()).toHaveProperty('item-clicked')
    })
  })
  describe('slots', () => {
    it("should display the content of the 'suffix-content' slot when it exists", () => {
      const suffixSlot = wrapper.find('[data-testid=suffix-slot]')

      expect(suffixSlot.exists()).toBeTruthy()
    })
  })
})
