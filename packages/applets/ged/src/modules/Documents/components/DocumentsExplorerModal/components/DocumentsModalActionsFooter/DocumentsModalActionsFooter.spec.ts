import { createPinia } from 'pinia'
import { nextTick } from 'vue'
import { type VueWrapper, mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { PButton } from '@pulse/styleguide/components'
import type { ButtonAction } from '@ged/modules/common/Types/ButtonAction'
import DocumentsModalActionsFooter
  from '@ged/modules/Documents/components/DocumentsExplorerModal/components/DocumentsModalActionsFooter'
import { type ModalActionsProps }
  from './DocumentsModalActionsFooterTypes'

const btnActions: Array<ButtonAction> = [
  {
    buttonName: '',
    buttonType: 'primary',
    buttonIcon: '',
    buttonActionName: 'add-action-click',
    round: false,
    circle: false,
    loading: false,
    disabled: false,
  },
  {
    buttonName: 'Annuler',
    buttonType: 'warning',
    buttonIcon: '',
    buttonActionName: 'cancel-action-click',
    round: false,
    circle: false,
    loading: false,
    disabled: false,
  },
]

const defaultProps: ModalActionsProps = {
  modalActionsButtons: btnActions,
}

const pinia = createPinia()

const createWrapper = (
  props: ModalActionsProps = defaultProps,
): VueWrapper<any> => {
  return mount(DocumentsModalActionsFooter, {
    props,
    global: {
      plugins: [pinia],
    },
  })
}
describe('documentsModalActionsFooter', () => {
  describe('props', () => {
    it('should render two PButton properly binded', async () => {
      const wrapper = createWrapper()
      expect(wrapper.exists()).toBeTruthy()

      await nextTick()

      const btns = wrapper.findAllComponents(PButton)

      expect(btns).toHaveLength(2)
      expect(btns[0].props('pType')).toBe('primary')
      expect(btns[1].props('pType')).toBe('warning')
      expect(btns[0].props('pCircle')).toBeTruthy()
      expect(btns[1].props('pCircle')).toBeFalsy()
      expect(btns[0].props('pLoading')).toBeFalsy()
      expect(btns[1].props('pLoading')).toBeFalsy()
      expect(btns[0].props('pDisabled')).toBeFalsy()
      expect(btns[1].props('pDisabled')).toBeFalsy()
      expect(btns[0].props('pSize')).toBe('default')
    })
  })

  describe('event', () => {
    it('should emit modal-action-button-clicked when button click is triggered', async () => {
      const wrapper = createWrapper()
      expect(wrapper.exists()).toBeTruthy()

      await nextTick()

      const btns = wrapper.findAllComponents(PButton)

      btns[0].trigger('click')
      btns[1].trigger('click')

      await nextTick()

      expect(wrapper.emitted('modal-action-button-clicked')).toBeTruthy()
      expect(wrapper.emitted('modal-action-button-clicked')).toStrictEqual([
        ['add-action-click'],
        ['cancel-action-click'],
      ])
    })
  })
})
