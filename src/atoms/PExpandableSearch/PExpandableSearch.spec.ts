/* eslint-disable vitest/no-commented-out-tests */
import { describe, it, expect } from 'vitest'
import type { PExpandableSearchProps } from './PExpandableSearchTypes'
import { VueWrapper, mount } from '@vue/test-utils'
import PExpandableSearch from './'
import { nextTick } from 'vue'
import PButton from '../PButton'
import PInput from '../PInput'

const pPlaceholder = 'write your text in here'
const defaultProps: PExpandableSearchProps = {
  pPlaceholder
}

const findPbutton = (wrapper: VueWrapper) => {
  return wrapper.findComponent(PButton)
}

const findPinput = (wrapper: VueWrapper) => {
  return wrapper.findComponent(PInput)
}

const findInput = (wrapper: VueWrapper) => {
  return wrapper.find('input')
}

const expandSearch = async (wrapper: VueWrapper) => {

  const pButton = findPbutton(wrapper)
  await nextTick()
  expect(pButton.exists()).toBeTruthy()
  await pButton.trigger('click')
}

const createWrapper = (props = defaultProps) =>
  mount(PExpandableSearch, {
    props
  })
describe('pExpandableSearch', () => {
  describe('props', () => {
    it('should bind the placeholder prop correctly', async () => {
      const wrapper = createWrapper()
      await expandSearch(wrapper)

      const pInput = findPinput(wrapper)
      await nextTick()

      expect(pInput.exists()).toBeTruthy()
      expect(pInput.props('pPlaceholder')).toBe(pPlaceholder)
    })

  })

  describe('interactions', () => {
    it('should expand search bar and hide search initial button upon button click', async () => {
      const wrapper = createWrapper()

      const pButton = findPbutton(wrapper)
      const pInputHidden = findPinput(wrapper)

      expect(pInputHidden.classes().includes('isExpanded')).toBeFalsy()

      expect(pButton.exists()).toBeTruthy()
      await pButton.trigger('click')
      await nextTick()

      const pInput = findPinput(wrapper)
      expect(pInput.classes().includes('isExpanded')).toBeTruthy()
      expect(wrapper.emitted('search-expand-change')).toStrictEqual([[true]])

    })
    it('should close search bar upon PInput clear event', async () => {
      const wrapper = createWrapper()

      await expandSearch(wrapper)

      const pInput = findPinput(wrapper)
      await pInput.vm.$emit('clear')

      await nextTick()

      const pInputHidden = findPinput(wrapper)
      await nextTick()
      expect(pInputHidden.classes().includes('isExpanded')).toBeFalsy()

    })
    it('should emit p-input event upon PInput input event', async () => {
      const wrapper = createWrapper()

      await expandSearch(wrapper)

      await wrapper.find('input').setValue('test')

      await nextTick()

      expect(wrapper.emitted('input')).toBeTruthy()
      expect(wrapper.emitted('input')).toStrictEqual([['test']])
    })

    it('should emit search-expand-change and clear input upon pinput blur event', async () => {
      const wrapper = createWrapper()

      await expandSearch(wrapper)

      const pInputWrapper = findPinput(wrapper)

      await pInputWrapper.setValue('test')

      await nextTick()

      const input = findInput(pInputWrapper)
      await input.trigger('focus')
      await nextTick()

      await input.trigger('blur')
      await nextTick()

      expect(wrapper.emitted('search-expand-change')).toBeTruthy()
      expect(pInputWrapper.classes().includes('isExpanded')).toBeFalsy()
      expect(input.element.value).toBe('')
    })
  })
})
