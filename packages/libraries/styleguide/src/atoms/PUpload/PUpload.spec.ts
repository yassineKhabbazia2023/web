import { describe, it, expect } from 'vitest'
import { shallowMount } from '@vue/test-utils'
import PUpload from './'
import type { UploadProps } from './PUploadTypes'
import { PUploadType } from './PUpload.enums'
import { nextTick } from 'vue'

// Mocks
const mockedFile = {
  name: 'image.png',
  status: 'ready',
  uid: 'c32d8b45-92fe-44f6-8b61-42c2107dfe87',
  raw: {
    uid: 'c32d8b45-92fe-44f6-8b61-42c2107dfe87',
    name: 'image.png',
    size: 1,
    type: 'image/png',
  },
}

const mockedRejectedFile = {
  name: 'document.exe',
  status: 'ready',
  uid: '5f9d9b3a-1c70-4f3b-9a36-2e9a4f0b8d21',
  raw: {
    uid: '5f9d9b3a-1c70-4f3b-9a36-2e9a4f0b8d21',
    name: 'document.exe',
    size: 1,
    type: 'application/x-msdownload',
  },
}

const defaultProps: UploadProps = {
  pMultiple: true,
  pDrag: false,
  pDisabled: false,
  pAccept: 'image/png, image/jpeg',
  pShowFileList: true,
  pDeleteButtonTitle: 'Delete document',
}

const createWrapper = (props = defaultProps) =>
  shallowMount(PUpload, {
    props,
    global: {
      stubs: {
        ElUpload: {
          name: 'ElUpload',
          template: '<div><input class="el-upload__input" type="file"><slot /><slot name="file" :file="file" /></div>',
          methods: {
            handleRemove: vi.fn(),
          },
          data() {
            return {
              file: mockedFile,
            }
          },
        },
        PIcon: {
          name: 'PIcon',
          template: '<div><slot /></div>',
        },
        PImage: {
          name: 'PIcon',
          template: '<div><slot /></div>',
        },
        PUploadFileLine: {
          name: 'PUploadFileLine',
          template: '<div><slot /></div>',
          props: {
            pIconName: { type: String },
            pIsMultiLine: { type: Boolean, default: false },
            pStatus: { type: String },
            pFile: { type: Object },
            pMessage: { type: String },
          },
        },
        PButton: {
          name: 'PButton',
          emits: ['click'],
          template: '<button @click="$emit(\'click\', $event)"><slot /></button>',
        },
      },
    },
  })

describe('pUpload', () => {
  describe('props', () => {
    it('should renders the upload file line with provided props', () => {
      const wrapper = createWrapper({
        ...defaultProps,
        pUploadType: PUploadType.FILE_LINE,
      })
      expect(wrapper.find('.p-upload--type-file-line').exists()).toBeTruthy()
      expect(wrapper.find('.p-upload__input').exists()).toBeTruthy()
    })
    it('should renders the upload dragger with provided props', () => {
      const wrapper = createWrapper({
        ...defaultProps,
        pUploadType: PUploadType.DRAGGER,
      })
      expect(wrapper.find('.p-upload--type-dragger').exists()).toBeTruthy()
      expect(wrapper.find('.p-upload__input').exists()).toBeTruthy()
    })
    it('should renders the class disabled when upload is disabled', () => {
      const wrapper = createWrapper({
        ...defaultProps,
        pDisabled: true,
      })
      expect(wrapper.find('.p-upload--disabled').exists()).toBeTruthy()
    })
  })

  describe('events', () => {
    it('should emit files-selected when emitFilesEvent', () => {
      const wrapper = createWrapper() as any
      wrapper.vm.files = [mockedFile]
      wrapper.vm.emitFilesEvent()

      expect(wrapper.emitted('files-selected')).toHaveLength(1)
      expect(wrapper.emitted('files-selected')).toStrictEqual([[[mockedFile.raw]]])
    })
    it('should not emit failed files when emitFilesEvent', () => {
      const wrapper = createWrapper() as any
      wrapper.vm.files = [mockedFile, { ...mockedRejectedFile, status: 'fail' }]
      wrapper.vm.emitFilesEvent()

      expect(wrapper.emitted('files-selected')).toStrictEqual([[[mockedFile.raw]]])
    })
    it('should keep only failed files in the list when pShouldClearPreviousFilesListOnUpload', () => {
      const wrapper = createWrapper({
        ...defaultProps,
        pShouldClearPreviousFilesListOnUpload: true,
      }) as any
      const failedFile = { ...mockedRejectedFile, status: 'fail' }
      wrapper.vm.files = [mockedFile, failedFile]
      wrapper.vm.emitFilesEvent()

      expect(wrapper.emitted('files-selected')).toStrictEqual([[[mockedFile.raw]]])
      expect(wrapper.vm.files).toStrictEqual([failedFile])
    })
    it('should emit a remove-file event when the click action is triggered', async () => {
      const wrapper = createWrapper() as any
      wrapper.vm.files = [mockedFile]
      wrapper.vm.emitFilesEvent()
      await nextTick()
      const firstUploadeFile = wrapper.findComponent({ name: 'PUploadFileLine' })
      firstUploadeFile.vm.$emit('on-click-file-action')

      expect(firstUploadeFile.props('pIconName')).toBe('filetypePng')
      expect(wrapper.emitted('delete-file')).toBeTruthy()
      expect(wrapper.emitted('delete-file')).toStrictEqual([[mockedFile]])
    })
  })

  describe('file extension validation (pAccept)', () => {
    it('should apply pAccept to the native input accept attribute', async () => {
      const wrapper = createWrapper()
      await nextTick()

      expect(wrapper.find('input.el-upload__input').attributes('accept')).toBe(defaultProps.pAccept)
    })

    it('should not set the accept attribute on the native input when pAccept is not provided', async () => {
      const wrapper = createWrapper({
        ...defaultProps,
        pAccept: undefined,
      })
      await nextTick()

      expect(wrapper.find('input.el-upload__input').attributes('accept')).toBeUndefined()
    })

    it('should mark a newly added file with a disallowed extension as fail', () => {
      const wrapper = createWrapper() as any
      const addedFile = { ...mockedRejectedFile }
      wrapper.vm.handleFileChange(addedFile)

      expect(addedFile.status).toBe('fail')
    })

    it('should keep a newly added file with an allowed extension as ready', () => {
      const wrapper = createWrapper() as any
      const addedFile = { ...mockedFile }
      wrapper.vm.handleFileChange(addedFile)

      expect(addedFile.status).toBe('ready')
    })

    it('should keep any newly added file as ready when pAccept is not provided', () => {
      const wrapper = createWrapper({
        ...defaultProps,
        pAccept: undefined,
      }) as any
      const addedFile = { ...mockedRejectedFile }
      wrapper.vm.handleFileChange(addedFile)

      expect(addedFile.status).toBe('ready')
    })

    it('should re-mark a disallowed file as fail when the auto upload flips it to success', () => {
      const wrapper = createWrapper() as any
      const uploadedFile = { ...mockedRejectedFile, status: 'success' }
      wrapper.vm.handleFileChange(uploadedFile)

      expect(uploadedFile.status).toBe('fail')
    })

    it('should keep an allowed file as success after upload', () => {
      const wrapper = createWrapper() as any
      const uploadedFile = { ...mockedFile, status: 'success' }
      wrapper.vm.handleFileChange(uploadedFile)

      expect(uploadedFile.status).toBe('success')
    })
  })

  describe('file size validation (pMaxFileSize)', () => {
    const buildFileOfSize = (sizeInMo: number) => ({
      ...mockedFile,
      size: sizeInMo * 1_000_000,
      raw: { ...mockedFile.raw, size: sizeInMo * 1_000_000 },
    })

    it('should mark a file exceeding pMaxFileSize as fail', () => {
      const wrapper = createWrapper({
        ...defaultProps,
        pMaxFileSize: 5,
      }) as any
      const addedFile = buildFileOfSize(6)
      wrapper.vm.handleFileChange(addedFile)

      expect(addedFile.status).toBe('fail')
    })

    it('should keep a file within pMaxFileSize as ready', () => {
      const wrapper = createWrapper({
        ...defaultProps,
        pMaxFileSize: 5,
      }) as any
      const addedFile = buildFileOfSize(2)
      wrapper.vm.handleFileChange(addedFile)

      expect(addedFile.status).toBe('ready')
    })

    it('should not apply any size limit when pMaxFileSize is not provided', () => {
      const wrapper = createWrapper() as any
      const addedFile = buildFileOfSize(999)
      wrapper.vm.handleFileChange(addedFile)

      expect(addedFile.status).toBe('ready')
    })

    it('should pass the oversized message to the file line of a too-large file', async () => {
      const wrapper = createWrapper({
        ...defaultProps,
        pUploadType: PUploadType.FILE_LINE,
        pMultiple: false,
        pMaxFileSize: 5,
      }) as any
      wrapper.vm.files = [{ ...buildFileOfSize(6), status: 'fail' }]
      await nextTick()

      const uploadFileLine = wrapper.findComponent({ name: 'PUploadFileLine' })
      expect(uploadFileLine.props('pStatus')).toBe('fail')
      expect(uploadFileLine.props('pMessage')).toBe('Le fichier dépasse la taille autorisée')
    })
  })

  describe('single file uploaded display (file-line + mono)', () => {
    it('should display the centered single-file block when file-line mono and a file is uploaded', async () => {
      const wrapper = createWrapper({
        ...defaultProps,
        pUploadType: PUploadType.FILE_LINE,
        pMultiple: false,
      }) as any
      wrapper.vm.files = [mockedFile]
      await nextTick()

      const uploadFileLine = wrapper.findComponent({ name: 'PUploadFileLine' })
      expect(uploadFileLine.exists()).toBe(true)
      expect(uploadFileLine.props('pIsMultiLine')).toBe(true)
      expect(uploadFileLine.props('pStatus')).toBe('ready')
      expect(wrapper.find('.p-upload__input').exists()).toBe(false)
    })

    it('should keep the ready look in the single-file block for an accepted uploaded file', async () => {
      const wrapper = createWrapper({
        ...defaultProps,
        pUploadType: PUploadType.FILE_LINE,
        pMultiple: false,
      }) as any
      wrapper.vm.files = [{ ...mockedFile, status: 'success' }]
      await nextTick()

      expect(wrapper.findComponent({ name: 'PUploadFileLine' }).props('pStatus')).toBe('ready')
    })

    it('should display the single-file block as fail for a rejected file', async () => {
      const wrapper = createWrapper({
        ...defaultProps,
        pUploadType: PUploadType.FILE_LINE,
        pMultiple: false,
      }) as any
      wrapper.vm.files = [{ ...mockedRejectedFile, status: 'fail' }]
      await nextTick()

      const uploadFileLine = wrapper.findComponent({ name: 'PUploadFileLine' })
      expect(uploadFileLine.props('pStatus')).toBe('fail')
      expect(uploadFileLine.props('pMessage')).toBe('Extension non supportée')
    })

    it('should not pass the rejected file message for an accepted file', async () => {
      const wrapper = createWrapper({
        ...defaultProps,
        pUploadType: PUploadType.FILE_LINE,
        pMultiple: false,
      }) as any
      wrapper.vm.files = [mockedFile]
      await nextTick()

      expect(wrapper.findComponent({ name: 'PUploadFileLine' }).props('pMessage')).toBeUndefined()
    })

    it('should keep the original trigger when file-line multi even with a file', async () => {
      const wrapper = createWrapper({
        ...defaultProps,
        pUploadType: PUploadType.FILE_LINE,
        pMultiple: true,
      }) as any
      wrapper.vm.files = [mockedFile]
      await nextTick()

      expect(wrapper.find('[data-testid="upload-single-file"]').exists()).toBe(false)
      expect(wrapper.find('.p-upload__input').exists()).toBe(true)
    })

    it('should not switch to centered block for dragger mono (out of scope)', async () => {
      const wrapper = createWrapper({
        ...defaultProps,
        pUploadType: PUploadType.DRAGGER,
        pMultiple: false,
      }) as any
      wrapper.vm.files = [mockedFile]
      await nextTick()

      expect(wrapper.find('[data-testid="upload-single-file"]').exists()).toBe(false)
      expect(wrapper.find('.p-upload__input').exists()).toBe(true)
    })

    it('should emit delete-file when the centered block trash button is clicked', async () => {
      const wrapper = createWrapper({
        ...defaultProps,
        pUploadType: PUploadType.FILE_LINE,
        pMultiple: false,
      }) as any
      wrapper.vm.files = [mockedFile]
      await nextTick()

      const uploadFileLine = wrapper.findComponent({ name: 'PUploadFileLine' })
      uploadFileLine.vm.$emit('on-click-file-action', mockedFile)

      expect(wrapper.emitted('delete-file')).toBeTruthy()
      expect(wrapper.emitted('delete-file')).toStrictEqual([[mockedFile]])
    })
  })
})
