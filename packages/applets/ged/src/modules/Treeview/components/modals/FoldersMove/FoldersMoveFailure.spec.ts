

import { describe, it, expect, beforeEach, vi } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import type { FoldersMoveProps } from './FoldersMoveTypes'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import FoldersMove from '.'
import { type FoldersMoveWrapper, defaultProps } from './helpers/testHelpers'
import { findComponentByNameInWrapper } from '@ged/modules/Documents/helpers/testHelpers'

vi.mock('@ged/services/Folder', () => ({
  moveFolderAsync: () => {
    throw new Error('Something uncool')
  },
}))

const mockToastPlugin = vi.fn()

const createWrapper = (
  props: FoldersMoveProps = defaultProps,
): FoldersMoveWrapper => {
  return mount(FoldersMove, {
    props,
    global: {
      plugins: [pinia],
      provide: {
        toast: mockToastPlugin,
      },
    },
  }) as unknown as FoldersMoveWrapper
}

const pinia = createPinia()

describe('test FoldersMove failure', () => {
  beforeEach(() => {
    setActivePinia(pinia)
  })

  describe('interactions', () => {
    describe('move', () => {
      describe('confirm', () => {
        it('should display failure notification on modal-action-clicked event', async () => {
          const updatedProps = {
            ...defaultProps,
            isMoveModalOpened: true,
          }

          const wrapper = createWrapper(updatedProps)

          const documentExplorerModalWrapper =
            findComponentByNameInWrapper(wrapper, 'DocumentsExplorerModal')

          documentExplorerModalWrapper.vm.$emit(
            'modal-action-clicked',
            'modal-move-folder-action-click',
          )

          await nextTick()
          expect(mockToastPlugin).toHaveBeenCalledTimes(1)
          const callArguments = mockToastPlugin.mock.calls[0][0]
          expect(callArguments.message).toBe('Connexion au serveur interrompue')
          expect(callArguments.customClass).toBe('error')
        })
      })
    })
  })
})
