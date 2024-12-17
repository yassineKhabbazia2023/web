import { describe, it, expect, vi } from 'vitest'
import { shallowMount, flushPromises } from '@vue/test-utils'
import { PIFiletypePdf, PITrash } from '../../atoms/PIcon/components'
import PUploadFileLine from './'
import type { PUploadFileLineProps } from './PUploadFileLineTypes'
import type { UploadFile, UploadStatus } from 'element-plus'

const getMainIconNameMock = vi.hoisted(() => vi.fn())
vi.mock('./PUploadFileLineUtils', () => ({
  getMainIconName: getMainIconNameMock,
}))

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

const createWrapper = (overriddenProps: Partial<PUploadFileLineProps> = {}) => {
  const props = {
    ...defaultProps,
    ...overriddenProps,
  }
  return shallowMount(PUploadFileLine, {
    props,
    global: {
      stubs: {
        PLoader: {
          name: 'PLoader',
          template: '<div><slot /></div>',
        },
        PIcon: {
          name: 'PIcon',
          template: '<div><slot /></div>',
          props: ['pName'],
        },
        PTooltip: {
          name: 'PTooltip',
          template: '<div><slot /></div>',
        },
        PButton: {
          name: 'PButton',
          template: '<div><slot /></div>',
        },
      },
    },
  })
}

describe('pUploadFileLine', () => {
  describe('props', () => {
    it('should renders the uploadfileline with provided props', async () => {
      const expectedParams = [
        defaultProps.pStatus,
        defaultProps.pIconName,
      ]

      const wrapper = createWrapper()
      await flushPromises()
      const icon = wrapper.findComponent(PIFiletypePdf)
      expect(getMainIconNameMock).toHaveBeenCalledOnce()
      expect(getMainIconNameMock).toHaveBeenNthCalledWith(1, ...expectedParams)
      expect(icon.exists()).toBeTruthy()
      expect(wrapper.find('.p-upload-file-line__title').text()).toBe('Nom du document.pdf')
    })
    it('should renders the button in uploadfileline with provided props', async () => {
      const wrapper = createWrapper()
      await flushPromises()
      expect(wrapper.findComponent({ name: 'PButton' }).exists()).toBeTruthy()
      const icon = wrapper.findComponent(PITrash)
      expect(icon.exists()).toBeTruthy()
    })

    it('should display button with given pButtonIconName', async () => {
      const pButtonIconName = 'x'
      const wrapper = createWrapper({
        pButtonIcon: undefined,
        pButtonIconName,
      })
      await flushPromises()
      const pButton = wrapper.findComponent({ name: 'PButton' })
      const icon = pButton.findComponent({ name: 'PIcon' })

      expect(pButton.exists()).toBeTruthy()
      expect(icon.exists()).toBeTruthy()
      expect(icon.props('pName')).toBe(pButtonIconName)
    })

    it('should load the component Loader when status is Uploading', () => {
      const wrapper = createWrapper({
        pStatus: 'uploading',
      })
      expect(wrapper.findComponent({ name: 'PLoader' }).exists()).toBeTruthy()
      expect(wrapper.find('[data-testid="upload-fileline-action"]').exists()).toBeFalsy()
      expect(wrapper.find('[data-testid="upload-fileline-icon"]').exists()).toBeFalsy()
    })
    it('should load the icon error when status is fail', () => {
      const pStatus = 'fail'
      const pIconName = 'x'
      getMainIconNameMock.mockReturnValueOnce('exclamationTriangle')
      const wrapper = createWrapper({
        pStatus,
        pIconName,
      })
      const expectedParams = [
        pStatus,
        pIconName,
      ]
      const pIcon = wrapper.findComponent({ name: 'PIcon' })
      expect(getMainIconNameMock).toHaveBeenCalledOnce()
      expect(getMainIconNameMock).toHaveBeenNthCalledWith(1, ...expectedParams)
      expect(wrapper.findComponent({ name: 'PLoader' }).exists()).toBeFalsy()
      expect(wrapper.find('[data-testid="upload-fileline-action"]').exists()).toBeFalsy()
      expect(pIcon.exists()).toBeTruthy()
      expect(pIcon.props('pName')).toBe('exclamationTriangle')
    })
  })

  describe('events', () => {
    it('should emit on-click-file-action when click on upload-fileline-action', async () => {
      const wrapper = createWrapper()
      const fileAction = wrapper.findComponent('[data-testid="upload-fileline-action-button"]')
      await fileAction.trigger('click')

      expect(wrapper.emitted()).toHaveProperty('on-click-file-action')
    })
  })
})
