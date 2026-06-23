import { describe, it, expect, vi } from 'vitest'
import { shallowMount, flushPromises } from '@vue/test-utils'
import PUploadFileLine from './'
import type { PUploadFileLineProps } from './PUploadFileLineTypes'

const getMainIconNameMock = vi.hoisted(() => vi.fn())
vi.mock('./PUploadFileLineUtils', () => ({
  getMainIconName: getMainIconNameMock,
}))

const defaultProps: PUploadFileLineProps = {
  pIconName: 'filetypePdf',
  pHasButton: true,
  pButtonIconName: 'trash',
  pTitleButton: 'Supprimer',
  pFileName: 'Nom du document.pdf',
  pStatus: 'success',
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
        PIcon: true,
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
      getMainIconNameMock.mockReturnValueOnce('filetypePdf')
      const expectedParams = [
        defaultProps.pStatus,
        defaultProps.pIconName,
      ]

      const wrapper = createWrapper()
      await flushPromises()
      const icon = wrapper.findComponent({ name: 'PIcon' })

      expect(getMainIconNameMock).toHaveBeenCalledOnce()
      expect(getMainIconNameMock).toHaveBeenNthCalledWith(1, ...expectedParams)
      expect(icon.exists()).toBeTruthy()
      expect(icon.props('pName')).toBe('filetypePdf')
      expect(wrapper.find('.p-upload-file-line__title').text()).toBe('Nom du document.pdf')
    })
    it('should renders the button in uploadfileline with provided props', async () => {
      const wrapper = createWrapper()
      await flushPromises()
      const pButton= wrapper.findComponent({ name: 'PButton' })
      const icon = pButton.findComponent({ name: 'PIcon' })
      expect(icon.exists()).toBeTruthy()
      expect(icon.props('pName')).toBe('trash')
    })

    it('should display button with given pButtonIconName', async () => {
      const pButtonIconName = 'x'
      const wrapper = createWrapper({
        pButtonIconName,
      })
      await flushPromises()
      const pButton = wrapper.findComponent({ name: 'PButton' })
      const icon = pButton.findComponent({ name: 'PIcon' })

      expect(pButton.exists()).toBeTruthy()
      expect(icon.exists()).toBeTruthy()
      expect(icon.props('pName')).toBe(pButtonIconName)
    })

    it('should display the message when pMessage is provided', () => {
      const wrapper = createWrapper({
        pMessage: 'Extension non supportée',
      })

      expect(wrapper.find('[data-testid="upload-fileline-message"]').text()).toBe('Extension non supportée')
    })

    it('should not display the message when pMessage is not provided', () => {
      const wrapper = createWrapper()

      expect(wrapper.find('[data-testid="upload-fileline-message"]').exists()).toBeFalsy()
    })

    it('should display the message in multi-line mode', () => {
      const wrapper = createWrapper({
        pIsMultiLine: true,
        pMessage: 'Extension non supportée',
      })

      expect(wrapper.find('[data-testid="upload-fileline-message"]').text()).toBe('Extension non supportée')
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
      expect(wrapper.find('[data-testid="upload-fileline-action"]').exists()).toBeTruthy()
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
