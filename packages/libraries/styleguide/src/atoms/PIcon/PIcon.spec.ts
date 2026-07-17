import { shallowMount } from '@vue/test-utils'
import { getIconComponentMock } from '@styleguide/__mocks__/icon.helper.mocks'

import PIcon from '.'

describe('p icon', () => {
  it('renders a component when pName is given', () => {
    shallowMount(PIcon, {
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
