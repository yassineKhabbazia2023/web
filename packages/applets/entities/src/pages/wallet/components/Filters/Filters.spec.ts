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
    const expectedProps = {
      'modelValue': [],
      'pFilters': [{
        'pCode': 1,
        'pColor': 'warning',
        'pContent': 'To Deploy',
        'pIcon': 'PIArrowUpCircle',
        'pValue': 3,
      }, {
        'pCode': 2,
        'pColor': 'amethyste',
        'pContent': 'In progress',
        'pIcon': 'PIArrowRepeat',
        'pValue': 0,
      }, {
        'pCode': 3,
        'pColor': 'success',
        'pContent': 'Connected',
        'pIcon': 'PICheckCircle',
        'pValue': 0,
      }, {
        'pCode': undefined,
        'pColor': 'gray-900',
        'pContent': 'Declared',
        'pDisabled': true,
        'pIcon': 'PIPatchCheck',
        'pValue': 6,
      }, {
        'pCode': undefined,
        'pColor': 'gray-900',
        'pContent': 'Connected',
        'pDisabled': true,
        'pIcon': 'PIPower',
        'pValue': 0,
      }, {
        'pCode': undefined,
        'pColor': 'gray-900',
        'pContent': 'Guest(s)',
        'pDisabled': true,
        'pIcon': 'PIPerson',
        'pValue': 0,
      }],
    }

    const pFilterGroup = wrapper.findComponent({ name: 'PFilterGroup' })
    expect(pFilterGroup.props()).toStrictEqual(expectedProps)
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
