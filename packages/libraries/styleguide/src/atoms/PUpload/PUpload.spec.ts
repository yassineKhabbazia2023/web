import { describe, it, expect } from 'vitest'
import { shallowMount } from '@vue/test-utils'
import PUpload from './'
import type { UploadProps } from './PUploadTypes'
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
          props: ['pIconName'],
        },
      },
    },
  })

describe('pUpload', () => {
  describe('props', () => {
    it('should renders the upload file line with provided props', () => {
      const wrapper = createWrapper({
        ...defaultProps,
        pUploadType: 'file-line',
      })
      expect(wrapper.find('.p-upload--type-file-line').exists()).toBeTruthy()
      expect(wrapper.find('.p-upload__input').exists()).toBeTruthy()
    })
    it('should renders the upload dragger with provided props', () => {
      const wrapper = createWrapper({
        ...defaultProps,
        pUploadType: 'dragger',
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
})
