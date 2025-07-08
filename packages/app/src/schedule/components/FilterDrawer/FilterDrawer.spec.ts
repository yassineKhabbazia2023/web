import { nextTick } from 'vue'
import { flushPromises, shallowMount } from '@vue/test-utils'
import { expect, describe, it, vi } from 'vitest'
import { scheduleServicesMock } from '@app/__mocks__/schedule.service.mocks'
import type { FilterDrawerProps, Filters } from './FilterDrawerTypes'
import type { Status } from '@app/schedule/models/Deadline'
import { AmplitudeService as AmplitudeServiceMock } from '@pulse/common/services/amplitude'

import FilterDrawer from '.'

vi.mock('@app/schedule/services', () => scheduleServicesMock)

vi.mock('@pulse/common/services/amplitude')

async function createWrapper(override: Partial<FilterDrawerProps> = {}) {
  const defaultProps: FilterDrawerProps = {
    modelValue: false,
    targets: [],
    templates: [],
    status: [],
    mineOnly: false,
    isCollab: true,
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
          emits: [
            'open',
            'close-drawer-button',
          ],
        },
        PForm: {
          name: 'PForm',
          template: '<div><slot /></div>',
          props: ['pModel'],
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

  describe('displayed field', () => {
    const fieldNames = [
      'filter-drawer-field-targets',
      'filter-drawer-field-templates',
      'filter-drawer-field-status',
    ]
    const tests = [{
      isCollab: false,
      expectedFieldTestIds: fieldNames,
    }, {
      isCollab: true,
      expectedFieldTestIds: [
        ...fieldNames,
        'filter-drawer-field-mineOnly',
      ],
    }]
    it.each(tests)('should display proper fields when isCollab is $isCollab', async ({
      isCollab,
      expectedFieldTestIds,
    }) => {
      const wrapper = await createWrapper({ isCollab })
      const pFields = wrapper.findAll('[data-testid^="filter-drawer-field-"]')

      const fieldTestIds = pFields?.map((field) => field.attributes('data-testid'))

      expect(pFields).toHaveLength(expectedFieldTestIds.length)
      expect(fieldTestIds).toStrictEqual(expectedFieldTestIds)
    })
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
    expect(AmplitudeServiceMock.track).toHaveBeenCalledOnce()
  })

  it('should reset filters when user clicks on reset button', async () => {
    const wrapper = await createWrapper({ modelValue: true })

    const pButtons = wrapper.findAllComponents({ name: 'PButton' })
    const pButtonClose = pButtons[0]
    const newTargets = [123]
    const expectedFiltersBefore: Filters = {
      targets: newTargets,
      templates: [],
      status: [],
      mineOnly: false,
    }
    const expectedFiltersAfter: Filters = {
      ...expectedFiltersBefore,
      targets: [],
      mineOnly: true,
    }

    const pForm = wrapper.findComponent({ name: 'PForm' })
    const pFields = wrapper.findAllComponents({ name: 'PFieldStringMultiple' })
    const firstField = pFields?.at(0)

    firstField?.vm?.$emit('update:model-value', newTargets)
    expect(pForm.props('pModel')).toStrictEqual(expectedFiltersBefore)

    pButtonClose.trigger('click')
    await nextTick()

    expect(pForm.props('pModel')).toStrictEqual(expectedFiltersAfter)
  })
})
