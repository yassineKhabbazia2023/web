
import { describe, it, expect, beforeEach, vi, type Mock } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import type { FoldersMoveProps } from './FoldersMoveTypes'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import FoldersMove from '.'
import { type FoldersMoveWrapper, defaultProps } from './helpers/testHelpers'
import { findComponentByNameInWrapper } from '@ged/modules/Documents/helpers/testHelpers'
import { PNotification as PNotificationMock } from '@pulse/styleguide'

const loggerDebugSpy = vi.hoisted(() => vi.fn())
const loggerWarnSpy = vi.hoisted(() => vi.fn())
const loggerErrorSpy = vi.hoisted(() => vi.fn())

vi.mock('@pulse/core', () => ({
  getFileExtension: vi.fn(() => 'jpg'),
  logger: {
    debug: loggerDebugSpy,
    warn: loggerWarnSpy,
    error: loggerErrorSpy,
  },
}))

vi.mock('@ged/services/Folder', () => ({
  moveFolderAsync: () => {
    throw new Error('Something uncool')
  },
}))

vi.mock('@pulse/styleguide')

const createWrapper = (
  props: FoldersMoveProps = defaultProps,
): FoldersMoveWrapper => {
  return mount(FoldersMove, {
    props,
    global: {
      plugins: [pinia],
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
          expect(PNotificationMock).toHaveBeenCalledTimes(1)
          const callArguments = (PNotificationMock as Mock).mock.calls[0][0]
          expect(callArguments.message).toBe('Connexion au serveur interrompue')
          expect(callArguments.customClass).toBe('error')
        })
      })
    })
  })
})
