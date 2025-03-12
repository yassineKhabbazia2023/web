import { vi, describe, it, expect } from 'vitest'
import { shallowMount } from '@vue/test-utils'
import { getIconComponentMock, iconHelperMock } from '@styleguide/__mocks__/icon.helper.mocks'

import PIcon from '.'

vi.mock('../../utils/iconHelper', () => iconHelperMock)

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
