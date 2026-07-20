import { shallowMount } from '@vue/test-utils'
import PButton from '.'

const createWrapper = (props = {}) => shallowMount(PButton, {
  props,
  global: {
    stubs: {
      ElButton: {
        name: 'ElButton',
        template: '<button><slot /></button>',
        props: ['type', 'circle', 'disabled', 'loading', 'size', 'class', 'tag'],
      },
      PIcon: {
        name: 'PIcon',
        template: '<i />',
      },
    },
  },
})

describe('test for PButton', () => {
  it('render correctly', () => {
    const wrapper = createWrapper()
    const elButton = wrapper.findComponent({ name: 'ElButton' })

    expect(elButton.exists()).toBeTruthy()
  })

  it('render with props', () => {
    const wrapper = createWrapper({
      pCircle: true,
      pDisabled: true,
      pLoading: true,
      pSize: 'small',
      pIconOnly: true,
      pIsActive: true,
    })

    const elButton = wrapper.findComponent({ name: 'ElButton' })

    expect(elButton.props()).toMatchObject({
      circle: true,
      disabled: true,
      loading: true,
      size: 'small',
    })
    expect(elButton.props('class')).toBe('p-button p-button--icon p-button--is-active')
  })

  it('should not force disabled prop when pDisabled is not provided', () => {
    const wrapper = createWrapper()
    const elButton = wrapper.findComponent({ name: 'ElButton' })

    expect(elButton.props('disabled')).toBeUndefined()
  })
  it('applies the active type class', () => {
    const wrapper = shallowMount(PButton, {
      props: {
        pType: 'active',
      },
    })

    expect(wrapper.findComponent({ name: 'PButton' }).attributes('class')).toContain('p-button--active')
  })
  it('applies the underlined class', () => {
    const wrapper = shallowMount(PButton, {
      props: {
        pIsUnderlined: true,
      },
    })

    expect(wrapper.findComponent({ name: 'PButton' }).attributes('class')).toContain('p-button--is-underlined')
  })
})
