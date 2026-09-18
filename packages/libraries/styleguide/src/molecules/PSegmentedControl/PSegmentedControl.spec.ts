import { type VueWrapper, mount } from '@vue/test-utils'

import PSegmentedControl from '.'
import PButton from '../../atoms/PButton'
import type { PSegmentedControlProps, PSegmentedControlValue } from './PSegmentedControlTypes'

/** `modelValue` comes from `defineModel`, so the props interface does not carry it. */
type Override = Partial<PSegmentedControlProps> & { modelValue?: PSegmentedControlValue }

const mockedOptions = [
  { pValue: 'N-1', pLabel: 'N-1 (12/2024)' },
  { pValue: 'N-2', pLabel: 'N-2 (12/2023)' },
]

/**
 * Mounted whole rather than shallow: `PButton` declares no `click` emit, so the
 * handler is a native listener on the button it renders. A stub would never
 * call it, and every interaction case would pass without proving anything.
 */
function createWrapper(override: Override = {}) {
  return mount(PSegmentedControl, {
    props: {
      pOptions: mockedOptions,
      modelValue: 'N-1',
      ...override,
    },
  })
}

/** Found by component rather than by name, so their props stay typed. */
function findButtons(wrapper: VueWrapper) {
  return wrapper.findAllComponents(PButton)
}

describe('segmentedControl', () => {
  let wrapper: VueWrapper
  let buttons: ReturnType<typeof findButtons>

  beforeEach(() => {
    wrapper = createWrapper()
    buttons = findButtons(wrapper)
  })

  it('should render one option per entry, filling only the selected one', () => {
    expect(buttons).toHaveLength(mockedOptions.length)
    expect(buttons[0].props('pType')).toBe('active')
    expect(buttons[1].props('pType')).toBe('white')
  })

  it('should say which option is pressed', () => {
    const pressed = wrapper.findAll('button').map(button => button.attributes('aria-pressed'))

    expect(pressed).toStrictEqual(['true', 'false'])
  })

  it('should name the group for a screen reader when asked to', () => {
    const named = createWrapper({ pAriaLabel: 'Exercice de comparaison' })

    expect(named.attributes('role')).toBe('group')
    expect(named.attributes('aria-label')).toBe('Exercice de comparaison')
  })

  it('should suffix the test id of every option by its own value', () => {
    const identified = createWrapper({ pTestId: 'comparison' })

    expect(identified.findAll('button').map(button => button.attributes('data-testid')))
      .toStrictEqual(['comparison-N-1', 'comparison-N-2'])
  })

  it('should leave the options without a test id when none is given', () => {
    expect(wrapper.findAll('button').map(button => button.attributes('data-testid')))
      .toStrictEqual([undefined, undefined])
  })

  it('should select the option that was picked', async () => {
    await buttons[1].trigger('click')

    expect(wrapper.emitted('update:modelValue')).toStrictEqual([['N-2']])
  })

  /**
   * The whole point of the control: an exclusive choice is never emptied, where
   * a filter group would remove the selected one and leave no value at all.
   */
  it('should keep the selection when the option already selected is picked', async () => {
    await buttons[0].trigger('click')

    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
  })

  it('should offer nothing when disabled, while still displaying every option', async () => {
    const locked = createWrapper({ pDisabled: true })
    const lockedButtons = locked.findAll('button')

    expect(lockedButtons).toHaveLength(mockedOptions.length)
    expect(lockedButtons.every(button => button.attributes('disabled') !== undefined)).toBe(true)

    await lockedButtons[1].trigger('click')

    expect(locked.emitted('update:modelValue')).toBeUndefined()
  })

  it('should read a boolean value as well as a string one', async () => {
    const units = createWrapper({
      pOptions: [{ pValue: false, pLabel: '€' }, { pValue: true, pLabel: 'k€' }],
      modelValue: true,
    })
    const unitButtons = findButtons(units)

    expect(unitButtons[0].props('pType')).toBe('white')
    expect(unitButtons[1].props('pType')).toBe('active')

    await unitButtons[0].trigger('click')

    expect(units.emitted('update:modelValue')).toStrictEqual([[false]])
  })
})
