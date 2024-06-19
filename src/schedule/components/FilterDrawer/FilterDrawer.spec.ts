import { nextTick } from 'vue'
import { flushPromises, shallowMount } from '@vue/test-utils'
import { ScheduleServicesMock } from '@/schedule/tests/mocks/commonViMock'
import FilterDrawer from '.'
import { expect, describe, it, vi } from 'vitest'
import type { FilterDrawerProps, Filters } from './FilterDrawerTypes'
import type { Status } from '@/schedule/models/Deadline'

vi.mock('@/schedule/services', () => ScheduleServicesMock)

async function createWrapper(override: Partial<FilterDrawerProps> = {}) {
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

  const wrapper = shallowMount(FilterDrawer, {
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
        PField: {
          name: 'PField',
          template: '<div />',
          props: ['modelValue'],
          emits: ['update:model-value'],
        },
        PButton: true,
      },
    },
  })
  await flushPromises()

  return wrapper
}

describe('test FilterDrawer', () => {
  it('renders the component when modelValue is true', async () => {
    const wrapper = await createWrapper({ modelValue: true })
    const pDrawer = wrapper.findComponent({ name: 'PDrawer' })

    expect(pDrawer.props()).toBeTruthy()
  })

  it('should emit update:model-value event when drawer closes', async () => {
    const wrapper = await createWrapper({ modelValue: true })
    const pDrawer = wrapper.findComponent({ name: 'PDrawer' })

    pDrawer.vm.$emit('close-drawer-button')
    await nextTick()

    expect(wrapper.emitted('update:model-value')).toStrictEqual([[false]])
  })

  it('should apply props in filter when drawer emit open', async () => {
    const target = 101
    const template = 'Bilan'
    const targets = [target]
    const templates = [template]
    const status: Status[] = ['Todo']
    const mineOnly = true
    const wrapper = await createWrapper({
      modelValue: false,
      targets,
      templates,
      status,
      mineOnly,
    })

    const pDrawer = wrapper.findComponent({ name: 'PDrawer' })

    pDrawer.vm.$emit('open')
    await nextTick()

    const pFields = wrapper.findAllComponents({ name: 'PFieldStringMultiple' })

    expect(pFields?.at(0)?.props('modelValue')).toStrictEqual(targets)
    expect(pFields?.at(1)?.props('modelValue')).toStrictEqual(templates)
    expect(pFields?.at(2)?.props('modelValue')).toStrictEqual(status)
    expect(pFields?.at(3)?.props('modelValue')).toStrictEqual(mineOnly)
  })

  it('should emit active filters and close drawer when user clicks on apply button', async () => {
    const wrapper = await createWrapper({ modelValue: true })

    const pFieldStringMultiples = wrapper.findAllComponents({ name: 'PFieldStringMultiple' })
    const pFieldStringMultiple = pFieldStringMultiples.at(1)
    const pButtons = wrapper.findAllComponents({ name: 'PButton' })
    const pButtonApply = pButtons[1]
    const template = 'TVA'
    const expectedFilters: Filters = {
      targets: [],
      templates: [template],
      status: [],
      mineOnly: false,
    }

    pFieldStringMultiple?.vm?.$emit('update:model-value', [template])
    pButtonApply.trigger('click')
    await nextTick()

    const emittedApply = wrapper?.emitted('apply')?.at(0)
    const emittedModelValue = wrapper?.emitted('update:model-value')?.at(0)

    expect(emittedApply).toStrictEqual([expectedFilters])
    expect(emittedModelValue).toStrictEqual([false])
  })

  it('should emit close drawer when user clicks on close button', async () => {
    const wrapper = await createWrapper({ modelValue: true })

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

