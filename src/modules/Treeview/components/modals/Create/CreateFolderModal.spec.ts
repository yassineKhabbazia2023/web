/* eslint-disable vitest/no-hooks */
import CreateFolderModal from '@/modules/Treeview/components/modals/Create'
import SingleInputModal from '@/modules/common/templates/modals'
import type { VueWrapper } from '@vue/test-utils'
import { mount } from '@vue/test-utils'
import { describe, it, expect, beforeEach } from 'vitest'
import { type CreateFolderModalProps }
  from '@/modules/Treeview/components/modals/Create/CreateFolderModalTypes'
import type { Folder, FolderProperties } from '@/models/Folder'
import { createPinia, setActivePinia } from 'pinia'
import type { ComponentPublicInstance } from 'vue'
import { nextTick } from 'vue'

const defaultProps: CreateFolderModalProps = {
  isCreateFolderModalVisible: false,
  modalTitle: 'string',
  inputLabel: 'string',
  inputPlaceHolder: 'string',
  cancelBtnLabel: 'string',
  confirmBtnabel: 'string',
  isConfirmButtonLoading: false,
  selectedFolder: {} as Folder,
}

type CreateFolderModalSetup = {
  inputContent: string
  folderNameExists: boolean
  isDialogVisible: boolean
}

export type CreateFolderModalWrapper = VueWrapper<
  ComponentPublicInstance<CreateFolderModalProps, CreateFolderModalSetup>
>
const pinia = createPinia()

const createWrapper = (
  props: CreateFolderModalProps = defaultProps,
): CreateFolderModalWrapper => {
  return mount(CreateFolderModal, {
    props,
    global: {
      plugins: [pinia],
    },
  }) as unknown as CreateFolderModalWrapper
}

describe('props', () => {
  beforeEach(() => {
    setActivePinia(pinia)
  })

  describe('confirm button validations', () => {
    const folderName = `Neque porro quisquam est qui dolorem ipsum quia dolor sit amet,
      consectetur, adipisci velit Neque porro quisquam est qui dolorem
      ipsum quia dolor sit amet, consectetur, adipisci velit quisquam est
      qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit`

    const btnValidationCases = [
      {
        typedValue: 'Test Content*',
        isBtnDisabled: true,
      },
      {
        typedValue: '',
        isBtnDisabled: true,
      },
      {
        typedValue: folderName,
        isBtnDisabled: true,
      },
      {
        typedValue: 'New Folder',
        isBtnDisabled: false,
      },
    ]

    it.each(btnValidationCases)(
      'button validation with "%s"',
      async ({ typedValue, isBtnDisabled }) => {
        const props: CreateFolderModalProps = {
          ...defaultProps,
          isCreateFolderModalVisible: true,
        }

        const wrapper = createWrapper(props)

        const dialog = wrapper.findComponent(SingleInputModal)

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
      'error message display with "%s"',
      async ({ typedValue, isErrorMsgShown }) => {
        const props: CreateFolderModalProps = {
          ...defaultProps,
          isCreateFolderModalVisible: true,
        }

        const wrapper = createWrapper(props)

        const dialog = wrapper.findComponent(SingleInputModal)

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
          'Entrez un nom qui ne contient aucun des caractères suivants : “ * : &lt; &gt; ? / \\',
        isFolderNameExits: false,
      },
      {
        typedValue: 'New Folder',
        expectedValue: 'Un dossier avec le nom New Folder existe déjà',
        isFolderNameExits: true,
      },
    ]
    it.each(errorMsgValueCases)(
      'error message value assertion with "%s"',
      async ({ typedValue, expectedValue, isFolderNameExits }) => {
        const props: CreateFolderModalProps = {
          ...defaultProps,
          isCreateFolderModalVisible: true,
        }

        const wrapper = createWrapper(props)

        const dialog = wrapper.findComponent(SingleInputModal)

        const componentInstance = wrapper.vm
        componentInstance.inputContent = typedValue
        await nextTick()

        componentInstance.folderNameExists = isFolderNameExits
        await nextTick()

        expect(dialog.props('errorMsg')).toBe(expectedValue)
      },
    )
  })
})

describe('interactions', () => {
  beforeEach(() => {
    setActivePinia(pinia)
  })
  it('should emit on-confirm-create-folder when confirm btn click', async () => {
    const props: CreateFolderModalProps = {
      ...defaultProps,
      isCreateFolderModalVisible: true,
    }

    const wrapper = createWrapper(props)

    const dialog = wrapper.findComponent(SingleInputModal)

    const componentInstance = wrapper.vm
    componentInstance.inputContent = 'TheFolder'
    componentInstance.folderNameExists = false

    await nextTick()

    const confirmButton = dialog.find('.confirm-action-button')
    await confirmButton.trigger('click')
    await nextTick()

    expect(wrapper.emitted('on-confirm-create-folder')).toBeTruthy()
    expect(wrapper.emitted('on-confirm-create-folder')).toStrictEqual([
      ['TheFolder'],
    ])
  })

  it.each([
    {
      childrenFolder: {
        id: 2,
        children: [{} as Folder],
        name: 'TheFolder',
        parent: { id: 1 },
        permissions: [],
        properties: {} as FolderProperties,
        serviceId: 'some-service',
      },
    },
    {
      childrenFolder: {
        id: 2,
        children: [{} as Folder],
        name: 'Thefolder',
        parent: { id: 1 },
        permissions: [],
        properties: {} as FolderProperties,
        serviceId: 'some-service',
      },
    },
    {
      childrenFolder: {
        id: 2,
        children: [{} as Folder],
        name: ' Thefolder ',
        parent: { id: 1 },
        permissions: [],
        properties: {} as FolderProperties,
        serviceId: 'some-service',
      },
    },
  ])(
    'should not emit on-confirm-create-folder when folder name already exists',
    async ({ childrenFolder }) => {
      const props: CreateFolderModalProps = {
        ...defaultProps,
        isCreateFolderModalVisible: true,
        selectedFolder: {
          id: 1,
          children: [
            {
              ...childrenFolder,
            } as Folder,
          ],
          name: 'A',
          parent: { id: 0 },
          permissions: [],
          properties: {} as FolderProperties,
          serviceId: 'some-service',
        } as Folder,
      }

      const wrapper = createWrapper(props)

      const dialog = wrapper.findComponent(SingleInputModal)

      const componentInstance = wrapper.vm
      componentInstance.inputContent = 'Thefolder'

      await nextTick()

      const confirmButton = dialog.find('.confirm-action-button')
      await confirmButton.trigger('click')
      await nextTick()

      expect(wrapper.emitted('on-confirm-create-folder')).toBeFalsy()
    },
  )

  it('should emit on-cancel-create-folder when cancel btn click', async () => {
    const props: CreateFolderModalProps = {
      ...defaultProps,
      isCreateFolderModalVisible: true,
    }

    const wrapper = createWrapper(props)

    const dialog = wrapper.findComponent(SingleInputModal)
    await nextTick()

    const cancelButton = dialog.find('.cancel-action-button')
    await cancelButton.trigger('click')
    await nextTick()

    expect(wrapper.emitted('on-cancel-create-folder')).toBeTruthy()
  })

  it('should emit on-close-create-folder when close modal', async () => {
    const props: CreateFolderModalProps = {
      ...defaultProps,
      isCreateFolderModalVisible: true,
    }

    const wrapper = createWrapper(props)

    const dialog = wrapper.findComponent(SingleInputModal)

    await dialog.vm.$emit('on-close-modal')
    await nextTick()

    expect(wrapper.emitted('on-close-create-folder')).toBeTruthy()
  })

  it('should emit update:isCreateFolderModalVisible when isCreateFolderModalVisible is updated',
    async () => {
      const wrapper = createWrapper()

      wrapper.vm.isDialogVisible = true
      await nextTick()

      expect(wrapper.emitted('update:isCreateFolderModalVisible')).toBeTruthy()
    })
})
