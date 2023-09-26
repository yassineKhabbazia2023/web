/* eslint-disable vitest/no-hooks */
import RenameFolderModal from '@/modules/Treeview/components/modals/Rename'
import SingleInputModal from '@/modules/common/templates/modals'
import { VueWrapper, mount } from '@vue/test-utils'
import { describe, it, expect, beforeEach } from 'vitest'
import { type RenameFolderModalProps }
  from '@/modules/Treeview/components/modals/Rename/RenameFolderModalTypes'
import { Folder, FolderProperties } from '@/models/Folder'
import { createPinia, setActivePinia } from 'pinia'
import {
  dynamicUntilFound,
  dynamicUntilFoundComponent
} from '@kpmg/common/src/testing-helpers'
import { ComponentPublicInstance } from 'vue'

const defaultProps: RenameFolderModalProps = {
  isRenameFolderModalVisible: false,
  modalTitle: 'string',
  inputLabel: 'string',
  inputPlaceHolder: 'string',
  cancelBtnLabel: 'string',
  confirmBtnabel: 'string',
  isConfirmButtonLoading: false,
  inputContentDefault: '',
  parentFolder: {} as Folder
}

// To access variables declared within the setup
type RenameFolderModalSetup = {
  inputContent: string
  folderNameExists: boolean
  isDialogRenameVisible:boolean
}

export type RenameFolderModalWrapper = VueWrapper<
  ComponentPublicInstance<RenameFolderModalProps, RenameFolderModalSetup>
>

const pinia = createPinia()

const createWrapper = (
  props: RenameFolderModalProps = defaultProps
): RenameFolderModalWrapper => {
  return mount(RenameFolderModal, {
    props,
    global: {
      plugins: [pinia]
    }
  }) as RenameFolderModalWrapper
}

describe('props', () => {
  beforeEach(() => {
    setActivePinia(pinia)
  })

  describe('confirm button validations', async () => {
    const folderName = `Neque porro quisquam est qui dolorem ipsum quia dolor sit amet,
      consectetur, adipisci velit Neque porro quisquam est qui dolorem
      ipsum quia dolor sit amet, consectetur, adipisci velit quisquam est
      qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit`

    const btnValidationCases = [
      {
        typedValue: 'Test Content*',
        isBtnDisabled: true
      },
      {
        typedValue: '',
        isBtnDisabled: true
      },
      {
        typedValue: folderName,
        isBtnDisabled: true
      },
      {
        typedValue: 'New Folder',
        isBtnDisabled: false
      }
    ]

    it.each(btnValidationCases)(
      'button validation with "%s"',
      async ({ typedValue, isBtnDisabled }) => {
        const props: RenameFolderModalProps = {
          ...defaultProps,
          isRenameFolderModalVisible: true
        }

        const wrapper = createWrapper(props)

        const dialog = await dynamicUntilFoundComponent(
          wrapper,
          SingleInputModal
        )

        const componentInstance = wrapper.vm
        componentInstance.inputContent = typedValue
        await wrapper.vm.$nextTick()
        expect(dialog.props('isConfirmButtonDisabled')).toBe(isBtnDisabled)
      }
    )
  })
  describe('error message sone display conditions', async () => {
    const showErrorMsgCases = [
      {
        typedValue: 'Test Content*',
        isErrorMsgShown: true
      },
      {
        typedValue: '',
        isErrorMsgShown: false
      },
      {
        typedValue: 'New Folder',
        isErrorMsgShown: false
      }
    ]
    it.each(showErrorMsgCases)(
      'error message display with "%s"',
      async ({ typedValue, isErrorMsgShown }) => {
        const props: RenameFolderModalProps = {
          ...defaultProps,
          isRenameFolderModalVisible: true
        }

        const wrapper = createWrapper(props)

        const dialog = await dynamicUntilFoundComponent(
          wrapper,
          SingleInputModal
        )

        const componentInstance = wrapper.vm
        componentInstance.inputContent = typedValue
        await wrapper.vm.$nextTick()

        expect(dialog.props('showErrorMsg')).toBe(isErrorMsgShown)
      }
    )
  })
  describe('error message zone dynamic content', async () => {
    const errorMsgValueCases = [
      {
        typedValue: 'Test Content*',
        expectedValue:
            'Enter a name that does not contain any of the following characters:' +
            ' “ * : &lt; &gt; ? / \\',
        isFolderNameExits: false
      },
      {
        typedValue: 'New Folder',
        expectedValue: 'Un dossier avec le nom New Folder existe déjà',
        isFolderNameExits: true
      }
    ]
    it.each(errorMsgValueCases)(
      'error message value assertion with "%s"',
      async ({ typedValue, expectedValue, isFolderNameExits }) => {
        const props: RenameFolderModalProps = {
          ...defaultProps,
          isRenameFolderModalVisible: true
        }

        const wrapper = createWrapper(props)

        const dialog = await dynamicUntilFoundComponent(
          wrapper,
          SingleInputModal
        )

        const componentInstance = wrapper.vm
        componentInstance.inputContent = typedValue
        await wrapper.vm.$nextTick()

        componentInstance.folderNameExists = isFolderNameExits
        await wrapper.vm.$nextTick()

        expect(dialog.props('errorMsg')).toBe(expectedValue)
      }
    )
  })
})

describe('interactions', () => {
  beforeEach(() => {
    setActivePinia(pinia)
  })
  it('should emit on-confirm-rename-folder when confirm btn click ', async () => {
    const props: RenameFolderModalProps = {
      ...defaultProps,
      isRenameFolderModalVisible: true
    }

    const wrapper = createWrapper(props)

    const dialog = await dynamicUntilFoundComponent(wrapper, SingleInputModal)

    const componentInstance = wrapper.vm
    componentInstance.inputContent = 'TheFolder'
    componentInstance.folderNameExists = false

    await wrapper.vm.$nextTick()

    const confirmButton = await dynamicUntilFound(
      dialog,
      '.confirm-action-button'
    )
    await confirmButton.trigger('click')
    await wrapper.vm.$nextTick()

    expect(wrapper.emitted('on-confirm-rename-folder')).toBeTruthy()
    expect(wrapper.emitted('on-confirm-rename-folder')).toStrictEqual([
      ['TheFolder']
    ])
  })

  it('should not emit on-confirm-rename-folder when folder name already exists ', async () => {
    const props: RenameFolderModalProps = {
      ...defaultProps,
      isRenameFolderModalVisible: true,
      parentFolder: {
        id: 1,
        children: [
          {
            id: 2,
            children: [{} as Folder],
            name: 'TheFolder',
            parent: { id: 1 },
            permissions: [],
            properties: {} as FolderProperties,
            serviceId: 'some-service'
          } as Folder
        ],
        name: 'A',
        parent: { id: 0 },
        permissions: [],
        properties: {} as FolderProperties,
        serviceId: 'some-service'
      } as Folder
    }

    const wrapper = createWrapper(props)

    const dialog = await dynamicUntilFoundComponent(wrapper, SingleInputModal)

    const componentInstance = wrapper.vm
    componentInstance.inputContent = 'TheFolder'

    await wrapper.vm.$nextTick()

    const confirmButton = await dynamicUntilFound(
      dialog,
      '.confirm-action-button'
    )
    await confirmButton.trigger('click')
    await wrapper.vm.$nextTick()

    expect(wrapper.emitted('on-confirm-rename-folder')).toBeFalsy()
  })

  it('should emit on-cancel-rename-folder when cancel btn click ', async () => {
    const props: RenameFolderModalProps = {
      ...defaultProps,
      isRenameFolderModalVisible: true
    }

    const wrapper = createWrapper(props)

    const dialog = await dynamicUntilFoundComponent(wrapper, SingleInputModal)
    await wrapper.vm.$nextTick()

    const cancelButton = await dynamicUntilFound(
      dialog,
      '.cancel-action-button'
    )
    await cancelButton.trigger('click')
    await wrapper.vm.$nextTick()

    expect(wrapper.emitted('on-cancel-rename-folder')).toBeTruthy()
  })

  it('should emit on-close-rename-folder when close modal', async () => {
    const props: RenameFolderModalProps = {
      ...defaultProps,
      isRenameFolderModalVisible: true
    }

    const wrapper = createWrapper(props)

    const dialog = await dynamicUntilFoundComponent(wrapper, SingleInputModal)

    await dialog.vm.$emit('on-close-modal')
    await wrapper.vm.$nextTick()

    expect(wrapper.emitted('on-close-rename-folder')).toBeTruthy()
  })
  it('should emit update:inputContentDefault when inputContent has changed', async () => {
    const wrapper = createWrapper()

    wrapper.vm.inputContent = 'hello 2'
    await wrapper.vm.$nextTick()

    expect(wrapper.emitted('update:inputContentDefault')).toBeTruthy()
  })

  it('should emit update:isRenameFolderModalVisible when isDialogRenameVisible has changed',
    async () => {
      const wrapper = createWrapper()

      wrapper.vm.isDialogRenameVisible = false
      await wrapper.vm.$nextTick()

      expect(wrapper.emitted('update:isRenameFolderModalVisible')).toBeTruthy()
    })
})
