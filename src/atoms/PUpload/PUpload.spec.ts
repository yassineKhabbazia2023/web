import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import PUpload from './'
import type { UploadProps } from './PUploadTypes'

const defaultProps: UploadProps = {
  pMultiple: true,
  pDrag: false,
  pDisabled: false,
  pAccept: 'image/png, image/jpeg',
}

const createWrapper = (props = defaultProps) =>
  mount(PUpload, {
    props,
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
      const f = {
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
      wrapper.vm.files = [f]
      wrapper.vm.emitFilesEvent()
      expect(wrapper.emitted('files-selected')).toHaveLength(1)
      expect(wrapper.emitted('files-selected')).toStrictEqual([[[f.raw]]])
    })
  })
})
