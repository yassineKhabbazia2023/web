import { flushPromises, shallowMount } from '@vue/test-utils'
import { nextTick } from 'vue'
import type { UploadFile } from 'element-plus'
import { getAxiosInstance } from '../../utils/axiosInstanceInit'
import { displayNotification } from '../../utils/PNotification/PNotification'
import PUploadMultiple from './'
import type { PUploadMultipleProps } from './PUploadMultipleTypes'

const buildNativeFile = (name = 'image.png', type = 'image/png') =>
  new File(['content'], name, { type })

const buildUploadFile = (rawFile: File, uid: number, size = rawFile.size): UploadFile => ({
  name: rawFile.name,
  uid,
  status: 'ready',
  size,
  raw: Object.assign(rawFile, { uid }),
} as UploadFile)

type MountProps = PUploadMultipleProps & { modelValue: File[] }

const defaultProps: MountProps = {
  modelValue: [],
  pAccept: 'image/png, image/jpeg',
  pDeleteButtonTitle: 'Delete document',
}

const createWrapper = (props: MountProps = defaultProps, slots: Record<string, string> = {}) =>
  shallowMount(PUploadMultiple, {
    props: {
      ...props,
      // Standard v-model wiring so parent writes flow back into the component.
      'onUpdate:modelValue': async (updatedModel: File[]) => {
        await wrapperHolder.wrapper.setProps({ modelValue: updatedModel })
      },
    },
    slots,
    global: {
      stubs: {
        ElUpload: {
          name: 'ElUpload',
          template: '<div><input class="el-upload__input" type="file"><slot /></div>',
          props: ['limit', 'drag', 'multiple', 'disabled'],
        },
        PUploadFileLine: {
          name: 'PUploadFileLine',
          template: '<div />',
          props: {
            pIconName: { type: String },
            pStatus: { type: String },
            pFileName: { type: String },
            pHasButton: { type: Boolean, default: false },
            pMessage: { type: String },
          },
        },
      },
    },
  })

// Holder so the onUpdate:modelValue handler can reference the wrapper it belongs to.
const wrapperHolder: { wrapper: ReturnType<typeof createWrapper> } = { wrapper: undefined as never }

const mountComponent = (props: MountProps = defaultProps, slots: Record<string, string> = {}) => {
  wrapperHolder.wrapper = createWrapper(props, slots)
  return wrapperHolder.wrapper
}

describe('pUploadMultiple', () => {
  beforeEach(() => {
    vi.mocked(displayNotification).mockReturnValue(undefined)
  })

  describe('rendering', () => {
    it('should render the drop zone with the dragger look by default', () => {
      const wrapper = mountComponent()

      expect(wrapper.find('.p-upload--type-dragger').exists()).toBe(true)
      expect(wrapper.find('.p-upload__input').exists()).toBe(true)
      expect(wrapper.findComponent({ name: 'ElUpload' }).props('drag')).toBe(true)
    })

    it('should render the label when pLabel is provided', () => {
      const wrapper = mountComponent({ ...defaultProps, pLabel: 'Justificatifs' })

      expect(wrapper.text()).toContain('Justificatifs')
    })

    it('should render the disabled class when upload is disabled', () => {
      const wrapper = mountComponent({ ...defaultProps, pDisabled: true })

      expect(wrapper.find('.p-upload--disabled').exists()).toBe(true)
    })

    it('should switch to picker mode when a default slot is provided', () => {
      const wrapper = mountComponent(defaultProps, { default: '<button>Déposer</button>' })

      expect(wrapper.find('.p-upload--type-slot').exists()).toBe(true)
      expect(wrapper.find('.p-upload__input').exists()).toBe(false)
      expect(wrapper.findComponent({ name: 'ElUpload' }).props('drag')).toBe(false)
    })
  })

  describe('selection (model)', () => {
    it('should sync accepted files to the model in insertion order', async () => {
      const wrapper = mountComponent() as any
      const firstFile = buildNativeFile('first.png')
      const secondFile = buildNativeFile('second.png')
      wrapper.vm.uploadFiles = [buildUploadFile(firstFile, 1), buildUploadFile(secondFile, 2)]
      await nextTick()

      expect(wrapper.emitted('update:modelValue')).toStrictEqual([[[firstFile, secondFile]]])
    })

    it('should evict a rejected file from the list and keep it out of the model', async () => {
      const wrapper = mountComponent() as any
      const acceptedFile = buildNativeFile('image.png')
      const rejectedFile = buildNativeFile('document.exe', 'application/x-msdownload')
      wrapper.vm.uploadFiles = [buildUploadFile(acceptedFile, 1), buildUploadFile(rejectedFile, 2)]
      await nextTick()
      await nextTick()

      expect(wrapper.vm.uploadFiles).toHaveLength(1)
      expect(wrapper.emitted('update:modelValue')).toStrictEqual([[[acceptedFile]]])
    })

    it('should clear the element-plus list when the parent resets the model', async () => {
      const wrapper = mountComponent() as any
      const selectedFile = buildNativeFile()
      wrapper.vm.uploadFiles = [buildUploadFile(selectedFile, 1)]
      await nextTick()

      await wrapper.setProps({ modelValue: [] })
      await nextTick()

      expect(wrapper.vm.uploadFiles).toStrictEqual([])
    })
  })

  describe('file lines display', () => {
    const uploadedFiles = [
      { id: '1', fileName: 'persisted.pdf' },
      { id: '2', fileName: 'other-persisted.pdf' },
    ]

    it('should render persisted, pending then rejected lines in that order', async () => {
      const pendingFile = buildNativeFile('pending.png')
      const wrapper = mountComponent({
        ...defaultProps,
        modelValue: [pendingFile],
        pUploadedFiles: uploadedFiles,
      }) as any
      const rejectedFile = buildNativeFile('document.exe', 'application/x-msdownload')
      wrapper.vm.uploadFiles = [buildUploadFile(pendingFile, 1), buildUploadFile(rejectedFile, 2)]
      await nextTick()
      await nextTick()

      const fileLines = wrapper.findAllComponents({ name: 'PUploadFileLine' })
      expect(fileLines.map((line: any) => line.props('pStatus'))).toStrictEqual(['success', 'success', 'ready', 'fail'])
      expect(fileLines.map((line: any) => line.props('pFileName'))).toStrictEqual([
        'persisted.pdf',
        'other-persisted.pdf',
        'pending.png',
        'document.exe',
      ])
    })

    it('should emit delete-uploaded-file with the document id when a persisted line is deleted', async () => {
      const wrapper = mountComponent({ ...defaultProps, pUploadedFiles: uploadedFiles })

      wrapper.findAllComponents({ name: 'PUploadFileLine' })[0].vm.$emit('on-click-file-action')
      await nextTick()

      expect(wrapper.emitted('delete-uploaded-file')).toStrictEqual([['1']])
    })

    it('should hide the delete button on persisted lines when pCanDeleteUploadedFiles is false', () => {
      const wrapper = mountComponent({
        ...defaultProps,
        pUploadedFiles: uploadedFiles,
        pCanDeleteUploadedFiles: false,
      })

      expect(wrapper.findAllComponents({ name: 'PUploadFileLine' })[0].props('pHasButton')).toBe(false)
    })

    it('should remove a pending file from the model when its line is deleted', async () => {
      const firstFile = buildNativeFile('first.png')
      const secondFile = buildNativeFile('second.png')
      const wrapper = mountComponent({ ...defaultProps, modelValue: [firstFile, secondFile] })

      wrapper.findAllComponents({ name: 'PUploadFileLine' })[0].vm.$emit('on-click-file-action')
      await nextTick()

      expect(wrapper.emitted('update:modelValue')).toStrictEqual([[[secondFile]]])
    })

    it('should remove a rejected line when it is dismissed', async () => {
      const wrapper = mountComponent() as any
      const rejectedFile = buildNativeFile('document.exe', 'application/x-msdownload')
      wrapper.vm.uploadFiles = [buildUploadFile(rejectedFile, 2)]
      await nextTick()
      await nextTick()

      wrapper.findComponent({ name: 'PUploadFileLine' }).vm.$emit('on-click-file-action')
      await nextTick()

      expect(wrapper.findAllComponents({ name: 'PUploadFileLine' })).toHaveLength(0)
    })
  })

  describe('remote deletion of uploaded files', () => {
    const uploadedFiles = [
      { id: '1', fileName: 'persisted.pdf' },
      { id: '2', fileName: 'other-persisted.pdf' },
    ]
    const remoteProps: MountProps = {
      ...defaultProps,
      pUploadedFiles: uploadedFiles,
      pCanRemoteDelete: true,
      pRemoteDeleteUrl: '/documents',
    }

    const clickDeleteButton = async (wrapper: any, fileLineIndex = 0) => {
      wrapper.findAllComponents({ name: 'PUploadFileLine' })[fileLineIndex].vm.$emit('on-click-file-action')
      await nextTick()
    }

    const confirmDeletion = async (wrapper: any) => {
      wrapper.findComponent({ name: 'PConfirmationPopup' }).vm.$emit('on-confirm-button-click')
      await nextTick()
    }

    it('should open the confirmation popup without calling DELETE on delete click', async () => {
      const deleteMock = vi.fn().mockResolvedValue(undefined)
      vi.mocked(getAxiosInstance).mockReturnValue({ delete: deleteMock })
      const wrapper = mountComponent(remoteProps)

      await clickDeleteButton(wrapper)

      expect(wrapper.findComponent({ name: 'PConfirmationPopup' }).props('pIsVisible')).toBe(true)
      expect(deleteMock).not.toHaveBeenCalled()
      expect(wrapper.emitted('delete-uploaded-file')).toBeUndefined()
    })

    it('should close the popup without calling DELETE nor emitting when cancelled', async () => {
      const deleteMock = vi.fn().mockResolvedValue(undefined)
      vi.mocked(getAxiosInstance).mockReturnValue({ delete: deleteMock })
      const wrapper = mountComponent(remoteProps)

      await clickDeleteButton(wrapper)
      wrapper.findComponent({ name: 'PConfirmationPopup' }).vm.$emit('on-cancel-button-click')
      await nextTick()

      expect(wrapper.findComponent({ name: 'PConfirmationPopup' }).props('pIsVisible')).toBe(false)
      expect(deleteMock).not.toHaveBeenCalled()
      expect(wrapper.emitted('uploaded-file-deleted')).toBeUndefined()
      expect(wrapper.emitted('delete-uploaded-file')).toBeUndefined()
    })

    it('should call DELETE, flag only the targeted line and emit uploaded-file-deleted once confirmed', async () => {
      const deleteMock = vi.fn().mockResolvedValue(undefined)
      vi.mocked(getAxiosInstance).mockReturnValue({ delete: deleteMock })
      const wrapper = mountComponent(remoteProps)

      await clickDeleteButton(wrapper)
      await confirmDeletion(wrapper)

      const fileLines = wrapper.findAllComponents({ name: 'PUploadFileLine' })
      expect(wrapper.findComponent({ name: 'PConfirmationPopup' }).props('pIsVisible')).toBe(false)
      expect(fileLines[0].props('pStatus')).toBe('uploading')
      expect(fileLines[1].props('pStatus')).toBe('success')

      await flushPromises()

      expect(deleteMock).toHaveBeenCalledWith('/documents/1')
      expect(wrapper.emitted('uploaded-file-deleted')).toStrictEqual([['1']])
      expect(wrapper.emitted('delete-uploaded-file')).toBeUndefined()
    })

    it('should keep the deleting state until the parent removes the deleted file', async () => {
      vi.mocked(getAxiosInstance).mockReturnValue({ delete: vi.fn().mockResolvedValue(undefined) })
      const wrapper = mountComponent(remoteProps)

      await clickDeleteButton(wrapper)
      await confirmDeletion(wrapper)
      await flushPromises()

      expect(wrapper.findAllComponents({ name: 'PUploadFileLine' })[0].props('pStatus')).toBe('uploading')

      await wrapper.setProps({ pUploadedFiles: [uploadedFiles[1]] })
      await nextTick()

      const fileLines = wrapper.findAllComponents({ name: 'PUploadFileLine' })
      expect(fileLines).toHaveLength(1)
      expect(fileLines[0].props('pStatus')).toBe('success')
    })

    it('should restore the success state when the remote deletion fails', async () => {
      vi.mocked(getAxiosInstance).mockReturnValue({ delete: vi.fn().mockRejectedValue(new Error('network error')) })
      const wrapper = mountComponent(remoteProps)

      await clickDeleteButton(wrapper)
      await confirmDeletion(wrapper)
      await flushPromises()

      expect(wrapper.findAllComponents({ name: 'PUploadFileLine' })[0].props('pStatus')).toBe('success')
      expect(wrapper.emitted('uploaded-file-deleted')).toBeUndefined()
    })

    it('should keep the plain emit path without confirmation when pCanRemoteDelete is false', async () => {
      const deleteMock = vi.fn()
      vi.mocked(getAxiosInstance).mockReturnValue({ delete: deleteMock })
      const wrapper = mountComponent({ ...remoteProps, pCanRemoteDelete: false })

      await clickDeleteButton(wrapper)
      await flushPromises()

      expect(wrapper.findComponent({ name: 'PConfirmationPopup' }).props('pIsVisible')).toBe(false)
      expect(deleteMock).not.toHaveBeenCalled()
      expect(wrapper.emitted('delete-uploaded-file')).toStrictEqual([['1']])
    })
  })

  describe('file count cap (pMaxFiles)', () => {
    it('should pass the remaining slot count to element-plus', () => {
      const wrapper = mountComponent({
        ...defaultProps,
        pMaxFiles: 5,
        pUploadedFiles: [{ id: '1', fileName: 'persisted.pdf' }],
      })

      expect(wrapper.findComponent({ name: 'ElUpload' }).props('limit')).toBe(4)
    })

    it('should not pass any limit when pMaxFiles is not provided', () => {
      const wrapper = mountComponent()

      expect(wrapper.findComponent({ name: 'ElUpload' }).props('limit')).toBeUndefined()
    })

    it('should hide the drop zone when the cap is reached', () => {
      const wrapper = mountComponent({
        ...defaultProps,
        pMaxFiles: 2,
        pUploadedFiles: [{ id: '1', fileName: 'persisted.pdf' }],
        modelValue: [buildNativeFile()],
      })

      expect(wrapper.findComponent({ name: 'ElUpload' }).exists()).toBe(false)
    })

    it('should keep the drop zone visible while slots remain', () => {
      const wrapper = mountComponent({
        ...defaultProps,
        pMaxFiles: 3,
        pUploadedFiles: [{ id: '1', fileName: 'persisted.pdf' }],
        modelValue: [buildNativeFile()],
      })

      expect(wrapper.findComponent({ name: 'ElUpload' }).exists()).toBe(true)
    })
  })
})
