import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import PUpload from './'
import type { UploadProps } from './PUploadTypes'
import { ElUpload } from 'element-plus'

const defaultProps: UploadProps = {
  pMultiple: true,
  pDrag: false,
  pShowFileList: false,
  pDisabled: false,
  pAccept: 'image/png, image/jpeg'
}

const createWrapper = (props = defaultProps) =>
  mount(PUpload, {
    props
  })

describe('pUpload', () => {
  describe('props', () => {
    it('should renders the upload with provided props', () => {
      const wrapper = createWrapper()
      const upload = wrapper.findComponent(ElUpload)
      expect(upload.props('multiple')).toBeTruthy()
      expect(upload.props('drag')).toBeFalsy()
      expect(upload.props('showFileList')).toBeFalsy()
      expect(upload.props('disabled')).toBeFalsy()
      expect(upload.props('accept')).toBe('image/png, image/jpeg')
    })
  })

  describe('events', () => {
    it('should emit files-selected when emitFilesEvent', async () => {
      const wrapper = createWrapper() as any
      const f = {
        name: 'image.png',
        status: 'ready',
        uid: 'c32d8b45-92fe-44f6-8b61-42c2107dfe87',
        raw: {
          uid: 'c32d8b45-92fe-44f6-8b61-42c2107dfe87',
          name: 'image.png',
          size: 1,
          type: 'image/png'
        }
      }
      wrapper.vm.files = [f]
      wrapper.vm.emitFilesEvent()
      expect(wrapper.emitted('files-selected')).toHaveLength(1)
      expect(wrapper.emitted('files-selected')).toStrictEqual([[[f.raw]]])
    })
  })
})
