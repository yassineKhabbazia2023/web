import { expect, it } from 'vitest'
import { VueWrapper } from '@vue/test-utils'
import { nextTick } from 'vue'

export const searchError = (wrapper: VueWrapper) => {
  it('displays an error if the user search with less than 3 characters', async () => {
    const getFormItemIsError = () => wrapper.find('.el-form-item.is-error')
    const inputSearch = wrapper.find('input[type="search"]')
    expect(getFormItemIsError().exists()).toBeFalsy()
    await inputSearch.setValue('az')
    await inputSearch.trigger('keyup')
    expect(getFormItemIsError().exists()).toBeTruthy()
  })
}

export const noResult = async (wrapper: any) => {
  it('can display a no results message', async () => {
    const getNoResultComponent = () => wrapper.findComponent({ name: 'NoResult' })
    expect(getNoResultComponent().exists()).toBeFalsy()
    wrapper.vm.state.data = []
    await nextTick()
    expect(getNoResultComponent().exists()).toBeTruthy()
  })
}
