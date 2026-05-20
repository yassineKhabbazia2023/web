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
          template: '<div><slot /><slot name="file" :file="file" /></div>',
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
