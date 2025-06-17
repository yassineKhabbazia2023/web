import { nextTick } from 'vue'
import { shallowMount } from '@vue/test-utils'
import type { PFormSearchProps } from './PFormSearch.types'

import PFormSearch from '.'

const validateMock = vi.fn()

const defaultProps: PFormSearchProps = {
  pSearchInvalidMessage: 'Minimum 3 caractères',
  pPlaceholder: 'veuillez saisir une valeur',
  pAutofocus: false,
}

function createWrapper(override: Partial<PFormSearchProps> = {}) {
  const props = {
    ...defaultProps,
    ...override,
  }

  return shallowMount(PFormSearch, {
    props,
    global: {
      stubs: {
        PInput: {
          name: 'PInput',
          template: '<div />',
          props: ['modelValue'],
        },
        PForm: {
          name: 'PForm',
          template: '<div><slot /></div>',
          props: [
            'pRules',
            'pModel',
          ],
          methods: {
            validate: validateMock,
          },
        },
        PFormItem: {
          name: 'PFormItem',
          template: '<div><slot /></div>',
          props: ['pLabel'],
        },
      },
    },
  })
}

describe('PFormSearch', () => {
  afterEach(() => {
    vi.useRealTimers()
  })
  beforeEach(() => {
    vi.useFakeTimers()
  })
  describe('display', () => {
    it('should display properly', async () => {
      const wrapper = createWrapper()

      await expect(wrapper.html()).toMatchFileSnapshot('__snap__/PFormSearch.html')
    })

    it('should display properly with pClearable and pSize', async () => {
      const wrapper = createWrapper({
        pSize: 'large',
        pClearable: true,
      })

      await expect(wrapper.html()).toMatchFileSnapshot('__snap__/PFormSearch.large.clearable.html')
    })
  })
  describe('props', () => {
    it('should clear search when call exposed clearSearch()', async () => {
      const searchValueMock = 'search value'
      const wrapper = createWrapper({
        pSearch: searchValueMock,
      })
      const pInput = wrapper.findComponent({ name: 'PInput' })

      expect(pInput.props('modelValue')).toBe(searchValueMock)

      wrapper.vm.clearSearch()
      await nextTick()

      expect(pInput.props('modelValue')).toBe('')
    })
  })

  describe('event', () => {
    it('should emit update:pSearch when form is valid', async () => {
      validateMock.mockResolvedValue(true)
      const newSearch = 'new search value'
      const expectedEmitted = [[newSearch]]

      const wrapper = createWrapper()
      const pInput = wrapper.findComponent({ name: 'PInput' })
      pInput.vm.$emit('input', newSearch)
      await nextTick()

      expect(wrapper.emitted('update:pSearch')).toBeUndefined()
      vi.advanceTimersByTime(500)

      expect(wrapper.emitted('update:pSearch')).toStrictEqual(expectedEmitted)
    })

    it('should NOT emit update:pSearch when form is invalid', async () => {
      validateMock.mockResolvedValue(false)
      const newSearch = 'search value'

      const wrapper = createWrapper()
      const pInput = wrapper.findComponent({ name: 'PInput' })
      pInput.vm.$emit('input', newSearch)
      await nextTick()

      expect(wrapper.emitted('update:pSearch')).toBeUndefined()
    })
  })
})
