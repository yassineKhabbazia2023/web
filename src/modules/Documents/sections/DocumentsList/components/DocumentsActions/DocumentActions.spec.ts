/* eslint-disable vitest/no-hooks */
import DocumentActions from './DocumentActions.vue'
import { type DocumentActionsProps } from './DocumentActionsTypes'
import { VueWrapper, mount } from '@vue/test-utils'
import { describe, it, expect, beforeEach } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { ComponentPublicInstance, nextTick } from 'vue'
import { dynamicUntilFoundComponent } from '@kpmg/common/src/testing-helpers'
import { PToolbox } from '@kpmg/styleguide'

const defaultProps: DocumentActionsProps = {
  permissions: []
}

type DocumentActionsSetup = {
  toolboxBasicData: any
}

export type DocumentActionsWrapper = VueWrapper<ComponentPublicInstance<
  DocumentActionsProps,
  DocumentActionsSetup>
>

const pinia = createPinia()

const createWrapper = (
  props: DocumentActionsProps = defaultProps
): DocumentActionsWrapper => {
  return mount(DocumentActions, {
    props,
    global: {
      stubs: {
        PToolbox: {
          template: '<span />'
        }
      },
      plugins: [pinia]
    }
  }) as unknown as DocumentActionsWrapper
}

describe('documentActions', () => {
  describe('props', () => {
    beforeEach(() => {
      setActivePinia(pinia)
    })

    it('should render PToolbox according to the provided permissions', async () => {
      const updatedProps: DocumentActionsProps = {
        ...defaultProps,
        permissions: ['CAN_DELETE_DOCUMENT']
      }
      const wrapper = createWrapper(updatedProps)
      expect(wrapper.exists()).toBeTruthy()

      const componentInstance = wrapper.vm

      expect(componentInstance.toolboxBasicData).toStrictEqual([
        {
          actionName: 'download-document',
          iconName: 'PIDownload',
          value: 'Télécharger'
        },
        {
          actionName: 'delete-document',
          iconName: 'PITrash',
          value: 'Supprimer'
        }
      ])
    })

    it('should render download action even when permissions is empty', async () => {
      const props: DocumentActionsProps = {
        ...defaultProps,
        permissions: []
      }

      const wrapper = createWrapper(props)
      const componentInstance = wrapper.vm

      expect(componentInstance.toolboxBasicData).toStrictEqual([
        {
          actionName: 'download-document',
          iconName: 'PIDownload',
          value: 'Télécharger'
        }
      ])
    })
  })

  describe('interactions', () => {
    it('should emit on-document-actions-dropdown-close when visible-change is emitted',
      async () => {
        const updatedProps: DocumentActionsProps = {
          ...defaultProps,
          permissions: ['CAN_DELETE_DOCUMENT']
        }

        const wrapper = createWrapper(updatedProps)

        const toolbox = await dynamicUntilFoundComponent(wrapper, PToolbox)

        await toolbox.vm.$emit('visible-change', true)
        await nextTick()

        expect(
          wrapper.emitted('on-document-actions-dropdown-close')
        ).toStrictEqual([[true]])
      })

    it('should handle handleActionsDropdownOpening', async () => {
      const wrapper: any = createWrapper()
      wrapper.vm.handleActionsDropdownOpening()

      expect(wrapper.emitted()).toHaveProperty('actions-dropdown-opened')
    })
  })
})
