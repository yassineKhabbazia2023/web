import { vi, describe, it, expect } from 'vitest'
import { shallowMount } from '@vue/test-utils'
import PIcon from '.'

const getIconComponentMock = vi.hoisted(() => vi.fn())
vi.mock('../../utils/iconHelper', () => ({
  getIconComponent: getIconComponentMock,
}))

describe('p icon', () => {
  it('renders a component when pName is given', () => {
    const wrapper = shallowMount(PIcon, {
      props: {
        pName: 'arrowBarLeft',
      },
      global: {
        stubs: {
          ElIcon: {
            name: 'ElIcon',
            template: '<div><slot /></div>',
          },
        },
      },
    })
    expect(getIconComponentMock).toHaveBeenCalledOnce()
    expect(getIconComponentMock).toHaveBeenNthCalledWith(1, 'arrowBarLeft')
  })
})
