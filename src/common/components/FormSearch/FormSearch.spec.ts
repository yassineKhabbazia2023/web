import { beforeEach, describe, expect, it } from 'vitest'
import type { VueWrapper } from '@vue/test-utils'
import { flushPromises, mount } from '@vue/test-utils'
import FormSearch from './'

const createWrapper = (): VueWrapper<any> =>
  mount(FormSearch)

let wrapper: VueWrapper<any>
const getInputSearch = () => wrapper.find('input[type="search"]')

describe('formSearch', () => {
  beforeEach(() => {
    wrapper = createWrapper()
  })

  it('displays an error if the user search with less than 3 characters', async () => {
    const getFormItemIsError = () => wrapper.find('.el-form-item.is-error')

    expect(getFormItemIsError().exists()).toBeFalsy()

    await getInputSearch().setValue('az')
    await getInputSearch().trigger('keyup')
    expect(getFormItemIsError().exists()).toBeTruthy()
  })

  const SEARCH_VALUES = ['ab', 'abc']
  it.each(SEARCH_VALUES)(
    'emits an event searchValueSubmitted with the search value depending of form rules',
    async (searchValue) => {
      expect(wrapper.emitted('searchValueSubmitted')).toBeFalsy()

      await getInputSearch().setValue(searchValue)
      await getInputSearch().trigger('keyup')
      await flushPromises()

      searchValue.length < 3
        ? expect(wrapper.emitted('searchValueSubmitted')).toBeFalsy()
        : expect(wrapper.emitted('searchValueSubmitted')).toStrictEqual([[searchValue]])
    },
  )
})
