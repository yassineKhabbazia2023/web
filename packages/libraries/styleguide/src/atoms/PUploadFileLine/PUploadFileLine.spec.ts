import { describe, it, expect } from 'vitest'
import type { VueWrapper } from '@vue/test-utils'
import { mount, flushPromises } from '@vue/test-utils'
import PButton from '@/atoms/PButton'
import PLoader from '@/atoms/PLoader'
import { PIFiletypePdf, PITrash } from '@/atoms/PIcon/components'
import PUploadFileLine from './'
import type { PUploadFileLineProps } from './PUploadFileLineTypes'
import type { UploadFile, UploadStatus } from 'element-plus'

const fileList = {
  name: 'Nom du document.pdf',
  status: 'success' as UploadStatus,
  uid: 1,
}

const defaultProps: PUploadFileLineProps = {
  pIcon: PIFiletypePdf,
  pHasButton: true,
  pButtonIcon: 'PITrash',
  pTitleButton: 'Supprimer',
  pFile: fileList as UploadFile,
  pStatus: fileList.status,
}

const createWrapper = (props = defaultProps) =>
  mount(PUploadFileLine, {
    props,
  })

describe('pUploadFileLine', () => {
  describe('props', () => {
    it('should renders the uploadfileline with provided props', async () => {
      const wrapper = createWrapper()
      await flushPromises()
      const icon = wrapper.findComponent(PIFiletypePdf) as VueWrapper
      expect(icon.exists()).toBeTruthy()
      expect(wrapper.find('.p-upload-file-line__title').text()).toBe('Nom du document.pdf')
    })
    it('should renders the button in uploadfileline with provided props', async () => {
      const wrapper = createWrapper()
      await flushPromises()
      expect(wrapper.findComponent(PButton).exists()).toBeTruthy()
      const icon = wrapper.findComponent(PITrash) as VueWrapper
      expect(icon.exists()).toBeTruthy()
    })
    it('should load the component Loader when status is Uploading', () => {
      const wrapper = createWrapper({
        ...defaultProps,
        pStatus: 'uploading',
      })
      expect(wrapper.findComponent(PLoader).exists()).toBeTruthy()
      expect(wrapper.find('[data-testid="upload-fileline-action"]').exists()).toBeFalsy()
      expect(wrapper.find('[data-testid="upload-fileline-icon"]').exists()).toBeFalsy()
    })
    it('should load the icon error when status is fail', () => {
      const wrapper = createWrapper({
        ...defaultProps,
        pStatus: 'fail',
      })
      expect(wrapper.findComponent(PLoader).exists()).toBeFalsy()
      expect(wrapper.find('[data-testid="upload-fileline-action"]').exists()).toBeFalsy()
      expect(wrapper.find('[data-testid="upload-fileline-icon"]').exists()).toBeTruthy()
      expect(wrapper.find('[data-testid="upload-fileline-icon-fail"]').exists()).toBeTruthy()
    })
  })

  describe('events', () => {
    it('should emit on-click-file-action when click on upload-fileline-action', async () => {
      const wrapper = createWrapper() as VueWrapper
      const fileAction = wrapper.findComponent('[data-testid="upload-fileline-action-button"]') as VueWrapper
      await fileAction.trigger('click')

      expect(wrapper.emitted()).toHaveProperty('on-click-file-action')
    })
  })
})
