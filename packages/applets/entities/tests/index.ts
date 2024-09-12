import { describe, expect, it } from 'vitest'
import { nextTick } from 'vue'

export const noResult = (wrapper: any) => {
  describe('test noResult', () => {
    it('can display a no results message', async () => {
      const getNoResultComponent = () => wrapper.findComponent({ name: 'NoResult' })
      expect(getNoResultComponent().exists()).toBeFalsy()
      wrapper.vm.state.data = []
      await nextTick()
      expect(getNoResultComponent().exists()).toBeTruthy()
    })
  })
}
