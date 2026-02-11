import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import PSmartSearch from './PSmartSearch.vue'

describe('PSmartSearch', () => {
  describe('Rendering', () => {
    it('renders classic mode by default', () => {
      const wrapper = mount(PSmartSearch)

      expect(wrapper.find('[data-testid="p-smart-search"]').exists()).toBe(true)
      expect(wrapper.find('[data-testid="p-smart-search-classic"]').exists()).toBe(true)
      expect(wrapper.find('[data-testid="p-smart-search-ai"]').exists()).toBe(false)
    })

    it('renders AI mode when pAiEnabled is true', () => {
      const wrapper = mount(PSmartSearch, {
        props: { pAiEnabled: true },
      })

      expect(wrapper.find('[data-testid="p-smart-search-ai"]').exists()).toBe(true)
      expect(wrapper.find('[data-testid="p-smart-search-classic"]').exists()).toBe(false)
    })

    it('displays switch label', () => {
      const wrapper = mount(PSmartSearch, {
        props: { pSwitchLabel: 'Enable AI' },
      })

      expect(wrapper.find('[data-testid="p-smart-search-switch-label"]').text()).toBe('Enable AI')
    })

    it('applies disabled class when pDisabled is true', () => {
      const wrapper = mount(PSmartSearch, {
        props: { pDisabled: true },
      })

      expect(wrapper.find('[data-testid="p-smart-search"]').classes()).toContain('p-smart-search--disabled')
    })
  })

  describe('AI Mode', () => {
    it('displays placeholder in textarea', () => {
      const wrapper = mount(PSmartSearch, {
        props: {
          pAiEnabled: true,
          pAiPlaceholder: 'Ask AI...',
        },
      })

      expect(wrapper.find('[data-testid="p-smart-search-textarea"]').attributes('placeholder')).toBe('Ask AI...')
    })

    it('displays header slot when provided', () => {
      const wrapper = mount(PSmartSearch, {
        props: { pAiEnabled: true },
        slots: { header: '<div>Header Content</div>' },
      })

      expect(wrapper.find('[data-testid="p-smart-search-header"]').exists()).toBe(true)
      expect(wrapper.find('[data-testid="p-smart-search-header"]').text()).toBe('Header Content')
    })

    it('hides header when slot is not provided', () => {
      const wrapper = mount(PSmartSearch, {
        props: { pAiEnabled: true },
      })

      expect(wrapper.find('[data-testid="p-smart-search-header"]').exists()).toBe(false)
    })

    it('displays disclaimer slot when provided', () => {
      const wrapper = mount(PSmartSearch, {
        props: { pAiEnabled: true },
        slots: { disclaimer: 'AI disclaimer' },
      })

      expect(wrapper.find('[data-testid="p-smart-search-disclaimer"]').text()).toBe('AI disclaimer')
    })

    it('applies no-header class when header slot is missing', () => {
      const wrapper = mount(PSmartSearch, {
        props: { pAiEnabled: true },
      })

      expect(wrapper.find('[data-testid="p-smart-search-ai-content"]').classes()).toContain('p-smart-search__ai-content--no-header')
    })

    it('emits search event on submit click when textarea has value', async () => {
      const wrapper = mount(PSmartSearch, {
        props: { pAiEnabled: true },
      })

      const textarea = wrapper.find('[data-testid="p-smart-search-textarea"]')
      await textarea.setValue('test query')

      const submitButton = wrapper.find('[data-testid="p-smart-search-submit"]')
      await submitButton.trigger('click')

      expect(wrapper.emitted('search')).toBeTruthy()
      expect(wrapper.emitted('search')?.[0]).toEqual(['test query'])
    })

    it('does not emit search event when textarea is empty', async () => {
      const wrapper = mount(PSmartSearch, {
        props: { pAiEnabled: true },
      })

      const submitButton = wrapper.find('[data-testid="p-smart-search-submit"]')
      await submitButton.trigger('click')

      expect(wrapper.emitted('search')).toBeFalsy()
    })

    it('disables textarea when pDisabled is true', () => {
      const wrapper = mount(PSmartSearch, {
        props: {
          pAiEnabled: true,
          pDisabled: true,
        },
      })

      expect(wrapper.find('[data-testid="p-smart-search-textarea"]').attributes('disabled')).toBeDefined()
    })
  })

  describe('Mode Switching', () => {
    it('emits update:pAiEnabled when switch is toggled', async () => {
      const wrapper = mount(PSmartSearch, {
        props: { pAiEnabled: false },
      })

      const switchComponent = wrapper.findComponent({ name: 'ElSwitch' })
      await switchComponent.vm.$emit('update:modelValue', true)
      await nextTick()

      expect(wrapper.emitted('update:pAiEnabled')).toBeTruthy()
      expect(wrapper.emitted('update:pAiEnabled')?.[0]).toEqual([true])
    })

    it('preserves search value when switching to AI mode', async () => {
      const wrapper = mount(PSmartSearch, {
        props: {
          pSearch: 'preserved text',
          pAiEnabled: false,
        },
      })

      await wrapper.setProps({ pAiEnabled: true })
      await nextTick()

      const textarea = wrapper.find('[data-testid="p-smart-search-textarea"]')
      expect((textarea.element as HTMLTextAreaElement).value).toBe('preserved text')
    })
  })

  describe('Exposed Methods', () => {
    it('exposes clearSearch method that resets value', async () => {
      const wrapper = mount(PSmartSearch, {
        props: { pAiEnabled: true },
      })

      const textarea = wrapper.find('[data-testid="p-smart-search-textarea"]')
      await textarea.setValue('some value')

      const vm = wrapper.vm as unknown as { clearSearch: () => void }
      vm.clearSearch()
      await nextTick()

      expect(wrapper.emitted('update:pSearch')).toBeTruthy()
    })

    it('exposes focus method', () => {
      const wrapper = mount(PSmartSearch, {
        props: { pAiEnabled: true },
        attachTo: document.body,
      })

      const vm = wrapper.vm as unknown as { focus: () => void }
      expect(typeof vm.focus).toBe('function')

      wrapper.unmount()
    })
  })
})
