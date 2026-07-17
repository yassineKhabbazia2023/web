import { shallowMount } from '@vue/test-utils'
import PDoubleText from './'


const pContent = 'Lorem ipsum sillopi cardovil pirutis, advem porac lacoci'

describe('tests for p-double-text', () => {
  it('renders with content', () => {
    const wrapper = shallowMount(PDoubleText, {
      props: {
        pIconName: 'filetypePdf',
        pProfile: 'FL',
        pTitle: 'Cell title',
        pContent,
        pType: 'primary',
        pDisabled: false,
        pSelected: false,
      },
    })

    // Check if the cell renders correctly
    const PDoubleTextElement = wrapper.findComponent({ name: 'PDoubleText' })

    expect(PDoubleTextElement.exists()).toBeTruthy()

    // Check if the content is rendered correctly in the cell
    const text = wrapper.text()
    expect(text.indexOf(pContent)).toBeGreaterThan(-1)
  })

  it('renders with an icon', () => {
    const wrapper = shallowMount(PDoubleText, {
      props: {
        pIconName: 'filetypePdf',
        pProfile: 'FL',
        pTitle: 'Cell title',
        pContent,
        pType: 'primary',
        pDisabled: false,
        pSelected: false,
      },
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
    // Check if the table renders correctly
    const iconElement = wrapper.findComponent({ name: 'PIcon' })

    expect(iconElement.exists()).toBeTruthy()
    expect(iconElement.props('pName')).toBe('filetypePdf')
  })
})
