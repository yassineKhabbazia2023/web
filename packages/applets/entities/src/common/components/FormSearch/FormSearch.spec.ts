import { beforeEach, describe, expect, it } from 'vitest'
import { flushPromises, mount, type VueWrapper } from '@vue/test-utils'
import FormSearch from './'

const createWrapper = (): VueWrapper<any> =>
  mount(FormSearch)

let wrapper: VueWrapper<any>
const getInputSearch = () => wrapper.find('input[type="search"]')

describe('formSearch', () => {
  beforeEach(() => {
    wrapper = createWrapper()
  })

  // FIXME : skipped while integrating SG in monorepo
  it.skip('displays an error if the user search with less than 3 characters', async () => {
    const getFormItemIsError = () => wrapper.find('.el-form-item.is-error')

    expect(getFormItemIsError().exists()).toBeFalsy()

    await getInputSearch().setValue('az')
    await getInputSearch().trigger('keyup')
    expect(getFormItemIsError().exists()).toBeTruthy()
  })

  const SEARCH_VALUES = [
    // 'ab', FIXME : skipped while integrating SG in monorepo
    'abc',
  ]
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

  it('should trigger the submit event when the form is submitted',
    async () => {
      await getInputSearch().setValue('sy')
      const pForm = wrapper.findComponent({ name: 'PForm' })
      await pForm.trigger('submit.prevent')
      await flushPromises()

      expect(pForm.emitted('submit')).toBeTruthy()
    },
  )
})
