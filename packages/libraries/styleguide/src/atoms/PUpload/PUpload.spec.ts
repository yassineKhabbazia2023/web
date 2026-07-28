import { flushPromises, shallowMount } from '@vue/test-utils'
import { nextTick } from 'vue'
import type { UploadFile } from 'element-plus'
import { getAxiosInstance } from '../../utils/axiosInstanceInit'
import { displayNotification } from '../../utils/PNotification/PNotification'
import PUpload from './'
import type { PUploadProps } from './PUploadTypes'

const buildNativeFile = (name = 'image.png', type = 'image/png') =>
  new File(['content'], name, { type })

const buildUploadFile = (overrides: Partial<UploadFile> = {}): UploadFile => {
  const rawFile = buildNativeFile()
  return {
    name: rawFile.name,
    uid: 1,
    status: 'ready',
    size: rawFile.size,
    raw: Object.assign(rawFile, { uid: 1 }),
    ...overrides,
  } as UploadFile
}

const defaultProps: PUploadProps & { modelValue?: File | null } = {
  pAccept: 'image/png, image/jpeg',
  pDeleteButtonTitle: 'Delete document',
}

const createWrapper = (props: PUploadProps & { modelValue?: File | null } = defaultProps) =>
  shallowMount(PUpload, {
    props,
    global: {
      stubs: {
        ElUpload: {
          name: 'ElUpload',
          template: '<div><input class="el-upload__input" type="file"><slot /></div>',
        },
        PUploadFileLine: {
          name: 'PUploadFileLine',
          template: '<div />',
          props: {
            pIconName: { type: String },
            pIsMultiLine: { type: Boolean, default: false },
            pStatus: { type: String },
            pFileName: { type: String },
            pHasButton: { type: Boolean, default: false },
            pMessage: { type: String },
          },
        },
      },
    },
  })

describe('pUpload', () => {
  beforeEach(() => {
    vi.mocked(displayNotification).mockReturnValue(undefined)
  })

  describe('rendering', () => {
    it('should render the drop zone when nothing is selected', () => {
      const wrapper = createWrapper()

      expect(wrapper.find('.p-upload--type-dragger').exists()).toBe(true)
      expect(wrapper.find('.p-upload__input').exists()).toBe(true)
    })

    it('should render the label when pLabel is provided', () => {
      const wrapper = createWrapper({ ...defaultProps, pLabel: 'Pièce d\'identité' })

      expect(wrapper.text()).toContain('Pièce d\'identité')
    })

    it('should render the disabled class when upload is disabled', () => {
      const wrapper = createWrapper({ ...defaultProps, pDisabled: true })

      expect(wrapper.find('.p-upload--disabled').exists()).toBe(true)
    })
  })

  describe('selection (model)', () => {
    it('should move an accepted file to the model and clear the element-plus list', async () => {
      const wrapper = createWrapper() as any
      const uploadFile = buildUploadFile()
      wrapper.vm.uploadFiles = [uploadFile]
      await nextTick()

      expect(wrapper.emitted('update:modelValue')).toStrictEqual([[uploadFile.raw]])
      expect(wrapper.vm.uploadFiles).toStrictEqual([])
    })

    it('should not update the model for a file with a disallowed extension', async () => {
      const wrapper = createWrapper() as any
      const rejectedRawFile = buildNativeFile('document.exe', 'application/x-msdownload')
      wrapper.vm.uploadFiles = [buildUploadFile({ name: rejectedRawFile.name, raw: Object.assign(rejectedRawFile, { uid: 1 }) })]
      await nextTick()

      expect(wrapper.emitted('update:modelValue')).toBeUndefined()
      expect(wrapper.vm.uploadFiles).toStrictEqual([])
    })
  })

  describe('rejected file display', () => {
    const selectRejectedFile = async (wrapper: any) => {
      const rejectedRawFile = buildNativeFile('document.exe', 'application/x-msdownload')
      wrapper.vm.uploadFiles = [buildUploadFile({ name: rejectedRawFile.name, raw: Object.assign(rejectedRawFile, { uid: 7 }), uid: 7 })]
      await nextTick()
    }

    it('should replace the drop zone with a fail line holding the rejection message', async () => {
      const wrapper = createWrapper() as any
      await selectRejectedFile(wrapper)

      const uploadFileLine = wrapper.findComponent({ name: 'PUploadFileLine' })
      expect(wrapper.find('.p-upload__input').exists()).toBe(false)
      expect(uploadFileLine.props('pStatus')).toBe('fail')
      expect(uploadFileLine.props('pMessage')).toBe('Extension non supportée, le fichier ne sera pas enregistré')
      expect(uploadFileLine.props('pFileName')).toBe('document.exe')
    })

    it('should use the oversized message for a file exceeding pMaxFileSize', async () => {
      const wrapper = createWrapper({ ...defaultProps, pMaxFileSize: 5 }) as any
      wrapper.vm.uploadFiles = [buildUploadFile({ size: 6_000_000 })]
      await nextTick()

      expect(wrapper.findComponent({ name: 'PUploadFileLine' }).props('pMessage')).toBe('Le fichier dépasse la taille autorisée, le fichier ne sera pas enregistré')
    })

    it('should restore the drop zone when the rejected line is dismissed', async () => {
      const wrapper = createWrapper() as any
      await selectRejectedFile(wrapper)

      wrapper.findComponent({ name: 'PUploadFileLine' }).vm.$emit('on-click-file-action')
      await nextTick()

      expect(wrapper.find('.p-upload__input').exists()).toBe(true)
    })
  })

  describe('pending file display', () => {
    it('should replace the drop zone with a ready line for the pending file', () => {
      const wrapper = createWrapper({ ...defaultProps, modelValue: buildNativeFile() })

      const uploadFileLine = wrapper.findComponent({ name: 'PUploadFileLine' })
      expect(wrapper.find('.p-upload__input').exists()).toBe(false)
      expect(uploadFileLine.props('pStatus')).toBe('ready')
      expect(uploadFileLine.props('pFileName')).toBe('image.png')
      expect(uploadFileLine.props('pIsMultiLine')).toBe(true)
      expect(uploadFileLine.props('pIconName')).toBe('filetypePng')
    })

    it('should clear the model when the pending line delete button is clicked', async () => {
      const wrapper = createWrapper({ ...defaultProps, modelValue: buildNativeFile() })

      wrapper.findComponent({ name: 'PUploadFileLine' }).vm.$emit('on-click-file-action')
      await nextTick()

      expect(wrapper.emitted('update:modelValue')).toStrictEqual([[null]])
    })

    it('should restore the drop zone when the parent clears the model', async () => {
      const wrapper = createWrapper({ ...defaultProps, modelValue: buildNativeFile() })
      await wrapper.setProps({ modelValue: null })

      expect(wrapper.find('.p-upload__input').exists()).toBe(true)
    })
  })

  describe('uploaded file display (persisted document)', () => {
    const uploadedFile = { id: 'document-1', fileName: 'carte-identite.pdf' }

    it('should replace the drop zone with a success line for the persisted document', () => {
      const wrapper = createWrapper({ ...defaultProps, pUploadedFile: uploadedFile })

      const uploadFileLine = wrapper.findComponent({ name: 'PUploadFileLine' })
      expect(wrapper.find('.p-upload__input').exists()).toBe(false)
      expect(uploadFileLine.props('pStatus')).toBe('success')
      expect(uploadFileLine.props('pFileName')).toBe('carte-identite.pdf')
      expect(uploadFileLine.props('pHasButton')).toBe(true)
    })

    it('should hide the delete button when pCanDeleteUploadedFile is false', () => {
      const wrapper = createWrapper({
        ...defaultProps,
        pUploadedFile: uploadedFile,
        pCanDeleteUploadedFile: false,
      })

      expect(wrapper.findComponent({ name: 'PUploadFileLine' }).props('pHasButton')).toBe(false)
    })

    it('should emit delete-uploaded-file with the document id on delete', async () => {
      const wrapper = createWrapper({ ...defaultProps, pUploadedFile: uploadedFile })

      wrapper.findComponent({ name: 'PUploadFileLine' }).vm.$emit('on-click-file-action')
      await nextTick()

      expect(wrapper.emitted('delete-uploaded-file')).toStrictEqual([['document-1']])
    })
  })

  describe('remote deletion of the uploaded file', () => {
    const uploadedFile = { id: 'document-1', fileName: 'carte-identite.pdf' }
    const remoteProps: PUploadProps = {
      ...defaultProps,
      pUploadedFile: uploadedFile,
      pCanRemoteDelete: true,
      pRemoteDeleteUrl: '/documents',
    }

    const clickDeleteButton = async (wrapper: any) => {
      wrapper.findComponent({ name: 'PUploadFileLine' }).vm.$emit('on-click-file-action')
      await nextTick()
    }

    const confirmDeletion = async (wrapper: any) => {
      wrapper.findComponent({ name: 'PConfirmationPopup' }).vm.$emit('on-confirm-button-click')
      await nextTick()
    }

    it('should open the confirmation popup without calling DELETE on delete click', async () => {
      const deleteMock = vi.fn().mockResolvedValue(undefined)
      vi.mocked(getAxiosInstance).mockReturnValue({ delete: deleteMock })
      const wrapper = createWrapper(remoteProps)

      await clickDeleteButton(wrapper)

      expect(wrapper.findComponent({ name: 'PConfirmationPopup' }).props('pIsVisible')).toBe(true)
      expect(deleteMock).not.toHaveBeenCalled()
      expect(wrapper.emitted('delete-uploaded-file')).toBeUndefined()
    })

    it('should close the popup without calling DELETE nor emitting when cancelled', async () => {
      const deleteMock = vi.fn().mockResolvedValue(undefined)
      vi.mocked(getAxiosInstance).mockReturnValue({ delete: deleteMock })
      const wrapper = createWrapper(remoteProps)

      await clickDeleteButton(wrapper)
      wrapper.findComponent({ name: 'PConfirmationPopup' }).vm.$emit('on-cancel-button-click')
      await nextTick()

      expect(wrapper.findComponent({ name: 'PConfirmationPopup' }).props('pIsVisible')).toBe(false)
      expect(deleteMock).not.toHaveBeenCalled()
      expect(wrapper.emitted('uploaded-file-deleted')).toBeUndefined()
      expect(wrapper.emitted('delete-uploaded-file')).toBeUndefined()
    })

    it('should call DELETE, show the deleting state and emit uploaded-file-deleted once confirmed', async () => {
      const deleteMock = vi.fn().mockResolvedValue(undefined)
      vi.mocked(getAxiosInstance).mockReturnValue({ delete: deleteMock })
      const wrapper = createWrapper(remoteProps)

      await clickDeleteButton(wrapper)
      await confirmDeletion(wrapper)

      expect(wrapper.findComponent({ name: 'PConfirmationPopup' }).props('pIsVisible')).toBe(false)
      expect(wrapper.findComponent({ name: 'PUploadFileLine' }).props('pStatus')).toBe('uploading')

      await flushPromises()

      expect(deleteMock).toHaveBeenCalledWith('/documents/document-1')
      expect(wrapper.emitted('uploaded-file-deleted')).toStrictEqual([['document-1']])
      expect(wrapper.emitted('delete-uploaded-file')).toBeUndefined()
    })

    it('should restore the success state and not emit when the remote deletion fails', async () => {
      vi.mocked(getAxiosInstance).mockReturnValue({ delete: vi.fn().mockRejectedValue(new Error('network error')) })
      const wrapper = createWrapper(remoteProps)

      await clickDeleteButton(wrapper)
      await confirmDeletion(wrapper)
      await flushPromises()

      expect(wrapper.findComponent({ name: 'PUploadFileLine' }).props('pStatus')).toBe('success')
      expect(wrapper.emitted('uploaded-file-deleted')).toBeUndefined()
      expect(wrapper.emitted('delete-uploaded-file')).toBeUndefined()
    })

    it('should fall back to the delete-uploaded-file emit when no axios instance is available', async () => {
      vi.mocked(getAxiosInstance).mockReturnValue(undefined)
      const wrapper = createWrapper(remoteProps)

      await clickDeleteButton(wrapper)
      await confirmDeletion(wrapper)
      await flushPromises()

      expect(wrapper.emitted('delete-uploaded-file')).toStrictEqual([['document-1']])
      expect(wrapper.emitted('uploaded-file-deleted')).toBeUndefined()
    })

    it('should keep the plain emit path without confirmation when pCanRemoteDelete is false despite a delete url', async () => {
      const deleteMock = vi.fn()
      vi.mocked(getAxiosInstance).mockReturnValue({ delete: deleteMock })
      const wrapper = createWrapper({ ...remoteProps, pCanRemoteDelete: false })

      await clickDeleteButton(wrapper)
      await flushPromises()

      expect(wrapper.findComponent({ name: 'PConfirmationPopup' }).props('pIsVisible')).toBe(false)
      expect(deleteMock).not.toHaveBeenCalled()
      expect(wrapper.emitted('delete-uploaded-file')).toStrictEqual([['document-1']])
    })
  })

  describe('file extension pre-filtering (pAccept)', () => {
    it('should apply pAccept to the native input accept attribute', async () => {
      const wrapper = createWrapper()
      await nextTick()

      expect(wrapper.find('input.el-upload__input').attributes('accept')).toBe(defaultProps.pAccept)
    })

    it('should not set the accept attribute on the native input when pAccept is not provided', async () => {
      const wrapper = createWrapper({ ...defaultProps, pAccept: undefined })
      await nextTick()

      expect(wrapper.find('input.el-upload__input').attributes('accept')).toBeUndefined()
    })
  })
})
