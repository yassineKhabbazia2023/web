import { shallowMount } from '@vue/test-utils'
import * as VueRouter from 'vue-router'
import { useUserStore } from '@pulse/common/stores'
import { getStoreMock } from '@pulse/common/mocks'
import { RouteParam } from '@pulse/common/enums'

import Users from './'

const userStoreMock = getStoreMock(useUserStore)

function createWrapper() {
  return shallowMount(Users)
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
    userStoreMock.isCollab = isCollab
    const wrapper = createWrapper()

    expect(wrapper.findComponent({ name: shouldExist }).exists()).toBeTruthy()
    expect(wrapper.findComponent({ name: shouldNotExist }).exists()).toBeFalsy()
  })

  describe('entityId', () => {
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
              [RouteParam.ENTITY_ID]: mockedAccountId,
            },
          } as any
        })
      const wrapper = createWrapper()
      const usersClient = wrapper.findComponent({ name: 'UsersClient' })

      expect(usersClient.props('entityId')).toStrictEqual(expected)
    })
  })
})
