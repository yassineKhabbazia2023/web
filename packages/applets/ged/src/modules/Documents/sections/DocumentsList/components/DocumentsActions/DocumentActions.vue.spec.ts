import type { VueWrapper } from '@vue/test-utils'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import { type DocumentActionsProps } from './DocumentActionsTypes'

import DocumentActions from './DocumentActions.vue'

const defaultProps: DocumentActionsProps = {
  permissions: [],
}

const createWrapper = (
  props: DocumentActionsProps = defaultProps,
): VueWrapper => {
  return mount(DocumentActions, {
    props,
  })
}

const findToolbox = (wrapper: VueWrapper) => wrapper.findComponent({ name: 'PToolbox' })

describe('documentActions', () => {
  describe('props', () => {
    it('should pass download and delete actions to PToolbox according to the provided permissions', () => {
      const updatedProps: DocumentActionsProps = {
        ...defaultProps,
        permissions: ['CAN_DELETE_DOCUMENT'],
      }
      const wrapper = createWrapper(updatedProps)
      expect(wrapper.exists()).toBeTruthy()

      const toolbox = findToolbox(wrapper)
      expect(toolbox.exists()).toBeTruthy()
      expect(toolbox.props('pElements')).toStrictEqual([
        {
          pActionName: 'download-document',
          pIconName: 'download',
          pValue: 'Télécharger',
        },
        {
          pActionName: 'delete-document',
          pIconName: 'trash',
          pValue: 'Supprimer',
        },
      ])
    })

    it('should pass the download action even when permissions is empty', () => {
      const props: DocumentActionsProps = {
        ...defaultProps,
        permissions: [],
      }

      const wrapper = createWrapper(props)

      expect(findToolbox(wrapper).props('pElements')).toStrictEqual([
        {
          pActionName: 'download-document',
          pIconName: 'download',
          pValue: 'Télécharger',
        },
      ])
    })
  })

  describe('interactions', () => {
    it('should emit on-document-actions-dropdown-close when PToolbox emits visible-change',
      async () => {
        const updatedProps: DocumentActionsProps = {
          ...defaultProps,
          permissions: ['CAN_DELETE_DOCUMENT'],
        }

        const wrapper = createWrapper(updatedProps)

        const toolbox = findToolbox(wrapper)

        await toolbox.vm.$emit('visible-change', true)
        await nextTick()

        expect(
          wrapper.emitted('on-document-actions-dropdown-close'),
        ).toStrictEqual([[true]])
      })

    it('should emit actions-dropdown-opened when the actions button is clicked', async () => {
      const wrapper = createWrapper()

      await wrapper.find('.on-document-action-clicked').trigger('click')

      expect(wrapper.emitted()).toHaveProperty('actions-dropdown-opened')
    })
  })
})
