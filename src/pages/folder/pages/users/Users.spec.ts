import { createTestingPinia } from '@pinia/testing'
import { commonStore } from '@kpmg/common'
import { shallowMount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import * as VueRouter from 'vue-router'
import Users from './'

const pinia = createTestingPinia()

function createWrapper() {
  return shallowMount(Users, {
    global: {
      plugins: [pinia],
    },
  })
}

vi.mock('vue-router', () => ({
  useRoute: () => ({
    matched: [],
  }),
}))

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

  describe('currentEntityId', () => {
    const tests = [{
      parentName: 'folder',
      mockedAccountId: 63,
      expected: 63,
    }, {
      parentName: 'folder',
      mockedAccountId: undefined,
      expected: undefined,
    }, {
      parentName: '',
      mockedAccountId: 63,
      expected: undefined,
    }, {
      parentName: '',
      mockedAccountId: undefined,
      expected: undefined,
    }]
    it.each(tests)('should return $expected when mockedAccountId, parentName equals $mockedAccountId, $parentName', ({
      parentName,
      mockedAccountId,
      expected,
    }) => {
      vi
        .spyOn(VueRouter, 'useRoute')
        .mockImplementation(() => {
          return {
            matched: [{
              name: parentName,
            }, {
              name: 'users',
            }],
            params: {
              id: mockedAccountId,
            },
          } as any
        })
      const wrapper = createWrapper()
      const usersClient = wrapper.findComponent({ name: 'UsersClient' })

      expect(usersClient.props('currentEntityId')).toStrictEqual(expected)
    })
  })
})
