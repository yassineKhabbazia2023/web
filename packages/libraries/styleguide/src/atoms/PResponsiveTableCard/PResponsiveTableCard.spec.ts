import { shallowMount } from '@vue/test-utils'
import PResponsiveTableCard from './'

const mockRow = { id: 1, name: 'Test Entity', code: '12345' }

function createWrapper(props = {}) {
  return shallowMount(PResponsiveTableCard, {
    props: {
      pRow: mockRow,
      ...props,
    },
    slots: {
      title: '<span class="title-slot">Title Content</span>',
      actions: '<button class="action-slot">Action</button>',
      body: '<div class="body-slot">Body Content</div>',
    },
  })
}

describe('PResponsiveTableCard', () => {
  describe('rendering', () => {
    it('renders the card with base class', () => {
      const wrapper = createWrapper()

      expect(wrapper.find('.p-responsive-table-card').exists()).toBe(true)
    })

    it('renders title slot content', () => {
      const wrapper = createWrapper()

      expect(wrapper.find('.title-slot').exists()).toBe(true)
    })

    it('renders actions slot content', () => {
      const wrapper = createWrapper()

      expect(wrapper.find('.action-slot').exists()).toBe(true)
    })

    it('renders body slot content', () => {
      const wrapper = createWrapper()

      expect(wrapper.find('.body-slot').exists()).toBe(true)
    })
  })

  describe('clickable behavior', () => {
    it('does not have clickable class by default', () => {
      const wrapper = createWrapper()

      expect(wrapper.find('.p-responsive-table-card--clickable').exists()).toBe(false)
    })

    it('has clickable class when pClickable is true', () => {
      const wrapper = createWrapper({ pClickable: true })

      expect(wrapper.find('.p-responsive-table-card--clickable').exists()).toBe(true)
    })

    it('does not emit click event when not clickable', async () => {
      const wrapper = createWrapper({ pClickable: false })

      await wrapper.find('.p-responsive-table-card').trigger('click')

      expect(wrapper.emitted('click')).toBeUndefined()
    })

    it('emits click event with row data when clickable', async () => {
      const wrapper = createWrapper({ pClickable: true })

      await wrapper.find('.p-responsive-table-card').trigger('click')

      expect(wrapper.emitted('click')).toBeTruthy()
      expect(wrapper.emitted('click')?.[0]).toEqual([mockRow])
    })
  })
})
