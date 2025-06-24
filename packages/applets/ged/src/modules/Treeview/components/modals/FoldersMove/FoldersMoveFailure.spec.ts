import type { FoldersMoveProps } from './FoldersMoveTypes'
import { mount } from '@vue/test-utils'
import { loggerMock } from '@pulse/core/mocks'
import { moveFolderAsyncFailMock } from '@ged/__mocks__/folder.service.mocks'
import { findComponentByNameInWrapper } from '@ged/__mocks__/component.wrapper'
import { nextTick } from 'vue'
import { type FoldersMoveWrapper, defaultProps } from './helpers/testHelpers'
import { PNotification as PNotificationMock } from '@pulse/styleguide'

import FoldersMove from '.'

vi.mock('@pulse/styleguide')
vi.mock('@pulse/core', () => ({
  getFileExtension: vi.fn(() => 'jpg'),
  logger: loggerMock,
}))

vi.mock('@ged/services/Folder', () => ({
  moveFolderAsync: moveFolderAsyncFailMock,
}))


const createWrapper = (
  props: FoldersMoveProps = defaultProps,
): FoldersMoveWrapper => {
  return mount(FoldersMove, {
    props,
  }) as unknown as FoldersMoveWrapper
}

describe('test FoldersMove failure', () => {
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
          const callArguments = (PNotificationMock as any).mock.calls[0][0]
          expect(callArguments.message).toBe('Connexion au serveur interrompue')
          expect(callArguments.customClass).toBe('error')
        })
      })
    })
  })
})
