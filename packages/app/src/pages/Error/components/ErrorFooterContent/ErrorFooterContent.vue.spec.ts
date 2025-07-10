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
  it.each(tests)('should display proper Html', async ({
    isCollab,
  }) => {
    userStoreMock.isCollab = isCollab

    const wrapper = shallowMount(ErrorFooterContent)
    const snapPath = `__snaps__/wrapper.${isCollab ? 'collab' : 'client'}.snap`

    await expect(wrapper.html()).toMatchFileSnapshot(snapPath)
  })
})
