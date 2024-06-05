import { createTestingPinia } from '@pinia/testing'
import { commonStore } from '@kpmg/common'
import { shallowMount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import Users from './'

const pinia = createTestingPinia()

function createWrapper() {
  return shallowMount(Users, {
    global: {
      plugins: [pinia],
    },
  })
}

describe('test User', () => {
  const tests = [{
    isCollab: true,
    shouldExist: 'UsersCollab',
    shouldNotExist: 'UsersClient',
  }, {
    isCollab: false,
    shouldExist: 'UsersClient',
    shouldNotExist: 'UsersCollab',
  }]
  it.each(tests)('should load $shouldExist when isCollab is $isCollab', ({
    isCollab,
    shouldExist,
    shouldNotExist,
  }) => {
    const store = commonStore()
    // @ts-expect-error: Getter is read only
    store.isCollab = isCollab
    const wrapper = createWrapper()

    expect(wrapper.findComponent({ name: shouldExist }).exists()).toBeTruthy()
    expect(wrapper.findComponent({ name: shouldNotExist }).exists()).toBeFalsy()
  })
})
