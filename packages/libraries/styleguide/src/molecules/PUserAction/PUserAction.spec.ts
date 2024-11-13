import { type VueWrapper, mount } from '@vue/test-utils'
import PUserAction from '.'
import { describe, it, expect } from 'vitest'
import type { PUserActionProps } from './PUserActionTypes'
import { getMockedOptions } from './PUserActionMocks'

const defaultProps: PUserActionProps = {
  pProfile: '',
  pTitle: '',
  pDescription: '',
}

function getWrapper(specificProps: Partial<PUserActionProps> = {}) {
  const props: PUserActionProps = {
    ...defaultProps,
    ...specificProps,
  }
  const wrapper = mount(PUserAction, { props })

  return wrapper
}

function mountAndGetComponent(
  specificProps: Partial<PUserActionProps> = {},
  componentSelector: string,
) {
  const wrapper = getWrapper(specificProps)
  const component = wrapper.findComponent(componentSelector)

  return component
}

function mountAndGetElement(
  specificProps: Partial<PUserActionProps> = {},
  componentSelector: string,
) {
  const wrapper = getWrapper(specificProps)
  const component = wrapper.find(componentSelector)

  return component
}

describe('testing PUserAction', () => {
  describe('profile', () => {
    const componentSelector = '[data-testid=p-user-action-profile]'
    it('should contain profile when pProfile is not empty', () => {
      const pProfile = 'my profile'
      const profile = mountAndGetComponent({ pProfile }, componentSelector)

      expect(profile.text()).toBe(pProfile)
    })

    it('should not contain profile when pProfile is empty', () => {
      const profile = mountAndGetComponent({}, componentSelector)

      expect(profile.exists()).toBeFalsy()
    })
  })

  describe('title', () => {
    const elementSelector = '.p-user-action__title'
    it('should contain title', () => {
      const pTitle = 'my title'
      const title = mountAndGetElement({ pTitle }, elementSelector)

      expect(title.text()).toBe(pTitle)
    })
  })

  describe('description', () => {
    const elementSelector = '.p-user-action__description'
    it('should contain description', () => {
      const pDescription = 'my description'
      const description = mountAndGetElement({ pDescription }, elementSelector)

      expect(description.text()).toBe(pDescription)
    })
  })

  describe('tagContent', () => {
    const componentSelector = '[data-testid=p-user-action-tag-content]'
    it('should contain tagContent if not empty', () => {
      const pTagContent = 'tag content'
      const tagContent = mountAndGetComponent({ pTagContent }, componentSelector)

      expect(tagContent.text()).toBe(pTagContent)
    })

    it('should NOT contain tagContent if empty', () => {
      const tagContent = mountAndGetComponent({}, componentSelector)

      expect(tagContent.exists()).toBeFalsy()
    })
  })

  describe('role', () => {
    const elementSelector = '.p-user-action__role'
    it('should contain role if not empty', () => {
      const pRole = 'tag content'
      const role = mountAndGetElement({ pRole }, elementSelector)

      expect(role.text()).toBe(pRole)
    })

    it('should NOT contain role if empty', () => {
      const role = mountAndGetElement({}, elementSelector)

      expect(role.exists()).toBeFalsy()
    })
  })

  describe('input', () => {
    const inputComponentSelector = '[class*="p-user-action__input"]'

    it('should contain input if pShowInput is true', () => {
      const pShowInput = true
      const input = mountAndGetComponent({ pShowInput }, inputComponentSelector)

      expect(input.exists()).toBeTruthy()
    })

    it('should emit update:pInputValue when user enter in input field', async () => {
      const pShowInput = true
      const inputValue = 'new value'
      const wrapper = getWrapper({ pShowInput })
      const inputComponent = wrapper.findComponent(inputComponentSelector) as VueWrapper
      await inputComponent.vm.$emit('update:modelValue', inputValue)

      expect(wrapper.emitted('update:pInputValue')).toStrictEqual([[inputValue]])
    })

    it('should NOT contain input if pShowInput is false', () => {
      const input = mountAndGetComponent({}, inputComponentSelector)

      expect(input.exists()).toBeFalsy()
    })
  })

  describe('options', () => {
    const optionsComponentSelector = '[data-testid="p-user-action-options"]'
    const pOptions = getMockedOptions()

    it('should contain input if pShowInput is true', () => {
      const pShowOptions = true
      const optionsComponent = mountAndGetComponent({ pShowOptions, pOptions }, optionsComponentSelector)

      expect(optionsComponent.exists()).toBeTruthy()
    })

    it('should emit update:pOptionsValue when user selects an option', async () => {
      const pShowOptions = true
      const firstOptionValue = pOptions.at(0)?.pValue
      const wrapper = getWrapper({ pShowOptions, pOptions })
      const optionsComponent = wrapper.findComponent(optionsComponentSelector) as VueWrapper
      await optionsComponent.vm.$emit('update:modelValue', firstOptionValue)

      expect(wrapper.emitted('update:pOptionsValue')).toStrictEqual([[firstOptionValue]])
    })

    it('should NOT contain input if pShowInput is false', () => {
      const input = mountAndGetComponent({}, optionsComponentSelector)

      expect(input.exists()).toBeFalsy()
    })
  })

  describe('delete', () => {
    const deleteElementSelector = '[class*="p-user-action__delete"]'

    it('should contain delete icon if pShowDelete is true', () => {
      const pShowDelete = true
      const deleteElement = mountAndGetElement({ pShowDelete }, deleteElementSelector)

      expect(deleteElement.exists()).toBeTruthy()
    })

    it('should emit click-delete if click on delete icon', () => {
      const pShowDelete = true
      const deleteIconSelector = '[data-testid="p-user-action-delete-icon"]'
      const wrapper = getWrapper({ pShowDelete })

      const deleteIcon = wrapper.findComponent(deleteIconSelector) as VueWrapper
      deleteIcon.vm.$emit('click')

      expect(wrapper.emitted('click-delete')).toBeTruthy()
    })

    it('should NOT contain delete icon if pShowDelete is false', () => {
      const deleteElement = mountAndGetElement({}, deleteElementSelector)

      expect(deleteElement.exists()).toBeFalsy()
    })
  })

  describe('warning', () => {
    it('should contain warning alert with content when set', () => {
      const wrapper: VueWrapper<any> = getWrapper({
        pWarningContent: 'Test de mon alerte',
      })
      const alert = wrapper.find('[data-testid="p-user-action-alert"]')
      expect(alert.exists()).toBeTruthy()
      expect(alert.text()).toContain('Test de mon alerte')
    })
    it('should not contain warning alert', () => {
      const wrapper: VueWrapper<any> = getWrapper()
      const alert = wrapper.find('[data-testid="p-user-action-alert"]')
      expect(alert.exists()).toBeFalsy()
    })
  })
})
