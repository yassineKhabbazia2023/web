import { nextTick } from 'vue'
import { mount } from '@vue/test-utils'
import { useResponsive } from './useResponsive'
import { BREAKPOINT_SIZES } from '@styleguide/guidelines/Layout/constants'

describe('useResponsive', () => {
  let originalInnerWidth: number

  beforeEach(() => {
    originalInnerWidth = window.innerWidth
  })

  afterEach(() => {
    setWindowWidth(originalInnerWidth)
  })

  function setWindowWidth(width: number) {
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: width,
    })
  }

  function createTestComponent(template: string) {
    return {
      template,
      setup() {
        return useResponsive()
      },
    }
  }

  it('should initialize with current window width', () => {
    setWindowWidth(1024)
    const wrapper = mount(createTestComponent('<div>{{ windowWidth }}</div>'))
    expect(wrapper.text()).toBe('1024')
  })

  describe('device detection', () => {
    it('should detect mobile correctly (width <= sm)', () => {
      setWindowWidth(500)
      const wrapper = mount(createTestComponent('<div>{{ isMobile }}</div>'))
      expect(wrapper.text()).toBe('true')
    })

    it('should detect mobile at exact sm breakpoint', () => {
      setWindowWidth(BREAKPOINT_SIZES.sm)
      const wrapper = mount(createTestComponent('<div>{{ isMobile }}</div>'))
      expect(wrapper.text()).toBe('true')
    })

    it('should not detect mobile above sm breakpoint', () => {
      setWindowWidth(BREAKPOINT_SIZES.sm + 1)
      const wrapper = mount(createTestComponent('<div>{{ isMobile }}</div>'))
      expect(wrapper.text()).toBe('false')
    })

    it('should detect tablet correctly (sm < width <= md)', () => {
      setWindowWidth(800)
      const wrapper = mount(createTestComponent('<div>{{ isTablet }}</div>'))
      expect(wrapper.text()).toBe('true')
    })

    it('should detect tablet at exact md breakpoint', () => {
      setWindowWidth(BREAKPOINT_SIZES.md)
      const wrapper = mount(createTestComponent('<div>{{ isTablet }}</div>'))
      expect(wrapper.text()).toBe('true')
    })

    it('should not detect tablet at or below sm breakpoint', () => {
      setWindowWidth(BREAKPOINT_SIZES.sm)
      const wrapper = mount(createTestComponent('<div>{{ isTablet }}</div>'))
      expect(wrapper.text()).toBe('false')
    })

    it('should not detect tablet above md breakpoint', () => {
      setWindowWidth(BREAKPOINT_SIZES.md + 1)
      const wrapper = mount(createTestComponent('<div>{{ isTablet }}</div>'))
      expect(wrapper.text()).toBe('false')
    })

    it('should detect desktop correctly (width > md)', () => {
      setWindowWidth(1200)
      const wrapper = mount(createTestComponent('<div>{{ isDesktop }}</div>'))
      expect(wrapper.text()).toBe('true')
    })

    it('should not detect desktop at or below md breakpoint', () => {
      setWindowWidth(BREAKPOINT_SIZES.md)
      const wrapper = mount(createTestComponent('<div>{{ isDesktop }}</div>'))
      expect(wrapper.text()).toBe('false')
    })
  })

  describe('window resize', () => {
    it('should update width on window resize', async () => {
      setWindowWidth(500)
      const wrapper = mount(createTestComponent('<div>{{ windowWidth }}</div>'))
      expect(wrapper.text()).toBe('500')

      setWindowWidth(1200)
      window.dispatchEvent(new Event('resize'))
      await nextTick()

      expect(wrapper.text()).toBe('1200')
    })

    it('should update isMobile on window resize', async () => {
      setWindowWidth(500)
      const wrapper = mount(createTestComponent('<div>{{ isMobile }}</div>'))
      expect(wrapper.text()).toBe('true')

      setWindowWidth(1200)
      window.dispatchEvent(new Event('resize'))
      await nextTick()

      expect(wrapper.text()).toBe('false')
    })

    it('should update isTablet on window resize', async () => {
      setWindowWidth(800)
      const wrapper = mount(createTestComponent('<div>{{ isTablet }}</div>'))
      expect(wrapper.text()).toBe('true')

      setWindowWidth(1200)
      window.dispatchEvent(new Event('resize'))
      await nextTick()

      expect(wrapper.text()).toBe('false')
    })
  })

  it('should cleanup event listener on unmount', () => {
    const removeEventListenerSpy = vi.spyOn(window, 'removeEventListener')
    const wrapper = mount(createTestComponent('<div>{{ windowWidth }}</div>'))
    wrapper.unmount()

    expect(removeEventListenerSpy).toHaveBeenCalledWith('resize', expect.any(Function))
  })
})
