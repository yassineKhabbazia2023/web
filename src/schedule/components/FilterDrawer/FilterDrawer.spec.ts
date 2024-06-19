import { flushPromises, shallowMount } from '@vue/test-utils'
import FilterDrawer from '.'
import { expect, describe, it } from 'vitest'
import type { FilterDrawerProps, Filters } from './FilterDrawerTypes'
import { nextTick } from 'vue'

function createWrapper(override: Partial<FilterDrawerProps> = {}) {
  const defaultProps: FilterDrawerProps = {
    modelValue: false,
    targets: [],
    templates: [],
    status: [],
    mineOnly: false,
  }
  const props = {
    ...defaultProps,
    ...override,
  }

  return shallowMount(FilterDrawer, {
    props,
    global: {
      stubs: {
        PDrawer: {
          name: 'PDrawer',
          template: '<div><slot /><slot name="footer" /></div>',
          emits: ['open'],
        },
        PForm: {
          name: 'PForm',
          template: '<div><slot /></div>',
        },
        PDropdown: {
          name: 'PDropdown',
          template: '<div />',
          props: ['modelValue'],
          emits: ['update:model-value'],
        },
        PButton: true,
      },
    },
  })
}

describe('test FilterDrawer', () => {
  it('renders the component when modelValue is true', () => {
    const wrapper = createWrapper({ modelValue: true })
    const pDrawer = wrapper.findComponent({ name: 'PDrawer' })

    expect(pDrawer.props()).toBeTruthy()
  })

  it('should emit update:model-value event when drawer closes', async () => {
    const wrapper = createWrapper({ modelValue: true })
    const pDrawer = wrapper.findComponent({ name: 'PDrawer' })

    pDrawer.vm.$emit('close-drawer-button')
    await nextTick()

    expect(wrapper.emitted('update:model-value')).toStrictEqual([[false]])
  })

  it('should apply props in filter when drawer emit open', async () => {
    const template = 'Bilan'
    const templates = [template]
    const wrapper = createWrapper({
      modelValue: false,
      templates,
    })

    const pDrawer = wrapper.findComponent({ name: 'PDrawer' })

    pDrawer.vm.$emit('open')
    await nextTick()

    const pDropdown = wrapper.findComponent({ name: 'PDropdown' })

    expect(pDropdown.props('modelValue')).toStrictEqual(templates)
  })

  it('should emit active filters and close drawer when user clicks on apply button', async () => {
    const wrapper = createWrapper({ modelValue: true })

    const pDropdown = wrapper.findComponent({ name: 'PDropdown' })
    const pButtons = wrapper.findAllComponents({ name: 'PButton' })
    const pButtonApply = pButtons[1]
    const template = 'TVA'
    const expectedFilters: Filters = {
      targets: [],
      templates: [template],
      status: [],
      mineOnly: false,
    }

    pDropdown.vm.$emit('update:model-value', [template])
    pButtonApply.trigger('click')
    await nextTick()

    const emittedApply = wrapper?.emitted('apply')?.at(0)
    const emittedModelValue = wrapper?.emitted('update:model-value')?.at(0)

    expect(emittedApply).toStrictEqual([expectedFilters])
    expect(emittedModelValue).toStrictEqual([false])
  })

  it('should emit close drawer when user clicks on close button', async () => {
    const wrapper = createWrapper({ modelValue: true })
    await flushPromises()

    const pButtons = wrapper.findAllComponents({ name: 'PButton' })
    const pButtonClose = pButtons[0]

    pButtonClose.trigger('click')
    await nextTick()

    const emittedApply = wrapper?.emitted('apply')?.at(0)
    const emittedModelValue = wrapper?.emitted('update:model-value')?.at(0)

    expect(emittedApply).toBeUndefined()
    expect(emittedModelValue).toStrictEqual([false])
  })
})

