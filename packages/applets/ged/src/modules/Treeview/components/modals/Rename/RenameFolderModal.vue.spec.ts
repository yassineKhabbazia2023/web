import type { VueWrapper } from '@vue/test-utils'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import { getMockedButtonTest, getMockedFolder } from '@ged/__mocks__/treeview.mocks'
import { type RenameFolderModalProps }
  from '@ged/modules/Treeview/components/modals/Rename/RenameFolderModalTypes'
import type { Folder } from '@ged/models/Folder'
import type { ComponentPublicInstance } from 'vue'

import RenameFolderModal from '@ged/modules/Treeview/components/modals/Rename'

const defaultProps: RenameFolderModalProps = {
  isRenameFolderModalVisible: false,
  modalTitle: 'string',
  inputLabel: 'string',
  inputPlaceHolder: 'string',
  cancelBtnLabel: 'string',
  confirmBtnabel: 'string',
  isConfirmButtonLoading: false,
  inputContentDefault: '',
  parentFolder: {} as Folder,
}

// To access variables declared within the setup
type RenameFolderModalSetup = {
  inputContent: string
  folderNameExists: boolean
  isDialogRenameVisible: boolean
}

export type RenameFolderModalWrapper = VueWrapper<
  ComponentPublicInstance<RenameFolderModalProps, RenameFolderModalSetup>
>

const createWrapper = (
  props: RenameFolderModalProps = defaultProps,
): RenameFolderModalWrapper => {
  return mount(RenameFolderModal, {
    props,
    global: {
    },
  }) as RenameFolderModalWrapper
}

describe('props', () => {
  describe('confirm button validations', () => {
    const folderName = `Neque porro quisquam est qui dolorem ipsum quia dolor sit amet,
      consectetur, adipisci velit Neque porro quisquam est qui dolorem
      ipsum quia dolor sit amet, consectetur, adipisci velit quisquam est
      qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit`

    const btnValidationCases = getMockedButtonTest(folderName)

    it.each(btnValidationCases)(
      'button validation with $label',
      async ({ typedValue, isBtnDisabled }) => {
        const props: RenameFolderModalProps = {
          ...defaultProps,
          isRenameFolderModalVisible: true,
        }

        const wrapper = createWrapper(props)

        const dialog = wrapper.findComponent({ name: 'SingleInputModal' })

        const componentInstance = wrapper.vm
        componentInstance.inputContent = typedValue
        await nextTick()
        expect(dialog.props('isConfirmButtonDisabled')).toBe(isBtnDisabled)
      },
    )
  })
  describe('error message sone display conditions', () => {
    const showErrorMsgCases = [
      {
        typedValue: 'Test Content*',
        isErrorMsgShown: true,
      },
      {
        typedValue: '',
        isErrorMsgShown: false,
      },
      {
        typedValue: 'New Folder',
        isErrorMsgShown: false,
      },
    ]
    it.each(showErrorMsgCases)(
      'error message display with $typedValue',
      async ({ typedValue, isErrorMsgShown }) => {
        const props: RenameFolderModalProps = {
          ...defaultProps,
          isRenameFolderModalVisible: true,
        }

        const wrapper = createWrapper(props)

        const dialog = wrapper.findComponent({ name: 'SingleInputModal' })

        const componentInstance = wrapper.vm
        componentInstance.inputContent = typedValue
        await nextTick()

        expect(dialog.props('showErrorMsg')).toBe(isErrorMsgShown)
      },
    )
  })
  describe('error message zone dynamic content', () => {
    const errorMsgValueCases = [
      {
        typedValue: 'Test Content*',
        expectedValue:
          'Enter a name that does not contain any of the following characters: “ * : < > ? / \\ |',
        isFolderNameExits: false,
      },
      {
        typedValue: 'New Folder',
        expectedValue: 'A folder with the name New Folder already exists',
        isFolderNameExits: true,
      },
    ]
    it.each(errorMsgValueCases)(
      'error message value assertion with $typedValue',
      async ({ typedValue, expectedValue, isFolderNameExits }) => {
        const props: RenameFolderModalProps = {
          ...defaultProps,
          isRenameFolderModalVisible: true,
        }

        const wrapper = createWrapper(props)

        const componentInstance = wrapper.vm
        componentInstance.inputContent = typedValue
        await nextTick()

        componentInstance.folderNameExists = isFolderNameExits
        await nextTick()

        const errorContainer = wrapper.find('.message')
        expect(errorContainer.text()).toBe(expectedValue)
      },
    )
  })
})

describe('interactions', () => {
  it('should emit on-confirm-rename-folder when confirm btn click', async () => {
    const props: RenameFolderModalProps = {
      ...defaultProps,
      isRenameFolderModalVisible: true,
    }

    const wrapper = createWrapper(props)

    const dialog = wrapper.findComponent({ name: 'SingleInputModal' })

    const componentInstance = wrapper.vm
    componentInstance.inputContent = 'TheFolder'
    componentInstance.folderNameExists = false

    await nextTick()

    const confirmButton = dialog.find('.confirm-action-button')
    await confirmButton.trigger('click')
    await nextTick()

    expect(wrapper.emitted('on-confirm-rename-folder')).toBeTruthy()
    expect(wrapper.emitted('on-confirm-rename-folder')).toStrictEqual([
      ['TheFolder'],
    ])
  })

  it('should not emit on-confirm-rename-folder when folder name already exists', async () => {
    const child = getMockedFolder(1, 2, 'TheFolder', {
      children: [{} as Folder],
      serviceId: 'some-service',
    })
    const parentFolder = getMockedFolder(0, 1, 'A', {
      children: [child],
    })

    const props: RenameFolderModalProps = {
      ...defaultProps,
      isRenameFolderModalVisible: true,
      parentFolder,
    }

    const wrapper = createWrapper(props)

    const dialog = wrapper.findComponent({ name: 'SingleInputModal' })

    const componentInstance = wrapper.vm
    componentInstance.inputContent = 'TheFolder'

    await nextTick()

    const confirmButton = dialog.find('.confirm-action-button')
    await confirmButton.trigger('click')
    await nextTick()

    expect(wrapper.emitted('on-confirm-rename-folder')).toBeFalsy()
  })

  it('should emit on-cancel-rename-folder when cancel btn click', async () => {
    const props: RenameFolderModalProps = {
      ...defaultProps,
      isRenameFolderModalVisible: true,
    }

    const wrapper = createWrapper(props)

    const dialog = wrapper.findComponent({ name: 'SingleInputModal' })
    await nextTick()

    const cancelButton = dialog.find('.cancel-action-button')
    await cancelButton.trigger('click')
    await nextTick()

    expect(wrapper.emitted('on-cancel-rename-folder')).toBeTruthy()
  })

  it('should emit on-close-rename-folder when close modal', async () => {
    const props: RenameFolderModalProps = {
      ...defaultProps,
      isRenameFolderModalVisible: true,
    }

    const wrapper = createWrapper(props)

    const dialog = wrapper.findComponent({ name: 'SingleInputModal' })

    dialog.vm.$emit('on-close-modal')
    await nextTick()

    expect(wrapper.emitted('on-close-rename-folder')).toBeTruthy()
  })

  it('should emit update:isRenameFolderModalVisible when isDialogRenameVisible has changed',
    async () => {
      const wrapper = createWrapper()

      wrapper.vm.isDialogRenameVisible = false
      await nextTick()

      expect(wrapper.emitted('update:isRenameFolderModalVisible')).toBeTruthy()
    })
})
