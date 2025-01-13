import { shallowMount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import DocumentDragGhost from '.'
import { type IconName } from '@pulse/styleguide/types'
import type { DocumentDragGhostProps } from './DocumentDragGhostTypes'

const getIconFileNameMock = vi.hoisted(() => vi.fn())
vi.mock('@pulse/styleguide', () => ({
  getIconFileName: getIconFileNameMock,
}))

const defaultProps: DocumentDragGhostProps = {
  displayedName: 'document.jpg',
  numberOfDocuments: 4,
  disabled: false,
}

const createWrapper = (
  overriddenProps: Partial<DocumentDragGhostProps> = {},
) => {
  const props = {
    ...defaultProps,
    ...overriddenProps,
  }

  return shallowMount(DocumentDragGhost, {
    props,
    global: {
      stubs: {
        PIcon: {
          name: 'PIcon',
          template: '<div><slot /></div>',
          props: ['pName'],
        },
      },
    },
  })
}

describe('test DocumentDragGhost', () => {
  it('should render DocumentDragGhost properly when several documnents', async () => {
    const mockedIconName: IconName = 'filetypePdf'
    getIconFileNameMock.mockReturnValueOnce(mockedIconName)

    const wrapper = createWrapper()
    const pIcon = wrapper.findComponent({ name: 'PIcon' })

    expect(getIconFileNameMock).toHaveBeenCalledOnce()
    expect(getIconFileNameMock).toHaveBeenNthCalledWith(1, 'jpg', 'fileText')
    expect(pIcon.exists()).toBeTruthy()
    expect(pIcon.props('pName')).toBe(mockedIconName)
    expect(wrapper.classes('document-drag-ghost--multiple')).toBeTruthy()
  })

  it('should render DocumentDragGhost properly when only one documnents', async () => {
    const wrapper = createWrapper({
      numberOfDocuments: 1,
    })

    expect(wrapper.classes('document-drag-ghost--multiple')).toBeFalsy()
  })
})
