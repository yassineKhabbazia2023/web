import { vi, describe, it, expect } from 'vitest'
import { shallowMount } from '@vue/test-utils'
import PIcon from '.'

const iconResolverMock = vi.hoisted(() => vi.fn())
vi.mock('../../utils/iconResolver', () => ({
  iconResolver: iconResolverMock,
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
    expect(iconResolverMock).toHaveBeenCalledOnce()
    expect(iconResolverMock).toHaveBeenNthCalledWith(1, 'PIArrowBarLeft')
  })
})
