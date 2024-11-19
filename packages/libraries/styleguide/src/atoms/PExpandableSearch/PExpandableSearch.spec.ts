/* eslint-disable vitest/no-commented-out-tests */
import { describe, it, expect, vi } from 'vitest'
import type { PExpandableSearchProps } from './PExpandableSearchTypes'
import type { VueWrapper } from '@vue/test-utils'
import { shallowMount } from '@vue/test-utils'
import PExpandableSearch from './'
import { nextTick } from 'vue'
import PButton from '../PButton'
import PInput from '../PInput'

const pPlaceholder = 'write your text in here'
const defaultProps: PExpandableSearchProps = {
  pPlaceholder,
  pIsSearchShrinkable: true,
  pIsSearchOpen: false,
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

const focusSpy = vi.fn()

const createWrapper = (props = defaultProps) =>
  shallowMount(PExpandableSearch, {
    props,
    global: {
      stubs: {
        PInput: {
          name: 'PInput',
          template: '<input />',
          methods: {
            focus: focusSpy,
          },
          props: [
            'modelValue',
            'pPlaceholder',
          ],
          emits: ['update:modelValue'],
        },
      },
    },
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

      const inputElement = wrapper.findComponent({ name: 'PInput' })
      expect(inputElement.exists()).toBeTruthy()
      inputElement.vm.$emit('update:modelValue', 'test')
      await nextTick()

      expect(wrapper.emitted('update:p-search-content')).toBeTruthy()
      expect(wrapper.emitted('update:p-search-content')).toStrictEqual([['test']])
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

    it('should not shrink search input upon pinput blur event and pIsSearchShrinkable  false', async () => {
      const updatedProps = { ...defaultProps, pIsSearchShrinkable: false }
      const wrapper = createWrapper(updatedProps)

      await expandSearch(wrapper)

      const pInputWrapper = findPinput(wrapper)

      const newPSearchContent = 'test'
      await pInputWrapper.setValue(newPSearchContent)

      await nextTick()

      const input = findInput(pInputWrapper)
      input.trigger('focus')
      await nextTick()

      input.trigger('blur')
      await nextTick()

      expect(pInputWrapper.classes().includes('isExpanded')).toBeTruthy()
      expect(wrapper.emitted('update:p-search-content')).toStrictEqual([[newPSearchContent]])
    })

    it('should not shrink search input and clear the content upon pIsSearchOpen value change', async () => {
      const updatedProps = {
        ...defaultProps,
        pIsSearchShrinkable: false,
        pIsSearchOpen: true,
      }
      const wrapper = createWrapper(updatedProps)

      const pInputWrapper = findPinput(wrapper)

      await pInputWrapper.setValue('test')

      wrapper.setProps({ pIsSearchOpen: false })
      await nextTick()

      expect(pInputWrapper.classes().includes('isExpanded')).toBeFalsy()
    })

    it('should emit "enter" when PInput emits keyup.enter', async () => {
      const updatedProps = {
        ...defaultProps,
        pIsSearchShrinkable: false,
        pIsSearchOpen: true,
      }
      const wrapper = createWrapper(updatedProps)
      const pInput = wrapper.find('[data-testid="p-expandable-search-input"]')

      await pInput.trigger('keyup.enter')

      expect(wrapper.emitted('enter')).toStrictEqual([[]])
    })

    it('should call PInput.focus() on expand when pFocusOnExpand is true', async () => {
      const props = {
        pIsSearchOpen: false,
        pFocusOnExpand: true,
      }
      const wrapper = createWrapper(props)
      const pButton = findPbutton(wrapper)
      await pButton.trigger('click')

      expect(focusSpy).toHaveBeenCalledOnce()
    })
  })
})
