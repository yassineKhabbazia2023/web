import { flushPromises, mount, type VueWrapper } from '@vue/test-utils'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { getMockedEntitiesStatistics } from './FiltersMocks'
import { EntityStatus } from './FiltersTypes'
import Filters from '.'

const pinia = createPinia()
const statistics = getMockedEntitiesStatistics()

vi.mock('@pulse/common', () => ({
  commonApi: () => ({
    gateway: {
      get: () => Promise.resolve({
        data: statistics,
      }),
    },
  }),
}))

describe('filter', () => {
  let wrapper: VueWrapper

  beforeEach(async () => {
    wrapper = mount(Filters)
    setActivePinia(pinia)
    await flushPromises()
  })

  it('renders filter correctly', async () => {
    const expectedProps1 = {
      'modelValue': [],
      'pFilters': [{
        'pCode': 1,
        'pColor': 'warning',
        'pContent': 'To Deploy',
        'pIconName': 'arrowUpCircle',
        'pValue': 3,
      }, {
        'pCode': 2,
        'pColor': 'amethyste',
        'pContent': 'In progress',
        'pIconName': 'arrowRepeat',
        'pValue': 0,
      }, {
        'pCode': 3,
        'pColor': 'success',
        'pContent': 'Connected',
        'pIconName': 'checkCircle',
        'pValue': 0,
      }],
    }
    const expectedProps2 = {
      'modelValue': [],
      'pFilters': [{
        'pCode': undefined,
        'pColor': 'gray-900',
        'pContent': 'Declared',
        'pDisabled': true,
        'pIconName': 'patchCheck',
        'pValue': 6,
      }, {
        'pCode': undefined,
        'pColor': 'gray-900',
        'pContent': 'Connected',
        'pDisabled': true,
        'pIconName': 'power',
        'pValue': 0,
      }, {
        'pCode': undefined,
        'pColor': 'gray-900',
        'pContent': 'Guest(s)',
        'pDisabled': true,
        'pIconName': 'person',
        'pValue': 0,
      }],
    }

    const pFilterGroups = wrapper.findAllComponents({ name: 'PFilterGroup' })
    const [pFilterGroup1, pFilterGroup2] = pFilterGroups
    expect(pFilterGroup1.props()).toStrictEqual(expectedProps1)
    expect(pFilterGroup2.props()).toStrictEqual(expectedProps2)
  })

  it('should emit event filterByStatus when click on the entityStatus button', async () => {
    const pFilterGroup = wrapper.findComponent({ name: 'PFilterGroup' })
    pFilterGroup.vm.$emit('toggle', EntityStatus.TO_DEPLOY, true)

    expect(wrapper.emitted('filterByStatus')).toStrictEqual([[EntityStatus.TO_DEPLOY]])
  })

  it('should emit event removeFilter when the close event is triggered', async () => {
    const pFilterGroup = wrapper.findComponent({ name: 'PFilterGroup' })
    pFilterGroup.vm.$emit('toggle', EntityStatus.TO_DEPLOY, false)

    expect(wrapper.emitted('removeFilter')).toBeTruthy()
  })
})
