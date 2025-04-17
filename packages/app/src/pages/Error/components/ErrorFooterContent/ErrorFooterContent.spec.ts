import { shallowMount } from '@vue/test-utils'
import ErrorFooterContent from './ErrorFooterContent.vue'
import { useUserStore } from '@pulse/common/stores'
import { getStoreMock } from '@pulse/common/mocks'

const userStoreMock = getStoreMock(useUserStore)

describe('test ErrorFooter', () => {
  const tests = [{
    isCollab: false,
  }, {
    isCollab: true,
  }]
  it.each(tests)('should display proper Html', ({
    isCollab,
  }) => {
    userStoreMock.isCollab = isCollab

    const wrapper = shallowMount(ErrorFooterContent)
    const snapPath = `__snaps__/wrapper.${isCollab ? 'collab' : 'client'}.snap`

    expect(wrapper.html()).toMatchFileSnapshot(snapPath)
  })
})
