import { shallowMount } from '@vue/test-utils'
import PDrawerActions from '.'
import type { PDrawerActionsProps } from './PDrawerActionsTypes'

const PButtonStub = {
  name: 'PButton',
  template: '<button :data-testid="$attrs[\'data-testid\']"><slot /></button>',
  props: ['pType', 'pDisabled', 'pLoading'],
}

const createWrapper = (props: PDrawerActionsProps = {}) => {
  return shallowMount(PDrawerActions, {
    props,
    global: {
      stubs: {
        PButton: PButtonStub,
      },
    },
  })
}

describe('PDrawerActions', () => {
  it('should render no buttons when no props are provided', () => {
    const wrapper = createWrapper()
    const buttons = wrapper.findAllComponents(PButtonStub)
    expect(buttons.length).toBe(0)
  })

  it('should render only the primary button when only pPrimaryCTA is provided', () => {
    const wrapper = createWrapper({
      pPrimaryCTA: { pLabel: 'Next' },
    })
    const buttons = wrapper.findAllComponents(PButtonStub)
    expect(buttons.length).toBe(1)
    expect(buttons[0].props('pType')).toBe('primary')
    expect(buttons[0].text()).toBe('Next')
  })

  it('should render only the tertiary button when only pBackCTA is provided', () => {
    const wrapper = createWrapper({
      pBackCTA: { pLabel: 'Back' },
    })
    const buttons = wrapper.findAllComponents(PButtonStub)
    expect(buttons.length).toBe(1)
    expect(buttons[0].props('pType')).toBe('tertiary')
    expect(buttons[0].text()).toBe('Back')
  })

  it('should render only the secondary button when only pSecondaryCTA is provided', () => {
    const wrapper = createWrapper({
      pSecondaryCTA: { pLabel: 'Save draft' },
    })
    const buttons = wrapper.findAllComponents(PButtonStub)
    expect(buttons.length).toBe(1)
    expect(buttons[0].props('pType')).toBe('secondary')
    expect(buttons[0].text()).toBe('Save draft')
  })

  it('should render all 3 buttons when all props are provided', () => {
    const wrapper = createWrapper({
      pBackCTA: { pLabel: 'Back' },
      pSecondaryCTA: { pLabel: 'Save draft' },
      pPrimaryCTA: { pLabel: 'Submit' },
    })
    const buttons = wrapper.findAllComponents(PButtonStub)
    expect(buttons.length).toBe(3)
  })

  it('should pass pDisabled and pLoading to the primary button', () => {
    const wrapper = createWrapper({
      pPrimaryCTA: { pLabel: 'Submit', pDisabled: true, pLoading: true },
    })
    const button = wrapper.findComponent(PButtonStub)
    expect(button.props('pDisabled')).toBe(true)
    expect(button.props('pLoading')).toBe(true)
  })

  it('should pass pDisabled and pLoading to the secondary button', () => {
    const wrapper = createWrapper({
      pSecondaryCTA: { pLabel: 'Save', pDisabled: true, pLoading: false },
    })
    const button = wrapper.findComponent(PButtonStub)
    expect(button.props('pDisabled')).toBe(true)
    expect(button.props('pLoading')).toBe(false)
  })

  it('should pass pDisabled and pLoading to the tertiary button', () => {
    const wrapper = createWrapper({
      pBackCTA: { pLabel: 'Back', pDisabled: true, pLoading: false },
    })
    const button = wrapper.findComponent(PButtonStub)
    expect(button.props('pDisabled')).toBe(true)
    expect(button.props('pLoading')).toBe(false)
  })

  it('should emit click-primary-cta when primary button is clicked', async () => {
    const wrapper = createWrapper({
      pPrimaryCTA: { pLabel: 'Next' },
    })
    await wrapper.findComponent(PButtonStub).trigger('click')
    expect(wrapper.emitted('click-primary-cta')).toHaveLength(1)
  })

  it('should emit click-secondary-cta when secondary button is clicked', async () => {
    const wrapper = createWrapper({
      pSecondaryCTA: { pLabel: 'Save' },
    })
    await wrapper.findComponent(PButtonStub).trigger('click')
    expect(wrapper.emitted('click-secondary-cta')).toHaveLength(1)
  })

  it('should emit click-back-cta when tertiary button is clicked', async () => {
    const wrapper = createWrapper({
      pBackCTA: { pLabel: 'Back' },
    })
    await wrapper.findComponent(PButtonStub).trigger('click')
    expect(wrapper.emitted('click-back-cta')).toHaveLength(1)
  })
})
