import { vi, describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import PIcon from '.'

describe('p icon', () => {
  it('renders a component when pName is given', async () => {
    const wrapper = mount(PIcon, {
      props: {
        pName: 'x',
      },
    })

    await vi.dynamicImportSettled()
    const PIXIcon = wrapper.findComponent({ name: 'PIX' })
    expect(PIXIcon.exists()).toBeTruthy()
  })
})
